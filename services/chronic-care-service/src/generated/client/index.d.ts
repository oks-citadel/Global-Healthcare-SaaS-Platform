
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
 * Model CarePlan
 * 
 */
export type CarePlan = $Result.DefaultSelection<Prisma.$CarePlanPayload>
/**
 * Model CareTask
 * 
 */
export type CareTask = $Result.DefaultSelection<Prisma.$CareTaskPayload>
/**
 * Model MonitoringDevice
 * 
 */
export type MonitoringDevice = $Result.DefaultSelection<Prisma.$MonitoringDevicePayload>
/**
 * Model VitalReading
 * 
 */
export type VitalReading = $Result.DefaultSelection<Prisma.$VitalReadingPayload>
/**
 * Model Alert
 * 
 */
export type Alert = $Result.DefaultSelection<Prisma.$AlertPayload>
/**
 * Model Goal
 * 
 */
export type Goal = $Result.DefaultSelection<Prisma.$GoalPayload>
/**
 * Model GoalProgress
 * 
 */
export type GoalProgress = $Result.DefaultSelection<Prisma.$GoalProgressPayload>
/**
 * Model AlertThreshold
 * 
 */
export type AlertThreshold = $Result.DefaultSelection<Prisma.$AlertThresholdPayload>
/**
 * Model CarePlanTemplate
 * 
 */
export type CarePlanTemplate = $Result.DefaultSelection<Prisma.$CarePlanTemplatePayload>
/**
 * Model PatientEngagement
 * 
 */
export type PatientEngagement = $Result.DefaultSelection<Prisma.$PatientEngagementPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PlanStatus: {
  active: 'active',
  completed: 'completed',
  suspended: 'suspended',
  cancelled: 'cancelled'
};

export type PlanStatus = (typeof PlanStatus)[keyof typeof PlanStatus]


export const TaskType: {
  medication: 'medication',
  measurement: 'measurement',
  exercise: 'exercise',
  diet: 'diet',
  appointment: 'appointment',
  other: 'other'
};

export type TaskType = (typeof TaskType)[keyof typeof TaskType]


export const TaskStatus: {
  pending: 'pending',
  completed: 'completed',
  missed: 'missed',
  cancelled: 'cancelled'
};

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]


export const DeviceType: {
  blood_pressure_monitor: 'blood_pressure_monitor',
  glucose_meter: 'glucose_meter',
  pulse_oximeter: 'pulse_oximeter',
  weight_scale: 'weight_scale',
  thermometer: 'thermometer',
  heart_rate_monitor: 'heart_rate_monitor',
  peak_flow_meter: 'peak_flow_meter',
  ecg_monitor: 'ecg_monitor'
};

export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType]


export const DeviceStatus: {
  active: 'active',
  inactive: 'inactive',
  maintenance: 'maintenance',
  decommissioned: 'decommissioned'
};

export type DeviceStatus = (typeof DeviceStatus)[keyof typeof DeviceStatus]


export const VitalType: {
  blood_pressure_systolic: 'blood_pressure_systolic',
  blood_pressure_diastolic: 'blood_pressure_diastolic',
  heart_rate: 'heart_rate',
  blood_glucose: 'blood_glucose',
  oxygen_saturation: 'oxygen_saturation',
  temperature: 'temperature',
  weight: 'weight',
  respiratory_rate: 'respiratory_rate',
  peak_flow: 'peak_flow'
};

export type VitalType = (typeof VitalType)[keyof typeof VitalType]


export const AlertType: {
  vital_out_of_range: 'vital_out_of_range',
  missed_medication: 'missed_medication',
  missed_measurement: 'missed_measurement',
  device_offline: 'device_offline',
  no_activity: 'no_activity',
  threshold_exceeded: 'threshold_exceeded'
};

export type AlertType = (typeof AlertType)[keyof typeof AlertType]


export const AlertSeverity: {
  info: 'info',
  warning: 'warning',
  critical: 'critical'
};

export type AlertSeverity = (typeof AlertSeverity)[keyof typeof AlertSeverity]


export const AlertStatus: {
  new: 'new',
  acknowledged: 'acknowledged',
  resolved: 'resolved',
  dismissed: 'dismissed'
};

export type AlertStatus = (typeof AlertStatus)[keyof typeof AlertStatus]


export const GoalType: {
  vital_sign: 'vital_sign',
  activity: 'activity',
  lifestyle: 'lifestyle',
  clinical_outcome: 'clinical_outcome',
  weight_loss: 'weight_loss',
  blood_pressure: 'blood_pressure',
  blood_glucose: 'blood_glucose',
  exercise: 'exercise',
  medication_adherence: 'medication_adherence',
  diet: 'diet',
  sleep: 'sleep',
  stress_management: 'stress_management',
  other: 'other'
};

export type GoalType = (typeof GoalType)[keyof typeof GoalType]


export const GoalStatus: {
  achieved: 'achieved',
  active: 'active',
  completed: 'completed',
  paused: 'paused',
  cancelled: 'cancelled'
};

export type GoalStatus = (typeof GoalStatus)[keyof typeof GoalStatus]


export const EngagementType: {
  device_sync: 'device_sync',
  vital_reading: 'vital_reading',
  goal_progress: 'goal_progress',
  medication_taken: 'medication_taken',
  appointment_kept: 'appointment_kept',
  task_completed: 'task_completed',
  education_viewed: 'education_viewed',
  message_sent: 'message_sent',
  other: 'other'
};

export type EngagementType = (typeof EngagementType)[keyof typeof EngagementType]

}

export type PlanStatus = $Enums.PlanStatus

export const PlanStatus: typeof $Enums.PlanStatus

export type TaskType = $Enums.TaskType

export const TaskType: typeof $Enums.TaskType

export type TaskStatus = $Enums.TaskStatus

export const TaskStatus: typeof $Enums.TaskStatus

export type DeviceType = $Enums.DeviceType

export const DeviceType: typeof $Enums.DeviceType

export type DeviceStatus = $Enums.DeviceStatus

export const DeviceStatus: typeof $Enums.DeviceStatus

export type VitalType = $Enums.VitalType

export const VitalType: typeof $Enums.VitalType

export type AlertType = $Enums.AlertType

export const AlertType: typeof $Enums.AlertType

export type AlertSeverity = $Enums.AlertSeverity

export const AlertSeverity: typeof $Enums.AlertSeverity

export type AlertStatus = $Enums.AlertStatus

export const AlertStatus: typeof $Enums.AlertStatus

export type GoalType = $Enums.GoalType

export const GoalType: typeof $Enums.GoalType

export type GoalStatus = $Enums.GoalStatus

export const GoalStatus: typeof $Enums.GoalStatus

export type EngagementType = $Enums.EngagementType

export const EngagementType: typeof $Enums.EngagementType

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more CarePlans
 * const carePlans = await prisma.carePlan.findMany()
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
   * // Fetch zero or more CarePlans
   * const carePlans = await prisma.carePlan.findMany()
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
   * `prisma.carePlan`: Exposes CRUD operations for the **CarePlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CarePlans
    * const carePlans = await prisma.carePlan.findMany()
    * ```
    */
  get carePlan(): Prisma.CarePlanDelegate<ExtArgs>;

  /**
   * `prisma.careTask`: Exposes CRUD operations for the **CareTask** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CareTasks
    * const careTasks = await prisma.careTask.findMany()
    * ```
    */
  get careTask(): Prisma.CareTaskDelegate<ExtArgs>;

  /**
   * `prisma.monitoringDevice`: Exposes CRUD operations for the **MonitoringDevice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MonitoringDevices
    * const monitoringDevices = await prisma.monitoringDevice.findMany()
    * ```
    */
  get monitoringDevice(): Prisma.MonitoringDeviceDelegate<ExtArgs>;

  /**
   * `prisma.vitalReading`: Exposes CRUD operations for the **VitalReading** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VitalReadings
    * const vitalReadings = await prisma.vitalReading.findMany()
    * ```
    */
  get vitalReading(): Prisma.VitalReadingDelegate<ExtArgs>;

  /**
   * `prisma.alert`: Exposes CRUD operations for the **Alert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Alerts
    * const alerts = await prisma.alert.findMany()
    * ```
    */
  get alert(): Prisma.AlertDelegate<ExtArgs>;

  /**
   * `prisma.goal`: Exposes CRUD operations for the **Goal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Goals
    * const goals = await prisma.goal.findMany()
    * ```
    */
  get goal(): Prisma.GoalDelegate<ExtArgs>;

  /**
   * `prisma.goalProgress`: Exposes CRUD operations for the **GoalProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GoalProgresses
    * const goalProgresses = await prisma.goalProgress.findMany()
    * ```
    */
  get goalProgress(): Prisma.GoalProgressDelegate<ExtArgs>;

  /**
   * `prisma.alertThreshold`: Exposes CRUD operations for the **AlertThreshold** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AlertThresholds
    * const alertThresholds = await prisma.alertThreshold.findMany()
    * ```
    */
  get alertThreshold(): Prisma.AlertThresholdDelegate<ExtArgs>;

  /**
   * `prisma.carePlanTemplate`: Exposes CRUD operations for the **CarePlanTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CarePlanTemplates
    * const carePlanTemplates = await prisma.carePlanTemplate.findMany()
    * ```
    */
  get carePlanTemplate(): Prisma.CarePlanTemplateDelegate<ExtArgs>;

  /**
   * `prisma.patientEngagement`: Exposes CRUD operations for the **PatientEngagement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientEngagements
    * const patientEngagements = await prisma.patientEngagement.findMany()
    * ```
    */
  get patientEngagement(): Prisma.PatientEngagementDelegate<ExtArgs>;
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
    CarePlan: 'CarePlan',
    CareTask: 'CareTask',
    MonitoringDevice: 'MonitoringDevice',
    VitalReading: 'VitalReading',
    Alert: 'Alert',
    Goal: 'Goal',
    GoalProgress: 'GoalProgress',
    AlertThreshold: 'AlertThreshold',
    CarePlanTemplate: 'CarePlanTemplate',
    PatientEngagement: 'PatientEngagement'
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
      modelProps: "carePlan" | "careTask" | "monitoringDevice" | "vitalReading" | "alert" | "goal" | "goalProgress" | "alertThreshold" | "carePlanTemplate" | "patientEngagement"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      CarePlan: {
        payload: Prisma.$CarePlanPayload<ExtArgs>
        fields: Prisma.CarePlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CarePlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CarePlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanPayload>
          }
          findFirst: {
            args: Prisma.CarePlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CarePlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanPayload>
          }
          findMany: {
            args: Prisma.CarePlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanPayload>[]
          }
          create: {
            args: Prisma.CarePlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanPayload>
          }
          createMany: {
            args: Prisma.CarePlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CarePlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanPayload>[]
          }
          delete: {
            args: Prisma.CarePlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanPayload>
          }
          update: {
            args: Prisma.CarePlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanPayload>
          }
          deleteMany: {
            args: Prisma.CarePlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CarePlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CarePlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanPayload>
          }
          aggregate: {
            args: Prisma.CarePlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCarePlan>
          }
          groupBy: {
            args: Prisma.CarePlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<CarePlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.CarePlanCountArgs<ExtArgs>
            result: $Utils.Optional<CarePlanCountAggregateOutputType> | number
          }
        }
      }
      CareTask: {
        payload: Prisma.$CareTaskPayload<ExtArgs>
        fields: Prisma.CareTaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CareTaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareTaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CareTaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareTaskPayload>
          }
          findFirst: {
            args: Prisma.CareTaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareTaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CareTaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareTaskPayload>
          }
          findMany: {
            args: Prisma.CareTaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareTaskPayload>[]
          }
          create: {
            args: Prisma.CareTaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareTaskPayload>
          }
          createMany: {
            args: Prisma.CareTaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CareTaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareTaskPayload>[]
          }
          delete: {
            args: Prisma.CareTaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareTaskPayload>
          }
          update: {
            args: Prisma.CareTaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareTaskPayload>
          }
          deleteMany: {
            args: Prisma.CareTaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CareTaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CareTaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareTaskPayload>
          }
          aggregate: {
            args: Prisma.CareTaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCareTask>
          }
          groupBy: {
            args: Prisma.CareTaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<CareTaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.CareTaskCountArgs<ExtArgs>
            result: $Utils.Optional<CareTaskCountAggregateOutputType> | number
          }
        }
      }
      MonitoringDevice: {
        payload: Prisma.$MonitoringDevicePayload<ExtArgs>
        fields: Prisma.MonitoringDeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MonitoringDeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonitoringDevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MonitoringDeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonitoringDevicePayload>
          }
          findFirst: {
            args: Prisma.MonitoringDeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonitoringDevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MonitoringDeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonitoringDevicePayload>
          }
          findMany: {
            args: Prisma.MonitoringDeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonitoringDevicePayload>[]
          }
          create: {
            args: Prisma.MonitoringDeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonitoringDevicePayload>
          }
          createMany: {
            args: Prisma.MonitoringDeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MonitoringDeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonitoringDevicePayload>[]
          }
          delete: {
            args: Prisma.MonitoringDeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonitoringDevicePayload>
          }
          update: {
            args: Prisma.MonitoringDeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonitoringDevicePayload>
          }
          deleteMany: {
            args: Prisma.MonitoringDeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MonitoringDeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MonitoringDeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonitoringDevicePayload>
          }
          aggregate: {
            args: Prisma.MonitoringDeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMonitoringDevice>
          }
          groupBy: {
            args: Prisma.MonitoringDeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<MonitoringDeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.MonitoringDeviceCountArgs<ExtArgs>
            result: $Utils.Optional<MonitoringDeviceCountAggregateOutputType> | number
          }
        }
      }
      VitalReading: {
        payload: Prisma.$VitalReadingPayload<ExtArgs>
        fields: Prisma.VitalReadingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VitalReadingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalReadingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VitalReadingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalReadingPayload>
          }
          findFirst: {
            args: Prisma.VitalReadingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalReadingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VitalReadingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalReadingPayload>
          }
          findMany: {
            args: Prisma.VitalReadingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalReadingPayload>[]
          }
          create: {
            args: Prisma.VitalReadingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalReadingPayload>
          }
          createMany: {
            args: Prisma.VitalReadingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VitalReadingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalReadingPayload>[]
          }
          delete: {
            args: Prisma.VitalReadingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalReadingPayload>
          }
          update: {
            args: Prisma.VitalReadingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalReadingPayload>
          }
          deleteMany: {
            args: Prisma.VitalReadingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VitalReadingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VitalReadingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalReadingPayload>
          }
          aggregate: {
            args: Prisma.VitalReadingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVitalReading>
          }
          groupBy: {
            args: Prisma.VitalReadingGroupByArgs<ExtArgs>
            result: $Utils.Optional<VitalReadingGroupByOutputType>[]
          }
          count: {
            args: Prisma.VitalReadingCountArgs<ExtArgs>
            result: $Utils.Optional<VitalReadingCountAggregateOutputType> | number
          }
        }
      }
      Alert: {
        payload: Prisma.$AlertPayload<ExtArgs>
        fields: Prisma.AlertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlertFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlertFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          findFirst: {
            args: Prisma.AlertFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlertFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          findMany: {
            args: Prisma.AlertFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>[]
          }
          create: {
            args: Prisma.AlertCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          createMany: {
            args: Prisma.AlertCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlertCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>[]
          }
          delete: {
            args: Prisma.AlertDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          update: {
            args: Prisma.AlertUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          deleteMany: {
            args: Prisma.AlertDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlertUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AlertUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          aggregate: {
            args: Prisma.AlertAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlert>
          }
          groupBy: {
            args: Prisma.AlertGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlertGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlertCountArgs<ExtArgs>
            result: $Utils.Optional<AlertCountAggregateOutputType> | number
          }
        }
      }
      Goal: {
        payload: Prisma.$GoalPayload<ExtArgs>
        fields: Prisma.GoalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GoalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GoalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>
          }
          findFirst: {
            args: Prisma.GoalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GoalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>
          }
          findMany: {
            args: Prisma.GoalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>[]
          }
          create: {
            args: Prisma.GoalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>
          }
          createMany: {
            args: Prisma.GoalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GoalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>[]
          }
          delete: {
            args: Prisma.GoalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>
          }
          update: {
            args: Prisma.GoalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>
          }
          deleteMany: {
            args: Prisma.GoalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GoalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GoalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>
          }
          aggregate: {
            args: Prisma.GoalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGoal>
          }
          groupBy: {
            args: Prisma.GoalGroupByArgs<ExtArgs>
            result: $Utils.Optional<GoalGroupByOutputType>[]
          }
          count: {
            args: Prisma.GoalCountArgs<ExtArgs>
            result: $Utils.Optional<GoalCountAggregateOutputType> | number
          }
        }
      }
      GoalProgress: {
        payload: Prisma.$GoalProgressPayload<ExtArgs>
        fields: Prisma.GoalProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GoalProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GoalProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalProgressPayload>
          }
          findFirst: {
            args: Prisma.GoalProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GoalProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalProgressPayload>
          }
          findMany: {
            args: Prisma.GoalProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalProgressPayload>[]
          }
          create: {
            args: Prisma.GoalProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalProgressPayload>
          }
          createMany: {
            args: Prisma.GoalProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GoalProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalProgressPayload>[]
          }
          delete: {
            args: Prisma.GoalProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalProgressPayload>
          }
          update: {
            args: Prisma.GoalProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalProgressPayload>
          }
          deleteMany: {
            args: Prisma.GoalProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GoalProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GoalProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalProgressPayload>
          }
          aggregate: {
            args: Prisma.GoalProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGoalProgress>
          }
          groupBy: {
            args: Prisma.GoalProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<GoalProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.GoalProgressCountArgs<ExtArgs>
            result: $Utils.Optional<GoalProgressCountAggregateOutputType> | number
          }
        }
      }
      AlertThreshold: {
        payload: Prisma.$AlertThresholdPayload<ExtArgs>
        fields: Prisma.AlertThresholdFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlertThresholdFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertThresholdPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlertThresholdFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertThresholdPayload>
          }
          findFirst: {
            args: Prisma.AlertThresholdFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertThresholdPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlertThresholdFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertThresholdPayload>
          }
          findMany: {
            args: Prisma.AlertThresholdFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertThresholdPayload>[]
          }
          create: {
            args: Prisma.AlertThresholdCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertThresholdPayload>
          }
          createMany: {
            args: Prisma.AlertThresholdCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlertThresholdCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertThresholdPayload>[]
          }
          delete: {
            args: Prisma.AlertThresholdDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertThresholdPayload>
          }
          update: {
            args: Prisma.AlertThresholdUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertThresholdPayload>
          }
          deleteMany: {
            args: Prisma.AlertThresholdDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlertThresholdUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AlertThresholdUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertThresholdPayload>
          }
          aggregate: {
            args: Prisma.AlertThresholdAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlertThreshold>
          }
          groupBy: {
            args: Prisma.AlertThresholdGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlertThresholdGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlertThresholdCountArgs<ExtArgs>
            result: $Utils.Optional<AlertThresholdCountAggregateOutputType> | number
          }
        }
      }
      CarePlanTemplate: {
        payload: Prisma.$CarePlanTemplatePayload<ExtArgs>
        fields: Prisma.CarePlanTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CarePlanTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CarePlanTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanTemplatePayload>
          }
          findFirst: {
            args: Prisma.CarePlanTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CarePlanTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanTemplatePayload>
          }
          findMany: {
            args: Prisma.CarePlanTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanTemplatePayload>[]
          }
          create: {
            args: Prisma.CarePlanTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanTemplatePayload>
          }
          createMany: {
            args: Prisma.CarePlanTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CarePlanTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanTemplatePayload>[]
          }
          delete: {
            args: Prisma.CarePlanTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanTemplatePayload>
          }
          update: {
            args: Prisma.CarePlanTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanTemplatePayload>
          }
          deleteMany: {
            args: Prisma.CarePlanTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CarePlanTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CarePlanTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarePlanTemplatePayload>
          }
          aggregate: {
            args: Prisma.CarePlanTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCarePlanTemplate>
          }
          groupBy: {
            args: Prisma.CarePlanTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<CarePlanTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.CarePlanTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<CarePlanTemplateCountAggregateOutputType> | number
          }
        }
      }
      PatientEngagement: {
        payload: Prisma.$PatientEngagementPayload<ExtArgs>
        fields: Prisma.PatientEngagementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientEngagementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientEngagementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementPayload>
          }
          findFirst: {
            args: Prisma.PatientEngagementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientEngagementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementPayload>
          }
          findMany: {
            args: Prisma.PatientEngagementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementPayload>[]
          }
          create: {
            args: Prisma.PatientEngagementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementPayload>
          }
          createMany: {
            args: Prisma.PatientEngagementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientEngagementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementPayload>[]
          }
          delete: {
            args: Prisma.PatientEngagementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementPayload>
          }
          update: {
            args: Prisma.PatientEngagementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementPayload>
          }
          deleteMany: {
            args: Prisma.PatientEngagementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientEngagementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientEngagementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementPayload>
          }
          aggregate: {
            args: Prisma.PatientEngagementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientEngagement>
          }
          groupBy: {
            args: Prisma.PatientEngagementGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientEngagementGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientEngagementCountArgs<ExtArgs>
            result: $Utils.Optional<PatientEngagementCountAggregateOutputType> | number
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
   * Count Type CarePlanCountOutputType
   */

  export type CarePlanCountOutputType = {
    tasks: number
    vitals: number
    alerts: number
  }

  export type CarePlanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | CarePlanCountOutputTypeCountTasksArgs
    vitals?: boolean | CarePlanCountOutputTypeCountVitalsArgs
    alerts?: boolean | CarePlanCountOutputTypeCountAlertsArgs
  }

  // Custom InputTypes
  /**
   * CarePlanCountOutputType without action
   */
  export type CarePlanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlanCountOutputType
     */
    select?: CarePlanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CarePlanCountOutputType without action
   */
  export type CarePlanCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CareTaskWhereInput
  }

  /**
   * CarePlanCountOutputType without action
   */
  export type CarePlanCountOutputTypeCountVitalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VitalReadingWhereInput
  }

  /**
   * CarePlanCountOutputType without action
   */
  export type CarePlanCountOutputTypeCountAlertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlertWhereInput
  }


  /**
   * Count Type MonitoringDeviceCountOutputType
   */

  export type MonitoringDeviceCountOutputType = {
    readings: number
  }

  export type MonitoringDeviceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    readings?: boolean | MonitoringDeviceCountOutputTypeCountReadingsArgs
  }

  // Custom InputTypes
  /**
   * MonitoringDeviceCountOutputType without action
   */
  export type MonitoringDeviceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDeviceCountOutputType
     */
    select?: MonitoringDeviceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MonitoringDeviceCountOutputType without action
   */
  export type MonitoringDeviceCountOutputTypeCountReadingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VitalReadingWhereInput
  }


  /**
   * Count Type GoalCountOutputType
   */

  export type GoalCountOutputType = {
    progress: number
  }

  export type GoalCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    progress?: boolean | GoalCountOutputTypeCountProgressArgs
  }

  // Custom InputTypes
  /**
   * GoalCountOutputType without action
   */
  export type GoalCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalCountOutputType
     */
    select?: GoalCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GoalCountOutputType without action
   */
  export type GoalCountOutputTypeCountProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GoalProgressWhereInput
  }


  /**
   * Models
   */

  /**
   * Model CarePlan
   */

  export type AggregateCarePlan = {
    _count: CarePlanCountAggregateOutputType | null
    _min: CarePlanMinAggregateOutputType | null
    _max: CarePlanMaxAggregateOutputType | null
  }

  export type CarePlanMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    condition: string | null
    status: $Enums.PlanStatus | null
    startDate: Date | null
    endDate: Date | null
    reviewSchedule: string | null
    nextReviewDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CarePlanMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    condition: string | null
    status: $Enums.PlanStatus | null
    startDate: Date | null
    endDate: Date | null
    reviewSchedule: string | null
    nextReviewDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CarePlanCountAggregateOutputType = {
    id: number
    patientId: number
    providerId: number
    condition: number
    status: number
    startDate: number
    endDate: number
    goals: number
    interventions: number
    reviewSchedule: number
    nextReviewDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CarePlanMinAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    condition?: true
    status?: true
    startDate?: true
    endDate?: true
    reviewSchedule?: true
    nextReviewDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CarePlanMaxAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    condition?: true
    status?: true
    startDate?: true
    endDate?: true
    reviewSchedule?: true
    nextReviewDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CarePlanCountAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    condition?: true
    status?: true
    startDate?: true
    endDate?: true
    goals?: true
    interventions?: true
    reviewSchedule?: true
    nextReviewDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CarePlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CarePlan to aggregate.
     */
    where?: CarePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CarePlans to fetch.
     */
    orderBy?: CarePlanOrderByWithRelationInput | CarePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CarePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CarePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CarePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CarePlans
    **/
    _count?: true | CarePlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CarePlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CarePlanMaxAggregateInputType
  }

  export type GetCarePlanAggregateType<T extends CarePlanAggregateArgs> = {
        [P in keyof T & keyof AggregateCarePlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCarePlan[P]>
      : GetScalarType<T[P], AggregateCarePlan[P]>
  }




  export type CarePlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CarePlanWhereInput
    orderBy?: CarePlanOrderByWithAggregationInput | CarePlanOrderByWithAggregationInput[]
    by: CarePlanScalarFieldEnum[] | CarePlanScalarFieldEnum
    having?: CarePlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CarePlanCountAggregateInputType | true
    _min?: CarePlanMinAggregateInputType
    _max?: CarePlanMaxAggregateInputType
  }

  export type CarePlanGroupByOutputType = {
    id: string
    patientId: string
    providerId: string
    condition: string
    status: $Enums.PlanStatus
    startDate: Date
    endDate: Date | null
    goals: JsonValue
    interventions: JsonValue
    reviewSchedule: string | null
    nextReviewDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: CarePlanCountAggregateOutputType | null
    _min: CarePlanMinAggregateOutputType | null
    _max: CarePlanMaxAggregateOutputType | null
  }

  type GetCarePlanGroupByPayload<T extends CarePlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CarePlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CarePlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CarePlanGroupByOutputType[P]>
            : GetScalarType<T[P], CarePlanGroupByOutputType[P]>
        }
      >
    >


  export type CarePlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    condition?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    goals?: boolean
    interventions?: boolean
    reviewSchedule?: boolean
    nextReviewDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tasks?: boolean | CarePlan$tasksArgs<ExtArgs>
    vitals?: boolean | CarePlan$vitalsArgs<ExtArgs>
    alerts?: boolean | CarePlan$alertsArgs<ExtArgs>
    _count?: boolean | CarePlanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["carePlan"]>

  export type CarePlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    condition?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    goals?: boolean
    interventions?: boolean
    reviewSchedule?: boolean
    nextReviewDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["carePlan"]>

  export type CarePlanSelectScalar = {
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    condition?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    goals?: boolean
    interventions?: boolean
    reviewSchedule?: boolean
    nextReviewDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CarePlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | CarePlan$tasksArgs<ExtArgs>
    vitals?: boolean | CarePlan$vitalsArgs<ExtArgs>
    alerts?: boolean | CarePlan$alertsArgs<ExtArgs>
    _count?: boolean | CarePlanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CarePlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CarePlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CarePlan"
    objects: {
      tasks: Prisma.$CareTaskPayload<ExtArgs>[]
      vitals: Prisma.$VitalReadingPayload<ExtArgs>[]
      alerts: Prisma.$AlertPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      providerId: string
      condition: string
      status: $Enums.PlanStatus
      startDate: Date
      endDate: Date | null
      goals: Prisma.JsonValue
      interventions: Prisma.JsonValue
      reviewSchedule: string | null
      nextReviewDate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["carePlan"]>
    composites: {}
  }

  type CarePlanGetPayload<S extends boolean | null | undefined | CarePlanDefaultArgs> = $Result.GetResult<Prisma.$CarePlanPayload, S>

  type CarePlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CarePlanFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CarePlanCountAggregateInputType | true
    }

  export interface CarePlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CarePlan'], meta: { name: 'CarePlan' } }
    /**
     * Find zero or one CarePlan that matches the filter.
     * @param {CarePlanFindUniqueArgs} args - Arguments to find a CarePlan
     * @example
     * // Get one CarePlan
     * const carePlan = await prisma.carePlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CarePlanFindUniqueArgs>(args: SelectSubset<T, CarePlanFindUniqueArgs<ExtArgs>>): Prisma__CarePlanClient<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CarePlan that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CarePlanFindUniqueOrThrowArgs} args - Arguments to find a CarePlan
     * @example
     * // Get one CarePlan
     * const carePlan = await prisma.carePlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CarePlanFindUniqueOrThrowArgs>(args: SelectSubset<T, CarePlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CarePlanClient<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CarePlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanFindFirstArgs} args - Arguments to find a CarePlan
     * @example
     * // Get one CarePlan
     * const carePlan = await prisma.carePlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CarePlanFindFirstArgs>(args?: SelectSubset<T, CarePlanFindFirstArgs<ExtArgs>>): Prisma__CarePlanClient<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CarePlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanFindFirstOrThrowArgs} args - Arguments to find a CarePlan
     * @example
     * // Get one CarePlan
     * const carePlan = await prisma.carePlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CarePlanFindFirstOrThrowArgs>(args?: SelectSubset<T, CarePlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__CarePlanClient<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CarePlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CarePlans
     * const carePlans = await prisma.carePlan.findMany()
     * 
     * // Get first 10 CarePlans
     * const carePlans = await prisma.carePlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const carePlanWithIdOnly = await prisma.carePlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CarePlanFindManyArgs>(args?: SelectSubset<T, CarePlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CarePlan.
     * @param {CarePlanCreateArgs} args - Arguments to create a CarePlan.
     * @example
     * // Create one CarePlan
     * const CarePlan = await prisma.carePlan.create({
     *   data: {
     *     // ... data to create a CarePlan
     *   }
     * })
     * 
     */
    create<T extends CarePlanCreateArgs>(args: SelectSubset<T, CarePlanCreateArgs<ExtArgs>>): Prisma__CarePlanClient<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CarePlans.
     * @param {CarePlanCreateManyArgs} args - Arguments to create many CarePlans.
     * @example
     * // Create many CarePlans
     * const carePlan = await prisma.carePlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CarePlanCreateManyArgs>(args?: SelectSubset<T, CarePlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CarePlans and returns the data saved in the database.
     * @param {CarePlanCreateManyAndReturnArgs} args - Arguments to create many CarePlans.
     * @example
     * // Create many CarePlans
     * const carePlan = await prisma.carePlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CarePlans and only return the `id`
     * const carePlanWithIdOnly = await prisma.carePlan.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CarePlanCreateManyAndReturnArgs>(args?: SelectSubset<T, CarePlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CarePlan.
     * @param {CarePlanDeleteArgs} args - Arguments to delete one CarePlan.
     * @example
     * // Delete one CarePlan
     * const CarePlan = await prisma.carePlan.delete({
     *   where: {
     *     // ... filter to delete one CarePlan
     *   }
     * })
     * 
     */
    delete<T extends CarePlanDeleteArgs>(args: SelectSubset<T, CarePlanDeleteArgs<ExtArgs>>): Prisma__CarePlanClient<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CarePlan.
     * @param {CarePlanUpdateArgs} args - Arguments to update one CarePlan.
     * @example
     * // Update one CarePlan
     * const carePlan = await prisma.carePlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CarePlanUpdateArgs>(args: SelectSubset<T, CarePlanUpdateArgs<ExtArgs>>): Prisma__CarePlanClient<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CarePlans.
     * @param {CarePlanDeleteManyArgs} args - Arguments to filter CarePlans to delete.
     * @example
     * // Delete a few CarePlans
     * const { count } = await prisma.carePlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CarePlanDeleteManyArgs>(args?: SelectSubset<T, CarePlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CarePlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CarePlans
     * const carePlan = await prisma.carePlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CarePlanUpdateManyArgs>(args: SelectSubset<T, CarePlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CarePlan.
     * @param {CarePlanUpsertArgs} args - Arguments to update or create a CarePlan.
     * @example
     * // Update or create a CarePlan
     * const carePlan = await prisma.carePlan.upsert({
     *   create: {
     *     // ... data to create a CarePlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CarePlan we want to update
     *   }
     * })
     */
    upsert<T extends CarePlanUpsertArgs>(args: SelectSubset<T, CarePlanUpsertArgs<ExtArgs>>): Prisma__CarePlanClient<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CarePlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanCountArgs} args - Arguments to filter CarePlans to count.
     * @example
     * // Count the number of CarePlans
     * const count = await prisma.carePlan.count({
     *   where: {
     *     // ... the filter for the CarePlans we want to count
     *   }
     * })
    **/
    count<T extends CarePlanCountArgs>(
      args?: Subset<T, CarePlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CarePlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CarePlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CarePlanAggregateArgs>(args: Subset<T, CarePlanAggregateArgs>): Prisma.PrismaPromise<GetCarePlanAggregateType<T>>

    /**
     * Group by CarePlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanGroupByArgs} args - Group by arguments.
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
      T extends CarePlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CarePlanGroupByArgs['orderBy'] }
        : { orderBy?: CarePlanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CarePlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCarePlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CarePlan model
   */
  readonly fields: CarePlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CarePlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CarePlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tasks<T extends CarePlan$tasksArgs<ExtArgs> = {}>(args?: Subset<T, CarePlan$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CareTaskPayload<ExtArgs>, T, "findMany"> | Null>
    vitals<T extends CarePlan$vitalsArgs<ExtArgs> = {}>(args?: Subset<T, CarePlan$vitalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VitalReadingPayload<ExtArgs>, T, "findMany"> | Null>
    alerts<T extends CarePlan$alertsArgs<ExtArgs> = {}>(args?: Subset<T, CarePlan$alertsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the CarePlan model
   */ 
  interface CarePlanFieldRefs {
    readonly id: FieldRef<"CarePlan", 'String'>
    readonly patientId: FieldRef<"CarePlan", 'String'>
    readonly providerId: FieldRef<"CarePlan", 'String'>
    readonly condition: FieldRef<"CarePlan", 'String'>
    readonly status: FieldRef<"CarePlan", 'PlanStatus'>
    readonly startDate: FieldRef<"CarePlan", 'DateTime'>
    readonly endDate: FieldRef<"CarePlan", 'DateTime'>
    readonly goals: FieldRef<"CarePlan", 'Json'>
    readonly interventions: FieldRef<"CarePlan", 'Json'>
    readonly reviewSchedule: FieldRef<"CarePlan", 'String'>
    readonly nextReviewDate: FieldRef<"CarePlan", 'DateTime'>
    readonly createdAt: FieldRef<"CarePlan", 'DateTime'>
    readonly updatedAt: FieldRef<"CarePlan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CarePlan findUnique
   */
  export type CarePlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CarePlanInclude<ExtArgs> | null
    /**
     * Filter, which CarePlan to fetch.
     */
    where: CarePlanWhereUniqueInput
  }

  /**
   * CarePlan findUniqueOrThrow
   */
  export type CarePlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CarePlanInclude<ExtArgs> | null
    /**
     * Filter, which CarePlan to fetch.
     */
    where: CarePlanWhereUniqueInput
  }

  /**
   * CarePlan findFirst
   */
  export type CarePlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CarePlanInclude<ExtArgs> | null
    /**
     * Filter, which CarePlan to fetch.
     */
    where?: CarePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CarePlans to fetch.
     */
    orderBy?: CarePlanOrderByWithRelationInput | CarePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CarePlans.
     */
    cursor?: CarePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CarePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CarePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CarePlans.
     */
    distinct?: CarePlanScalarFieldEnum | CarePlanScalarFieldEnum[]
  }

  /**
   * CarePlan findFirstOrThrow
   */
  export type CarePlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CarePlanInclude<ExtArgs> | null
    /**
     * Filter, which CarePlan to fetch.
     */
    where?: CarePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CarePlans to fetch.
     */
    orderBy?: CarePlanOrderByWithRelationInput | CarePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CarePlans.
     */
    cursor?: CarePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CarePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CarePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CarePlans.
     */
    distinct?: CarePlanScalarFieldEnum | CarePlanScalarFieldEnum[]
  }

  /**
   * CarePlan findMany
   */
  export type CarePlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CarePlanInclude<ExtArgs> | null
    /**
     * Filter, which CarePlans to fetch.
     */
    where?: CarePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CarePlans to fetch.
     */
    orderBy?: CarePlanOrderByWithRelationInput | CarePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CarePlans.
     */
    cursor?: CarePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CarePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CarePlans.
     */
    skip?: number
    distinct?: CarePlanScalarFieldEnum | CarePlanScalarFieldEnum[]
  }

  /**
   * CarePlan create
   */
  export type CarePlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CarePlanInclude<ExtArgs> | null
    /**
     * The data needed to create a CarePlan.
     */
    data: XOR<CarePlanCreateInput, CarePlanUncheckedCreateInput>
  }

  /**
   * CarePlan createMany
   */
  export type CarePlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CarePlans.
     */
    data: CarePlanCreateManyInput | CarePlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CarePlan createManyAndReturn
   */
  export type CarePlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CarePlans.
     */
    data: CarePlanCreateManyInput | CarePlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CarePlan update
   */
  export type CarePlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CarePlanInclude<ExtArgs> | null
    /**
     * The data needed to update a CarePlan.
     */
    data: XOR<CarePlanUpdateInput, CarePlanUncheckedUpdateInput>
    /**
     * Choose, which CarePlan to update.
     */
    where: CarePlanWhereUniqueInput
  }

  /**
   * CarePlan updateMany
   */
  export type CarePlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CarePlans.
     */
    data: XOR<CarePlanUpdateManyMutationInput, CarePlanUncheckedUpdateManyInput>
    /**
     * Filter which CarePlans to update
     */
    where?: CarePlanWhereInput
  }

  /**
   * CarePlan upsert
   */
  export type CarePlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CarePlanInclude<ExtArgs> | null
    /**
     * The filter to search for the CarePlan to update in case it exists.
     */
    where: CarePlanWhereUniqueInput
    /**
     * In case the CarePlan found by the `where` argument doesn't exist, create a new CarePlan with this data.
     */
    create: XOR<CarePlanCreateInput, CarePlanUncheckedCreateInput>
    /**
     * In case the CarePlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CarePlanUpdateInput, CarePlanUncheckedUpdateInput>
  }

  /**
   * CarePlan delete
   */
  export type CarePlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CarePlanInclude<ExtArgs> | null
    /**
     * Filter which CarePlan to delete.
     */
    where: CarePlanWhereUniqueInput
  }

  /**
   * CarePlan deleteMany
   */
  export type CarePlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CarePlans to delete
     */
    where?: CarePlanWhereInput
  }

  /**
   * CarePlan.tasks
   */
  export type CarePlan$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareTask
     */
    select?: CareTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareTaskInclude<ExtArgs> | null
    where?: CareTaskWhereInput
    orderBy?: CareTaskOrderByWithRelationInput | CareTaskOrderByWithRelationInput[]
    cursor?: CareTaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CareTaskScalarFieldEnum | CareTaskScalarFieldEnum[]
  }

  /**
   * CarePlan.vitals
   */
  export type CarePlan$vitalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingInclude<ExtArgs> | null
    where?: VitalReadingWhereInput
    orderBy?: VitalReadingOrderByWithRelationInput | VitalReadingOrderByWithRelationInput[]
    cursor?: VitalReadingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VitalReadingScalarFieldEnum | VitalReadingScalarFieldEnum[]
  }

  /**
   * CarePlan.alerts
   */
  export type CarePlan$alertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    where?: AlertWhereInput
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    cursor?: AlertWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AlertScalarFieldEnum | AlertScalarFieldEnum[]
  }

  /**
   * CarePlan without action
   */
  export type CarePlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CarePlanInclude<ExtArgs> | null
  }


  /**
   * Model CareTask
   */

  export type AggregateCareTask = {
    _count: CareTaskCountAggregateOutputType | null
    _min: CareTaskMinAggregateOutputType | null
    _max: CareTaskMaxAggregateOutputType | null
  }

  export type CareTaskMinAggregateOutputType = {
    id: string | null
    carePlanId: string | null
    title: string | null
    description: string | null
    taskType: $Enums.TaskType | null
    frequency: string | null
    dueDate: Date | null
    completedAt: Date | null
    status: $Enums.TaskStatus | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CareTaskMaxAggregateOutputType = {
    id: string | null
    carePlanId: string | null
    title: string | null
    description: string | null
    taskType: $Enums.TaskType | null
    frequency: string | null
    dueDate: Date | null
    completedAt: Date | null
    status: $Enums.TaskStatus | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CareTaskCountAggregateOutputType = {
    id: number
    carePlanId: number
    title: number
    description: number
    taskType: number
    frequency: number
    dueDate: number
    completedAt: number
    status: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CareTaskMinAggregateInputType = {
    id?: true
    carePlanId?: true
    title?: true
    description?: true
    taskType?: true
    frequency?: true
    dueDate?: true
    completedAt?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CareTaskMaxAggregateInputType = {
    id?: true
    carePlanId?: true
    title?: true
    description?: true
    taskType?: true
    frequency?: true
    dueDate?: true
    completedAt?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CareTaskCountAggregateInputType = {
    id?: true
    carePlanId?: true
    title?: true
    description?: true
    taskType?: true
    frequency?: true
    dueDate?: true
    completedAt?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CareTaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CareTask to aggregate.
     */
    where?: CareTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CareTasks to fetch.
     */
    orderBy?: CareTaskOrderByWithRelationInput | CareTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CareTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CareTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CareTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CareTasks
    **/
    _count?: true | CareTaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CareTaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CareTaskMaxAggregateInputType
  }

  export type GetCareTaskAggregateType<T extends CareTaskAggregateArgs> = {
        [P in keyof T & keyof AggregateCareTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCareTask[P]>
      : GetScalarType<T[P], AggregateCareTask[P]>
  }




  export type CareTaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CareTaskWhereInput
    orderBy?: CareTaskOrderByWithAggregationInput | CareTaskOrderByWithAggregationInput[]
    by: CareTaskScalarFieldEnum[] | CareTaskScalarFieldEnum
    having?: CareTaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CareTaskCountAggregateInputType | true
    _min?: CareTaskMinAggregateInputType
    _max?: CareTaskMaxAggregateInputType
  }

  export type CareTaskGroupByOutputType = {
    id: string
    carePlanId: string
    title: string
    description: string | null
    taskType: $Enums.TaskType
    frequency: string
    dueDate: Date | null
    completedAt: Date | null
    status: $Enums.TaskStatus
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: CareTaskCountAggregateOutputType | null
    _min: CareTaskMinAggregateOutputType | null
    _max: CareTaskMaxAggregateOutputType | null
  }

  type GetCareTaskGroupByPayload<T extends CareTaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CareTaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CareTaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CareTaskGroupByOutputType[P]>
            : GetScalarType<T[P], CareTaskGroupByOutputType[P]>
        }
      >
    >


  export type CareTaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    carePlanId?: boolean
    title?: boolean
    description?: boolean
    taskType?: boolean
    frequency?: boolean
    dueDate?: boolean
    completedAt?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    carePlan?: boolean | CarePlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["careTask"]>

  export type CareTaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    carePlanId?: boolean
    title?: boolean
    description?: boolean
    taskType?: boolean
    frequency?: boolean
    dueDate?: boolean
    completedAt?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    carePlan?: boolean | CarePlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["careTask"]>

  export type CareTaskSelectScalar = {
    id?: boolean
    carePlanId?: boolean
    title?: boolean
    description?: boolean
    taskType?: boolean
    frequency?: boolean
    dueDate?: boolean
    completedAt?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CareTaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    carePlan?: boolean | CarePlanDefaultArgs<ExtArgs>
  }
  export type CareTaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    carePlan?: boolean | CarePlanDefaultArgs<ExtArgs>
  }

  export type $CareTaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CareTask"
    objects: {
      carePlan: Prisma.$CarePlanPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      carePlanId: string
      title: string
      description: string | null
      taskType: $Enums.TaskType
      frequency: string
      dueDate: Date | null
      completedAt: Date | null
      status: $Enums.TaskStatus
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["careTask"]>
    composites: {}
  }

  type CareTaskGetPayload<S extends boolean | null | undefined | CareTaskDefaultArgs> = $Result.GetResult<Prisma.$CareTaskPayload, S>

  type CareTaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CareTaskFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CareTaskCountAggregateInputType | true
    }

  export interface CareTaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CareTask'], meta: { name: 'CareTask' } }
    /**
     * Find zero or one CareTask that matches the filter.
     * @param {CareTaskFindUniqueArgs} args - Arguments to find a CareTask
     * @example
     * // Get one CareTask
     * const careTask = await prisma.careTask.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CareTaskFindUniqueArgs>(args: SelectSubset<T, CareTaskFindUniqueArgs<ExtArgs>>): Prisma__CareTaskClient<$Result.GetResult<Prisma.$CareTaskPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CareTask that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CareTaskFindUniqueOrThrowArgs} args - Arguments to find a CareTask
     * @example
     * // Get one CareTask
     * const careTask = await prisma.careTask.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CareTaskFindUniqueOrThrowArgs>(args: SelectSubset<T, CareTaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CareTaskClient<$Result.GetResult<Prisma.$CareTaskPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CareTask that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareTaskFindFirstArgs} args - Arguments to find a CareTask
     * @example
     * // Get one CareTask
     * const careTask = await prisma.careTask.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CareTaskFindFirstArgs>(args?: SelectSubset<T, CareTaskFindFirstArgs<ExtArgs>>): Prisma__CareTaskClient<$Result.GetResult<Prisma.$CareTaskPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CareTask that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareTaskFindFirstOrThrowArgs} args - Arguments to find a CareTask
     * @example
     * // Get one CareTask
     * const careTask = await prisma.careTask.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CareTaskFindFirstOrThrowArgs>(args?: SelectSubset<T, CareTaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__CareTaskClient<$Result.GetResult<Prisma.$CareTaskPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CareTasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareTaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CareTasks
     * const careTasks = await prisma.careTask.findMany()
     * 
     * // Get first 10 CareTasks
     * const careTasks = await prisma.careTask.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const careTaskWithIdOnly = await prisma.careTask.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CareTaskFindManyArgs>(args?: SelectSubset<T, CareTaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CareTaskPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CareTask.
     * @param {CareTaskCreateArgs} args - Arguments to create a CareTask.
     * @example
     * // Create one CareTask
     * const CareTask = await prisma.careTask.create({
     *   data: {
     *     // ... data to create a CareTask
     *   }
     * })
     * 
     */
    create<T extends CareTaskCreateArgs>(args: SelectSubset<T, CareTaskCreateArgs<ExtArgs>>): Prisma__CareTaskClient<$Result.GetResult<Prisma.$CareTaskPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CareTasks.
     * @param {CareTaskCreateManyArgs} args - Arguments to create many CareTasks.
     * @example
     * // Create many CareTasks
     * const careTask = await prisma.careTask.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CareTaskCreateManyArgs>(args?: SelectSubset<T, CareTaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CareTasks and returns the data saved in the database.
     * @param {CareTaskCreateManyAndReturnArgs} args - Arguments to create many CareTasks.
     * @example
     * // Create many CareTasks
     * const careTask = await prisma.careTask.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CareTasks and only return the `id`
     * const careTaskWithIdOnly = await prisma.careTask.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CareTaskCreateManyAndReturnArgs>(args?: SelectSubset<T, CareTaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CareTaskPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CareTask.
     * @param {CareTaskDeleteArgs} args - Arguments to delete one CareTask.
     * @example
     * // Delete one CareTask
     * const CareTask = await prisma.careTask.delete({
     *   where: {
     *     // ... filter to delete one CareTask
     *   }
     * })
     * 
     */
    delete<T extends CareTaskDeleteArgs>(args: SelectSubset<T, CareTaskDeleteArgs<ExtArgs>>): Prisma__CareTaskClient<$Result.GetResult<Prisma.$CareTaskPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CareTask.
     * @param {CareTaskUpdateArgs} args - Arguments to update one CareTask.
     * @example
     * // Update one CareTask
     * const careTask = await prisma.careTask.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CareTaskUpdateArgs>(args: SelectSubset<T, CareTaskUpdateArgs<ExtArgs>>): Prisma__CareTaskClient<$Result.GetResult<Prisma.$CareTaskPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CareTasks.
     * @param {CareTaskDeleteManyArgs} args - Arguments to filter CareTasks to delete.
     * @example
     * // Delete a few CareTasks
     * const { count } = await prisma.careTask.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CareTaskDeleteManyArgs>(args?: SelectSubset<T, CareTaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CareTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareTaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CareTasks
     * const careTask = await prisma.careTask.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CareTaskUpdateManyArgs>(args: SelectSubset<T, CareTaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CareTask.
     * @param {CareTaskUpsertArgs} args - Arguments to update or create a CareTask.
     * @example
     * // Update or create a CareTask
     * const careTask = await prisma.careTask.upsert({
     *   create: {
     *     // ... data to create a CareTask
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CareTask we want to update
     *   }
     * })
     */
    upsert<T extends CareTaskUpsertArgs>(args: SelectSubset<T, CareTaskUpsertArgs<ExtArgs>>): Prisma__CareTaskClient<$Result.GetResult<Prisma.$CareTaskPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CareTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareTaskCountArgs} args - Arguments to filter CareTasks to count.
     * @example
     * // Count the number of CareTasks
     * const count = await prisma.careTask.count({
     *   where: {
     *     // ... the filter for the CareTasks we want to count
     *   }
     * })
    **/
    count<T extends CareTaskCountArgs>(
      args?: Subset<T, CareTaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CareTaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CareTask.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareTaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CareTaskAggregateArgs>(args: Subset<T, CareTaskAggregateArgs>): Prisma.PrismaPromise<GetCareTaskAggregateType<T>>

    /**
     * Group by CareTask.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareTaskGroupByArgs} args - Group by arguments.
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
      T extends CareTaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CareTaskGroupByArgs['orderBy'] }
        : { orderBy?: CareTaskGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CareTaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCareTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CareTask model
   */
  readonly fields: CareTaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CareTask.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CareTaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    carePlan<T extends CarePlanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CarePlanDefaultArgs<ExtArgs>>): Prisma__CarePlanClient<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the CareTask model
   */ 
  interface CareTaskFieldRefs {
    readonly id: FieldRef<"CareTask", 'String'>
    readonly carePlanId: FieldRef<"CareTask", 'String'>
    readonly title: FieldRef<"CareTask", 'String'>
    readonly description: FieldRef<"CareTask", 'String'>
    readonly taskType: FieldRef<"CareTask", 'TaskType'>
    readonly frequency: FieldRef<"CareTask", 'String'>
    readonly dueDate: FieldRef<"CareTask", 'DateTime'>
    readonly completedAt: FieldRef<"CareTask", 'DateTime'>
    readonly status: FieldRef<"CareTask", 'TaskStatus'>
    readonly notes: FieldRef<"CareTask", 'String'>
    readonly createdAt: FieldRef<"CareTask", 'DateTime'>
    readonly updatedAt: FieldRef<"CareTask", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CareTask findUnique
   */
  export type CareTaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareTask
     */
    select?: CareTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareTaskInclude<ExtArgs> | null
    /**
     * Filter, which CareTask to fetch.
     */
    where: CareTaskWhereUniqueInput
  }

  /**
   * CareTask findUniqueOrThrow
   */
  export type CareTaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareTask
     */
    select?: CareTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareTaskInclude<ExtArgs> | null
    /**
     * Filter, which CareTask to fetch.
     */
    where: CareTaskWhereUniqueInput
  }

  /**
   * CareTask findFirst
   */
  export type CareTaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareTask
     */
    select?: CareTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareTaskInclude<ExtArgs> | null
    /**
     * Filter, which CareTask to fetch.
     */
    where?: CareTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CareTasks to fetch.
     */
    orderBy?: CareTaskOrderByWithRelationInput | CareTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CareTasks.
     */
    cursor?: CareTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CareTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CareTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CareTasks.
     */
    distinct?: CareTaskScalarFieldEnum | CareTaskScalarFieldEnum[]
  }

  /**
   * CareTask findFirstOrThrow
   */
  export type CareTaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareTask
     */
    select?: CareTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareTaskInclude<ExtArgs> | null
    /**
     * Filter, which CareTask to fetch.
     */
    where?: CareTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CareTasks to fetch.
     */
    orderBy?: CareTaskOrderByWithRelationInput | CareTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CareTasks.
     */
    cursor?: CareTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CareTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CareTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CareTasks.
     */
    distinct?: CareTaskScalarFieldEnum | CareTaskScalarFieldEnum[]
  }

  /**
   * CareTask findMany
   */
  export type CareTaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareTask
     */
    select?: CareTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareTaskInclude<ExtArgs> | null
    /**
     * Filter, which CareTasks to fetch.
     */
    where?: CareTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CareTasks to fetch.
     */
    orderBy?: CareTaskOrderByWithRelationInput | CareTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CareTasks.
     */
    cursor?: CareTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CareTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CareTasks.
     */
    skip?: number
    distinct?: CareTaskScalarFieldEnum | CareTaskScalarFieldEnum[]
  }

  /**
   * CareTask create
   */
  export type CareTaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareTask
     */
    select?: CareTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareTaskInclude<ExtArgs> | null
    /**
     * The data needed to create a CareTask.
     */
    data: XOR<CareTaskCreateInput, CareTaskUncheckedCreateInput>
  }

  /**
   * CareTask createMany
   */
  export type CareTaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CareTasks.
     */
    data: CareTaskCreateManyInput | CareTaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CareTask createManyAndReturn
   */
  export type CareTaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareTask
     */
    select?: CareTaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CareTasks.
     */
    data: CareTaskCreateManyInput | CareTaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareTaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CareTask update
   */
  export type CareTaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareTask
     */
    select?: CareTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareTaskInclude<ExtArgs> | null
    /**
     * The data needed to update a CareTask.
     */
    data: XOR<CareTaskUpdateInput, CareTaskUncheckedUpdateInput>
    /**
     * Choose, which CareTask to update.
     */
    where: CareTaskWhereUniqueInput
  }

  /**
   * CareTask updateMany
   */
  export type CareTaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CareTasks.
     */
    data: XOR<CareTaskUpdateManyMutationInput, CareTaskUncheckedUpdateManyInput>
    /**
     * Filter which CareTasks to update
     */
    where?: CareTaskWhereInput
  }

  /**
   * CareTask upsert
   */
  export type CareTaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareTask
     */
    select?: CareTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareTaskInclude<ExtArgs> | null
    /**
     * The filter to search for the CareTask to update in case it exists.
     */
    where: CareTaskWhereUniqueInput
    /**
     * In case the CareTask found by the `where` argument doesn't exist, create a new CareTask with this data.
     */
    create: XOR<CareTaskCreateInput, CareTaskUncheckedCreateInput>
    /**
     * In case the CareTask was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CareTaskUpdateInput, CareTaskUncheckedUpdateInput>
  }

  /**
   * CareTask delete
   */
  export type CareTaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareTask
     */
    select?: CareTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareTaskInclude<ExtArgs> | null
    /**
     * Filter which CareTask to delete.
     */
    where: CareTaskWhereUniqueInput
  }

  /**
   * CareTask deleteMany
   */
  export type CareTaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CareTasks to delete
     */
    where?: CareTaskWhereInput
  }

  /**
   * CareTask without action
   */
  export type CareTaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareTask
     */
    select?: CareTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareTaskInclude<ExtArgs> | null
  }


  /**
   * Model MonitoringDevice
   */

  export type AggregateMonitoringDevice = {
    _count: MonitoringDeviceCountAggregateOutputType | null
    _avg: MonitoringDeviceAvgAggregateOutputType | null
    _sum: MonitoringDeviceSumAggregateOutputType | null
    _min: MonitoringDeviceMinAggregateOutputType | null
    _max: MonitoringDeviceMaxAggregateOutputType | null
  }

  export type MonitoringDeviceAvgAggregateOutputType = {
    batteryLevel: number | null
  }

  export type MonitoringDeviceSumAggregateOutputType = {
    batteryLevel: number | null
  }

  export type MonitoringDeviceMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    deviceType: $Enums.DeviceType | null
    manufacturer: string | null
    model: string | null
    serialNumber: string | null
    status: $Enums.DeviceStatus | null
    lastSyncAt: Date | null
    batteryLevel: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MonitoringDeviceMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    deviceType: $Enums.DeviceType | null
    manufacturer: string | null
    model: string | null
    serialNumber: string | null
    status: $Enums.DeviceStatus | null
    lastSyncAt: Date | null
    batteryLevel: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MonitoringDeviceCountAggregateOutputType = {
    id: number
    patientId: number
    deviceType: number
    manufacturer: number
    model: number
    serialNumber: number
    status: number
    lastSyncAt: number
    batteryLevel: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MonitoringDeviceAvgAggregateInputType = {
    batteryLevel?: true
  }

  export type MonitoringDeviceSumAggregateInputType = {
    batteryLevel?: true
  }

  export type MonitoringDeviceMinAggregateInputType = {
    id?: true
    patientId?: true
    deviceType?: true
    manufacturer?: true
    model?: true
    serialNumber?: true
    status?: true
    lastSyncAt?: true
    batteryLevel?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MonitoringDeviceMaxAggregateInputType = {
    id?: true
    patientId?: true
    deviceType?: true
    manufacturer?: true
    model?: true
    serialNumber?: true
    status?: true
    lastSyncAt?: true
    batteryLevel?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MonitoringDeviceCountAggregateInputType = {
    id?: true
    patientId?: true
    deviceType?: true
    manufacturer?: true
    model?: true
    serialNumber?: true
    status?: true
    lastSyncAt?: true
    batteryLevel?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MonitoringDeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MonitoringDevice to aggregate.
     */
    where?: MonitoringDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonitoringDevices to fetch.
     */
    orderBy?: MonitoringDeviceOrderByWithRelationInput | MonitoringDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MonitoringDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonitoringDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonitoringDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MonitoringDevices
    **/
    _count?: true | MonitoringDeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MonitoringDeviceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MonitoringDeviceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MonitoringDeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MonitoringDeviceMaxAggregateInputType
  }

  export type GetMonitoringDeviceAggregateType<T extends MonitoringDeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateMonitoringDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMonitoringDevice[P]>
      : GetScalarType<T[P], AggregateMonitoringDevice[P]>
  }




  export type MonitoringDeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MonitoringDeviceWhereInput
    orderBy?: MonitoringDeviceOrderByWithAggregationInput | MonitoringDeviceOrderByWithAggregationInput[]
    by: MonitoringDeviceScalarFieldEnum[] | MonitoringDeviceScalarFieldEnum
    having?: MonitoringDeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MonitoringDeviceCountAggregateInputType | true
    _avg?: MonitoringDeviceAvgAggregateInputType
    _sum?: MonitoringDeviceSumAggregateInputType
    _min?: MonitoringDeviceMinAggregateInputType
    _max?: MonitoringDeviceMaxAggregateInputType
  }

  export type MonitoringDeviceGroupByOutputType = {
    id: string
    patientId: string
    deviceType: $Enums.DeviceType
    manufacturer: string | null
    model: string | null
    serialNumber: string
    status: $Enums.DeviceStatus
    lastSyncAt: Date | null
    batteryLevel: number | null
    createdAt: Date
    updatedAt: Date
    _count: MonitoringDeviceCountAggregateOutputType | null
    _avg: MonitoringDeviceAvgAggregateOutputType | null
    _sum: MonitoringDeviceSumAggregateOutputType | null
    _min: MonitoringDeviceMinAggregateOutputType | null
    _max: MonitoringDeviceMaxAggregateOutputType | null
  }

  type GetMonitoringDeviceGroupByPayload<T extends MonitoringDeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MonitoringDeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MonitoringDeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MonitoringDeviceGroupByOutputType[P]>
            : GetScalarType<T[P], MonitoringDeviceGroupByOutputType[P]>
        }
      >
    >


  export type MonitoringDeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    deviceType?: boolean
    manufacturer?: boolean
    model?: boolean
    serialNumber?: boolean
    status?: boolean
    lastSyncAt?: boolean
    batteryLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    readings?: boolean | MonitoringDevice$readingsArgs<ExtArgs>
    _count?: boolean | MonitoringDeviceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["monitoringDevice"]>

  export type MonitoringDeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    deviceType?: boolean
    manufacturer?: boolean
    model?: boolean
    serialNumber?: boolean
    status?: boolean
    lastSyncAt?: boolean
    batteryLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["monitoringDevice"]>

  export type MonitoringDeviceSelectScalar = {
    id?: boolean
    patientId?: boolean
    deviceType?: boolean
    manufacturer?: boolean
    model?: boolean
    serialNumber?: boolean
    status?: boolean
    lastSyncAt?: boolean
    batteryLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MonitoringDeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    readings?: boolean | MonitoringDevice$readingsArgs<ExtArgs>
    _count?: boolean | MonitoringDeviceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MonitoringDeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MonitoringDevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MonitoringDevice"
    objects: {
      readings: Prisma.$VitalReadingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      deviceType: $Enums.DeviceType
      manufacturer: string | null
      model: string | null
      serialNumber: string
      status: $Enums.DeviceStatus
      lastSyncAt: Date | null
      batteryLevel: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["monitoringDevice"]>
    composites: {}
  }

  type MonitoringDeviceGetPayload<S extends boolean | null | undefined | MonitoringDeviceDefaultArgs> = $Result.GetResult<Prisma.$MonitoringDevicePayload, S>

  type MonitoringDeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MonitoringDeviceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MonitoringDeviceCountAggregateInputType | true
    }

  export interface MonitoringDeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MonitoringDevice'], meta: { name: 'MonitoringDevice' } }
    /**
     * Find zero or one MonitoringDevice that matches the filter.
     * @param {MonitoringDeviceFindUniqueArgs} args - Arguments to find a MonitoringDevice
     * @example
     * // Get one MonitoringDevice
     * const monitoringDevice = await prisma.monitoringDevice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MonitoringDeviceFindUniqueArgs>(args: SelectSubset<T, MonitoringDeviceFindUniqueArgs<ExtArgs>>): Prisma__MonitoringDeviceClient<$Result.GetResult<Prisma.$MonitoringDevicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MonitoringDevice that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MonitoringDeviceFindUniqueOrThrowArgs} args - Arguments to find a MonitoringDevice
     * @example
     * // Get one MonitoringDevice
     * const monitoringDevice = await prisma.monitoringDevice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MonitoringDeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, MonitoringDeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MonitoringDeviceClient<$Result.GetResult<Prisma.$MonitoringDevicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MonitoringDevice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitoringDeviceFindFirstArgs} args - Arguments to find a MonitoringDevice
     * @example
     * // Get one MonitoringDevice
     * const monitoringDevice = await prisma.monitoringDevice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MonitoringDeviceFindFirstArgs>(args?: SelectSubset<T, MonitoringDeviceFindFirstArgs<ExtArgs>>): Prisma__MonitoringDeviceClient<$Result.GetResult<Prisma.$MonitoringDevicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MonitoringDevice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitoringDeviceFindFirstOrThrowArgs} args - Arguments to find a MonitoringDevice
     * @example
     * // Get one MonitoringDevice
     * const monitoringDevice = await prisma.monitoringDevice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MonitoringDeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, MonitoringDeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__MonitoringDeviceClient<$Result.GetResult<Prisma.$MonitoringDevicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MonitoringDevices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitoringDeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MonitoringDevices
     * const monitoringDevices = await prisma.monitoringDevice.findMany()
     * 
     * // Get first 10 MonitoringDevices
     * const monitoringDevices = await prisma.monitoringDevice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const monitoringDeviceWithIdOnly = await prisma.monitoringDevice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MonitoringDeviceFindManyArgs>(args?: SelectSubset<T, MonitoringDeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonitoringDevicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MonitoringDevice.
     * @param {MonitoringDeviceCreateArgs} args - Arguments to create a MonitoringDevice.
     * @example
     * // Create one MonitoringDevice
     * const MonitoringDevice = await prisma.monitoringDevice.create({
     *   data: {
     *     // ... data to create a MonitoringDevice
     *   }
     * })
     * 
     */
    create<T extends MonitoringDeviceCreateArgs>(args: SelectSubset<T, MonitoringDeviceCreateArgs<ExtArgs>>): Prisma__MonitoringDeviceClient<$Result.GetResult<Prisma.$MonitoringDevicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MonitoringDevices.
     * @param {MonitoringDeviceCreateManyArgs} args - Arguments to create many MonitoringDevices.
     * @example
     * // Create many MonitoringDevices
     * const monitoringDevice = await prisma.monitoringDevice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MonitoringDeviceCreateManyArgs>(args?: SelectSubset<T, MonitoringDeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MonitoringDevices and returns the data saved in the database.
     * @param {MonitoringDeviceCreateManyAndReturnArgs} args - Arguments to create many MonitoringDevices.
     * @example
     * // Create many MonitoringDevices
     * const monitoringDevice = await prisma.monitoringDevice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MonitoringDevices and only return the `id`
     * const monitoringDeviceWithIdOnly = await prisma.monitoringDevice.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MonitoringDeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, MonitoringDeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonitoringDevicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MonitoringDevice.
     * @param {MonitoringDeviceDeleteArgs} args - Arguments to delete one MonitoringDevice.
     * @example
     * // Delete one MonitoringDevice
     * const MonitoringDevice = await prisma.monitoringDevice.delete({
     *   where: {
     *     // ... filter to delete one MonitoringDevice
     *   }
     * })
     * 
     */
    delete<T extends MonitoringDeviceDeleteArgs>(args: SelectSubset<T, MonitoringDeviceDeleteArgs<ExtArgs>>): Prisma__MonitoringDeviceClient<$Result.GetResult<Prisma.$MonitoringDevicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MonitoringDevice.
     * @param {MonitoringDeviceUpdateArgs} args - Arguments to update one MonitoringDevice.
     * @example
     * // Update one MonitoringDevice
     * const monitoringDevice = await prisma.monitoringDevice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MonitoringDeviceUpdateArgs>(args: SelectSubset<T, MonitoringDeviceUpdateArgs<ExtArgs>>): Prisma__MonitoringDeviceClient<$Result.GetResult<Prisma.$MonitoringDevicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MonitoringDevices.
     * @param {MonitoringDeviceDeleteManyArgs} args - Arguments to filter MonitoringDevices to delete.
     * @example
     * // Delete a few MonitoringDevices
     * const { count } = await prisma.monitoringDevice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MonitoringDeviceDeleteManyArgs>(args?: SelectSubset<T, MonitoringDeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MonitoringDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitoringDeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MonitoringDevices
     * const monitoringDevice = await prisma.monitoringDevice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MonitoringDeviceUpdateManyArgs>(args: SelectSubset<T, MonitoringDeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MonitoringDevice.
     * @param {MonitoringDeviceUpsertArgs} args - Arguments to update or create a MonitoringDevice.
     * @example
     * // Update or create a MonitoringDevice
     * const monitoringDevice = await prisma.monitoringDevice.upsert({
     *   create: {
     *     // ... data to create a MonitoringDevice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MonitoringDevice we want to update
     *   }
     * })
     */
    upsert<T extends MonitoringDeviceUpsertArgs>(args: SelectSubset<T, MonitoringDeviceUpsertArgs<ExtArgs>>): Prisma__MonitoringDeviceClient<$Result.GetResult<Prisma.$MonitoringDevicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MonitoringDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitoringDeviceCountArgs} args - Arguments to filter MonitoringDevices to count.
     * @example
     * // Count the number of MonitoringDevices
     * const count = await prisma.monitoringDevice.count({
     *   where: {
     *     // ... the filter for the MonitoringDevices we want to count
     *   }
     * })
    **/
    count<T extends MonitoringDeviceCountArgs>(
      args?: Subset<T, MonitoringDeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MonitoringDeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MonitoringDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitoringDeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MonitoringDeviceAggregateArgs>(args: Subset<T, MonitoringDeviceAggregateArgs>): Prisma.PrismaPromise<GetMonitoringDeviceAggregateType<T>>

    /**
     * Group by MonitoringDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonitoringDeviceGroupByArgs} args - Group by arguments.
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
      T extends MonitoringDeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MonitoringDeviceGroupByArgs['orderBy'] }
        : { orderBy?: MonitoringDeviceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MonitoringDeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMonitoringDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MonitoringDevice model
   */
  readonly fields: MonitoringDeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MonitoringDevice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MonitoringDeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    readings<T extends MonitoringDevice$readingsArgs<ExtArgs> = {}>(args?: Subset<T, MonitoringDevice$readingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VitalReadingPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the MonitoringDevice model
   */ 
  interface MonitoringDeviceFieldRefs {
    readonly id: FieldRef<"MonitoringDevice", 'String'>
    readonly patientId: FieldRef<"MonitoringDevice", 'String'>
    readonly deviceType: FieldRef<"MonitoringDevice", 'DeviceType'>
    readonly manufacturer: FieldRef<"MonitoringDevice", 'String'>
    readonly model: FieldRef<"MonitoringDevice", 'String'>
    readonly serialNumber: FieldRef<"MonitoringDevice", 'String'>
    readonly status: FieldRef<"MonitoringDevice", 'DeviceStatus'>
    readonly lastSyncAt: FieldRef<"MonitoringDevice", 'DateTime'>
    readonly batteryLevel: FieldRef<"MonitoringDevice", 'Int'>
    readonly createdAt: FieldRef<"MonitoringDevice", 'DateTime'>
    readonly updatedAt: FieldRef<"MonitoringDevice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MonitoringDevice findUnique
   */
  export type MonitoringDeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDevice
     */
    select?: MonitoringDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitoringDeviceInclude<ExtArgs> | null
    /**
     * Filter, which MonitoringDevice to fetch.
     */
    where: MonitoringDeviceWhereUniqueInput
  }

  /**
   * MonitoringDevice findUniqueOrThrow
   */
  export type MonitoringDeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDevice
     */
    select?: MonitoringDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitoringDeviceInclude<ExtArgs> | null
    /**
     * Filter, which MonitoringDevice to fetch.
     */
    where: MonitoringDeviceWhereUniqueInput
  }

  /**
   * MonitoringDevice findFirst
   */
  export type MonitoringDeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDevice
     */
    select?: MonitoringDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitoringDeviceInclude<ExtArgs> | null
    /**
     * Filter, which MonitoringDevice to fetch.
     */
    where?: MonitoringDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonitoringDevices to fetch.
     */
    orderBy?: MonitoringDeviceOrderByWithRelationInput | MonitoringDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MonitoringDevices.
     */
    cursor?: MonitoringDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonitoringDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonitoringDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MonitoringDevices.
     */
    distinct?: MonitoringDeviceScalarFieldEnum | MonitoringDeviceScalarFieldEnum[]
  }

  /**
   * MonitoringDevice findFirstOrThrow
   */
  export type MonitoringDeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDevice
     */
    select?: MonitoringDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitoringDeviceInclude<ExtArgs> | null
    /**
     * Filter, which MonitoringDevice to fetch.
     */
    where?: MonitoringDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonitoringDevices to fetch.
     */
    orderBy?: MonitoringDeviceOrderByWithRelationInput | MonitoringDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MonitoringDevices.
     */
    cursor?: MonitoringDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonitoringDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonitoringDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MonitoringDevices.
     */
    distinct?: MonitoringDeviceScalarFieldEnum | MonitoringDeviceScalarFieldEnum[]
  }

  /**
   * MonitoringDevice findMany
   */
  export type MonitoringDeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDevice
     */
    select?: MonitoringDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitoringDeviceInclude<ExtArgs> | null
    /**
     * Filter, which MonitoringDevices to fetch.
     */
    where?: MonitoringDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonitoringDevices to fetch.
     */
    orderBy?: MonitoringDeviceOrderByWithRelationInput | MonitoringDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MonitoringDevices.
     */
    cursor?: MonitoringDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonitoringDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonitoringDevices.
     */
    skip?: number
    distinct?: MonitoringDeviceScalarFieldEnum | MonitoringDeviceScalarFieldEnum[]
  }

  /**
   * MonitoringDevice create
   */
  export type MonitoringDeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDevice
     */
    select?: MonitoringDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitoringDeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a MonitoringDevice.
     */
    data: XOR<MonitoringDeviceCreateInput, MonitoringDeviceUncheckedCreateInput>
  }

  /**
   * MonitoringDevice createMany
   */
  export type MonitoringDeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MonitoringDevices.
     */
    data: MonitoringDeviceCreateManyInput | MonitoringDeviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MonitoringDevice createManyAndReturn
   */
  export type MonitoringDeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDevice
     */
    select?: MonitoringDeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MonitoringDevices.
     */
    data: MonitoringDeviceCreateManyInput | MonitoringDeviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MonitoringDevice update
   */
  export type MonitoringDeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDevice
     */
    select?: MonitoringDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitoringDeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a MonitoringDevice.
     */
    data: XOR<MonitoringDeviceUpdateInput, MonitoringDeviceUncheckedUpdateInput>
    /**
     * Choose, which MonitoringDevice to update.
     */
    where: MonitoringDeviceWhereUniqueInput
  }

  /**
   * MonitoringDevice updateMany
   */
  export type MonitoringDeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MonitoringDevices.
     */
    data: XOR<MonitoringDeviceUpdateManyMutationInput, MonitoringDeviceUncheckedUpdateManyInput>
    /**
     * Filter which MonitoringDevices to update
     */
    where?: MonitoringDeviceWhereInput
  }

  /**
   * MonitoringDevice upsert
   */
  export type MonitoringDeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDevice
     */
    select?: MonitoringDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitoringDeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the MonitoringDevice to update in case it exists.
     */
    where: MonitoringDeviceWhereUniqueInput
    /**
     * In case the MonitoringDevice found by the `where` argument doesn't exist, create a new MonitoringDevice with this data.
     */
    create: XOR<MonitoringDeviceCreateInput, MonitoringDeviceUncheckedCreateInput>
    /**
     * In case the MonitoringDevice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MonitoringDeviceUpdateInput, MonitoringDeviceUncheckedUpdateInput>
  }

  /**
   * MonitoringDevice delete
   */
  export type MonitoringDeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDevice
     */
    select?: MonitoringDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitoringDeviceInclude<ExtArgs> | null
    /**
     * Filter which MonitoringDevice to delete.
     */
    where: MonitoringDeviceWhereUniqueInput
  }

  /**
   * MonitoringDevice deleteMany
   */
  export type MonitoringDeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MonitoringDevices to delete
     */
    where?: MonitoringDeviceWhereInput
  }

  /**
   * MonitoringDevice.readings
   */
  export type MonitoringDevice$readingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingInclude<ExtArgs> | null
    where?: VitalReadingWhereInput
    orderBy?: VitalReadingOrderByWithRelationInput | VitalReadingOrderByWithRelationInput[]
    cursor?: VitalReadingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VitalReadingScalarFieldEnum | VitalReadingScalarFieldEnum[]
  }

  /**
   * MonitoringDevice without action
   */
  export type MonitoringDeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDevice
     */
    select?: MonitoringDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitoringDeviceInclude<ExtArgs> | null
  }


  /**
   * Model VitalReading
   */

  export type AggregateVitalReading = {
    _count: VitalReadingCountAggregateOutputType | null
    _avg: VitalReadingAvgAggregateOutputType | null
    _sum: VitalReadingSumAggregateOutputType | null
    _min: VitalReadingMinAggregateOutputType | null
    _max: VitalReadingMaxAggregateOutputType | null
  }

  export type VitalReadingAvgAggregateOutputType = {
    value: number | null
  }

  export type VitalReadingSumAggregateOutputType = {
    value: number | null
  }

  export type VitalReadingMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    carePlanId: string | null
    deviceId: string | null
    vitalType: $Enums.VitalType | null
    value: number | null
    unit: string | null
    isAbnormal: boolean | null
    notes: string | null
    recordedAt: Date | null
    createdAt: Date | null
  }

  export type VitalReadingMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    carePlanId: string | null
    deviceId: string | null
    vitalType: $Enums.VitalType | null
    value: number | null
    unit: string | null
    isAbnormal: boolean | null
    notes: string | null
    recordedAt: Date | null
    createdAt: Date | null
  }

  export type VitalReadingCountAggregateOutputType = {
    id: number
    patientId: number
    carePlanId: number
    deviceId: number
    vitalType: number
    value: number
    unit: number
    isAbnormal: number
    notes: number
    recordedAt: number
    createdAt: number
    _all: number
  }


  export type VitalReadingAvgAggregateInputType = {
    value?: true
  }

  export type VitalReadingSumAggregateInputType = {
    value?: true
  }

  export type VitalReadingMinAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    deviceId?: true
    vitalType?: true
    value?: true
    unit?: true
    isAbnormal?: true
    notes?: true
    recordedAt?: true
    createdAt?: true
  }

  export type VitalReadingMaxAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    deviceId?: true
    vitalType?: true
    value?: true
    unit?: true
    isAbnormal?: true
    notes?: true
    recordedAt?: true
    createdAt?: true
  }

  export type VitalReadingCountAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    deviceId?: true
    vitalType?: true
    value?: true
    unit?: true
    isAbnormal?: true
    notes?: true
    recordedAt?: true
    createdAt?: true
    _all?: true
  }

  export type VitalReadingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VitalReading to aggregate.
     */
    where?: VitalReadingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VitalReadings to fetch.
     */
    orderBy?: VitalReadingOrderByWithRelationInput | VitalReadingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VitalReadingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VitalReadings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VitalReadings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VitalReadings
    **/
    _count?: true | VitalReadingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VitalReadingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VitalReadingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VitalReadingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VitalReadingMaxAggregateInputType
  }

  export type GetVitalReadingAggregateType<T extends VitalReadingAggregateArgs> = {
        [P in keyof T & keyof AggregateVitalReading]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVitalReading[P]>
      : GetScalarType<T[P], AggregateVitalReading[P]>
  }




  export type VitalReadingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VitalReadingWhereInput
    orderBy?: VitalReadingOrderByWithAggregationInput | VitalReadingOrderByWithAggregationInput[]
    by: VitalReadingScalarFieldEnum[] | VitalReadingScalarFieldEnum
    having?: VitalReadingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VitalReadingCountAggregateInputType | true
    _avg?: VitalReadingAvgAggregateInputType
    _sum?: VitalReadingSumAggregateInputType
    _min?: VitalReadingMinAggregateInputType
    _max?: VitalReadingMaxAggregateInputType
  }

  export type VitalReadingGroupByOutputType = {
    id: string
    patientId: string
    carePlanId: string | null
    deviceId: string | null
    vitalType: $Enums.VitalType
    value: number
    unit: string
    isAbnormal: boolean
    notes: string | null
    recordedAt: Date
    createdAt: Date
    _count: VitalReadingCountAggregateOutputType | null
    _avg: VitalReadingAvgAggregateOutputType | null
    _sum: VitalReadingSumAggregateOutputType | null
    _min: VitalReadingMinAggregateOutputType | null
    _max: VitalReadingMaxAggregateOutputType | null
  }

  type GetVitalReadingGroupByPayload<T extends VitalReadingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VitalReadingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VitalReadingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VitalReadingGroupByOutputType[P]>
            : GetScalarType<T[P], VitalReadingGroupByOutputType[P]>
        }
      >
    >


  export type VitalReadingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    deviceId?: boolean
    vitalType?: boolean
    value?: boolean
    unit?: boolean
    isAbnormal?: boolean
    notes?: boolean
    recordedAt?: boolean
    createdAt?: boolean
    carePlan?: boolean | VitalReading$carePlanArgs<ExtArgs>
    device?: boolean | VitalReading$deviceArgs<ExtArgs>
  }, ExtArgs["result"]["vitalReading"]>

  export type VitalReadingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    deviceId?: boolean
    vitalType?: boolean
    value?: boolean
    unit?: boolean
    isAbnormal?: boolean
    notes?: boolean
    recordedAt?: boolean
    createdAt?: boolean
    carePlan?: boolean | VitalReading$carePlanArgs<ExtArgs>
    device?: boolean | VitalReading$deviceArgs<ExtArgs>
  }, ExtArgs["result"]["vitalReading"]>

  export type VitalReadingSelectScalar = {
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    deviceId?: boolean
    vitalType?: boolean
    value?: boolean
    unit?: boolean
    isAbnormal?: boolean
    notes?: boolean
    recordedAt?: boolean
    createdAt?: boolean
  }

  export type VitalReadingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    carePlan?: boolean | VitalReading$carePlanArgs<ExtArgs>
    device?: boolean | VitalReading$deviceArgs<ExtArgs>
  }
  export type VitalReadingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    carePlan?: boolean | VitalReading$carePlanArgs<ExtArgs>
    device?: boolean | VitalReading$deviceArgs<ExtArgs>
  }

  export type $VitalReadingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VitalReading"
    objects: {
      carePlan: Prisma.$CarePlanPayload<ExtArgs> | null
      device: Prisma.$MonitoringDevicePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      carePlanId: string | null
      deviceId: string | null
      vitalType: $Enums.VitalType
      value: number
      unit: string
      isAbnormal: boolean
      notes: string | null
      recordedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["vitalReading"]>
    composites: {}
  }

  type VitalReadingGetPayload<S extends boolean | null | undefined | VitalReadingDefaultArgs> = $Result.GetResult<Prisma.$VitalReadingPayload, S>

  type VitalReadingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VitalReadingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VitalReadingCountAggregateInputType | true
    }

  export interface VitalReadingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VitalReading'], meta: { name: 'VitalReading' } }
    /**
     * Find zero or one VitalReading that matches the filter.
     * @param {VitalReadingFindUniqueArgs} args - Arguments to find a VitalReading
     * @example
     * // Get one VitalReading
     * const vitalReading = await prisma.vitalReading.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VitalReadingFindUniqueArgs>(args: SelectSubset<T, VitalReadingFindUniqueArgs<ExtArgs>>): Prisma__VitalReadingClient<$Result.GetResult<Prisma.$VitalReadingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one VitalReading that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VitalReadingFindUniqueOrThrowArgs} args - Arguments to find a VitalReading
     * @example
     * // Get one VitalReading
     * const vitalReading = await prisma.vitalReading.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VitalReadingFindUniqueOrThrowArgs>(args: SelectSubset<T, VitalReadingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VitalReadingClient<$Result.GetResult<Prisma.$VitalReadingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first VitalReading that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalReadingFindFirstArgs} args - Arguments to find a VitalReading
     * @example
     * // Get one VitalReading
     * const vitalReading = await prisma.vitalReading.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VitalReadingFindFirstArgs>(args?: SelectSubset<T, VitalReadingFindFirstArgs<ExtArgs>>): Prisma__VitalReadingClient<$Result.GetResult<Prisma.$VitalReadingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first VitalReading that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalReadingFindFirstOrThrowArgs} args - Arguments to find a VitalReading
     * @example
     * // Get one VitalReading
     * const vitalReading = await prisma.vitalReading.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VitalReadingFindFirstOrThrowArgs>(args?: SelectSubset<T, VitalReadingFindFirstOrThrowArgs<ExtArgs>>): Prisma__VitalReadingClient<$Result.GetResult<Prisma.$VitalReadingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more VitalReadings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalReadingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VitalReadings
     * const vitalReadings = await prisma.vitalReading.findMany()
     * 
     * // Get first 10 VitalReadings
     * const vitalReadings = await prisma.vitalReading.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vitalReadingWithIdOnly = await prisma.vitalReading.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VitalReadingFindManyArgs>(args?: SelectSubset<T, VitalReadingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VitalReadingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a VitalReading.
     * @param {VitalReadingCreateArgs} args - Arguments to create a VitalReading.
     * @example
     * // Create one VitalReading
     * const VitalReading = await prisma.vitalReading.create({
     *   data: {
     *     // ... data to create a VitalReading
     *   }
     * })
     * 
     */
    create<T extends VitalReadingCreateArgs>(args: SelectSubset<T, VitalReadingCreateArgs<ExtArgs>>): Prisma__VitalReadingClient<$Result.GetResult<Prisma.$VitalReadingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many VitalReadings.
     * @param {VitalReadingCreateManyArgs} args - Arguments to create many VitalReadings.
     * @example
     * // Create many VitalReadings
     * const vitalReading = await prisma.vitalReading.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VitalReadingCreateManyArgs>(args?: SelectSubset<T, VitalReadingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VitalReadings and returns the data saved in the database.
     * @param {VitalReadingCreateManyAndReturnArgs} args - Arguments to create many VitalReadings.
     * @example
     * // Create many VitalReadings
     * const vitalReading = await prisma.vitalReading.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VitalReadings and only return the `id`
     * const vitalReadingWithIdOnly = await prisma.vitalReading.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VitalReadingCreateManyAndReturnArgs>(args?: SelectSubset<T, VitalReadingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VitalReadingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a VitalReading.
     * @param {VitalReadingDeleteArgs} args - Arguments to delete one VitalReading.
     * @example
     * // Delete one VitalReading
     * const VitalReading = await prisma.vitalReading.delete({
     *   where: {
     *     // ... filter to delete one VitalReading
     *   }
     * })
     * 
     */
    delete<T extends VitalReadingDeleteArgs>(args: SelectSubset<T, VitalReadingDeleteArgs<ExtArgs>>): Prisma__VitalReadingClient<$Result.GetResult<Prisma.$VitalReadingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one VitalReading.
     * @param {VitalReadingUpdateArgs} args - Arguments to update one VitalReading.
     * @example
     * // Update one VitalReading
     * const vitalReading = await prisma.vitalReading.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VitalReadingUpdateArgs>(args: SelectSubset<T, VitalReadingUpdateArgs<ExtArgs>>): Prisma__VitalReadingClient<$Result.GetResult<Prisma.$VitalReadingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more VitalReadings.
     * @param {VitalReadingDeleteManyArgs} args - Arguments to filter VitalReadings to delete.
     * @example
     * // Delete a few VitalReadings
     * const { count } = await prisma.vitalReading.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VitalReadingDeleteManyArgs>(args?: SelectSubset<T, VitalReadingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VitalReadings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalReadingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VitalReadings
     * const vitalReading = await prisma.vitalReading.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VitalReadingUpdateManyArgs>(args: SelectSubset<T, VitalReadingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one VitalReading.
     * @param {VitalReadingUpsertArgs} args - Arguments to update or create a VitalReading.
     * @example
     * // Update or create a VitalReading
     * const vitalReading = await prisma.vitalReading.upsert({
     *   create: {
     *     // ... data to create a VitalReading
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VitalReading we want to update
     *   }
     * })
     */
    upsert<T extends VitalReadingUpsertArgs>(args: SelectSubset<T, VitalReadingUpsertArgs<ExtArgs>>): Prisma__VitalReadingClient<$Result.GetResult<Prisma.$VitalReadingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of VitalReadings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalReadingCountArgs} args - Arguments to filter VitalReadings to count.
     * @example
     * // Count the number of VitalReadings
     * const count = await prisma.vitalReading.count({
     *   where: {
     *     // ... the filter for the VitalReadings we want to count
     *   }
     * })
    **/
    count<T extends VitalReadingCountArgs>(
      args?: Subset<T, VitalReadingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VitalReadingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VitalReading.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalReadingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VitalReadingAggregateArgs>(args: Subset<T, VitalReadingAggregateArgs>): Prisma.PrismaPromise<GetVitalReadingAggregateType<T>>

    /**
     * Group by VitalReading.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalReadingGroupByArgs} args - Group by arguments.
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
      T extends VitalReadingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VitalReadingGroupByArgs['orderBy'] }
        : { orderBy?: VitalReadingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VitalReadingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVitalReadingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VitalReading model
   */
  readonly fields: VitalReadingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VitalReading.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VitalReadingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    carePlan<T extends VitalReading$carePlanArgs<ExtArgs> = {}>(args?: Subset<T, VitalReading$carePlanArgs<ExtArgs>>): Prisma__CarePlanClient<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    device<T extends VitalReading$deviceArgs<ExtArgs> = {}>(args?: Subset<T, VitalReading$deviceArgs<ExtArgs>>): Prisma__MonitoringDeviceClient<$Result.GetResult<Prisma.$MonitoringDevicePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the VitalReading model
   */ 
  interface VitalReadingFieldRefs {
    readonly id: FieldRef<"VitalReading", 'String'>
    readonly patientId: FieldRef<"VitalReading", 'String'>
    readonly carePlanId: FieldRef<"VitalReading", 'String'>
    readonly deviceId: FieldRef<"VitalReading", 'String'>
    readonly vitalType: FieldRef<"VitalReading", 'VitalType'>
    readonly value: FieldRef<"VitalReading", 'Float'>
    readonly unit: FieldRef<"VitalReading", 'String'>
    readonly isAbnormal: FieldRef<"VitalReading", 'Boolean'>
    readonly notes: FieldRef<"VitalReading", 'String'>
    readonly recordedAt: FieldRef<"VitalReading", 'DateTime'>
    readonly createdAt: FieldRef<"VitalReading", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VitalReading findUnique
   */
  export type VitalReadingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingInclude<ExtArgs> | null
    /**
     * Filter, which VitalReading to fetch.
     */
    where: VitalReadingWhereUniqueInput
  }

  /**
   * VitalReading findUniqueOrThrow
   */
  export type VitalReadingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingInclude<ExtArgs> | null
    /**
     * Filter, which VitalReading to fetch.
     */
    where: VitalReadingWhereUniqueInput
  }

  /**
   * VitalReading findFirst
   */
  export type VitalReadingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingInclude<ExtArgs> | null
    /**
     * Filter, which VitalReading to fetch.
     */
    where?: VitalReadingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VitalReadings to fetch.
     */
    orderBy?: VitalReadingOrderByWithRelationInput | VitalReadingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VitalReadings.
     */
    cursor?: VitalReadingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VitalReadings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VitalReadings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VitalReadings.
     */
    distinct?: VitalReadingScalarFieldEnum | VitalReadingScalarFieldEnum[]
  }

  /**
   * VitalReading findFirstOrThrow
   */
  export type VitalReadingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingInclude<ExtArgs> | null
    /**
     * Filter, which VitalReading to fetch.
     */
    where?: VitalReadingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VitalReadings to fetch.
     */
    orderBy?: VitalReadingOrderByWithRelationInput | VitalReadingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VitalReadings.
     */
    cursor?: VitalReadingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VitalReadings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VitalReadings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VitalReadings.
     */
    distinct?: VitalReadingScalarFieldEnum | VitalReadingScalarFieldEnum[]
  }

  /**
   * VitalReading findMany
   */
  export type VitalReadingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingInclude<ExtArgs> | null
    /**
     * Filter, which VitalReadings to fetch.
     */
    where?: VitalReadingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VitalReadings to fetch.
     */
    orderBy?: VitalReadingOrderByWithRelationInput | VitalReadingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VitalReadings.
     */
    cursor?: VitalReadingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VitalReadings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VitalReadings.
     */
    skip?: number
    distinct?: VitalReadingScalarFieldEnum | VitalReadingScalarFieldEnum[]
  }

  /**
   * VitalReading create
   */
  export type VitalReadingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingInclude<ExtArgs> | null
    /**
     * The data needed to create a VitalReading.
     */
    data: XOR<VitalReadingCreateInput, VitalReadingUncheckedCreateInput>
  }

  /**
   * VitalReading createMany
   */
  export type VitalReadingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VitalReadings.
     */
    data: VitalReadingCreateManyInput | VitalReadingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VitalReading createManyAndReturn
   */
  export type VitalReadingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many VitalReadings.
     */
    data: VitalReadingCreateManyInput | VitalReadingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VitalReading update
   */
  export type VitalReadingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingInclude<ExtArgs> | null
    /**
     * The data needed to update a VitalReading.
     */
    data: XOR<VitalReadingUpdateInput, VitalReadingUncheckedUpdateInput>
    /**
     * Choose, which VitalReading to update.
     */
    where: VitalReadingWhereUniqueInput
  }

  /**
   * VitalReading updateMany
   */
  export type VitalReadingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VitalReadings.
     */
    data: XOR<VitalReadingUpdateManyMutationInput, VitalReadingUncheckedUpdateManyInput>
    /**
     * Filter which VitalReadings to update
     */
    where?: VitalReadingWhereInput
  }

  /**
   * VitalReading upsert
   */
  export type VitalReadingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingInclude<ExtArgs> | null
    /**
     * The filter to search for the VitalReading to update in case it exists.
     */
    where: VitalReadingWhereUniqueInput
    /**
     * In case the VitalReading found by the `where` argument doesn't exist, create a new VitalReading with this data.
     */
    create: XOR<VitalReadingCreateInput, VitalReadingUncheckedCreateInput>
    /**
     * In case the VitalReading was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VitalReadingUpdateInput, VitalReadingUncheckedUpdateInput>
  }

  /**
   * VitalReading delete
   */
  export type VitalReadingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingInclude<ExtArgs> | null
    /**
     * Filter which VitalReading to delete.
     */
    where: VitalReadingWhereUniqueInput
  }

  /**
   * VitalReading deleteMany
   */
  export type VitalReadingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VitalReadings to delete
     */
    where?: VitalReadingWhereInput
  }

  /**
   * VitalReading.carePlan
   */
  export type VitalReading$carePlanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CarePlanInclude<ExtArgs> | null
    where?: CarePlanWhereInput
  }

  /**
   * VitalReading.device
   */
  export type VitalReading$deviceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonitoringDevice
     */
    select?: MonitoringDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonitoringDeviceInclude<ExtArgs> | null
    where?: MonitoringDeviceWhereInput
  }

  /**
   * VitalReading without action
   */
  export type VitalReadingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VitalReading
     */
    select?: VitalReadingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VitalReadingInclude<ExtArgs> | null
  }


  /**
   * Model Alert
   */

  export type AggregateAlert = {
    _count: AlertCountAggregateOutputType | null
    _min: AlertMinAggregateOutputType | null
    _max: AlertMaxAggregateOutputType | null
  }

  export type AlertMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    carePlanId: string | null
    alertType: $Enums.AlertType | null
    severity: $Enums.AlertSeverity | null
    title: string | null
    description: string | null
    status: $Enums.AlertStatus | null
    acknowledgedBy: string | null
    acknowledgedAt: Date | null
    resolvedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AlertMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    carePlanId: string | null
    alertType: $Enums.AlertType | null
    severity: $Enums.AlertSeverity | null
    title: string | null
    description: string | null
    status: $Enums.AlertStatus | null
    acknowledgedBy: string | null
    acknowledgedAt: Date | null
    resolvedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AlertCountAggregateOutputType = {
    id: number
    patientId: number
    carePlanId: number
    alertType: number
    severity: number
    title: number
    description: number
    status: number
    acknowledgedBy: number
    acknowledgedAt: number
    resolvedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AlertMinAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    alertType?: true
    severity?: true
    title?: true
    description?: true
    status?: true
    acknowledgedBy?: true
    acknowledgedAt?: true
    resolvedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AlertMaxAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    alertType?: true
    severity?: true
    title?: true
    description?: true
    status?: true
    acknowledgedBy?: true
    acknowledgedAt?: true
    resolvedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AlertCountAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    alertType?: true
    severity?: true
    title?: true
    description?: true
    status?: true
    acknowledgedBy?: true
    acknowledgedAt?: true
    resolvedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AlertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alert to aggregate.
     */
    where?: AlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alerts to fetch.
     */
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Alerts
    **/
    _count?: true | AlertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlertMaxAggregateInputType
  }

  export type GetAlertAggregateType<T extends AlertAggregateArgs> = {
        [P in keyof T & keyof AggregateAlert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlert[P]>
      : GetScalarType<T[P], AggregateAlert[P]>
  }




  export type AlertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlertWhereInput
    orderBy?: AlertOrderByWithAggregationInput | AlertOrderByWithAggregationInput[]
    by: AlertScalarFieldEnum[] | AlertScalarFieldEnum
    having?: AlertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlertCountAggregateInputType | true
    _min?: AlertMinAggregateInputType
    _max?: AlertMaxAggregateInputType
  }

  export type AlertGroupByOutputType = {
    id: string
    patientId: string
    carePlanId: string | null
    alertType: $Enums.AlertType
    severity: $Enums.AlertSeverity
    title: string
    description: string
    status: $Enums.AlertStatus
    acknowledgedBy: string | null
    acknowledgedAt: Date | null
    resolvedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: AlertCountAggregateOutputType | null
    _min: AlertMinAggregateOutputType | null
    _max: AlertMaxAggregateOutputType | null
  }

  type GetAlertGroupByPayload<T extends AlertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlertGroupByOutputType[P]>
            : GetScalarType<T[P], AlertGroupByOutputType[P]>
        }
      >
    >


  export type AlertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    alertType?: boolean
    severity?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    acknowledgedBy?: boolean
    acknowledgedAt?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    carePlan?: boolean | Alert$carePlanArgs<ExtArgs>
  }, ExtArgs["result"]["alert"]>

  export type AlertSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    alertType?: boolean
    severity?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    acknowledgedBy?: boolean
    acknowledgedAt?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    carePlan?: boolean | Alert$carePlanArgs<ExtArgs>
  }, ExtArgs["result"]["alert"]>

  export type AlertSelectScalar = {
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    alertType?: boolean
    severity?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    acknowledgedBy?: boolean
    acknowledgedAt?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AlertInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    carePlan?: boolean | Alert$carePlanArgs<ExtArgs>
  }
  export type AlertIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    carePlan?: boolean | Alert$carePlanArgs<ExtArgs>
  }

  export type $AlertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Alert"
    objects: {
      carePlan: Prisma.$CarePlanPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      carePlanId: string | null
      alertType: $Enums.AlertType
      severity: $Enums.AlertSeverity
      title: string
      description: string
      status: $Enums.AlertStatus
      acknowledgedBy: string | null
      acknowledgedAt: Date | null
      resolvedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["alert"]>
    composites: {}
  }

  type AlertGetPayload<S extends boolean | null | undefined | AlertDefaultArgs> = $Result.GetResult<Prisma.$AlertPayload, S>

  type AlertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AlertFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AlertCountAggregateInputType | true
    }

  export interface AlertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Alert'], meta: { name: 'Alert' } }
    /**
     * Find zero or one Alert that matches the filter.
     * @param {AlertFindUniqueArgs} args - Arguments to find a Alert
     * @example
     * // Get one Alert
     * const alert = await prisma.alert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlertFindUniqueArgs>(args: SelectSubset<T, AlertFindUniqueArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Alert that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AlertFindUniqueOrThrowArgs} args - Arguments to find a Alert
     * @example
     * // Get one Alert
     * const alert = await prisma.alert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlertFindUniqueOrThrowArgs>(args: SelectSubset<T, AlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Alert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertFindFirstArgs} args - Arguments to find a Alert
     * @example
     * // Get one Alert
     * const alert = await prisma.alert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlertFindFirstArgs>(args?: SelectSubset<T, AlertFindFirstArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Alert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertFindFirstOrThrowArgs} args - Arguments to find a Alert
     * @example
     * // Get one Alert
     * const alert = await prisma.alert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlertFindFirstOrThrowArgs>(args?: SelectSubset<T, AlertFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Alerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Alerts
     * const alerts = await prisma.alert.findMany()
     * 
     * // Get first 10 Alerts
     * const alerts = await prisma.alert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const alertWithIdOnly = await prisma.alert.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlertFindManyArgs>(args?: SelectSubset<T, AlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Alert.
     * @param {AlertCreateArgs} args - Arguments to create a Alert.
     * @example
     * // Create one Alert
     * const Alert = await prisma.alert.create({
     *   data: {
     *     // ... data to create a Alert
     *   }
     * })
     * 
     */
    create<T extends AlertCreateArgs>(args: SelectSubset<T, AlertCreateArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Alerts.
     * @param {AlertCreateManyArgs} args - Arguments to create many Alerts.
     * @example
     * // Create many Alerts
     * const alert = await prisma.alert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlertCreateManyArgs>(args?: SelectSubset<T, AlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Alerts and returns the data saved in the database.
     * @param {AlertCreateManyAndReturnArgs} args - Arguments to create many Alerts.
     * @example
     * // Create many Alerts
     * const alert = await prisma.alert.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Alerts and only return the `id`
     * const alertWithIdOnly = await prisma.alert.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlertCreateManyAndReturnArgs>(args?: SelectSubset<T, AlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Alert.
     * @param {AlertDeleteArgs} args - Arguments to delete one Alert.
     * @example
     * // Delete one Alert
     * const Alert = await prisma.alert.delete({
     *   where: {
     *     // ... filter to delete one Alert
     *   }
     * })
     * 
     */
    delete<T extends AlertDeleteArgs>(args: SelectSubset<T, AlertDeleteArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Alert.
     * @param {AlertUpdateArgs} args - Arguments to update one Alert.
     * @example
     * // Update one Alert
     * const alert = await prisma.alert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlertUpdateArgs>(args: SelectSubset<T, AlertUpdateArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Alerts.
     * @param {AlertDeleteManyArgs} args - Arguments to filter Alerts to delete.
     * @example
     * // Delete a few Alerts
     * const { count } = await prisma.alert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlertDeleteManyArgs>(args?: SelectSubset<T, AlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Alerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Alerts
     * const alert = await prisma.alert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlertUpdateManyArgs>(args: SelectSubset<T, AlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Alert.
     * @param {AlertUpsertArgs} args - Arguments to update or create a Alert.
     * @example
     * // Update or create a Alert
     * const alert = await prisma.alert.upsert({
     *   create: {
     *     // ... data to create a Alert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Alert we want to update
     *   }
     * })
     */
    upsert<T extends AlertUpsertArgs>(args: SelectSubset<T, AlertUpsertArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Alerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertCountArgs} args - Arguments to filter Alerts to count.
     * @example
     * // Count the number of Alerts
     * const count = await prisma.alert.count({
     *   where: {
     *     // ... the filter for the Alerts we want to count
     *   }
     * })
    **/
    count<T extends AlertCountArgs>(
      args?: Subset<T, AlertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Alert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AlertAggregateArgs>(args: Subset<T, AlertAggregateArgs>): Prisma.PrismaPromise<GetAlertAggregateType<T>>

    /**
     * Group by Alert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertGroupByArgs} args - Group by arguments.
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
      T extends AlertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlertGroupByArgs['orderBy'] }
        : { orderBy?: AlertGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Alert model
   */
  readonly fields: AlertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Alert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    carePlan<T extends Alert$carePlanArgs<ExtArgs> = {}>(args?: Subset<T, Alert$carePlanArgs<ExtArgs>>): Prisma__CarePlanClient<$Result.GetResult<Prisma.$CarePlanPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the Alert model
   */ 
  interface AlertFieldRefs {
    readonly id: FieldRef<"Alert", 'String'>
    readonly patientId: FieldRef<"Alert", 'String'>
    readonly carePlanId: FieldRef<"Alert", 'String'>
    readonly alertType: FieldRef<"Alert", 'AlertType'>
    readonly severity: FieldRef<"Alert", 'AlertSeverity'>
    readonly title: FieldRef<"Alert", 'String'>
    readonly description: FieldRef<"Alert", 'String'>
    readonly status: FieldRef<"Alert", 'AlertStatus'>
    readonly acknowledgedBy: FieldRef<"Alert", 'String'>
    readonly acknowledgedAt: FieldRef<"Alert", 'DateTime'>
    readonly resolvedAt: FieldRef<"Alert", 'DateTime'>
    readonly createdAt: FieldRef<"Alert", 'DateTime'>
    readonly updatedAt: FieldRef<"Alert", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Alert findUnique
   */
  export type AlertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alert to fetch.
     */
    where: AlertWhereUniqueInput
  }

  /**
   * Alert findUniqueOrThrow
   */
  export type AlertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alert to fetch.
     */
    where: AlertWhereUniqueInput
  }

  /**
   * Alert findFirst
   */
  export type AlertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alert to fetch.
     */
    where?: AlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alerts to fetch.
     */
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alerts.
     */
    cursor?: AlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alerts.
     */
    distinct?: AlertScalarFieldEnum | AlertScalarFieldEnum[]
  }

  /**
   * Alert findFirstOrThrow
   */
  export type AlertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alert to fetch.
     */
    where?: AlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alerts to fetch.
     */
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alerts.
     */
    cursor?: AlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alerts.
     */
    distinct?: AlertScalarFieldEnum | AlertScalarFieldEnum[]
  }

  /**
   * Alert findMany
   */
  export type AlertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alerts to fetch.
     */
    where?: AlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alerts to fetch.
     */
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Alerts.
     */
    cursor?: AlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alerts.
     */
    skip?: number
    distinct?: AlertScalarFieldEnum | AlertScalarFieldEnum[]
  }

  /**
   * Alert create
   */
  export type AlertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * The data needed to create a Alert.
     */
    data: XOR<AlertCreateInput, AlertUncheckedCreateInput>
  }

  /**
   * Alert createMany
   */
  export type AlertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Alerts.
     */
    data: AlertCreateManyInput | AlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Alert createManyAndReturn
   */
  export type AlertCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Alerts.
     */
    data: AlertCreateManyInput | AlertCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Alert update
   */
  export type AlertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * The data needed to update a Alert.
     */
    data: XOR<AlertUpdateInput, AlertUncheckedUpdateInput>
    /**
     * Choose, which Alert to update.
     */
    where: AlertWhereUniqueInput
  }

  /**
   * Alert updateMany
   */
  export type AlertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Alerts.
     */
    data: XOR<AlertUpdateManyMutationInput, AlertUncheckedUpdateManyInput>
    /**
     * Filter which Alerts to update
     */
    where?: AlertWhereInput
  }

  /**
   * Alert upsert
   */
  export type AlertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * The filter to search for the Alert to update in case it exists.
     */
    where: AlertWhereUniqueInput
    /**
     * In case the Alert found by the `where` argument doesn't exist, create a new Alert with this data.
     */
    create: XOR<AlertCreateInput, AlertUncheckedCreateInput>
    /**
     * In case the Alert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlertUpdateInput, AlertUncheckedUpdateInput>
  }

  /**
   * Alert delete
   */
  export type AlertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter which Alert to delete.
     */
    where: AlertWhereUniqueInput
  }

  /**
   * Alert deleteMany
   */
  export type AlertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alerts to delete
     */
    where?: AlertWhereInput
  }

  /**
   * Alert.carePlan
   */
  export type Alert$carePlanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlan
     */
    select?: CarePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CarePlanInclude<ExtArgs> | null
    where?: CarePlanWhereInput
  }

  /**
   * Alert without action
   */
  export type AlertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
  }


  /**
   * Model Goal
   */

  export type AggregateGoal = {
    _count: GoalCountAggregateOutputType | null
    _avg: GoalAvgAggregateOutputType | null
    _sum: GoalSumAggregateOutputType | null
    _min: GoalMinAggregateOutputType | null
    _max: GoalMaxAggregateOutputType | null
  }

  export type GoalAvgAggregateOutputType = {
    targetValue: number | null
  }

  export type GoalSumAggregateOutputType = {
    targetValue: number | null
  }

  export type GoalMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    carePlanId: string | null
    title: string | null
    description: string | null
    goalType: $Enums.GoalType | null
    targetValue: number | null
    targetUnit: string | null
    targetDate: Date | null
    frequency: string | null
    status: $Enums.GoalStatus | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GoalMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    carePlanId: string | null
    title: string | null
    description: string | null
    goalType: $Enums.GoalType | null
    targetValue: number | null
    targetUnit: string | null
    targetDate: Date | null
    frequency: string | null
    status: $Enums.GoalStatus | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GoalCountAggregateOutputType = {
    id: number
    patientId: number
    carePlanId: number
    title: number
    description: number
    goalType: number
    targetValue: number
    targetUnit: number
    targetDate: number
    frequency: number
    status: number
    completedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GoalAvgAggregateInputType = {
    targetValue?: true
  }

  export type GoalSumAggregateInputType = {
    targetValue?: true
  }

  export type GoalMinAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    title?: true
    description?: true
    goalType?: true
    targetValue?: true
    targetUnit?: true
    targetDate?: true
    frequency?: true
    status?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GoalMaxAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    title?: true
    description?: true
    goalType?: true
    targetValue?: true
    targetUnit?: true
    targetDate?: true
    frequency?: true
    status?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GoalCountAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    title?: true
    description?: true
    goalType?: true
    targetValue?: true
    targetUnit?: true
    targetDate?: true
    frequency?: true
    status?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GoalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Goal to aggregate.
     */
    where?: GoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Goals to fetch.
     */
    orderBy?: GoalOrderByWithRelationInput | GoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Goals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Goals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Goals
    **/
    _count?: true | GoalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GoalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GoalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GoalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GoalMaxAggregateInputType
  }

  export type GetGoalAggregateType<T extends GoalAggregateArgs> = {
        [P in keyof T & keyof AggregateGoal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGoal[P]>
      : GetScalarType<T[P], AggregateGoal[P]>
  }




  export type GoalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GoalWhereInput
    orderBy?: GoalOrderByWithAggregationInput | GoalOrderByWithAggregationInput[]
    by: GoalScalarFieldEnum[] | GoalScalarFieldEnum
    having?: GoalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GoalCountAggregateInputType | true
    _avg?: GoalAvgAggregateInputType
    _sum?: GoalSumAggregateInputType
    _min?: GoalMinAggregateInputType
    _max?: GoalMaxAggregateInputType
  }

  export type GoalGroupByOutputType = {
    id: string
    patientId: string
    carePlanId: string | null
    title: string
    description: string | null
    goalType: $Enums.GoalType
    targetValue: number | null
    targetUnit: string | null
    targetDate: Date | null
    frequency: string | null
    status: $Enums.GoalStatus
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: GoalCountAggregateOutputType | null
    _avg: GoalAvgAggregateOutputType | null
    _sum: GoalSumAggregateOutputType | null
    _min: GoalMinAggregateOutputType | null
    _max: GoalMaxAggregateOutputType | null
  }

  type GetGoalGroupByPayload<T extends GoalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GoalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GoalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GoalGroupByOutputType[P]>
            : GetScalarType<T[P], GoalGroupByOutputType[P]>
        }
      >
    >


  export type GoalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    title?: boolean
    description?: boolean
    goalType?: boolean
    targetValue?: boolean
    targetUnit?: boolean
    targetDate?: boolean
    frequency?: boolean
    status?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    progress?: boolean | Goal$progressArgs<ExtArgs>
    _count?: boolean | GoalCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["goal"]>

  export type GoalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    title?: boolean
    description?: boolean
    goalType?: boolean
    targetValue?: boolean
    targetUnit?: boolean
    targetDate?: boolean
    frequency?: boolean
    status?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["goal"]>

  export type GoalSelectScalar = {
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    title?: boolean
    description?: boolean
    goalType?: boolean
    targetValue?: boolean
    targetUnit?: boolean
    targetDate?: boolean
    frequency?: boolean
    status?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GoalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    progress?: boolean | Goal$progressArgs<ExtArgs>
    _count?: boolean | GoalCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GoalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GoalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Goal"
    objects: {
      progress: Prisma.$GoalProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      carePlanId: string | null
      title: string
      description: string | null
      goalType: $Enums.GoalType
      targetValue: number | null
      targetUnit: string | null
      targetDate: Date | null
      frequency: string | null
      status: $Enums.GoalStatus
      completedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["goal"]>
    composites: {}
  }

  type GoalGetPayload<S extends boolean | null | undefined | GoalDefaultArgs> = $Result.GetResult<Prisma.$GoalPayload, S>

  type GoalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GoalFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GoalCountAggregateInputType | true
    }

  export interface GoalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Goal'], meta: { name: 'Goal' } }
    /**
     * Find zero or one Goal that matches the filter.
     * @param {GoalFindUniqueArgs} args - Arguments to find a Goal
     * @example
     * // Get one Goal
     * const goal = await prisma.goal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GoalFindUniqueArgs>(args: SelectSubset<T, GoalFindUniqueArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Goal that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GoalFindUniqueOrThrowArgs} args - Arguments to find a Goal
     * @example
     * // Get one Goal
     * const goal = await prisma.goal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GoalFindUniqueOrThrowArgs>(args: SelectSubset<T, GoalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Goal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalFindFirstArgs} args - Arguments to find a Goal
     * @example
     * // Get one Goal
     * const goal = await prisma.goal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GoalFindFirstArgs>(args?: SelectSubset<T, GoalFindFirstArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Goal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalFindFirstOrThrowArgs} args - Arguments to find a Goal
     * @example
     * // Get one Goal
     * const goal = await prisma.goal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GoalFindFirstOrThrowArgs>(args?: SelectSubset<T, GoalFindFirstOrThrowArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Goals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Goals
     * const goals = await prisma.goal.findMany()
     * 
     * // Get first 10 Goals
     * const goals = await prisma.goal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const goalWithIdOnly = await prisma.goal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GoalFindManyArgs>(args?: SelectSubset<T, GoalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Goal.
     * @param {GoalCreateArgs} args - Arguments to create a Goal.
     * @example
     * // Create one Goal
     * const Goal = await prisma.goal.create({
     *   data: {
     *     // ... data to create a Goal
     *   }
     * })
     * 
     */
    create<T extends GoalCreateArgs>(args: SelectSubset<T, GoalCreateArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Goals.
     * @param {GoalCreateManyArgs} args - Arguments to create many Goals.
     * @example
     * // Create many Goals
     * const goal = await prisma.goal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GoalCreateManyArgs>(args?: SelectSubset<T, GoalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Goals and returns the data saved in the database.
     * @param {GoalCreateManyAndReturnArgs} args - Arguments to create many Goals.
     * @example
     * // Create many Goals
     * const goal = await prisma.goal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Goals and only return the `id`
     * const goalWithIdOnly = await prisma.goal.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GoalCreateManyAndReturnArgs>(args?: SelectSubset<T, GoalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Goal.
     * @param {GoalDeleteArgs} args - Arguments to delete one Goal.
     * @example
     * // Delete one Goal
     * const Goal = await prisma.goal.delete({
     *   where: {
     *     // ... filter to delete one Goal
     *   }
     * })
     * 
     */
    delete<T extends GoalDeleteArgs>(args: SelectSubset<T, GoalDeleteArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Goal.
     * @param {GoalUpdateArgs} args - Arguments to update one Goal.
     * @example
     * // Update one Goal
     * const goal = await prisma.goal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GoalUpdateArgs>(args: SelectSubset<T, GoalUpdateArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Goals.
     * @param {GoalDeleteManyArgs} args - Arguments to filter Goals to delete.
     * @example
     * // Delete a few Goals
     * const { count } = await prisma.goal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GoalDeleteManyArgs>(args?: SelectSubset<T, GoalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Goals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Goals
     * const goal = await prisma.goal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GoalUpdateManyArgs>(args: SelectSubset<T, GoalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Goal.
     * @param {GoalUpsertArgs} args - Arguments to update or create a Goal.
     * @example
     * // Update or create a Goal
     * const goal = await prisma.goal.upsert({
     *   create: {
     *     // ... data to create a Goal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Goal we want to update
     *   }
     * })
     */
    upsert<T extends GoalUpsertArgs>(args: SelectSubset<T, GoalUpsertArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Goals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalCountArgs} args - Arguments to filter Goals to count.
     * @example
     * // Count the number of Goals
     * const count = await prisma.goal.count({
     *   where: {
     *     // ... the filter for the Goals we want to count
     *   }
     * })
    **/
    count<T extends GoalCountArgs>(
      args?: Subset<T, GoalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GoalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Goal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GoalAggregateArgs>(args: Subset<T, GoalAggregateArgs>): Prisma.PrismaPromise<GetGoalAggregateType<T>>

    /**
     * Group by Goal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalGroupByArgs} args - Group by arguments.
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
      T extends GoalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GoalGroupByArgs['orderBy'] }
        : { orderBy?: GoalGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GoalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGoalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Goal model
   */
  readonly fields: GoalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Goal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GoalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    progress<T extends Goal$progressArgs<ExtArgs> = {}>(args?: Subset<T, Goal$progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoalProgressPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Goal model
   */ 
  interface GoalFieldRefs {
    readonly id: FieldRef<"Goal", 'String'>
    readonly patientId: FieldRef<"Goal", 'String'>
    readonly carePlanId: FieldRef<"Goal", 'String'>
    readonly title: FieldRef<"Goal", 'String'>
    readonly description: FieldRef<"Goal", 'String'>
    readonly goalType: FieldRef<"Goal", 'GoalType'>
    readonly targetValue: FieldRef<"Goal", 'Float'>
    readonly targetUnit: FieldRef<"Goal", 'String'>
    readonly targetDate: FieldRef<"Goal", 'DateTime'>
    readonly frequency: FieldRef<"Goal", 'String'>
    readonly status: FieldRef<"Goal", 'GoalStatus'>
    readonly completedAt: FieldRef<"Goal", 'DateTime'>
    readonly createdAt: FieldRef<"Goal", 'DateTime'>
    readonly updatedAt: FieldRef<"Goal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Goal findUnique
   */
  export type GoalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * Filter, which Goal to fetch.
     */
    where: GoalWhereUniqueInput
  }

  /**
   * Goal findUniqueOrThrow
   */
  export type GoalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * Filter, which Goal to fetch.
     */
    where: GoalWhereUniqueInput
  }

  /**
   * Goal findFirst
   */
  export type GoalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * Filter, which Goal to fetch.
     */
    where?: GoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Goals to fetch.
     */
    orderBy?: GoalOrderByWithRelationInput | GoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Goals.
     */
    cursor?: GoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Goals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Goals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Goals.
     */
    distinct?: GoalScalarFieldEnum | GoalScalarFieldEnum[]
  }

  /**
   * Goal findFirstOrThrow
   */
  export type GoalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * Filter, which Goal to fetch.
     */
    where?: GoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Goals to fetch.
     */
    orderBy?: GoalOrderByWithRelationInput | GoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Goals.
     */
    cursor?: GoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Goals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Goals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Goals.
     */
    distinct?: GoalScalarFieldEnum | GoalScalarFieldEnum[]
  }

  /**
   * Goal findMany
   */
  export type GoalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * Filter, which Goals to fetch.
     */
    where?: GoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Goals to fetch.
     */
    orderBy?: GoalOrderByWithRelationInput | GoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Goals.
     */
    cursor?: GoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Goals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Goals.
     */
    skip?: number
    distinct?: GoalScalarFieldEnum | GoalScalarFieldEnum[]
  }

  /**
   * Goal create
   */
  export type GoalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * The data needed to create a Goal.
     */
    data: XOR<GoalCreateInput, GoalUncheckedCreateInput>
  }

  /**
   * Goal createMany
   */
  export type GoalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Goals.
     */
    data: GoalCreateManyInput | GoalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Goal createManyAndReturn
   */
  export type GoalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Goals.
     */
    data: GoalCreateManyInput | GoalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Goal update
   */
  export type GoalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * The data needed to update a Goal.
     */
    data: XOR<GoalUpdateInput, GoalUncheckedUpdateInput>
    /**
     * Choose, which Goal to update.
     */
    where: GoalWhereUniqueInput
  }

  /**
   * Goal updateMany
   */
  export type GoalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Goals.
     */
    data: XOR<GoalUpdateManyMutationInput, GoalUncheckedUpdateManyInput>
    /**
     * Filter which Goals to update
     */
    where?: GoalWhereInput
  }

  /**
   * Goal upsert
   */
  export type GoalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * The filter to search for the Goal to update in case it exists.
     */
    where: GoalWhereUniqueInput
    /**
     * In case the Goal found by the `where` argument doesn't exist, create a new Goal with this data.
     */
    create: XOR<GoalCreateInput, GoalUncheckedCreateInput>
    /**
     * In case the Goal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GoalUpdateInput, GoalUncheckedUpdateInput>
  }

  /**
   * Goal delete
   */
  export type GoalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * Filter which Goal to delete.
     */
    where: GoalWhereUniqueInput
  }

  /**
   * Goal deleteMany
   */
  export type GoalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Goals to delete
     */
    where?: GoalWhereInput
  }

  /**
   * Goal.progress
   */
  export type Goal$progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalProgress
     */
    select?: GoalProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalProgressInclude<ExtArgs> | null
    where?: GoalProgressWhereInput
    orderBy?: GoalProgressOrderByWithRelationInput | GoalProgressOrderByWithRelationInput[]
    cursor?: GoalProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GoalProgressScalarFieldEnum | GoalProgressScalarFieldEnum[]
  }

  /**
   * Goal without action
   */
  export type GoalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
  }


  /**
   * Model GoalProgress
   */

  export type AggregateGoalProgress = {
    _count: GoalProgressCountAggregateOutputType | null
    _avg: GoalProgressAvgAggregateOutputType | null
    _sum: GoalProgressSumAggregateOutputType | null
    _min: GoalProgressMinAggregateOutputType | null
    _max: GoalProgressMaxAggregateOutputType | null
  }

  export type GoalProgressAvgAggregateOutputType = {
    value: number | null
    currentValue: number | null
  }

  export type GoalProgressSumAggregateOutputType = {
    value: number | null
    currentValue: number | null
  }

  export type GoalProgressMinAggregateOutputType = {
    id: string | null
    goalId: string | null
    value: number | null
    currentValue: number | null
    currentUnit: string | null
    notes: string | null
    recordedAt: Date | null
    createdAt: Date | null
  }

  export type GoalProgressMaxAggregateOutputType = {
    id: string | null
    goalId: string | null
    value: number | null
    currentValue: number | null
    currentUnit: string | null
    notes: string | null
    recordedAt: Date | null
    createdAt: Date | null
  }

  export type GoalProgressCountAggregateOutputType = {
    id: number
    goalId: number
    value: number
    currentValue: number
    currentUnit: number
    notes: number
    recordedAt: number
    createdAt: number
    _all: number
  }


  export type GoalProgressAvgAggregateInputType = {
    value?: true
    currentValue?: true
  }

  export type GoalProgressSumAggregateInputType = {
    value?: true
    currentValue?: true
  }

  export type GoalProgressMinAggregateInputType = {
    id?: true
    goalId?: true
    value?: true
    currentValue?: true
    currentUnit?: true
    notes?: true
    recordedAt?: true
    createdAt?: true
  }

  export type GoalProgressMaxAggregateInputType = {
    id?: true
    goalId?: true
    value?: true
    currentValue?: true
    currentUnit?: true
    notes?: true
    recordedAt?: true
    createdAt?: true
  }

  export type GoalProgressCountAggregateInputType = {
    id?: true
    goalId?: true
    value?: true
    currentValue?: true
    currentUnit?: true
    notes?: true
    recordedAt?: true
    createdAt?: true
    _all?: true
  }

  export type GoalProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GoalProgress to aggregate.
     */
    where?: GoalProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoalProgresses to fetch.
     */
    orderBy?: GoalProgressOrderByWithRelationInput | GoalProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GoalProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoalProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoalProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GoalProgresses
    **/
    _count?: true | GoalProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GoalProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GoalProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GoalProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GoalProgressMaxAggregateInputType
  }

  export type GetGoalProgressAggregateType<T extends GoalProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateGoalProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGoalProgress[P]>
      : GetScalarType<T[P], AggregateGoalProgress[P]>
  }




  export type GoalProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GoalProgressWhereInput
    orderBy?: GoalProgressOrderByWithAggregationInput | GoalProgressOrderByWithAggregationInput[]
    by: GoalProgressScalarFieldEnum[] | GoalProgressScalarFieldEnum
    having?: GoalProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GoalProgressCountAggregateInputType | true
    _avg?: GoalProgressAvgAggregateInputType
    _sum?: GoalProgressSumAggregateInputType
    _min?: GoalProgressMinAggregateInputType
    _max?: GoalProgressMaxAggregateInputType
  }

  export type GoalProgressGroupByOutputType = {
    id: string
    goalId: string
    value: number
    currentValue: number | null
    currentUnit: string | null
    notes: string | null
    recordedAt: Date
    createdAt: Date
    _count: GoalProgressCountAggregateOutputType | null
    _avg: GoalProgressAvgAggregateOutputType | null
    _sum: GoalProgressSumAggregateOutputType | null
    _min: GoalProgressMinAggregateOutputType | null
    _max: GoalProgressMaxAggregateOutputType | null
  }

  type GetGoalProgressGroupByPayload<T extends GoalProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GoalProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GoalProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GoalProgressGroupByOutputType[P]>
            : GetScalarType<T[P], GoalProgressGroupByOutputType[P]>
        }
      >
    >


  export type GoalProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    goalId?: boolean
    value?: boolean
    currentValue?: boolean
    currentUnit?: boolean
    notes?: boolean
    recordedAt?: boolean
    createdAt?: boolean
    goal?: boolean | GoalDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["goalProgress"]>

  export type GoalProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    goalId?: boolean
    value?: boolean
    currentValue?: boolean
    currentUnit?: boolean
    notes?: boolean
    recordedAt?: boolean
    createdAt?: boolean
    goal?: boolean | GoalDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["goalProgress"]>

  export type GoalProgressSelectScalar = {
    id?: boolean
    goalId?: boolean
    value?: boolean
    currentValue?: boolean
    currentUnit?: boolean
    notes?: boolean
    recordedAt?: boolean
    createdAt?: boolean
  }

  export type GoalProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    goal?: boolean | GoalDefaultArgs<ExtArgs>
  }
  export type GoalProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    goal?: boolean | GoalDefaultArgs<ExtArgs>
  }

  export type $GoalProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GoalProgress"
    objects: {
      goal: Prisma.$GoalPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      goalId: string
      value: number
      currentValue: number | null
      currentUnit: string | null
      notes: string | null
      recordedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["goalProgress"]>
    composites: {}
  }

  type GoalProgressGetPayload<S extends boolean | null | undefined | GoalProgressDefaultArgs> = $Result.GetResult<Prisma.$GoalProgressPayload, S>

  type GoalProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GoalProgressFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GoalProgressCountAggregateInputType | true
    }

  export interface GoalProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GoalProgress'], meta: { name: 'GoalProgress' } }
    /**
     * Find zero or one GoalProgress that matches the filter.
     * @param {GoalProgressFindUniqueArgs} args - Arguments to find a GoalProgress
     * @example
     * // Get one GoalProgress
     * const goalProgress = await prisma.goalProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GoalProgressFindUniqueArgs>(args: SelectSubset<T, GoalProgressFindUniqueArgs<ExtArgs>>): Prisma__GoalProgressClient<$Result.GetResult<Prisma.$GoalProgressPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GoalProgress that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GoalProgressFindUniqueOrThrowArgs} args - Arguments to find a GoalProgress
     * @example
     * // Get one GoalProgress
     * const goalProgress = await prisma.goalProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GoalProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, GoalProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GoalProgressClient<$Result.GetResult<Prisma.$GoalProgressPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GoalProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalProgressFindFirstArgs} args - Arguments to find a GoalProgress
     * @example
     * // Get one GoalProgress
     * const goalProgress = await prisma.goalProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GoalProgressFindFirstArgs>(args?: SelectSubset<T, GoalProgressFindFirstArgs<ExtArgs>>): Prisma__GoalProgressClient<$Result.GetResult<Prisma.$GoalProgressPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GoalProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalProgressFindFirstOrThrowArgs} args - Arguments to find a GoalProgress
     * @example
     * // Get one GoalProgress
     * const goalProgress = await prisma.goalProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GoalProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, GoalProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__GoalProgressClient<$Result.GetResult<Prisma.$GoalProgressPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GoalProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GoalProgresses
     * const goalProgresses = await prisma.goalProgress.findMany()
     * 
     * // Get first 10 GoalProgresses
     * const goalProgresses = await prisma.goalProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const goalProgressWithIdOnly = await prisma.goalProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GoalProgressFindManyArgs>(args?: SelectSubset<T, GoalProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoalProgressPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GoalProgress.
     * @param {GoalProgressCreateArgs} args - Arguments to create a GoalProgress.
     * @example
     * // Create one GoalProgress
     * const GoalProgress = await prisma.goalProgress.create({
     *   data: {
     *     // ... data to create a GoalProgress
     *   }
     * })
     * 
     */
    create<T extends GoalProgressCreateArgs>(args: SelectSubset<T, GoalProgressCreateArgs<ExtArgs>>): Prisma__GoalProgressClient<$Result.GetResult<Prisma.$GoalProgressPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GoalProgresses.
     * @param {GoalProgressCreateManyArgs} args - Arguments to create many GoalProgresses.
     * @example
     * // Create many GoalProgresses
     * const goalProgress = await prisma.goalProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GoalProgressCreateManyArgs>(args?: SelectSubset<T, GoalProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GoalProgresses and returns the data saved in the database.
     * @param {GoalProgressCreateManyAndReturnArgs} args - Arguments to create many GoalProgresses.
     * @example
     * // Create many GoalProgresses
     * const goalProgress = await prisma.goalProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GoalProgresses and only return the `id`
     * const goalProgressWithIdOnly = await prisma.goalProgress.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GoalProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, GoalProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoalProgressPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GoalProgress.
     * @param {GoalProgressDeleteArgs} args - Arguments to delete one GoalProgress.
     * @example
     * // Delete one GoalProgress
     * const GoalProgress = await prisma.goalProgress.delete({
     *   where: {
     *     // ... filter to delete one GoalProgress
     *   }
     * })
     * 
     */
    delete<T extends GoalProgressDeleteArgs>(args: SelectSubset<T, GoalProgressDeleteArgs<ExtArgs>>): Prisma__GoalProgressClient<$Result.GetResult<Prisma.$GoalProgressPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GoalProgress.
     * @param {GoalProgressUpdateArgs} args - Arguments to update one GoalProgress.
     * @example
     * // Update one GoalProgress
     * const goalProgress = await prisma.goalProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GoalProgressUpdateArgs>(args: SelectSubset<T, GoalProgressUpdateArgs<ExtArgs>>): Prisma__GoalProgressClient<$Result.GetResult<Prisma.$GoalProgressPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GoalProgresses.
     * @param {GoalProgressDeleteManyArgs} args - Arguments to filter GoalProgresses to delete.
     * @example
     * // Delete a few GoalProgresses
     * const { count } = await prisma.goalProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GoalProgressDeleteManyArgs>(args?: SelectSubset<T, GoalProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GoalProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GoalProgresses
     * const goalProgress = await prisma.goalProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GoalProgressUpdateManyArgs>(args: SelectSubset<T, GoalProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GoalProgress.
     * @param {GoalProgressUpsertArgs} args - Arguments to update or create a GoalProgress.
     * @example
     * // Update or create a GoalProgress
     * const goalProgress = await prisma.goalProgress.upsert({
     *   create: {
     *     // ... data to create a GoalProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GoalProgress we want to update
     *   }
     * })
     */
    upsert<T extends GoalProgressUpsertArgs>(args: SelectSubset<T, GoalProgressUpsertArgs<ExtArgs>>): Prisma__GoalProgressClient<$Result.GetResult<Prisma.$GoalProgressPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GoalProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalProgressCountArgs} args - Arguments to filter GoalProgresses to count.
     * @example
     * // Count the number of GoalProgresses
     * const count = await prisma.goalProgress.count({
     *   where: {
     *     // ... the filter for the GoalProgresses we want to count
     *   }
     * })
    **/
    count<T extends GoalProgressCountArgs>(
      args?: Subset<T, GoalProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GoalProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GoalProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GoalProgressAggregateArgs>(args: Subset<T, GoalProgressAggregateArgs>): Prisma.PrismaPromise<GetGoalProgressAggregateType<T>>

    /**
     * Group by GoalProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalProgressGroupByArgs} args - Group by arguments.
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
      T extends GoalProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GoalProgressGroupByArgs['orderBy'] }
        : { orderBy?: GoalProgressGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GoalProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGoalProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GoalProgress model
   */
  readonly fields: GoalProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GoalProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GoalProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    goal<T extends GoalDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GoalDefaultArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the GoalProgress model
   */ 
  interface GoalProgressFieldRefs {
    readonly id: FieldRef<"GoalProgress", 'String'>
    readonly goalId: FieldRef<"GoalProgress", 'String'>
    readonly value: FieldRef<"GoalProgress", 'Float'>
    readonly currentValue: FieldRef<"GoalProgress", 'Float'>
    readonly currentUnit: FieldRef<"GoalProgress", 'String'>
    readonly notes: FieldRef<"GoalProgress", 'String'>
    readonly recordedAt: FieldRef<"GoalProgress", 'DateTime'>
    readonly createdAt: FieldRef<"GoalProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GoalProgress findUnique
   */
  export type GoalProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalProgress
     */
    select?: GoalProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalProgressInclude<ExtArgs> | null
    /**
     * Filter, which GoalProgress to fetch.
     */
    where: GoalProgressWhereUniqueInput
  }

  /**
   * GoalProgress findUniqueOrThrow
   */
  export type GoalProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalProgress
     */
    select?: GoalProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalProgressInclude<ExtArgs> | null
    /**
     * Filter, which GoalProgress to fetch.
     */
    where: GoalProgressWhereUniqueInput
  }

  /**
   * GoalProgress findFirst
   */
  export type GoalProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalProgress
     */
    select?: GoalProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalProgressInclude<ExtArgs> | null
    /**
     * Filter, which GoalProgress to fetch.
     */
    where?: GoalProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoalProgresses to fetch.
     */
    orderBy?: GoalProgressOrderByWithRelationInput | GoalProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GoalProgresses.
     */
    cursor?: GoalProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoalProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoalProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GoalProgresses.
     */
    distinct?: GoalProgressScalarFieldEnum | GoalProgressScalarFieldEnum[]
  }

  /**
   * GoalProgress findFirstOrThrow
   */
  export type GoalProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalProgress
     */
    select?: GoalProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalProgressInclude<ExtArgs> | null
    /**
     * Filter, which GoalProgress to fetch.
     */
    where?: GoalProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoalProgresses to fetch.
     */
    orderBy?: GoalProgressOrderByWithRelationInput | GoalProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GoalProgresses.
     */
    cursor?: GoalProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoalProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoalProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GoalProgresses.
     */
    distinct?: GoalProgressScalarFieldEnum | GoalProgressScalarFieldEnum[]
  }

  /**
   * GoalProgress findMany
   */
  export type GoalProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalProgress
     */
    select?: GoalProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalProgressInclude<ExtArgs> | null
    /**
     * Filter, which GoalProgresses to fetch.
     */
    where?: GoalProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoalProgresses to fetch.
     */
    orderBy?: GoalProgressOrderByWithRelationInput | GoalProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GoalProgresses.
     */
    cursor?: GoalProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoalProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoalProgresses.
     */
    skip?: number
    distinct?: GoalProgressScalarFieldEnum | GoalProgressScalarFieldEnum[]
  }

  /**
   * GoalProgress create
   */
  export type GoalProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalProgress
     */
    select?: GoalProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a GoalProgress.
     */
    data: XOR<GoalProgressCreateInput, GoalProgressUncheckedCreateInput>
  }

  /**
   * GoalProgress createMany
   */
  export type GoalProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GoalProgresses.
     */
    data: GoalProgressCreateManyInput | GoalProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GoalProgress createManyAndReturn
   */
  export type GoalProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalProgress
     */
    select?: GoalProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GoalProgresses.
     */
    data: GoalProgressCreateManyInput | GoalProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GoalProgress update
   */
  export type GoalProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalProgress
     */
    select?: GoalProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a GoalProgress.
     */
    data: XOR<GoalProgressUpdateInput, GoalProgressUncheckedUpdateInput>
    /**
     * Choose, which GoalProgress to update.
     */
    where: GoalProgressWhereUniqueInput
  }

  /**
   * GoalProgress updateMany
   */
  export type GoalProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GoalProgresses.
     */
    data: XOR<GoalProgressUpdateManyMutationInput, GoalProgressUncheckedUpdateManyInput>
    /**
     * Filter which GoalProgresses to update
     */
    where?: GoalProgressWhereInput
  }

  /**
   * GoalProgress upsert
   */
  export type GoalProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalProgress
     */
    select?: GoalProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the GoalProgress to update in case it exists.
     */
    where: GoalProgressWhereUniqueInput
    /**
     * In case the GoalProgress found by the `where` argument doesn't exist, create a new GoalProgress with this data.
     */
    create: XOR<GoalProgressCreateInput, GoalProgressUncheckedCreateInput>
    /**
     * In case the GoalProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GoalProgressUpdateInput, GoalProgressUncheckedUpdateInput>
  }

  /**
   * GoalProgress delete
   */
  export type GoalProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalProgress
     */
    select?: GoalProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalProgressInclude<ExtArgs> | null
    /**
     * Filter which GoalProgress to delete.
     */
    where: GoalProgressWhereUniqueInput
  }

  /**
   * GoalProgress deleteMany
   */
  export type GoalProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GoalProgresses to delete
     */
    where?: GoalProgressWhereInput
  }

  /**
   * GoalProgress without action
   */
  export type GoalProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalProgress
     */
    select?: GoalProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalProgressInclude<ExtArgs> | null
  }


  /**
   * Model AlertThreshold
   */

  export type AggregateAlertThreshold = {
    _count: AlertThresholdCountAggregateOutputType | null
    _avg: AlertThresholdAvgAggregateOutputType | null
    _sum: AlertThresholdSumAggregateOutputType | null
    _min: AlertThresholdMinAggregateOutputType | null
    _max: AlertThresholdMaxAggregateOutputType | null
  }

  export type AlertThresholdAvgAggregateOutputType = {
    minValue: number | null
    maxValue: number | null
    criticalMin: number | null
    criticalMax: number | null
    warningMin: number | null
    warningMax: number | null
  }

  export type AlertThresholdSumAggregateOutputType = {
    minValue: number | null
    maxValue: number | null
    criticalMin: number | null
    criticalMax: number | null
    warningMin: number | null
    warningMax: number | null
  }

  export type AlertThresholdMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    carePlanId: string | null
    vitalType: $Enums.VitalType | null
    condition: string | null
    minValue: number | null
    maxValue: number | null
    criticalMin: number | null
    criticalMax: number | null
    warningMin: number | null
    warningMax: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AlertThresholdMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    carePlanId: string | null
    vitalType: $Enums.VitalType | null
    condition: string | null
    minValue: number | null
    maxValue: number | null
    criticalMin: number | null
    criticalMax: number | null
    warningMin: number | null
    warningMax: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AlertThresholdCountAggregateOutputType = {
    id: number
    patientId: number
    carePlanId: number
    vitalType: number
    condition: number
    minValue: number
    maxValue: number
    criticalMin: number
    criticalMax: number
    warningMin: number
    warningMax: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AlertThresholdAvgAggregateInputType = {
    minValue?: true
    maxValue?: true
    criticalMin?: true
    criticalMax?: true
    warningMin?: true
    warningMax?: true
  }

  export type AlertThresholdSumAggregateInputType = {
    minValue?: true
    maxValue?: true
    criticalMin?: true
    criticalMax?: true
    warningMin?: true
    warningMax?: true
  }

  export type AlertThresholdMinAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    vitalType?: true
    condition?: true
    minValue?: true
    maxValue?: true
    criticalMin?: true
    criticalMax?: true
    warningMin?: true
    warningMax?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AlertThresholdMaxAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    vitalType?: true
    condition?: true
    minValue?: true
    maxValue?: true
    criticalMin?: true
    criticalMax?: true
    warningMin?: true
    warningMax?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AlertThresholdCountAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    vitalType?: true
    condition?: true
    minValue?: true
    maxValue?: true
    criticalMin?: true
    criticalMax?: true
    warningMin?: true
    warningMax?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AlertThresholdAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlertThreshold to aggregate.
     */
    where?: AlertThresholdWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlertThresholds to fetch.
     */
    orderBy?: AlertThresholdOrderByWithRelationInput | AlertThresholdOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlertThresholdWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlertThresholds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlertThresholds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AlertThresholds
    **/
    _count?: true | AlertThresholdCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AlertThresholdAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AlertThresholdSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlertThresholdMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlertThresholdMaxAggregateInputType
  }

  export type GetAlertThresholdAggregateType<T extends AlertThresholdAggregateArgs> = {
        [P in keyof T & keyof AggregateAlertThreshold]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlertThreshold[P]>
      : GetScalarType<T[P], AggregateAlertThreshold[P]>
  }




  export type AlertThresholdGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlertThresholdWhereInput
    orderBy?: AlertThresholdOrderByWithAggregationInput | AlertThresholdOrderByWithAggregationInput[]
    by: AlertThresholdScalarFieldEnum[] | AlertThresholdScalarFieldEnum
    having?: AlertThresholdScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlertThresholdCountAggregateInputType | true
    _avg?: AlertThresholdAvgAggregateInputType
    _sum?: AlertThresholdSumAggregateInputType
    _min?: AlertThresholdMinAggregateInputType
    _max?: AlertThresholdMaxAggregateInputType
  }

  export type AlertThresholdGroupByOutputType = {
    id: string
    patientId: string
    carePlanId: string | null
    vitalType: $Enums.VitalType
    condition: string | null
    minValue: number | null
    maxValue: number | null
    criticalMin: number | null
    criticalMax: number | null
    warningMin: number | null
    warningMax: number | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: AlertThresholdCountAggregateOutputType | null
    _avg: AlertThresholdAvgAggregateOutputType | null
    _sum: AlertThresholdSumAggregateOutputType | null
    _min: AlertThresholdMinAggregateOutputType | null
    _max: AlertThresholdMaxAggregateOutputType | null
  }

  type GetAlertThresholdGroupByPayload<T extends AlertThresholdGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlertThresholdGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlertThresholdGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlertThresholdGroupByOutputType[P]>
            : GetScalarType<T[P], AlertThresholdGroupByOutputType[P]>
        }
      >
    >


  export type AlertThresholdSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    vitalType?: boolean
    condition?: boolean
    minValue?: boolean
    maxValue?: boolean
    criticalMin?: boolean
    criticalMax?: boolean
    warningMin?: boolean
    warningMax?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["alertThreshold"]>

  export type AlertThresholdSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    vitalType?: boolean
    condition?: boolean
    minValue?: boolean
    maxValue?: boolean
    criticalMin?: boolean
    criticalMax?: boolean
    warningMin?: boolean
    warningMax?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["alertThreshold"]>

  export type AlertThresholdSelectScalar = {
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    vitalType?: boolean
    condition?: boolean
    minValue?: boolean
    maxValue?: boolean
    criticalMin?: boolean
    criticalMax?: boolean
    warningMin?: boolean
    warningMax?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $AlertThresholdPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AlertThreshold"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      carePlanId: string | null
      vitalType: $Enums.VitalType
      condition: string | null
      minValue: number | null
      maxValue: number | null
      criticalMin: number | null
      criticalMax: number | null
      warningMin: number | null
      warningMax: number | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["alertThreshold"]>
    composites: {}
  }

  type AlertThresholdGetPayload<S extends boolean | null | undefined | AlertThresholdDefaultArgs> = $Result.GetResult<Prisma.$AlertThresholdPayload, S>

  type AlertThresholdCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AlertThresholdFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AlertThresholdCountAggregateInputType | true
    }

  export interface AlertThresholdDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AlertThreshold'], meta: { name: 'AlertThreshold' } }
    /**
     * Find zero or one AlertThreshold that matches the filter.
     * @param {AlertThresholdFindUniqueArgs} args - Arguments to find a AlertThreshold
     * @example
     * // Get one AlertThreshold
     * const alertThreshold = await prisma.alertThreshold.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlertThresholdFindUniqueArgs>(args: SelectSubset<T, AlertThresholdFindUniqueArgs<ExtArgs>>): Prisma__AlertThresholdClient<$Result.GetResult<Prisma.$AlertThresholdPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AlertThreshold that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AlertThresholdFindUniqueOrThrowArgs} args - Arguments to find a AlertThreshold
     * @example
     * // Get one AlertThreshold
     * const alertThreshold = await prisma.alertThreshold.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlertThresholdFindUniqueOrThrowArgs>(args: SelectSubset<T, AlertThresholdFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlertThresholdClient<$Result.GetResult<Prisma.$AlertThresholdPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AlertThreshold that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertThresholdFindFirstArgs} args - Arguments to find a AlertThreshold
     * @example
     * // Get one AlertThreshold
     * const alertThreshold = await prisma.alertThreshold.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlertThresholdFindFirstArgs>(args?: SelectSubset<T, AlertThresholdFindFirstArgs<ExtArgs>>): Prisma__AlertThresholdClient<$Result.GetResult<Prisma.$AlertThresholdPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AlertThreshold that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertThresholdFindFirstOrThrowArgs} args - Arguments to find a AlertThreshold
     * @example
     * // Get one AlertThreshold
     * const alertThreshold = await prisma.alertThreshold.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlertThresholdFindFirstOrThrowArgs>(args?: SelectSubset<T, AlertThresholdFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlertThresholdClient<$Result.GetResult<Prisma.$AlertThresholdPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AlertThresholds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertThresholdFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AlertThresholds
     * const alertThresholds = await prisma.alertThreshold.findMany()
     * 
     * // Get first 10 AlertThresholds
     * const alertThresholds = await prisma.alertThreshold.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const alertThresholdWithIdOnly = await prisma.alertThreshold.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlertThresholdFindManyArgs>(args?: SelectSubset<T, AlertThresholdFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertThresholdPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AlertThreshold.
     * @param {AlertThresholdCreateArgs} args - Arguments to create a AlertThreshold.
     * @example
     * // Create one AlertThreshold
     * const AlertThreshold = await prisma.alertThreshold.create({
     *   data: {
     *     // ... data to create a AlertThreshold
     *   }
     * })
     * 
     */
    create<T extends AlertThresholdCreateArgs>(args: SelectSubset<T, AlertThresholdCreateArgs<ExtArgs>>): Prisma__AlertThresholdClient<$Result.GetResult<Prisma.$AlertThresholdPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AlertThresholds.
     * @param {AlertThresholdCreateManyArgs} args - Arguments to create many AlertThresholds.
     * @example
     * // Create many AlertThresholds
     * const alertThreshold = await prisma.alertThreshold.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlertThresholdCreateManyArgs>(args?: SelectSubset<T, AlertThresholdCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AlertThresholds and returns the data saved in the database.
     * @param {AlertThresholdCreateManyAndReturnArgs} args - Arguments to create many AlertThresholds.
     * @example
     * // Create many AlertThresholds
     * const alertThreshold = await prisma.alertThreshold.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AlertThresholds and only return the `id`
     * const alertThresholdWithIdOnly = await prisma.alertThreshold.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlertThresholdCreateManyAndReturnArgs>(args?: SelectSubset<T, AlertThresholdCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertThresholdPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AlertThreshold.
     * @param {AlertThresholdDeleteArgs} args - Arguments to delete one AlertThreshold.
     * @example
     * // Delete one AlertThreshold
     * const AlertThreshold = await prisma.alertThreshold.delete({
     *   where: {
     *     // ... filter to delete one AlertThreshold
     *   }
     * })
     * 
     */
    delete<T extends AlertThresholdDeleteArgs>(args: SelectSubset<T, AlertThresholdDeleteArgs<ExtArgs>>): Prisma__AlertThresholdClient<$Result.GetResult<Prisma.$AlertThresholdPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AlertThreshold.
     * @param {AlertThresholdUpdateArgs} args - Arguments to update one AlertThreshold.
     * @example
     * // Update one AlertThreshold
     * const alertThreshold = await prisma.alertThreshold.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlertThresholdUpdateArgs>(args: SelectSubset<T, AlertThresholdUpdateArgs<ExtArgs>>): Prisma__AlertThresholdClient<$Result.GetResult<Prisma.$AlertThresholdPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AlertThresholds.
     * @param {AlertThresholdDeleteManyArgs} args - Arguments to filter AlertThresholds to delete.
     * @example
     * // Delete a few AlertThresholds
     * const { count } = await prisma.alertThreshold.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlertThresholdDeleteManyArgs>(args?: SelectSubset<T, AlertThresholdDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AlertThresholds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertThresholdUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AlertThresholds
     * const alertThreshold = await prisma.alertThreshold.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlertThresholdUpdateManyArgs>(args: SelectSubset<T, AlertThresholdUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AlertThreshold.
     * @param {AlertThresholdUpsertArgs} args - Arguments to update or create a AlertThreshold.
     * @example
     * // Update or create a AlertThreshold
     * const alertThreshold = await prisma.alertThreshold.upsert({
     *   create: {
     *     // ... data to create a AlertThreshold
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AlertThreshold we want to update
     *   }
     * })
     */
    upsert<T extends AlertThresholdUpsertArgs>(args: SelectSubset<T, AlertThresholdUpsertArgs<ExtArgs>>): Prisma__AlertThresholdClient<$Result.GetResult<Prisma.$AlertThresholdPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AlertThresholds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertThresholdCountArgs} args - Arguments to filter AlertThresholds to count.
     * @example
     * // Count the number of AlertThresholds
     * const count = await prisma.alertThreshold.count({
     *   where: {
     *     // ... the filter for the AlertThresholds we want to count
     *   }
     * })
    **/
    count<T extends AlertThresholdCountArgs>(
      args?: Subset<T, AlertThresholdCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlertThresholdCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AlertThreshold.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertThresholdAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AlertThresholdAggregateArgs>(args: Subset<T, AlertThresholdAggregateArgs>): Prisma.PrismaPromise<GetAlertThresholdAggregateType<T>>

    /**
     * Group by AlertThreshold.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertThresholdGroupByArgs} args - Group by arguments.
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
      T extends AlertThresholdGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlertThresholdGroupByArgs['orderBy'] }
        : { orderBy?: AlertThresholdGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AlertThresholdGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlertThresholdGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AlertThreshold model
   */
  readonly fields: AlertThresholdFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AlertThreshold.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlertThresholdClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the AlertThreshold model
   */ 
  interface AlertThresholdFieldRefs {
    readonly id: FieldRef<"AlertThreshold", 'String'>
    readonly patientId: FieldRef<"AlertThreshold", 'String'>
    readonly carePlanId: FieldRef<"AlertThreshold", 'String'>
    readonly vitalType: FieldRef<"AlertThreshold", 'VitalType'>
    readonly condition: FieldRef<"AlertThreshold", 'String'>
    readonly minValue: FieldRef<"AlertThreshold", 'Float'>
    readonly maxValue: FieldRef<"AlertThreshold", 'Float'>
    readonly criticalMin: FieldRef<"AlertThreshold", 'Float'>
    readonly criticalMax: FieldRef<"AlertThreshold", 'Float'>
    readonly warningMin: FieldRef<"AlertThreshold", 'Float'>
    readonly warningMax: FieldRef<"AlertThreshold", 'Float'>
    readonly isActive: FieldRef<"AlertThreshold", 'Boolean'>
    readonly createdAt: FieldRef<"AlertThreshold", 'DateTime'>
    readonly updatedAt: FieldRef<"AlertThreshold", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AlertThreshold findUnique
   */
  export type AlertThresholdFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertThreshold
     */
    select?: AlertThresholdSelect<ExtArgs> | null
    /**
     * Filter, which AlertThreshold to fetch.
     */
    where: AlertThresholdWhereUniqueInput
  }

  /**
   * AlertThreshold findUniqueOrThrow
   */
  export type AlertThresholdFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertThreshold
     */
    select?: AlertThresholdSelect<ExtArgs> | null
    /**
     * Filter, which AlertThreshold to fetch.
     */
    where: AlertThresholdWhereUniqueInput
  }

  /**
   * AlertThreshold findFirst
   */
  export type AlertThresholdFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertThreshold
     */
    select?: AlertThresholdSelect<ExtArgs> | null
    /**
     * Filter, which AlertThreshold to fetch.
     */
    where?: AlertThresholdWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlertThresholds to fetch.
     */
    orderBy?: AlertThresholdOrderByWithRelationInput | AlertThresholdOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlertThresholds.
     */
    cursor?: AlertThresholdWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlertThresholds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlertThresholds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlertThresholds.
     */
    distinct?: AlertThresholdScalarFieldEnum | AlertThresholdScalarFieldEnum[]
  }

  /**
   * AlertThreshold findFirstOrThrow
   */
  export type AlertThresholdFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertThreshold
     */
    select?: AlertThresholdSelect<ExtArgs> | null
    /**
     * Filter, which AlertThreshold to fetch.
     */
    where?: AlertThresholdWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlertThresholds to fetch.
     */
    orderBy?: AlertThresholdOrderByWithRelationInput | AlertThresholdOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlertThresholds.
     */
    cursor?: AlertThresholdWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlertThresholds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlertThresholds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlertThresholds.
     */
    distinct?: AlertThresholdScalarFieldEnum | AlertThresholdScalarFieldEnum[]
  }

  /**
   * AlertThreshold findMany
   */
  export type AlertThresholdFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertThreshold
     */
    select?: AlertThresholdSelect<ExtArgs> | null
    /**
     * Filter, which AlertThresholds to fetch.
     */
    where?: AlertThresholdWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlertThresholds to fetch.
     */
    orderBy?: AlertThresholdOrderByWithRelationInput | AlertThresholdOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AlertThresholds.
     */
    cursor?: AlertThresholdWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlertThresholds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlertThresholds.
     */
    skip?: number
    distinct?: AlertThresholdScalarFieldEnum | AlertThresholdScalarFieldEnum[]
  }

  /**
   * AlertThreshold create
   */
  export type AlertThresholdCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertThreshold
     */
    select?: AlertThresholdSelect<ExtArgs> | null
    /**
     * The data needed to create a AlertThreshold.
     */
    data: XOR<AlertThresholdCreateInput, AlertThresholdUncheckedCreateInput>
  }

  /**
   * AlertThreshold createMany
   */
  export type AlertThresholdCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AlertThresholds.
     */
    data: AlertThresholdCreateManyInput | AlertThresholdCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AlertThreshold createManyAndReturn
   */
  export type AlertThresholdCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertThreshold
     */
    select?: AlertThresholdSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AlertThresholds.
     */
    data: AlertThresholdCreateManyInput | AlertThresholdCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AlertThreshold update
   */
  export type AlertThresholdUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertThreshold
     */
    select?: AlertThresholdSelect<ExtArgs> | null
    /**
     * The data needed to update a AlertThreshold.
     */
    data: XOR<AlertThresholdUpdateInput, AlertThresholdUncheckedUpdateInput>
    /**
     * Choose, which AlertThreshold to update.
     */
    where: AlertThresholdWhereUniqueInput
  }

  /**
   * AlertThreshold updateMany
   */
  export type AlertThresholdUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AlertThresholds.
     */
    data: XOR<AlertThresholdUpdateManyMutationInput, AlertThresholdUncheckedUpdateManyInput>
    /**
     * Filter which AlertThresholds to update
     */
    where?: AlertThresholdWhereInput
  }

  /**
   * AlertThreshold upsert
   */
  export type AlertThresholdUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertThreshold
     */
    select?: AlertThresholdSelect<ExtArgs> | null
    /**
     * The filter to search for the AlertThreshold to update in case it exists.
     */
    where: AlertThresholdWhereUniqueInput
    /**
     * In case the AlertThreshold found by the `where` argument doesn't exist, create a new AlertThreshold with this data.
     */
    create: XOR<AlertThresholdCreateInput, AlertThresholdUncheckedCreateInput>
    /**
     * In case the AlertThreshold was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlertThresholdUpdateInput, AlertThresholdUncheckedUpdateInput>
  }

  /**
   * AlertThreshold delete
   */
  export type AlertThresholdDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertThreshold
     */
    select?: AlertThresholdSelect<ExtArgs> | null
    /**
     * Filter which AlertThreshold to delete.
     */
    where: AlertThresholdWhereUniqueInput
  }

  /**
   * AlertThreshold deleteMany
   */
  export type AlertThresholdDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlertThresholds to delete
     */
    where?: AlertThresholdWhereInput
  }

  /**
   * AlertThreshold without action
   */
  export type AlertThresholdDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertThreshold
     */
    select?: AlertThresholdSelect<ExtArgs> | null
  }


  /**
   * Model CarePlanTemplate
   */

  export type AggregateCarePlanTemplate = {
    _count: CarePlanTemplateCountAggregateOutputType | null
    _avg: CarePlanTemplateAvgAggregateOutputType | null
    _sum: CarePlanTemplateSumAggregateOutputType | null
    _min: CarePlanTemplateMinAggregateOutputType | null
    _max: CarePlanTemplateMaxAggregateOutputType | null
  }

  export type CarePlanTemplateAvgAggregateOutputType = {
    version: number | null
  }

  export type CarePlanTemplateSumAggregateOutputType = {
    version: number | null
  }

  export type CarePlanTemplateMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    condition: string | null
    reviewSchedule: string | null
    version: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CarePlanTemplateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    condition: string | null
    reviewSchedule: string | null
    version: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CarePlanTemplateCountAggregateOutputType = {
    id: number
    name: number
    description: number
    condition: number
    goals: number
    interventions: number
    tasks: number
    reviewSchedule: number
    thresholds: number
    version: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CarePlanTemplateAvgAggregateInputType = {
    version?: true
  }

  export type CarePlanTemplateSumAggregateInputType = {
    version?: true
  }

  export type CarePlanTemplateMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    condition?: true
    reviewSchedule?: true
    version?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CarePlanTemplateMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    condition?: true
    reviewSchedule?: true
    version?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CarePlanTemplateCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    condition?: true
    goals?: true
    interventions?: true
    tasks?: true
    reviewSchedule?: true
    thresholds?: true
    version?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CarePlanTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CarePlanTemplate to aggregate.
     */
    where?: CarePlanTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CarePlanTemplates to fetch.
     */
    orderBy?: CarePlanTemplateOrderByWithRelationInput | CarePlanTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CarePlanTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CarePlanTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CarePlanTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CarePlanTemplates
    **/
    _count?: true | CarePlanTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CarePlanTemplateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CarePlanTemplateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CarePlanTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CarePlanTemplateMaxAggregateInputType
  }

  export type GetCarePlanTemplateAggregateType<T extends CarePlanTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateCarePlanTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCarePlanTemplate[P]>
      : GetScalarType<T[P], AggregateCarePlanTemplate[P]>
  }




  export type CarePlanTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CarePlanTemplateWhereInput
    orderBy?: CarePlanTemplateOrderByWithAggregationInput | CarePlanTemplateOrderByWithAggregationInput[]
    by: CarePlanTemplateScalarFieldEnum[] | CarePlanTemplateScalarFieldEnum
    having?: CarePlanTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CarePlanTemplateCountAggregateInputType | true
    _avg?: CarePlanTemplateAvgAggregateInputType
    _sum?: CarePlanTemplateSumAggregateInputType
    _min?: CarePlanTemplateMinAggregateInputType
    _max?: CarePlanTemplateMaxAggregateInputType
  }

  export type CarePlanTemplateGroupByOutputType = {
    id: string
    name: string
    description: string | null
    condition: string
    goals: JsonValue
    interventions: JsonValue
    tasks: JsonValue | null
    reviewSchedule: string | null
    thresholds: JsonValue | null
    version: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: CarePlanTemplateCountAggregateOutputType | null
    _avg: CarePlanTemplateAvgAggregateOutputType | null
    _sum: CarePlanTemplateSumAggregateOutputType | null
    _min: CarePlanTemplateMinAggregateOutputType | null
    _max: CarePlanTemplateMaxAggregateOutputType | null
  }

  type GetCarePlanTemplateGroupByPayload<T extends CarePlanTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CarePlanTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CarePlanTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CarePlanTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], CarePlanTemplateGroupByOutputType[P]>
        }
      >
    >


  export type CarePlanTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    condition?: boolean
    goals?: boolean
    interventions?: boolean
    tasks?: boolean
    reviewSchedule?: boolean
    thresholds?: boolean
    version?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["carePlanTemplate"]>

  export type CarePlanTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    condition?: boolean
    goals?: boolean
    interventions?: boolean
    tasks?: boolean
    reviewSchedule?: boolean
    thresholds?: boolean
    version?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["carePlanTemplate"]>

  export type CarePlanTemplateSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    condition?: boolean
    goals?: boolean
    interventions?: boolean
    tasks?: boolean
    reviewSchedule?: boolean
    thresholds?: boolean
    version?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $CarePlanTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CarePlanTemplate"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      condition: string
      goals: Prisma.JsonValue
      interventions: Prisma.JsonValue
      tasks: Prisma.JsonValue | null
      reviewSchedule: string | null
      thresholds: Prisma.JsonValue | null
      version: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["carePlanTemplate"]>
    composites: {}
  }

  type CarePlanTemplateGetPayload<S extends boolean | null | undefined | CarePlanTemplateDefaultArgs> = $Result.GetResult<Prisma.$CarePlanTemplatePayload, S>

  type CarePlanTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CarePlanTemplateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CarePlanTemplateCountAggregateInputType | true
    }

  export interface CarePlanTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CarePlanTemplate'], meta: { name: 'CarePlanTemplate' } }
    /**
     * Find zero or one CarePlanTemplate that matches the filter.
     * @param {CarePlanTemplateFindUniqueArgs} args - Arguments to find a CarePlanTemplate
     * @example
     * // Get one CarePlanTemplate
     * const carePlanTemplate = await prisma.carePlanTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CarePlanTemplateFindUniqueArgs>(args: SelectSubset<T, CarePlanTemplateFindUniqueArgs<ExtArgs>>): Prisma__CarePlanTemplateClient<$Result.GetResult<Prisma.$CarePlanTemplatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CarePlanTemplate that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CarePlanTemplateFindUniqueOrThrowArgs} args - Arguments to find a CarePlanTemplate
     * @example
     * // Get one CarePlanTemplate
     * const carePlanTemplate = await prisma.carePlanTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CarePlanTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, CarePlanTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CarePlanTemplateClient<$Result.GetResult<Prisma.$CarePlanTemplatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CarePlanTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanTemplateFindFirstArgs} args - Arguments to find a CarePlanTemplate
     * @example
     * // Get one CarePlanTemplate
     * const carePlanTemplate = await prisma.carePlanTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CarePlanTemplateFindFirstArgs>(args?: SelectSubset<T, CarePlanTemplateFindFirstArgs<ExtArgs>>): Prisma__CarePlanTemplateClient<$Result.GetResult<Prisma.$CarePlanTemplatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CarePlanTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanTemplateFindFirstOrThrowArgs} args - Arguments to find a CarePlanTemplate
     * @example
     * // Get one CarePlanTemplate
     * const carePlanTemplate = await prisma.carePlanTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CarePlanTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, CarePlanTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__CarePlanTemplateClient<$Result.GetResult<Prisma.$CarePlanTemplatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CarePlanTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CarePlanTemplates
     * const carePlanTemplates = await prisma.carePlanTemplate.findMany()
     * 
     * // Get first 10 CarePlanTemplates
     * const carePlanTemplates = await prisma.carePlanTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const carePlanTemplateWithIdOnly = await prisma.carePlanTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CarePlanTemplateFindManyArgs>(args?: SelectSubset<T, CarePlanTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CarePlanTemplatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CarePlanTemplate.
     * @param {CarePlanTemplateCreateArgs} args - Arguments to create a CarePlanTemplate.
     * @example
     * // Create one CarePlanTemplate
     * const CarePlanTemplate = await prisma.carePlanTemplate.create({
     *   data: {
     *     // ... data to create a CarePlanTemplate
     *   }
     * })
     * 
     */
    create<T extends CarePlanTemplateCreateArgs>(args: SelectSubset<T, CarePlanTemplateCreateArgs<ExtArgs>>): Prisma__CarePlanTemplateClient<$Result.GetResult<Prisma.$CarePlanTemplatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CarePlanTemplates.
     * @param {CarePlanTemplateCreateManyArgs} args - Arguments to create many CarePlanTemplates.
     * @example
     * // Create many CarePlanTemplates
     * const carePlanTemplate = await prisma.carePlanTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CarePlanTemplateCreateManyArgs>(args?: SelectSubset<T, CarePlanTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CarePlanTemplates and returns the data saved in the database.
     * @param {CarePlanTemplateCreateManyAndReturnArgs} args - Arguments to create many CarePlanTemplates.
     * @example
     * // Create many CarePlanTemplates
     * const carePlanTemplate = await prisma.carePlanTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CarePlanTemplates and only return the `id`
     * const carePlanTemplateWithIdOnly = await prisma.carePlanTemplate.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CarePlanTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, CarePlanTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CarePlanTemplatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CarePlanTemplate.
     * @param {CarePlanTemplateDeleteArgs} args - Arguments to delete one CarePlanTemplate.
     * @example
     * // Delete one CarePlanTemplate
     * const CarePlanTemplate = await prisma.carePlanTemplate.delete({
     *   where: {
     *     // ... filter to delete one CarePlanTemplate
     *   }
     * })
     * 
     */
    delete<T extends CarePlanTemplateDeleteArgs>(args: SelectSubset<T, CarePlanTemplateDeleteArgs<ExtArgs>>): Prisma__CarePlanTemplateClient<$Result.GetResult<Prisma.$CarePlanTemplatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CarePlanTemplate.
     * @param {CarePlanTemplateUpdateArgs} args - Arguments to update one CarePlanTemplate.
     * @example
     * // Update one CarePlanTemplate
     * const carePlanTemplate = await prisma.carePlanTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CarePlanTemplateUpdateArgs>(args: SelectSubset<T, CarePlanTemplateUpdateArgs<ExtArgs>>): Prisma__CarePlanTemplateClient<$Result.GetResult<Prisma.$CarePlanTemplatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CarePlanTemplates.
     * @param {CarePlanTemplateDeleteManyArgs} args - Arguments to filter CarePlanTemplates to delete.
     * @example
     * // Delete a few CarePlanTemplates
     * const { count } = await prisma.carePlanTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CarePlanTemplateDeleteManyArgs>(args?: SelectSubset<T, CarePlanTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CarePlanTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CarePlanTemplates
     * const carePlanTemplate = await prisma.carePlanTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CarePlanTemplateUpdateManyArgs>(args: SelectSubset<T, CarePlanTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CarePlanTemplate.
     * @param {CarePlanTemplateUpsertArgs} args - Arguments to update or create a CarePlanTemplate.
     * @example
     * // Update or create a CarePlanTemplate
     * const carePlanTemplate = await prisma.carePlanTemplate.upsert({
     *   create: {
     *     // ... data to create a CarePlanTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CarePlanTemplate we want to update
     *   }
     * })
     */
    upsert<T extends CarePlanTemplateUpsertArgs>(args: SelectSubset<T, CarePlanTemplateUpsertArgs<ExtArgs>>): Prisma__CarePlanTemplateClient<$Result.GetResult<Prisma.$CarePlanTemplatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CarePlanTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanTemplateCountArgs} args - Arguments to filter CarePlanTemplates to count.
     * @example
     * // Count the number of CarePlanTemplates
     * const count = await prisma.carePlanTemplate.count({
     *   where: {
     *     // ... the filter for the CarePlanTemplates we want to count
     *   }
     * })
    **/
    count<T extends CarePlanTemplateCountArgs>(
      args?: Subset<T, CarePlanTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CarePlanTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CarePlanTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CarePlanTemplateAggregateArgs>(args: Subset<T, CarePlanTemplateAggregateArgs>): Prisma.PrismaPromise<GetCarePlanTemplateAggregateType<T>>

    /**
     * Group by CarePlanTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarePlanTemplateGroupByArgs} args - Group by arguments.
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
      T extends CarePlanTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CarePlanTemplateGroupByArgs['orderBy'] }
        : { orderBy?: CarePlanTemplateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CarePlanTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCarePlanTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CarePlanTemplate model
   */
  readonly fields: CarePlanTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CarePlanTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CarePlanTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CarePlanTemplate model
   */ 
  interface CarePlanTemplateFieldRefs {
    readonly id: FieldRef<"CarePlanTemplate", 'String'>
    readonly name: FieldRef<"CarePlanTemplate", 'String'>
    readonly description: FieldRef<"CarePlanTemplate", 'String'>
    readonly condition: FieldRef<"CarePlanTemplate", 'String'>
    readonly goals: FieldRef<"CarePlanTemplate", 'Json'>
    readonly interventions: FieldRef<"CarePlanTemplate", 'Json'>
    readonly tasks: FieldRef<"CarePlanTemplate", 'Json'>
    readonly reviewSchedule: FieldRef<"CarePlanTemplate", 'String'>
    readonly thresholds: FieldRef<"CarePlanTemplate", 'Json'>
    readonly version: FieldRef<"CarePlanTemplate", 'Int'>
    readonly isActive: FieldRef<"CarePlanTemplate", 'Boolean'>
    readonly createdAt: FieldRef<"CarePlanTemplate", 'DateTime'>
    readonly updatedAt: FieldRef<"CarePlanTemplate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CarePlanTemplate findUnique
   */
  export type CarePlanTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlanTemplate
     */
    select?: CarePlanTemplateSelect<ExtArgs> | null
    /**
     * Filter, which CarePlanTemplate to fetch.
     */
    where: CarePlanTemplateWhereUniqueInput
  }

  /**
   * CarePlanTemplate findUniqueOrThrow
   */
  export type CarePlanTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlanTemplate
     */
    select?: CarePlanTemplateSelect<ExtArgs> | null
    /**
     * Filter, which CarePlanTemplate to fetch.
     */
    where: CarePlanTemplateWhereUniqueInput
  }

  /**
   * CarePlanTemplate findFirst
   */
  export type CarePlanTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlanTemplate
     */
    select?: CarePlanTemplateSelect<ExtArgs> | null
    /**
     * Filter, which CarePlanTemplate to fetch.
     */
    where?: CarePlanTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CarePlanTemplates to fetch.
     */
    orderBy?: CarePlanTemplateOrderByWithRelationInput | CarePlanTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CarePlanTemplates.
     */
    cursor?: CarePlanTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CarePlanTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CarePlanTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CarePlanTemplates.
     */
    distinct?: CarePlanTemplateScalarFieldEnum | CarePlanTemplateScalarFieldEnum[]
  }

  /**
   * CarePlanTemplate findFirstOrThrow
   */
  export type CarePlanTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlanTemplate
     */
    select?: CarePlanTemplateSelect<ExtArgs> | null
    /**
     * Filter, which CarePlanTemplate to fetch.
     */
    where?: CarePlanTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CarePlanTemplates to fetch.
     */
    orderBy?: CarePlanTemplateOrderByWithRelationInput | CarePlanTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CarePlanTemplates.
     */
    cursor?: CarePlanTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CarePlanTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CarePlanTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CarePlanTemplates.
     */
    distinct?: CarePlanTemplateScalarFieldEnum | CarePlanTemplateScalarFieldEnum[]
  }

  /**
   * CarePlanTemplate findMany
   */
  export type CarePlanTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlanTemplate
     */
    select?: CarePlanTemplateSelect<ExtArgs> | null
    /**
     * Filter, which CarePlanTemplates to fetch.
     */
    where?: CarePlanTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CarePlanTemplates to fetch.
     */
    orderBy?: CarePlanTemplateOrderByWithRelationInput | CarePlanTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CarePlanTemplates.
     */
    cursor?: CarePlanTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CarePlanTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CarePlanTemplates.
     */
    skip?: number
    distinct?: CarePlanTemplateScalarFieldEnum | CarePlanTemplateScalarFieldEnum[]
  }

  /**
   * CarePlanTemplate create
   */
  export type CarePlanTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlanTemplate
     */
    select?: CarePlanTemplateSelect<ExtArgs> | null
    /**
     * The data needed to create a CarePlanTemplate.
     */
    data: XOR<CarePlanTemplateCreateInput, CarePlanTemplateUncheckedCreateInput>
  }

  /**
   * CarePlanTemplate createMany
   */
  export type CarePlanTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CarePlanTemplates.
     */
    data: CarePlanTemplateCreateManyInput | CarePlanTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CarePlanTemplate createManyAndReturn
   */
  export type CarePlanTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlanTemplate
     */
    select?: CarePlanTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CarePlanTemplates.
     */
    data: CarePlanTemplateCreateManyInput | CarePlanTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CarePlanTemplate update
   */
  export type CarePlanTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlanTemplate
     */
    select?: CarePlanTemplateSelect<ExtArgs> | null
    /**
     * The data needed to update a CarePlanTemplate.
     */
    data: XOR<CarePlanTemplateUpdateInput, CarePlanTemplateUncheckedUpdateInput>
    /**
     * Choose, which CarePlanTemplate to update.
     */
    where: CarePlanTemplateWhereUniqueInput
  }

  /**
   * CarePlanTemplate updateMany
   */
  export type CarePlanTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CarePlanTemplates.
     */
    data: XOR<CarePlanTemplateUpdateManyMutationInput, CarePlanTemplateUncheckedUpdateManyInput>
    /**
     * Filter which CarePlanTemplates to update
     */
    where?: CarePlanTemplateWhereInput
  }

  /**
   * CarePlanTemplate upsert
   */
  export type CarePlanTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlanTemplate
     */
    select?: CarePlanTemplateSelect<ExtArgs> | null
    /**
     * The filter to search for the CarePlanTemplate to update in case it exists.
     */
    where: CarePlanTemplateWhereUniqueInput
    /**
     * In case the CarePlanTemplate found by the `where` argument doesn't exist, create a new CarePlanTemplate with this data.
     */
    create: XOR<CarePlanTemplateCreateInput, CarePlanTemplateUncheckedCreateInput>
    /**
     * In case the CarePlanTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CarePlanTemplateUpdateInput, CarePlanTemplateUncheckedUpdateInput>
  }

  /**
   * CarePlanTemplate delete
   */
  export type CarePlanTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlanTemplate
     */
    select?: CarePlanTemplateSelect<ExtArgs> | null
    /**
     * Filter which CarePlanTemplate to delete.
     */
    where: CarePlanTemplateWhereUniqueInput
  }

  /**
   * CarePlanTemplate deleteMany
   */
  export type CarePlanTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CarePlanTemplates to delete
     */
    where?: CarePlanTemplateWhereInput
  }

  /**
   * CarePlanTemplate without action
   */
  export type CarePlanTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CarePlanTemplate
     */
    select?: CarePlanTemplateSelect<ExtArgs> | null
  }


  /**
   * Model PatientEngagement
   */

  export type AggregatePatientEngagement = {
    _count: PatientEngagementCountAggregateOutputType | null
    _min: PatientEngagementMinAggregateOutputType | null
    _max: PatientEngagementMaxAggregateOutputType | null
  }

  export type PatientEngagementMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    carePlanId: string | null
    engagementType: $Enums.EngagementType | null
    activityType: string | null
    description: string | null
    recordedAt: Date | null
    createdAt: Date | null
  }

  export type PatientEngagementMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    carePlanId: string | null
    engagementType: $Enums.EngagementType | null
    activityType: string | null
    description: string | null
    recordedAt: Date | null
    createdAt: Date | null
  }

  export type PatientEngagementCountAggregateOutputType = {
    id: number
    patientId: number
    carePlanId: number
    engagementType: number
    activityType: number
    description: number
    metadata: number
    recordedAt: number
    createdAt: number
    _all: number
  }


  export type PatientEngagementMinAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    engagementType?: true
    activityType?: true
    description?: true
    recordedAt?: true
    createdAt?: true
  }

  export type PatientEngagementMaxAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    engagementType?: true
    activityType?: true
    description?: true
    recordedAt?: true
    createdAt?: true
  }

  export type PatientEngagementCountAggregateInputType = {
    id?: true
    patientId?: true
    carePlanId?: true
    engagementType?: true
    activityType?: true
    description?: true
    metadata?: true
    recordedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PatientEngagementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientEngagement to aggregate.
     */
    where?: PatientEngagementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientEngagements to fetch.
     */
    orderBy?: PatientEngagementOrderByWithRelationInput | PatientEngagementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientEngagementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientEngagements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientEngagements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientEngagements
    **/
    _count?: true | PatientEngagementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientEngagementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientEngagementMaxAggregateInputType
  }

  export type GetPatientEngagementAggregateType<T extends PatientEngagementAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientEngagement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientEngagement[P]>
      : GetScalarType<T[P], AggregatePatientEngagement[P]>
  }




  export type PatientEngagementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientEngagementWhereInput
    orderBy?: PatientEngagementOrderByWithAggregationInput | PatientEngagementOrderByWithAggregationInput[]
    by: PatientEngagementScalarFieldEnum[] | PatientEngagementScalarFieldEnum
    having?: PatientEngagementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientEngagementCountAggregateInputType | true
    _min?: PatientEngagementMinAggregateInputType
    _max?: PatientEngagementMaxAggregateInputType
  }

  export type PatientEngagementGroupByOutputType = {
    id: string
    patientId: string
    carePlanId: string | null
    engagementType: $Enums.EngagementType
    activityType: string
    description: string | null
    metadata: JsonValue | null
    recordedAt: Date
    createdAt: Date
    _count: PatientEngagementCountAggregateOutputType | null
    _min: PatientEngagementMinAggregateOutputType | null
    _max: PatientEngagementMaxAggregateOutputType | null
  }

  type GetPatientEngagementGroupByPayload<T extends PatientEngagementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientEngagementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientEngagementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientEngagementGroupByOutputType[P]>
            : GetScalarType<T[P], PatientEngagementGroupByOutputType[P]>
        }
      >
    >


  export type PatientEngagementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    engagementType?: boolean
    activityType?: boolean
    description?: boolean
    metadata?: boolean
    recordedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["patientEngagement"]>

  export type PatientEngagementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    engagementType?: boolean
    activityType?: boolean
    description?: boolean
    metadata?: boolean
    recordedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["patientEngagement"]>

  export type PatientEngagementSelectScalar = {
    id?: boolean
    patientId?: boolean
    carePlanId?: boolean
    engagementType?: boolean
    activityType?: boolean
    description?: boolean
    metadata?: boolean
    recordedAt?: boolean
    createdAt?: boolean
  }


  export type $PatientEngagementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientEngagement"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      carePlanId: string | null
      engagementType: $Enums.EngagementType
      activityType: string
      description: string | null
      metadata: Prisma.JsonValue | null
      recordedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["patientEngagement"]>
    composites: {}
  }

  type PatientEngagementGetPayload<S extends boolean | null | undefined | PatientEngagementDefaultArgs> = $Result.GetResult<Prisma.$PatientEngagementPayload, S>

  type PatientEngagementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientEngagementFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientEngagementCountAggregateInputType | true
    }

  export interface PatientEngagementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientEngagement'], meta: { name: 'PatientEngagement' } }
    /**
     * Find zero or one PatientEngagement that matches the filter.
     * @param {PatientEngagementFindUniqueArgs} args - Arguments to find a PatientEngagement
     * @example
     * // Get one PatientEngagement
     * const patientEngagement = await prisma.patientEngagement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientEngagementFindUniqueArgs>(args: SelectSubset<T, PatientEngagementFindUniqueArgs<ExtArgs>>): Prisma__PatientEngagementClient<$Result.GetResult<Prisma.$PatientEngagementPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PatientEngagement that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientEngagementFindUniqueOrThrowArgs} args - Arguments to find a PatientEngagement
     * @example
     * // Get one PatientEngagement
     * const patientEngagement = await prisma.patientEngagement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientEngagementFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientEngagementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientEngagementClient<$Result.GetResult<Prisma.$PatientEngagementPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PatientEngagement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementFindFirstArgs} args - Arguments to find a PatientEngagement
     * @example
     * // Get one PatientEngagement
     * const patientEngagement = await prisma.patientEngagement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientEngagementFindFirstArgs>(args?: SelectSubset<T, PatientEngagementFindFirstArgs<ExtArgs>>): Prisma__PatientEngagementClient<$Result.GetResult<Prisma.$PatientEngagementPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PatientEngagement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementFindFirstOrThrowArgs} args - Arguments to find a PatientEngagement
     * @example
     * // Get one PatientEngagement
     * const patientEngagement = await prisma.patientEngagement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientEngagementFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientEngagementFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientEngagementClient<$Result.GetResult<Prisma.$PatientEngagementPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PatientEngagements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientEngagements
     * const patientEngagements = await prisma.patientEngagement.findMany()
     * 
     * // Get first 10 PatientEngagements
     * const patientEngagements = await prisma.patientEngagement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientEngagementWithIdOnly = await prisma.patientEngagement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientEngagementFindManyArgs>(args?: SelectSubset<T, PatientEngagementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientEngagementPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PatientEngagement.
     * @param {PatientEngagementCreateArgs} args - Arguments to create a PatientEngagement.
     * @example
     * // Create one PatientEngagement
     * const PatientEngagement = await prisma.patientEngagement.create({
     *   data: {
     *     // ... data to create a PatientEngagement
     *   }
     * })
     * 
     */
    create<T extends PatientEngagementCreateArgs>(args: SelectSubset<T, PatientEngagementCreateArgs<ExtArgs>>): Prisma__PatientEngagementClient<$Result.GetResult<Prisma.$PatientEngagementPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PatientEngagements.
     * @param {PatientEngagementCreateManyArgs} args - Arguments to create many PatientEngagements.
     * @example
     * // Create many PatientEngagements
     * const patientEngagement = await prisma.patientEngagement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientEngagementCreateManyArgs>(args?: SelectSubset<T, PatientEngagementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientEngagements and returns the data saved in the database.
     * @param {PatientEngagementCreateManyAndReturnArgs} args - Arguments to create many PatientEngagements.
     * @example
     * // Create many PatientEngagements
     * const patientEngagement = await prisma.patientEngagement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientEngagements and only return the `id`
     * const patientEngagementWithIdOnly = await prisma.patientEngagement.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientEngagementCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientEngagementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientEngagementPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PatientEngagement.
     * @param {PatientEngagementDeleteArgs} args - Arguments to delete one PatientEngagement.
     * @example
     * // Delete one PatientEngagement
     * const PatientEngagement = await prisma.patientEngagement.delete({
     *   where: {
     *     // ... filter to delete one PatientEngagement
     *   }
     * })
     * 
     */
    delete<T extends PatientEngagementDeleteArgs>(args: SelectSubset<T, PatientEngagementDeleteArgs<ExtArgs>>): Prisma__PatientEngagementClient<$Result.GetResult<Prisma.$PatientEngagementPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PatientEngagement.
     * @param {PatientEngagementUpdateArgs} args - Arguments to update one PatientEngagement.
     * @example
     * // Update one PatientEngagement
     * const patientEngagement = await prisma.patientEngagement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientEngagementUpdateArgs>(args: SelectSubset<T, PatientEngagementUpdateArgs<ExtArgs>>): Prisma__PatientEngagementClient<$Result.GetResult<Prisma.$PatientEngagementPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PatientEngagements.
     * @param {PatientEngagementDeleteManyArgs} args - Arguments to filter PatientEngagements to delete.
     * @example
     * // Delete a few PatientEngagements
     * const { count } = await prisma.patientEngagement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientEngagementDeleteManyArgs>(args?: SelectSubset<T, PatientEngagementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientEngagements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientEngagements
     * const patientEngagement = await prisma.patientEngagement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientEngagementUpdateManyArgs>(args: SelectSubset<T, PatientEngagementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PatientEngagement.
     * @param {PatientEngagementUpsertArgs} args - Arguments to update or create a PatientEngagement.
     * @example
     * // Update or create a PatientEngagement
     * const patientEngagement = await prisma.patientEngagement.upsert({
     *   create: {
     *     // ... data to create a PatientEngagement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientEngagement we want to update
     *   }
     * })
     */
    upsert<T extends PatientEngagementUpsertArgs>(args: SelectSubset<T, PatientEngagementUpsertArgs<ExtArgs>>): Prisma__PatientEngagementClient<$Result.GetResult<Prisma.$PatientEngagementPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PatientEngagements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementCountArgs} args - Arguments to filter PatientEngagements to count.
     * @example
     * // Count the number of PatientEngagements
     * const count = await prisma.patientEngagement.count({
     *   where: {
     *     // ... the filter for the PatientEngagements we want to count
     *   }
     * })
    **/
    count<T extends PatientEngagementCountArgs>(
      args?: Subset<T, PatientEngagementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientEngagementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientEngagement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PatientEngagementAggregateArgs>(args: Subset<T, PatientEngagementAggregateArgs>): Prisma.PrismaPromise<GetPatientEngagementAggregateType<T>>

    /**
     * Group by PatientEngagement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementGroupByArgs} args - Group by arguments.
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
      T extends PatientEngagementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientEngagementGroupByArgs['orderBy'] }
        : { orderBy?: PatientEngagementGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PatientEngagementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientEngagementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientEngagement model
   */
  readonly fields: PatientEngagementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientEngagement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientEngagementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the PatientEngagement model
   */ 
  interface PatientEngagementFieldRefs {
    readonly id: FieldRef<"PatientEngagement", 'String'>
    readonly patientId: FieldRef<"PatientEngagement", 'String'>
    readonly carePlanId: FieldRef<"PatientEngagement", 'String'>
    readonly engagementType: FieldRef<"PatientEngagement", 'EngagementType'>
    readonly activityType: FieldRef<"PatientEngagement", 'String'>
    readonly description: FieldRef<"PatientEngagement", 'String'>
    readonly metadata: FieldRef<"PatientEngagement", 'Json'>
    readonly recordedAt: FieldRef<"PatientEngagement", 'DateTime'>
    readonly createdAt: FieldRef<"PatientEngagement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PatientEngagement findUnique
   */
  export type PatientEngagementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagement
     */
    select?: PatientEngagementSelect<ExtArgs> | null
    /**
     * Filter, which PatientEngagement to fetch.
     */
    where: PatientEngagementWhereUniqueInput
  }

  /**
   * PatientEngagement findUniqueOrThrow
   */
  export type PatientEngagementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagement
     */
    select?: PatientEngagementSelect<ExtArgs> | null
    /**
     * Filter, which PatientEngagement to fetch.
     */
    where: PatientEngagementWhereUniqueInput
  }

  /**
   * PatientEngagement findFirst
   */
  export type PatientEngagementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagement
     */
    select?: PatientEngagementSelect<ExtArgs> | null
    /**
     * Filter, which PatientEngagement to fetch.
     */
    where?: PatientEngagementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientEngagements to fetch.
     */
    orderBy?: PatientEngagementOrderByWithRelationInput | PatientEngagementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientEngagements.
     */
    cursor?: PatientEngagementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientEngagements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientEngagements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientEngagements.
     */
    distinct?: PatientEngagementScalarFieldEnum | PatientEngagementScalarFieldEnum[]
  }

  /**
   * PatientEngagement findFirstOrThrow
   */
  export type PatientEngagementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagement
     */
    select?: PatientEngagementSelect<ExtArgs> | null
    /**
     * Filter, which PatientEngagement to fetch.
     */
    where?: PatientEngagementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientEngagements to fetch.
     */
    orderBy?: PatientEngagementOrderByWithRelationInput | PatientEngagementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientEngagements.
     */
    cursor?: PatientEngagementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientEngagements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientEngagements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientEngagements.
     */
    distinct?: PatientEngagementScalarFieldEnum | PatientEngagementScalarFieldEnum[]
  }

  /**
   * PatientEngagement findMany
   */
  export type PatientEngagementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagement
     */
    select?: PatientEngagementSelect<ExtArgs> | null
    /**
     * Filter, which PatientEngagements to fetch.
     */
    where?: PatientEngagementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientEngagements to fetch.
     */
    orderBy?: PatientEngagementOrderByWithRelationInput | PatientEngagementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientEngagements.
     */
    cursor?: PatientEngagementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientEngagements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientEngagements.
     */
    skip?: number
    distinct?: PatientEngagementScalarFieldEnum | PatientEngagementScalarFieldEnum[]
  }

  /**
   * PatientEngagement create
   */
  export type PatientEngagementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagement
     */
    select?: PatientEngagementSelect<ExtArgs> | null
    /**
     * The data needed to create a PatientEngagement.
     */
    data: XOR<PatientEngagementCreateInput, PatientEngagementUncheckedCreateInput>
  }

  /**
   * PatientEngagement createMany
   */
  export type PatientEngagementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientEngagements.
     */
    data: PatientEngagementCreateManyInput | PatientEngagementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientEngagement createManyAndReturn
   */
  export type PatientEngagementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagement
     */
    select?: PatientEngagementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PatientEngagements.
     */
    data: PatientEngagementCreateManyInput | PatientEngagementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientEngagement update
   */
  export type PatientEngagementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagement
     */
    select?: PatientEngagementSelect<ExtArgs> | null
    /**
     * The data needed to update a PatientEngagement.
     */
    data: XOR<PatientEngagementUpdateInput, PatientEngagementUncheckedUpdateInput>
    /**
     * Choose, which PatientEngagement to update.
     */
    where: PatientEngagementWhereUniqueInput
  }

  /**
   * PatientEngagement updateMany
   */
  export type PatientEngagementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientEngagements.
     */
    data: XOR<PatientEngagementUpdateManyMutationInput, PatientEngagementUncheckedUpdateManyInput>
    /**
     * Filter which PatientEngagements to update
     */
    where?: PatientEngagementWhereInput
  }

  /**
   * PatientEngagement upsert
   */
  export type PatientEngagementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagement
     */
    select?: PatientEngagementSelect<ExtArgs> | null
    /**
     * The filter to search for the PatientEngagement to update in case it exists.
     */
    where: PatientEngagementWhereUniqueInput
    /**
     * In case the PatientEngagement found by the `where` argument doesn't exist, create a new PatientEngagement with this data.
     */
    create: XOR<PatientEngagementCreateInput, PatientEngagementUncheckedCreateInput>
    /**
     * In case the PatientEngagement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientEngagementUpdateInput, PatientEngagementUncheckedUpdateInput>
  }

  /**
   * PatientEngagement delete
   */
  export type PatientEngagementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagement
     */
    select?: PatientEngagementSelect<ExtArgs> | null
    /**
     * Filter which PatientEngagement to delete.
     */
    where: PatientEngagementWhereUniqueInput
  }

  /**
   * PatientEngagement deleteMany
   */
  export type PatientEngagementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientEngagements to delete
     */
    where?: PatientEngagementWhereInput
  }

  /**
   * PatientEngagement without action
   */
  export type PatientEngagementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagement
     */
    select?: PatientEngagementSelect<ExtArgs> | null
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


  export const CarePlanScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    providerId: 'providerId',
    condition: 'condition',
    status: 'status',
    startDate: 'startDate',
    endDate: 'endDate',
    goals: 'goals',
    interventions: 'interventions',
    reviewSchedule: 'reviewSchedule',
    nextReviewDate: 'nextReviewDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CarePlanScalarFieldEnum = (typeof CarePlanScalarFieldEnum)[keyof typeof CarePlanScalarFieldEnum]


  export const CareTaskScalarFieldEnum: {
    id: 'id',
    carePlanId: 'carePlanId',
    title: 'title',
    description: 'description',
    taskType: 'taskType',
    frequency: 'frequency',
    dueDate: 'dueDate',
    completedAt: 'completedAt',
    status: 'status',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CareTaskScalarFieldEnum = (typeof CareTaskScalarFieldEnum)[keyof typeof CareTaskScalarFieldEnum]


  export const MonitoringDeviceScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    deviceType: 'deviceType',
    manufacturer: 'manufacturer',
    model: 'model',
    serialNumber: 'serialNumber',
    status: 'status',
    lastSyncAt: 'lastSyncAt',
    batteryLevel: 'batteryLevel',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MonitoringDeviceScalarFieldEnum = (typeof MonitoringDeviceScalarFieldEnum)[keyof typeof MonitoringDeviceScalarFieldEnum]


  export const VitalReadingScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    carePlanId: 'carePlanId',
    deviceId: 'deviceId',
    vitalType: 'vitalType',
    value: 'value',
    unit: 'unit',
    isAbnormal: 'isAbnormal',
    notes: 'notes',
    recordedAt: 'recordedAt',
    createdAt: 'createdAt'
  };

  export type VitalReadingScalarFieldEnum = (typeof VitalReadingScalarFieldEnum)[keyof typeof VitalReadingScalarFieldEnum]


  export const AlertScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    carePlanId: 'carePlanId',
    alertType: 'alertType',
    severity: 'severity',
    title: 'title',
    description: 'description',
    status: 'status',
    acknowledgedBy: 'acknowledgedBy',
    acknowledgedAt: 'acknowledgedAt',
    resolvedAt: 'resolvedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AlertScalarFieldEnum = (typeof AlertScalarFieldEnum)[keyof typeof AlertScalarFieldEnum]


  export const GoalScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    carePlanId: 'carePlanId',
    title: 'title',
    description: 'description',
    goalType: 'goalType',
    targetValue: 'targetValue',
    targetUnit: 'targetUnit',
    targetDate: 'targetDate',
    frequency: 'frequency',
    status: 'status',
    completedAt: 'completedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GoalScalarFieldEnum = (typeof GoalScalarFieldEnum)[keyof typeof GoalScalarFieldEnum]


  export const GoalProgressScalarFieldEnum: {
    id: 'id',
    goalId: 'goalId',
    value: 'value',
    currentValue: 'currentValue',
    currentUnit: 'currentUnit',
    notes: 'notes',
    recordedAt: 'recordedAt',
    createdAt: 'createdAt'
  };

  export type GoalProgressScalarFieldEnum = (typeof GoalProgressScalarFieldEnum)[keyof typeof GoalProgressScalarFieldEnum]


  export const AlertThresholdScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    carePlanId: 'carePlanId',
    vitalType: 'vitalType',
    condition: 'condition',
    minValue: 'minValue',
    maxValue: 'maxValue',
    criticalMin: 'criticalMin',
    criticalMax: 'criticalMax',
    warningMin: 'warningMin',
    warningMax: 'warningMax',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AlertThresholdScalarFieldEnum = (typeof AlertThresholdScalarFieldEnum)[keyof typeof AlertThresholdScalarFieldEnum]


  export const CarePlanTemplateScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    condition: 'condition',
    goals: 'goals',
    interventions: 'interventions',
    tasks: 'tasks',
    reviewSchedule: 'reviewSchedule',
    thresholds: 'thresholds',
    version: 'version',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CarePlanTemplateScalarFieldEnum = (typeof CarePlanTemplateScalarFieldEnum)[keyof typeof CarePlanTemplateScalarFieldEnum]


  export const PatientEngagementScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    carePlanId: 'carePlanId',
    engagementType: 'engagementType',
    activityType: 'activityType',
    description: 'description',
    metadata: 'metadata',
    recordedAt: 'recordedAt',
    createdAt: 'createdAt'
  };

  export type PatientEngagementScalarFieldEnum = (typeof PatientEngagementScalarFieldEnum)[keyof typeof PatientEngagementScalarFieldEnum]


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
   * Reference to a field of type 'PlanStatus'
   */
  export type EnumPlanStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanStatus'>
    


  /**
   * Reference to a field of type 'PlanStatus[]'
   */
  export type ListEnumPlanStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'TaskType'
   */
  export type EnumTaskTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskType'>
    


  /**
   * Reference to a field of type 'TaskType[]'
   */
  export type ListEnumTaskTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskType[]'>
    


  /**
   * Reference to a field of type 'TaskStatus'
   */
  export type EnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus'>
    


  /**
   * Reference to a field of type 'TaskStatus[]'
   */
  export type ListEnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus[]'>
    


  /**
   * Reference to a field of type 'DeviceType'
   */
  export type EnumDeviceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeviceType'>
    


  /**
   * Reference to a field of type 'DeviceType[]'
   */
  export type ListEnumDeviceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeviceType[]'>
    


  /**
   * Reference to a field of type 'DeviceStatus'
   */
  export type EnumDeviceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeviceStatus'>
    


  /**
   * Reference to a field of type 'DeviceStatus[]'
   */
  export type ListEnumDeviceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeviceStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'VitalType'
   */
  export type EnumVitalTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VitalType'>
    


  /**
   * Reference to a field of type 'VitalType[]'
   */
  export type ListEnumVitalTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VitalType[]'>
    


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
   * Reference to a field of type 'AlertType'
   */
  export type EnumAlertTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertType'>
    


  /**
   * Reference to a field of type 'AlertType[]'
   */
  export type ListEnumAlertTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertType[]'>
    


  /**
   * Reference to a field of type 'AlertSeverity'
   */
  export type EnumAlertSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertSeverity'>
    


  /**
   * Reference to a field of type 'AlertSeverity[]'
   */
  export type ListEnumAlertSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertSeverity[]'>
    


  /**
   * Reference to a field of type 'AlertStatus'
   */
  export type EnumAlertStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertStatus'>
    


  /**
   * Reference to a field of type 'AlertStatus[]'
   */
  export type ListEnumAlertStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertStatus[]'>
    


  /**
   * Reference to a field of type 'GoalType'
   */
  export type EnumGoalTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GoalType'>
    


  /**
   * Reference to a field of type 'GoalType[]'
   */
  export type ListEnumGoalTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GoalType[]'>
    


  /**
   * Reference to a field of type 'GoalStatus'
   */
  export type EnumGoalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GoalStatus'>
    


  /**
   * Reference to a field of type 'GoalStatus[]'
   */
  export type ListEnumGoalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GoalStatus[]'>
    


  /**
   * Reference to a field of type 'EngagementType'
   */
  export type EnumEngagementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EngagementType'>
    


  /**
   * Reference to a field of type 'EngagementType[]'
   */
  export type ListEnumEngagementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EngagementType[]'>
    
  /**
   * Deep Input Types
   */


  export type CarePlanWhereInput = {
    AND?: CarePlanWhereInput | CarePlanWhereInput[]
    OR?: CarePlanWhereInput[]
    NOT?: CarePlanWhereInput | CarePlanWhereInput[]
    id?: StringFilter<"CarePlan"> | string
    patientId?: StringFilter<"CarePlan"> | string
    providerId?: StringFilter<"CarePlan"> | string
    condition?: StringFilter<"CarePlan"> | string
    status?: EnumPlanStatusFilter<"CarePlan"> | $Enums.PlanStatus
    startDate?: DateTimeFilter<"CarePlan"> | Date | string
    endDate?: DateTimeNullableFilter<"CarePlan"> | Date | string | null
    goals?: JsonFilter<"CarePlan">
    interventions?: JsonFilter<"CarePlan">
    reviewSchedule?: StringNullableFilter<"CarePlan"> | string | null
    nextReviewDate?: DateTimeNullableFilter<"CarePlan"> | Date | string | null
    createdAt?: DateTimeFilter<"CarePlan"> | Date | string
    updatedAt?: DateTimeFilter<"CarePlan"> | Date | string
    tasks?: CareTaskListRelationFilter
    vitals?: VitalReadingListRelationFilter
    alerts?: AlertListRelationFilter
  }

  export type CarePlanOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    condition?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    goals?: SortOrder
    interventions?: SortOrder
    reviewSchedule?: SortOrderInput | SortOrder
    nextReviewDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tasks?: CareTaskOrderByRelationAggregateInput
    vitals?: VitalReadingOrderByRelationAggregateInput
    alerts?: AlertOrderByRelationAggregateInput
  }

  export type CarePlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CarePlanWhereInput | CarePlanWhereInput[]
    OR?: CarePlanWhereInput[]
    NOT?: CarePlanWhereInput | CarePlanWhereInput[]
    patientId?: StringFilter<"CarePlan"> | string
    providerId?: StringFilter<"CarePlan"> | string
    condition?: StringFilter<"CarePlan"> | string
    status?: EnumPlanStatusFilter<"CarePlan"> | $Enums.PlanStatus
    startDate?: DateTimeFilter<"CarePlan"> | Date | string
    endDate?: DateTimeNullableFilter<"CarePlan"> | Date | string | null
    goals?: JsonFilter<"CarePlan">
    interventions?: JsonFilter<"CarePlan">
    reviewSchedule?: StringNullableFilter<"CarePlan"> | string | null
    nextReviewDate?: DateTimeNullableFilter<"CarePlan"> | Date | string | null
    createdAt?: DateTimeFilter<"CarePlan"> | Date | string
    updatedAt?: DateTimeFilter<"CarePlan"> | Date | string
    tasks?: CareTaskListRelationFilter
    vitals?: VitalReadingListRelationFilter
    alerts?: AlertListRelationFilter
  }, "id">

  export type CarePlanOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    condition?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    goals?: SortOrder
    interventions?: SortOrder
    reviewSchedule?: SortOrderInput | SortOrder
    nextReviewDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CarePlanCountOrderByAggregateInput
    _max?: CarePlanMaxOrderByAggregateInput
    _min?: CarePlanMinOrderByAggregateInput
  }

  export type CarePlanScalarWhereWithAggregatesInput = {
    AND?: CarePlanScalarWhereWithAggregatesInput | CarePlanScalarWhereWithAggregatesInput[]
    OR?: CarePlanScalarWhereWithAggregatesInput[]
    NOT?: CarePlanScalarWhereWithAggregatesInput | CarePlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CarePlan"> | string
    patientId?: StringWithAggregatesFilter<"CarePlan"> | string
    providerId?: StringWithAggregatesFilter<"CarePlan"> | string
    condition?: StringWithAggregatesFilter<"CarePlan"> | string
    status?: EnumPlanStatusWithAggregatesFilter<"CarePlan"> | $Enums.PlanStatus
    startDate?: DateTimeWithAggregatesFilter<"CarePlan"> | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter<"CarePlan"> | Date | string | null
    goals?: JsonWithAggregatesFilter<"CarePlan">
    interventions?: JsonWithAggregatesFilter<"CarePlan">
    reviewSchedule?: StringNullableWithAggregatesFilter<"CarePlan"> | string | null
    nextReviewDate?: DateTimeNullableWithAggregatesFilter<"CarePlan"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CarePlan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CarePlan"> | Date | string
  }

  export type CareTaskWhereInput = {
    AND?: CareTaskWhereInput | CareTaskWhereInput[]
    OR?: CareTaskWhereInput[]
    NOT?: CareTaskWhereInput | CareTaskWhereInput[]
    id?: StringFilter<"CareTask"> | string
    carePlanId?: StringFilter<"CareTask"> | string
    title?: StringFilter<"CareTask"> | string
    description?: StringNullableFilter<"CareTask"> | string | null
    taskType?: EnumTaskTypeFilter<"CareTask"> | $Enums.TaskType
    frequency?: StringFilter<"CareTask"> | string
    dueDate?: DateTimeNullableFilter<"CareTask"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"CareTask"> | Date | string | null
    status?: EnumTaskStatusFilter<"CareTask"> | $Enums.TaskStatus
    notes?: StringNullableFilter<"CareTask"> | string | null
    createdAt?: DateTimeFilter<"CareTask"> | Date | string
    updatedAt?: DateTimeFilter<"CareTask"> | Date | string
    carePlan?: XOR<CarePlanRelationFilter, CarePlanWhereInput>
  }

  export type CareTaskOrderByWithRelationInput = {
    id?: SortOrder
    carePlanId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    taskType?: SortOrder
    frequency?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    carePlan?: CarePlanOrderByWithRelationInput
  }

  export type CareTaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CareTaskWhereInput | CareTaskWhereInput[]
    OR?: CareTaskWhereInput[]
    NOT?: CareTaskWhereInput | CareTaskWhereInput[]
    carePlanId?: StringFilter<"CareTask"> | string
    title?: StringFilter<"CareTask"> | string
    description?: StringNullableFilter<"CareTask"> | string | null
    taskType?: EnumTaskTypeFilter<"CareTask"> | $Enums.TaskType
    frequency?: StringFilter<"CareTask"> | string
    dueDate?: DateTimeNullableFilter<"CareTask"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"CareTask"> | Date | string | null
    status?: EnumTaskStatusFilter<"CareTask"> | $Enums.TaskStatus
    notes?: StringNullableFilter<"CareTask"> | string | null
    createdAt?: DateTimeFilter<"CareTask"> | Date | string
    updatedAt?: DateTimeFilter<"CareTask"> | Date | string
    carePlan?: XOR<CarePlanRelationFilter, CarePlanWhereInput>
  }, "id">

  export type CareTaskOrderByWithAggregationInput = {
    id?: SortOrder
    carePlanId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    taskType?: SortOrder
    frequency?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CareTaskCountOrderByAggregateInput
    _max?: CareTaskMaxOrderByAggregateInput
    _min?: CareTaskMinOrderByAggregateInput
  }

  export type CareTaskScalarWhereWithAggregatesInput = {
    AND?: CareTaskScalarWhereWithAggregatesInput | CareTaskScalarWhereWithAggregatesInput[]
    OR?: CareTaskScalarWhereWithAggregatesInput[]
    NOT?: CareTaskScalarWhereWithAggregatesInput | CareTaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CareTask"> | string
    carePlanId?: StringWithAggregatesFilter<"CareTask"> | string
    title?: StringWithAggregatesFilter<"CareTask"> | string
    description?: StringNullableWithAggregatesFilter<"CareTask"> | string | null
    taskType?: EnumTaskTypeWithAggregatesFilter<"CareTask"> | $Enums.TaskType
    frequency?: StringWithAggregatesFilter<"CareTask"> | string
    dueDate?: DateTimeNullableWithAggregatesFilter<"CareTask"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"CareTask"> | Date | string | null
    status?: EnumTaskStatusWithAggregatesFilter<"CareTask"> | $Enums.TaskStatus
    notes?: StringNullableWithAggregatesFilter<"CareTask"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CareTask"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CareTask"> | Date | string
  }

  export type MonitoringDeviceWhereInput = {
    AND?: MonitoringDeviceWhereInput | MonitoringDeviceWhereInput[]
    OR?: MonitoringDeviceWhereInput[]
    NOT?: MonitoringDeviceWhereInput | MonitoringDeviceWhereInput[]
    id?: StringFilter<"MonitoringDevice"> | string
    patientId?: StringFilter<"MonitoringDevice"> | string
    deviceType?: EnumDeviceTypeFilter<"MonitoringDevice"> | $Enums.DeviceType
    manufacturer?: StringNullableFilter<"MonitoringDevice"> | string | null
    model?: StringNullableFilter<"MonitoringDevice"> | string | null
    serialNumber?: StringFilter<"MonitoringDevice"> | string
    status?: EnumDeviceStatusFilter<"MonitoringDevice"> | $Enums.DeviceStatus
    lastSyncAt?: DateTimeNullableFilter<"MonitoringDevice"> | Date | string | null
    batteryLevel?: IntNullableFilter<"MonitoringDevice"> | number | null
    createdAt?: DateTimeFilter<"MonitoringDevice"> | Date | string
    updatedAt?: DateTimeFilter<"MonitoringDevice"> | Date | string
    readings?: VitalReadingListRelationFilter
  }

  export type MonitoringDeviceOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    deviceType?: SortOrder
    manufacturer?: SortOrderInput | SortOrder
    model?: SortOrderInput | SortOrder
    serialNumber?: SortOrder
    status?: SortOrder
    lastSyncAt?: SortOrderInput | SortOrder
    batteryLevel?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    readings?: VitalReadingOrderByRelationAggregateInput
  }

  export type MonitoringDeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    serialNumber?: string
    AND?: MonitoringDeviceWhereInput | MonitoringDeviceWhereInput[]
    OR?: MonitoringDeviceWhereInput[]
    NOT?: MonitoringDeviceWhereInput | MonitoringDeviceWhereInput[]
    patientId?: StringFilter<"MonitoringDevice"> | string
    deviceType?: EnumDeviceTypeFilter<"MonitoringDevice"> | $Enums.DeviceType
    manufacturer?: StringNullableFilter<"MonitoringDevice"> | string | null
    model?: StringNullableFilter<"MonitoringDevice"> | string | null
    status?: EnumDeviceStatusFilter<"MonitoringDevice"> | $Enums.DeviceStatus
    lastSyncAt?: DateTimeNullableFilter<"MonitoringDevice"> | Date | string | null
    batteryLevel?: IntNullableFilter<"MonitoringDevice"> | number | null
    createdAt?: DateTimeFilter<"MonitoringDevice"> | Date | string
    updatedAt?: DateTimeFilter<"MonitoringDevice"> | Date | string
    readings?: VitalReadingListRelationFilter
  }, "id" | "serialNumber">

  export type MonitoringDeviceOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    deviceType?: SortOrder
    manufacturer?: SortOrderInput | SortOrder
    model?: SortOrderInput | SortOrder
    serialNumber?: SortOrder
    status?: SortOrder
    lastSyncAt?: SortOrderInput | SortOrder
    batteryLevel?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MonitoringDeviceCountOrderByAggregateInput
    _avg?: MonitoringDeviceAvgOrderByAggregateInput
    _max?: MonitoringDeviceMaxOrderByAggregateInput
    _min?: MonitoringDeviceMinOrderByAggregateInput
    _sum?: MonitoringDeviceSumOrderByAggregateInput
  }

  export type MonitoringDeviceScalarWhereWithAggregatesInput = {
    AND?: MonitoringDeviceScalarWhereWithAggregatesInput | MonitoringDeviceScalarWhereWithAggregatesInput[]
    OR?: MonitoringDeviceScalarWhereWithAggregatesInput[]
    NOT?: MonitoringDeviceScalarWhereWithAggregatesInput | MonitoringDeviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MonitoringDevice"> | string
    patientId?: StringWithAggregatesFilter<"MonitoringDevice"> | string
    deviceType?: EnumDeviceTypeWithAggregatesFilter<"MonitoringDevice"> | $Enums.DeviceType
    manufacturer?: StringNullableWithAggregatesFilter<"MonitoringDevice"> | string | null
    model?: StringNullableWithAggregatesFilter<"MonitoringDevice"> | string | null
    serialNumber?: StringWithAggregatesFilter<"MonitoringDevice"> | string
    status?: EnumDeviceStatusWithAggregatesFilter<"MonitoringDevice"> | $Enums.DeviceStatus
    lastSyncAt?: DateTimeNullableWithAggregatesFilter<"MonitoringDevice"> | Date | string | null
    batteryLevel?: IntNullableWithAggregatesFilter<"MonitoringDevice"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"MonitoringDevice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MonitoringDevice"> | Date | string
  }

  export type VitalReadingWhereInput = {
    AND?: VitalReadingWhereInput | VitalReadingWhereInput[]
    OR?: VitalReadingWhereInput[]
    NOT?: VitalReadingWhereInput | VitalReadingWhereInput[]
    id?: StringFilter<"VitalReading"> | string
    patientId?: StringFilter<"VitalReading"> | string
    carePlanId?: StringNullableFilter<"VitalReading"> | string | null
    deviceId?: StringNullableFilter<"VitalReading"> | string | null
    vitalType?: EnumVitalTypeFilter<"VitalReading"> | $Enums.VitalType
    value?: FloatFilter<"VitalReading"> | number
    unit?: StringFilter<"VitalReading"> | string
    isAbnormal?: BoolFilter<"VitalReading"> | boolean
    notes?: StringNullableFilter<"VitalReading"> | string | null
    recordedAt?: DateTimeFilter<"VitalReading"> | Date | string
    createdAt?: DateTimeFilter<"VitalReading"> | Date | string
    carePlan?: XOR<CarePlanNullableRelationFilter, CarePlanWhereInput> | null
    device?: XOR<MonitoringDeviceNullableRelationFilter, MonitoringDeviceWhereInput> | null
  }

  export type VitalReadingOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrderInput | SortOrder
    deviceId?: SortOrderInput | SortOrder
    vitalType?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    isAbnormal?: SortOrder
    notes?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
    carePlan?: CarePlanOrderByWithRelationInput
    device?: MonitoringDeviceOrderByWithRelationInput
  }

  export type VitalReadingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VitalReadingWhereInput | VitalReadingWhereInput[]
    OR?: VitalReadingWhereInput[]
    NOT?: VitalReadingWhereInput | VitalReadingWhereInput[]
    patientId?: StringFilter<"VitalReading"> | string
    carePlanId?: StringNullableFilter<"VitalReading"> | string | null
    deviceId?: StringNullableFilter<"VitalReading"> | string | null
    vitalType?: EnumVitalTypeFilter<"VitalReading"> | $Enums.VitalType
    value?: FloatFilter<"VitalReading"> | number
    unit?: StringFilter<"VitalReading"> | string
    isAbnormal?: BoolFilter<"VitalReading"> | boolean
    notes?: StringNullableFilter<"VitalReading"> | string | null
    recordedAt?: DateTimeFilter<"VitalReading"> | Date | string
    createdAt?: DateTimeFilter<"VitalReading"> | Date | string
    carePlan?: XOR<CarePlanNullableRelationFilter, CarePlanWhereInput> | null
    device?: XOR<MonitoringDeviceNullableRelationFilter, MonitoringDeviceWhereInput> | null
  }, "id">

  export type VitalReadingOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrderInput | SortOrder
    deviceId?: SortOrderInput | SortOrder
    vitalType?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    isAbnormal?: SortOrder
    notes?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
    _count?: VitalReadingCountOrderByAggregateInput
    _avg?: VitalReadingAvgOrderByAggregateInput
    _max?: VitalReadingMaxOrderByAggregateInput
    _min?: VitalReadingMinOrderByAggregateInput
    _sum?: VitalReadingSumOrderByAggregateInput
  }

  export type VitalReadingScalarWhereWithAggregatesInput = {
    AND?: VitalReadingScalarWhereWithAggregatesInput | VitalReadingScalarWhereWithAggregatesInput[]
    OR?: VitalReadingScalarWhereWithAggregatesInput[]
    NOT?: VitalReadingScalarWhereWithAggregatesInput | VitalReadingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VitalReading"> | string
    patientId?: StringWithAggregatesFilter<"VitalReading"> | string
    carePlanId?: StringNullableWithAggregatesFilter<"VitalReading"> | string | null
    deviceId?: StringNullableWithAggregatesFilter<"VitalReading"> | string | null
    vitalType?: EnumVitalTypeWithAggregatesFilter<"VitalReading"> | $Enums.VitalType
    value?: FloatWithAggregatesFilter<"VitalReading"> | number
    unit?: StringWithAggregatesFilter<"VitalReading"> | string
    isAbnormal?: BoolWithAggregatesFilter<"VitalReading"> | boolean
    notes?: StringNullableWithAggregatesFilter<"VitalReading"> | string | null
    recordedAt?: DateTimeWithAggregatesFilter<"VitalReading"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"VitalReading"> | Date | string
  }

  export type AlertWhereInput = {
    AND?: AlertWhereInput | AlertWhereInput[]
    OR?: AlertWhereInput[]
    NOT?: AlertWhereInput | AlertWhereInput[]
    id?: StringFilter<"Alert"> | string
    patientId?: StringFilter<"Alert"> | string
    carePlanId?: StringNullableFilter<"Alert"> | string | null
    alertType?: EnumAlertTypeFilter<"Alert"> | $Enums.AlertType
    severity?: EnumAlertSeverityFilter<"Alert"> | $Enums.AlertSeverity
    title?: StringFilter<"Alert"> | string
    description?: StringFilter<"Alert"> | string
    status?: EnumAlertStatusFilter<"Alert"> | $Enums.AlertStatus
    acknowledgedBy?: StringNullableFilter<"Alert"> | string | null
    acknowledgedAt?: DateTimeNullableFilter<"Alert"> | Date | string | null
    resolvedAt?: DateTimeNullableFilter<"Alert"> | Date | string | null
    createdAt?: DateTimeFilter<"Alert"> | Date | string
    updatedAt?: DateTimeFilter<"Alert"> | Date | string
    carePlan?: XOR<CarePlanNullableRelationFilter, CarePlanWhereInput> | null
  }

  export type AlertOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrderInput | SortOrder
    alertType?: SortOrder
    severity?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    acknowledgedBy?: SortOrderInput | SortOrder
    acknowledgedAt?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    carePlan?: CarePlanOrderByWithRelationInput
  }

  export type AlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AlertWhereInput | AlertWhereInput[]
    OR?: AlertWhereInput[]
    NOT?: AlertWhereInput | AlertWhereInput[]
    patientId?: StringFilter<"Alert"> | string
    carePlanId?: StringNullableFilter<"Alert"> | string | null
    alertType?: EnumAlertTypeFilter<"Alert"> | $Enums.AlertType
    severity?: EnumAlertSeverityFilter<"Alert"> | $Enums.AlertSeverity
    title?: StringFilter<"Alert"> | string
    description?: StringFilter<"Alert"> | string
    status?: EnumAlertStatusFilter<"Alert"> | $Enums.AlertStatus
    acknowledgedBy?: StringNullableFilter<"Alert"> | string | null
    acknowledgedAt?: DateTimeNullableFilter<"Alert"> | Date | string | null
    resolvedAt?: DateTimeNullableFilter<"Alert"> | Date | string | null
    createdAt?: DateTimeFilter<"Alert"> | Date | string
    updatedAt?: DateTimeFilter<"Alert"> | Date | string
    carePlan?: XOR<CarePlanNullableRelationFilter, CarePlanWhereInput> | null
  }, "id">

  export type AlertOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrderInput | SortOrder
    alertType?: SortOrder
    severity?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    acknowledgedBy?: SortOrderInput | SortOrder
    acknowledgedAt?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AlertCountOrderByAggregateInput
    _max?: AlertMaxOrderByAggregateInput
    _min?: AlertMinOrderByAggregateInput
  }

  export type AlertScalarWhereWithAggregatesInput = {
    AND?: AlertScalarWhereWithAggregatesInput | AlertScalarWhereWithAggregatesInput[]
    OR?: AlertScalarWhereWithAggregatesInput[]
    NOT?: AlertScalarWhereWithAggregatesInput | AlertScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Alert"> | string
    patientId?: StringWithAggregatesFilter<"Alert"> | string
    carePlanId?: StringNullableWithAggregatesFilter<"Alert"> | string | null
    alertType?: EnumAlertTypeWithAggregatesFilter<"Alert"> | $Enums.AlertType
    severity?: EnumAlertSeverityWithAggregatesFilter<"Alert"> | $Enums.AlertSeverity
    title?: StringWithAggregatesFilter<"Alert"> | string
    description?: StringWithAggregatesFilter<"Alert"> | string
    status?: EnumAlertStatusWithAggregatesFilter<"Alert"> | $Enums.AlertStatus
    acknowledgedBy?: StringNullableWithAggregatesFilter<"Alert"> | string | null
    acknowledgedAt?: DateTimeNullableWithAggregatesFilter<"Alert"> | Date | string | null
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"Alert"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Alert"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Alert"> | Date | string
  }

  export type GoalWhereInput = {
    AND?: GoalWhereInput | GoalWhereInput[]
    OR?: GoalWhereInput[]
    NOT?: GoalWhereInput | GoalWhereInput[]
    id?: StringFilter<"Goal"> | string
    patientId?: StringFilter<"Goal"> | string
    carePlanId?: StringNullableFilter<"Goal"> | string | null
    title?: StringFilter<"Goal"> | string
    description?: StringNullableFilter<"Goal"> | string | null
    goalType?: EnumGoalTypeFilter<"Goal"> | $Enums.GoalType
    targetValue?: FloatNullableFilter<"Goal"> | number | null
    targetUnit?: StringNullableFilter<"Goal"> | string | null
    targetDate?: DateTimeNullableFilter<"Goal"> | Date | string | null
    frequency?: StringNullableFilter<"Goal"> | string | null
    status?: EnumGoalStatusFilter<"Goal"> | $Enums.GoalStatus
    completedAt?: DateTimeNullableFilter<"Goal"> | Date | string | null
    createdAt?: DateTimeFilter<"Goal"> | Date | string
    updatedAt?: DateTimeFilter<"Goal"> | Date | string
    progress?: GoalProgressListRelationFilter
  }

  export type GoalOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    goalType?: SortOrder
    targetValue?: SortOrderInput | SortOrder
    targetUnit?: SortOrderInput | SortOrder
    targetDate?: SortOrderInput | SortOrder
    frequency?: SortOrderInput | SortOrder
    status?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    progress?: GoalProgressOrderByRelationAggregateInput
  }

  export type GoalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GoalWhereInput | GoalWhereInput[]
    OR?: GoalWhereInput[]
    NOT?: GoalWhereInput | GoalWhereInput[]
    patientId?: StringFilter<"Goal"> | string
    carePlanId?: StringNullableFilter<"Goal"> | string | null
    title?: StringFilter<"Goal"> | string
    description?: StringNullableFilter<"Goal"> | string | null
    goalType?: EnumGoalTypeFilter<"Goal"> | $Enums.GoalType
    targetValue?: FloatNullableFilter<"Goal"> | number | null
    targetUnit?: StringNullableFilter<"Goal"> | string | null
    targetDate?: DateTimeNullableFilter<"Goal"> | Date | string | null
    frequency?: StringNullableFilter<"Goal"> | string | null
    status?: EnumGoalStatusFilter<"Goal"> | $Enums.GoalStatus
    completedAt?: DateTimeNullableFilter<"Goal"> | Date | string | null
    createdAt?: DateTimeFilter<"Goal"> | Date | string
    updatedAt?: DateTimeFilter<"Goal"> | Date | string
    progress?: GoalProgressListRelationFilter
  }, "id">

  export type GoalOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    goalType?: SortOrder
    targetValue?: SortOrderInput | SortOrder
    targetUnit?: SortOrderInput | SortOrder
    targetDate?: SortOrderInput | SortOrder
    frequency?: SortOrderInput | SortOrder
    status?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GoalCountOrderByAggregateInput
    _avg?: GoalAvgOrderByAggregateInput
    _max?: GoalMaxOrderByAggregateInput
    _min?: GoalMinOrderByAggregateInput
    _sum?: GoalSumOrderByAggregateInput
  }

  export type GoalScalarWhereWithAggregatesInput = {
    AND?: GoalScalarWhereWithAggregatesInput | GoalScalarWhereWithAggregatesInput[]
    OR?: GoalScalarWhereWithAggregatesInput[]
    NOT?: GoalScalarWhereWithAggregatesInput | GoalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Goal"> | string
    patientId?: StringWithAggregatesFilter<"Goal"> | string
    carePlanId?: StringNullableWithAggregatesFilter<"Goal"> | string | null
    title?: StringWithAggregatesFilter<"Goal"> | string
    description?: StringNullableWithAggregatesFilter<"Goal"> | string | null
    goalType?: EnumGoalTypeWithAggregatesFilter<"Goal"> | $Enums.GoalType
    targetValue?: FloatNullableWithAggregatesFilter<"Goal"> | number | null
    targetUnit?: StringNullableWithAggregatesFilter<"Goal"> | string | null
    targetDate?: DateTimeNullableWithAggregatesFilter<"Goal"> | Date | string | null
    frequency?: StringNullableWithAggregatesFilter<"Goal"> | string | null
    status?: EnumGoalStatusWithAggregatesFilter<"Goal"> | $Enums.GoalStatus
    completedAt?: DateTimeNullableWithAggregatesFilter<"Goal"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Goal"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Goal"> | Date | string
  }

  export type GoalProgressWhereInput = {
    AND?: GoalProgressWhereInput | GoalProgressWhereInput[]
    OR?: GoalProgressWhereInput[]
    NOT?: GoalProgressWhereInput | GoalProgressWhereInput[]
    id?: StringFilter<"GoalProgress"> | string
    goalId?: StringFilter<"GoalProgress"> | string
    value?: FloatFilter<"GoalProgress"> | number
    currentValue?: FloatNullableFilter<"GoalProgress"> | number | null
    currentUnit?: StringNullableFilter<"GoalProgress"> | string | null
    notes?: StringNullableFilter<"GoalProgress"> | string | null
    recordedAt?: DateTimeFilter<"GoalProgress"> | Date | string
    createdAt?: DateTimeFilter<"GoalProgress"> | Date | string
    goal?: XOR<GoalRelationFilter, GoalWhereInput>
  }

  export type GoalProgressOrderByWithRelationInput = {
    id?: SortOrder
    goalId?: SortOrder
    value?: SortOrder
    currentValue?: SortOrderInput | SortOrder
    currentUnit?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
    goal?: GoalOrderByWithRelationInput
  }

  export type GoalProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GoalProgressWhereInput | GoalProgressWhereInput[]
    OR?: GoalProgressWhereInput[]
    NOT?: GoalProgressWhereInput | GoalProgressWhereInput[]
    goalId?: StringFilter<"GoalProgress"> | string
    value?: FloatFilter<"GoalProgress"> | number
    currentValue?: FloatNullableFilter<"GoalProgress"> | number | null
    currentUnit?: StringNullableFilter<"GoalProgress"> | string | null
    notes?: StringNullableFilter<"GoalProgress"> | string | null
    recordedAt?: DateTimeFilter<"GoalProgress"> | Date | string
    createdAt?: DateTimeFilter<"GoalProgress"> | Date | string
    goal?: XOR<GoalRelationFilter, GoalWhereInput>
  }, "id">

  export type GoalProgressOrderByWithAggregationInput = {
    id?: SortOrder
    goalId?: SortOrder
    value?: SortOrder
    currentValue?: SortOrderInput | SortOrder
    currentUnit?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
    _count?: GoalProgressCountOrderByAggregateInput
    _avg?: GoalProgressAvgOrderByAggregateInput
    _max?: GoalProgressMaxOrderByAggregateInput
    _min?: GoalProgressMinOrderByAggregateInput
    _sum?: GoalProgressSumOrderByAggregateInput
  }

  export type GoalProgressScalarWhereWithAggregatesInput = {
    AND?: GoalProgressScalarWhereWithAggregatesInput | GoalProgressScalarWhereWithAggregatesInput[]
    OR?: GoalProgressScalarWhereWithAggregatesInput[]
    NOT?: GoalProgressScalarWhereWithAggregatesInput | GoalProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GoalProgress"> | string
    goalId?: StringWithAggregatesFilter<"GoalProgress"> | string
    value?: FloatWithAggregatesFilter<"GoalProgress"> | number
    currentValue?: FloatNullableWithAggregatesFilter<"GoalProgress"> | number | null
    currentUnit?: StringNullableWithAggregatesFilter<"GoalProgress"> | string | null
    notes?: StringNullableWithAggregatesFilter<"GoalProgress"> | string | null
    recordedAt?: DateTimeWithAggregatesFilter<"GoalProgress"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"GoalProgress"> | Date | string
  }

  export type AlertThresholdWhereInput = {
    AND?: AlertThresholdWhereInput | AlertThresholdWhereInput[]
    OR?: AlertThresholdWhereInput[]
    NOT?: AlertThresholdWhereInput | AlertThresholdWhereInput[]
    id?: StringFilter<"AlertThreshold"> | string
    patientId?: StringFilter<"AlertThreshold"> | string
    carePlanId?: StringNullableFilter<"AlertThreshold"> | string | null
    vitalType?: EnumVitalTypeFilter<"AlertThreshold"> | $Enums.VitalType
    condition?: StringNullableFilter<"AlertThreshold"> | string | null
    minValue?: FloatNullableFilter<"AlertThreshold"> | number | null
    maxValue?: FloatNullableFilter<"AlertThreshold"> | number | null
    criticalMin?: FloatNullableFilter<"AlertThreshold"> | number | null
    criticalMax?: FloatNullableFilter<"AlertThreshold"> | number | null
    warningMin?: FloatNullableFilter<"AlertThreshold"> | number | null
    warningMax?: FloatNullableFilter<"AlertThreshold"> | number | null
    isActive?: BoolFilter<"AlertThreshold"> | boolean
    createdAt?: DateTimeFilter<"AlertThreshold"> | Date | string
    updatedAt?: DateTimeFilter<"AlertThreshold"> | Date | string
  }

  export type AlertThresholdOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrderInput | SortOrder
    vitalType?: SortOrder
    condition?: SortOrderInput | SortOrder
    minValue?: SortOrderInput | SortOrder
    maxValue?: SortOrderInput | SortOrder
    criticalMin?: SortOrderInput | SortOrder
    criticalMax?: SortOrderInput | SortOrder
    warningMin?: SortOrderInput | SortOrder
    warningMax?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AlertThresholdWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AlertThresholdWhereInput | AlertThresholdWhereInput[]
    OR?: AlertThresholdWhereInput[]
    NOT?: AlertThresholdWhereInput | AlertThresholdWhereInput[]
    patientId?: StringFilter<"AlertThreshold"> | string
    carePlanId?: StringNullableFilter<"AlertThreshold"> | string | null
    vitalType?: EnumVitalTypeFilter<"AlertThreshold"> | $Enums.VitalType
    condition?: StringNullableFilter<"AlertThreshold"> | string | null
    minValue?: FloatNullableFilter<"AlertThreshold"> | number | null
    maxValue?: FloatNullableFilter<"AlertThreshold"> | number | null
    criticalMin?: FloatNullableFilter<"AlertThreshold"> | number | null
    criticalMax?: FloatNullableFilter<"AlertThreshold"> | number | null
    warningMin?: FloatNullableFilter<"AlertThreshold"> | number | null
    warningMax?: FloatNullableFilter<"AlertThreshold"> | number | null
    isActive?: BoolFilter<"AlertThreshold"> | boolean
    createdAt?: DateTimeFilter<"AlertThreshold"> | Date | string
    updatedAt?: DateTimeFilter<"AlertThreshold"> | Date | string
  }, "id">

  export type AlertThresholdOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrderInput | SortOrder
    vitalType?: SortOrder
    condition?: SortOrderInput | SortOrder
    minValue?: SortOrderInput | SortOrder
    maxValue?: SortOrderInput | SortOrder
    criticalMin?: SortOrderInput | SortOrder
    criticalMax?: SortOrderInput | SortOrder
    warningMin?: SortOrderInput | SortOrder
    warningMax?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AlertThresholdCountOrderByAggregateInput
    _avg?: AlertThresholdAvgOrderByAggregateInput
    _max?: AlertThresholdMaxOrderByAggregateInput
    _min?: AlertThresholdMinOrderByAggregateInput
    _sum?: AlertThresholdSumOrderByAggregateInput
  }

  export type AlertThresholdScalarWhereWithAggregatesInput = {
    AND?: AlertThresholdScalarWhereWithAggregatesInput | AlertThresholdScalarWhereWithAggregatesInput[]
    OR?: AlertThresholdScalarWhereWithAggregatesInput[]
    NOT?: AlertThresholdScalarWhereWithAggregatesInput | AlertThresholdScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AlertThreshold"> | string
    patientId?: StringWithAggregatesFilter<"AlertThreshold"> | string
    carePlanId?: StringNullableWithAggregatesFilter<"AlertThreshold"> | string | null
    vitalType?: EnumVitalTypeWithAggregatesFilter<"AlertThreshold"> | $Enums.VitalType
    condition?: StringNullableWithAggregatesFilter<"AlertThreshold"> | string | null
    minValue?: FloatNullableWithAggregatesFilter<"AlertThreshold"> | number | null
    maxValue?: FloatNullableWithAggregatesFilter<"AlertThreshold"> | number | null
    criticalMin?: FloatNullableWithAggregatesFilter<"AlertThreshold"> | number | null
    criticalMax?: FloatNullableWithAggregatesFilter<"AlertThreshold"> | number | null
    warningMin?: FloatNullableWithAggregatesFilter<"AlertThreshold"> | number | null
    warningMax?: FloatNullableWithAggregatesFilter<"AlertThreshold"> | number | null
    isActive?: BoolWithAggregatesFilter<"AlertThreshold"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AlertThreshold"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AlertThreshold"> | Date | string
  }

  export type CarePlanTemplateWhereInput = {
    AND?: CarePlanTemplateWhereInput | CarePlanTemplateWhereInput[]
    OR?: CarePlanTemplateWhereInput[]
    NOT?: CarePlanTemplateWhereInput | CarePlanTemplateWhereInput[]
    id?: StringFilter<"CarePlanTemplate"> | string
    name?: StringFilter<"CarePlanTemplate"> | string
    description?: StringNullableFilter<"CarePlanTemplate"> | string | null
    condition?: StringFilter<"CarePlanTemplate"> | string
    goals?: JsonFilter<"CarePlanTemplate">
    interventions?: JsonFilter<"CarePlanTemplate">
    tasks?: JsonNullableFilter<"CarePlanTemplate">
    reviewSchedule?: StringNullableFilter<"CarePlanTemplate"> | string | null
    thresholds?: JsonNullableFilter<"CarePlanTemplate">
    version?: IntFilter<"CarePlanTemplate"> | number
    isActive?: BoolFilter<"CarePlanTemplate"> | boolean
    createdAt?: DateTimeFilter<"CarePlanTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"CarePlanTemplate"> | Date | string
  }

  export type CarePlanTemplateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    condition?: SortOrder
    goals?: SortOrder
    interventions?: SortOrder
    tasks?: SortOrderInput | SortOrder
    reviewSchedule?: SortOrderInput | SortOrder
    thresholds?: SortOrderInput | SortOrder
    version?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CarePlanTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CarePlanTemplateWhereInput | CarePlanTemplateWhereInput[]
    OR?: CarePlanTemplateWhereInput[]
    NOT?: CarePlanTemplateWhereInput | CarePlanTemplateWhereInput[]
    name?: StringFilter<"CarePlanTemplate"> | string
    description?: StringNullableFilter<"CarePlanTemplate"> | string | null
    condition?: StringFilter<"CarePlanTemplate"> | string
    goals?: JsonFilter<"CarePlanTemplate">
    interventions?: JsonFilter<"CarePlanTemplate">
    tasks?: JsonNullableFilter<"CarePlanTemplate">
    reviewSchedule?: StringNullableFilter<"CarePlanTemplate"> | string | null
    thresholds?: JsonNullableFilter<"CarePlanTemplate">
    version?: IntFilter<"CarePlanTemplate"> | number
    isActive?: BoolFilter<"CarePlanTemplate"> | boolean
    createdAt?: DateTimeFilter<"CarePlanTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"CarePlanTemplate"> | Date | string
  }, "id">

  export type CarePlanTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    condition?: SortOrder
    goals?: SortOrder
    interventions?: SortOrder
    tasks?: SortOrderInput | SortOrder
    reviewSchedule?: SortOrderInput | SortOrder
    thresholds?: SortOrderInput | SortOrder
    version?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CarePlanTemplateCountOrderByAggregateInput
    _avg?: CarePlanTemplateAvgOrderByAggregateInput
    _max?: CarePlanTemplateMaxOrderByAggregateInput
    _min?: CarePlanTemplateMinOrderByAggregateInput
    _sum?: CarePlanTemplateSumOrderByAggregateInput
  }

  export type CarePlanTemplateScalarWhereWithAggregatesInput = {
    AND?: CarePlanTemplateScalarWhereWithAggregatesInput | CarePlanTemplateScalarWhereWithAggregatesInput[]
    OR?: CarePlanTemplateScalarWhereWithAggregatesInput[]
    NOT?: CarePlanTemplateScalarWhereWithAggregatesInput | CarePlanTemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CarePlanTemplate"> | string
    name?: StringWithAggregatesFilter<"CarePlanTemplate"> | string
    description?: StringNullableWithAggregatesFilter<"CarePlanTemplate"> | string | null
    condition?: StringWithAggregatesFilter<"CarePlanTemplate"> | string
    goals?: JsonWithAggregatesFilter<"CarePlanTemplate">
    interventions?: JsonWithAggregatesFilter<"CarePlanTemplate">
    tasks?: JsonNullableWithAggregatesFilter<"CarePlanTemplate">
    reviewSchedule?: StringNullableWithAggregatesFilter<"CarePlanTemplate"> | string | null
    thresholds?: JsonNullableWithAggregatesFilter<"CarePlanTemplate">
    version?: IntWithAggregatesFilter<"CarePlanTemplate"> | number
    isActive?: BoolWithAggregatesFilter<"CarePlanTemplate"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CarePlanTemplate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CarePlanTemplate"> | Date | string
  }

  export type PatientEngagementWhereInput = {
    AND?: PatientEngagementWhereInput | PatientEngagementWhereInput[]
    OR?: PatientEngagementWhereInput[]
    NOT?: PatientEngagementWhereInput | PatientEngagementWhereInput[]
    id?: StringFilter<"PatientEngagement"> | string
    patientId?: StringFilter<"PatientEngagement"> | string
    carePlanId?: StringNullableFilter<"PatientEngagement"> | string | null
    engagementType?: EnumEngagementTypeFilter<"PatientEngagement"> | $Enums.EngagementType
    activityType?: StringFilter<"PatientEngagement"> | string
    description?: StringNullableFilter<"PatientEngagement"> | string | null
    metadata?: JsonNullableFilter<"PatientEngagement">
    recordedAt?: DateTimeFilter<"PatientEngagement"> | Date | string
    createdAt?: DateTimeFilter<"PatientEngagement"> | Date | string
  }

  export type PatientEngagementOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrderInput | SortOrder
    engagementType?: SortOrder
    activityType?: SortOrder
    description?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PatientEngagementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PatientEngagementWhereInput | PatientEngagementWhereInput[]
    OR?: PatientEngagementWhereInput[]
    NOT?: PatientEngagementWhereInput | PatientEngagementWhereInput[]
    patientId?: StringFilter<"PatientEngagement"> | string
    carePlanId?: StringNullableFilter<"PatientEngagement"> | string | null
    engagementType?: EnumEngagementTypeFilter<"PatientEngagement"> | $Enums.EngagementType
    activityType?: StringFilter<"PatientEngagement"> | string
    description?: StringNullableFilter<"PatientEngagement"> | string | null
    metadata?: JsonNullableFilter<"PatientEngagement">
    recordedAt?: DateTimeFilter<"PatientEngagement"> | Date | string
    createdAt?: DateTimeFilter<"PatientEngagement"> | Date | string
  }, "id">

  export type PatientEngagementOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrderInput | SortOrder
    engagementType?: SortOrder
    activityType?: SortOrder
    description?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
    _count?: PatientEngagementCountOrderByAggregateInput
    _max?: PatientEngagementMaxOrderByAggregateInput
    _min?: PatientEngagementMinOrderByAggregateInput
  }

  export type PatientEngagementScalarWhereWithAggregatesInput = {
    AND?: PatientEngagementScalarWhereWithAggregatesInput | PatientEngagementScalarWhereWithAggregatesInput[]
    OR?: PatientEngagementScalarWhereWithAggregatesInput[]
    NOT?: PatientEngagementScalarWhereWithAggregatesInput | PatientEngagementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PatientEngagement"> | string
    patientId?: StringWithAggregatesFilter<"PatientEngagement"> | string
    carePlanId?: StringNullableWithAggregatesFilter<"PatientEngagement"> | string | null
    engagementType?: EnumEngagementTypeWithAggregatesFilter<"PatientEngagement"> | $Enums.EngagementType
    activityType?: StringWithAggregatesFilter<"PatientEngagement"> | string
    description?: StringNullableWithAggregatesFilter<"PatientEngagement"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"PatientEngagement">
    recordedAt?: DateTimeWithAggregatesFilter<"PatientEngagement"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"PatientEngagement"> | Date | string
  }

  export type CarePlanCreateInput = {
    id?: string
    patientId: string
    providerId: string
    condition: string
    status?: $Enums.PlanStatus
    startDate?: Date | string
    endDate?: Date | string | null
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    reviewSchedule?: string | null
    nextReviewDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: CareTaskCreateNestedManyWithoutCarePlanInput
    vitals?: VitalReadingCreateNestedManyWithoutCarePlanInput
    alerts?: AlertCreateNestedManyWithoutCarePlanInput
  }

  export type CarePlanUncheckedCreateInput = {
    id?: string
    patientId: string
    providerId: string
    condition: string
    status?: $Enums.PlanStatus
    startDate?: Date | string
    endDate?: Date | string | null
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    reviewSchedule?: string | null
    nextReviewDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: CareTaskUncheckedCreateNestedManyWithoutCarePlanInput
    vitals?: VitalReadingUncheckedCreateNestedManyWithoutCarePlanInput
    alerts?: AlertUncheckedCreateNestedManyWithoutCarePlanInput
  }

  export type CarePlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    nextReviewDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: CareTaskUpdateManyWithoutCarePlanNestedInput
    vitals?: VitalReadingUpdateManyWithoutCarePlanNestedInput
    alerts?: AlertUpdateManyWithoutCarePlanNestedInput
  }

  export type CarePlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    nextReviewDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: CareTaskUncheckedUpdateManyWithoutCarePlanNestedInput
    vitals?: VitalReadingUncheckedUpdateManyWithoutCarePlanNestedInput
    alerts?: AlertUncheckedUpdateManyWithoutCarePlanNestedInput
  }

  export type CarePlanCreateManyInput = {
    id?: string
    patientId: string
    providerId: string
    condition: string
    status?: $Enums.PlanStatus
    startDate?: Date | string
    endDate?: Date | string | null
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    reviewSchedule?: string | null
    nextReviewDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CarePlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    nextReviewDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CarePlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    nextReviewDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CareTaskCreateInput = {
    id?: string
    title: string
    description?: string | null
    taskType: $Enums.TaskType
    frequency: string
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    status?: $Enums.TaskStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    carePlan: CarePlanCreateNestedOneWithoutTasksInput
  }

  export type CareTaskUncheckedCreateInput = {
    id?: string
    carePlanId: string
    title: string
    description?: string | null
    taskType: $Enums.TaskType
    frequency: string
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    status?: $Enums.TaskStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CareTaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carePlan?: CarePlanUpdateOneRequiredWithoutTasksNestedInput
  }

  export type CareTaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    carePlanId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CareTaskCreateManyInput = {
    id?: string
    carePlanId: string
    title: string
    description?: string | null
    taskType: $Enums.TaskType
    frequency: string
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    status?: $Enums.TaskStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CareTaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CareTaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    carePlanId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MonitoringDeviceCreateInput = {
    id?: string
    patientId: string
    deviceType: $Enums.DeviceType
    manufacturer?: string | null
    model?: string | null
    serialNumber: string
    status?: $Enums.DeviceStatus
    lastSyncAt?: Date | string | null
    batteryLevel?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    readings?: VitalReadingCreateNestedManyWithoutDeviceInput
  }

  export type MonitoringDeviceUncheckedCreateInput = {
    id?: string
    patientId: string
    deviceType: $Enums.DeviceType
    manufacturer?: string | null
    model?: string | null
    serialNumber: string
    status?: $Enums.DeviceStatus
    lastSyncAt?: Date | string | null
    batteryLevel?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    readings?: VitalReadingUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type MonitoringDeviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batteryLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readings?: VitalReadingUpdateManyWithoutDeviceNestedInput
  }

  export type MonitoringDeviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batteryLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readings?: VitalReadingUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type MonitoringDeviceCreateManyInput = {
    id?: string
    patientId: string
    deviceType: $Enums.DeviceType
    manufacturer?: string | null
    model?: string | null
    serialNumber: string
    status?: $Enums.DeviceStatus
    lastSyncAt?: Date | string | null
    batteryLevel?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MonitoringDeviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batteryLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MonitoringDeviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batteryLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VitalReadingCreateInput = {
    id?: string
    patientId: string
    vitalType: $Enums.VitalType
    value: number
    unit: string
    isAbnormal?: boolean
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
    carePlan?: CarePlanCreateNestedOneWithoutVitalsInput
    device?: MonitoringDeviceCreateNestedOneWithoutReadingsInput
  }

  export type VitalReadingUncheckedCreateInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    deviceId?: string | null
    vitalType: $Enums.VitalType
    value: number
    unit: string
    isAbnormal?: boolean
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type VitalReadingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    value?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carePlan?: CarePlanUpdateOneWithoutVitalsNestedInput
    device?: MonitoringDeviceUpdateOneWithoutReadingsNestedInput
  }

  export type VitalReadingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    value?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VitalReadingCreateManyInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    deviceId?: string | null
    vitalType: $Enums.VitalType
    value: number
    unit: string
    isAbnormal?: boolean
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type VitalReadingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    value?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VitalReadingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    value?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertCreateInput = {
    id?: string
    patientId: string
    alertType: $Enums.AlertType
    severity: $Enums.AlertSeverity
    title: string
    description: string
    status?: $Enums.AlertStatus
    acknowledgedBy?: string | null
    acknowledgedAt?: Date | string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    carePlan?: CarePlanCreateNestedOneWithoutAlertsInput
  }

  export type AlertUncheckedCreateInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    alertType: $Enums.AlertType
    severity: $Enums.AlertSeverity
    title: string
    description: string
    status?: $Enums.AlertStatus
    acknowledgedBy?: string | null
    acknowledgedAt?: Date | string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    alertType?: EnumAlertTypeFieldUpdateOperationsInput | $Enums.AlertType
    severity?: EnumAlertSeverityFieldUpdateOperationsInput | $Enums.AlertSeverity
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumAlertStatusFieldUpdateOperationsInput | $Enums.AlertStatus
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carePlan?: CarePlanUpdateOneWithoutAlertsNestedInput
  }

  export type AlertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    alertType?: EnumAlertTypeFieldUpdateOperationsInput | $Enums.AlertType
    severity?: EnumAlertSeverityFieldUpdateOperationsInput | $Enums.AlertSeverity
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumAlertStatusFieldUpdateOperationsInput | $Enums.AlertStatus
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertCreateManyInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    alertType: $Enums.AlertType
    severity: $Enums.AlertSeverity
    title: string
    description: string
    status?: $Enums.AlertStatus
    acknowledgedBy?: string | null
    acknowledgedAt?: Date | string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    alertType?: EnumAlertTypeFieldUpdateOperationsInput | $Enums.AlertType
    severity?: EnumAlertSeverityFieldUpdateOperationsInput | $Enums.AlertSeverity
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumAlertStatusFieldUpdateOperationsInput | $Enums.AlertStatus
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    alertType?: EnumAlertTypeFieldUpdateOperationsInput | $Enums.AlertType
    severity?: EnumAlertSeverityFieldUpdateOperationsInput | $Enums.AlertSeverity
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumAlertStatusFieldUpdateOperationsInput | $Enums.AlertStatus
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoalCreateInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    title: string
    description?: string | null
    goalType: $Enums.GoalType
    targetValue?: number | null
    targetUnit?: string | null
    targetDate?: Date | string | null
    frequency?: string | null
    status?: $Enums.GoalStatus
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    progress?: GoalProgressCreateNestedManyWithoutGoalInput
  }

  export type GoalUncheckedCreateInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    title: string
    description?: string | null
    goalType: $Enums.GoalType
    targetValue?: number | null
    targetUnit?: string | null
    targetDate?: Date | string | null
    frequency?: string | null
    status?: $Enums.GoalStatus
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    progress?: GoalProgressUncheckedCreateNestedManyWithoutGoalInput
  }

  export type GoalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goalType?: EnumGoalTypeFieldUpdateOperationsInput | $Enums.GoalType
    targetValue?: NullableFloatFieldUpdateOperationsInput | number | null
    targetUnit?: NullableStringFieldUpdateOperationsInput | string | null
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumGoalStatusFieldUpdateOperationsInput | $Enums.GoalStatus
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    progress?: GoalProgressUpdateManyWithoutGoalNestedInput
  }

  export type GoalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goalType?: EnumGoalTypeFieldUpdateOperationsInput | $Enums.GoalType
    targetValue?: NullableFloatFieldUpdateOperationsInput | number | null
    targetUnit?: NullableStringFieldUpdateOperationsInput | string | null
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumGoalStatusFieldUpdateOperationsInput | $Enums.GoalStatus
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    progress?: GoalProgressUncheckedUpdateManyWithoutGoalNestedInput
  }

  export type GoalCreateManyInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    title: string
    description?: string | null
    goalType: $Enums.GoalType
    targetValue?: number | null
    targetUnit?: string | null
    targetDate?: Date | string | null
    frequency?: string | null
    status?: $Enums.GoalStatus
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goalType?: EnumGoalTypeFieldUpdateOperationsInput | $Enums.GoalType
    targetValue?: NullableFloatFieldUpdateOperationsInput | number | null
    targetUnit?: NullableStringFieldUpdateOperationsInput | string | null
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumGoalStatusFieldUpdateOperationsInput | $Enums.GoalStatus
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goalType?: EnumGoalTypeFieldUpdateOperationsInput | $Enums.GoalType
    targetValue?: NullableFloatFieldUpdateOperationsInput | number | null
    targetUnit?: NullableStringFieldUpdateOperationsInput | string | null
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumGoalStatusFieldUpdateOperationsInput | $Enums.GoalStatus
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoalProgressCreateInput = {
    id?: string
    value: number
    currentValue?: number | null
    currentUnit?: string | null
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
    goal: GoalCreateNestedOneWithoutProgressInput
  }

  export type GoalProgressUncheckedCreateInput = {
    id?: string
    goalId: string
    value: number
    currentValue?: number | null
    currentUnit?: string | null
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type GoalProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    currentValue?: NullableFloatFieldUpdateOperationsInput | number | null
    currentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goal?: GoalUpdateOneRequiredWithoutProgressNestedInput
  }

  export type GoalProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    goalId?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    currentValue?: NullableFloatFieldUpdateOperationsInput | number | null
    currentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoalProgressCreateManyInput = {
    id?: string
    goalId: string
    value: number
    currentValue?: number | null
    currentUnit?: string | null
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type GoalProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    currentValue?: NullableFloatFieldUpdateOperationsInput | number | null
    currentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoalProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    goalId?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    currentValue?: NullableFloatFieldUpdateOperationsInput | number | null
    currentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertThresholdCreateInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    vitalType: $Enums.VitalType
    condition?: string | null
    minValue?: number | null
    maxValue?: number | null
    criticalMin?: number | null
    criticalMax?: number | null
    warningMin?: number | null
    warningMax?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertThresholdUncheckedCreateInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    vitalType: $Enums.VitalType
    condition?: string | null
    minValue?: number | null
    maxValue?: number | null
    criticalMin?: number | null
    criticalMax?: number | null
    warningMin?: number | null
    warningMax?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertThresholdUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    condition?: NullableStringFieldUpdateOperationsInput | string | null
    minValue?: NullableFloatFieldUpdateOperationsInput | number | null
    maxValue?: NullableFloatFieldUpdateOperationsInput | number | null
    criticalMin?: NullableFloatFieldUpdateOperationsInput | number | null
    criticalMax?: NullableFloatFieldUpdateOperationsInput | number | null
    warningMin?: NullableFloatFieldUpdateOperationsInput | number | null
    warningMax?: NullableFloatFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertThresholdUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    condition?: NullableStringFieldUpdateOperationsInput | string | null
    minValue?: NullableFloatFieldUpdateOperationsInput | number | null
    maxValue?: NullableFloatFieldUpdateOperationsInput | number | null
    criticalMin?: NullableFloatFieldUpdateOperationsInput | number | null
    criticalMax?: NullableFloatFieldUpdateOperationsInput | number | null
    warningMin?: NullableFloatFieldUpdateOperationsInput | number | null
    warningMax?: NullableFloatFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertThresholdCreateManyInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    vitalType: $Enums.VitalType
    condition?: string | null
    minValue?: number | null
    maxValue?: number | null
    criticalMin?: number | null
    criticalMax?: number | null
    warningMin?: number | null
    warningMax?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertThresholdUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    condition?: NullableStringFieldUpdateOperationsInput | string | null
    minValue?: NullableFloatFieldUpdateOperationsInput | number | null
    maxValue?: NullableFloatFieldUpdateOperationsInput | number | null
    criticalMin?: NullableFloatFieldUpdateOperationsInput | number | null
    criticalMax?: NullableFloatFieldUpdateOperationsInput | number | null
    warningMin?: NullableFloatFieldUpdateOperationsInput | number | null
    warningMax?: NullableFloatFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertThresholdUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    condition?: NullableStringFieldUpdateOperationsInput | string | null
    minValue?: NullableFloatFieldUpdateOperationsInput | number | null
    maxValue?: NullableFloatFieldUpdateOperationsInput | number | null
    criticalMin?: NullableFloatFieldUpdateOperationsInput | number | null
    criticalMax?: NullableFloatFieldUpdateOperationsInput | number | null
    warningMin?: NullableFloatFieldUpdateOperationsInput | number | null
    warningMax?: NullableFloatFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CarePlanTemplateCreateInput = {
    id?: string
    name: string
    description?: string | null
    condition: string
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    tasks?: NullableJsonNullValueInput | InputJsonValue
    reviewSchedule?: string | null
    thresholds?: NullableJsonNullValueInput | InputJsonValue
    version?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CarePlanTemplateUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    condition: string
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    tasks?: NullableJsonNullValueInput | InputJsonValue
    reviewSchedule?: string | null
    thresholds?: NullableJsonNullValueInput | InputJsonValue
    version?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CarePlanTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    tasks?: NullableJsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    thresholds?: NullableJsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CarePlanTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    tasks?: NullableJsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    thresholds?: NullableJsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CarePlanTemplateCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    condition: string
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    tasks?: NullableJsonNullValueInput | InputJsonValue
    reviewSchedule?: string | null
    thresholds?: NullableJsonNullValueInput | InputJsonValue
    version?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CarePlanTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    tasks?: NullableJsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    thresholds?: NullableJsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CarePlanTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    tasks?: NullableJsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    thresholds?: NullableJsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientEngagementCreateInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    engagementType: $Enums.EngagementType
    activityType: string
    description?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type PatientEngagementUncheckedCreateInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    engagementType: $Enums.EngagementType
    activityType: string
    description?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type PatientEngagementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    engagementType?: EnumEngagementTypeFieldUpdateOperationsInput | $Enums.EngagementType
    activityType?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientEngagementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    engagementType?: EnumEngagementTypeFieldUpdateOperationsInput | $Enums.EngagementType
    activityType?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientEngagementCreateManyInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    engagementType: $Enums.EngagementType
    activityType: string
    description?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type PatientEngagementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    engagementType?: EnumEngagementTypeFieldUpdateOperationsInput | $Enums.EngagementType
    activityType?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientEngagementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    engagementType?: EnumEngagementTypeFieldUpdateOperationsInput | $Enums.EngagementType
    activityType?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumPlanStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanStatus | EnumPlanStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanStatusFilter<$PrismaModel> | $Enums.PlanStatus
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

  export type CareTaskListRelationFilter = {
    every?: CareTaskWhereInput
    some?: CareTaskWhereInput
    none?: CareTaskWhereInput
  }

  export type VitalReadingListRelationFilter = {
    every?: VitalReadingWhereInput
    some?: VitalReadingWhereInput
    none?: VitalReadingWhereInput
  }

  export type AlertListRelationFilter = {
    every?: AlertWhereInput
    some?: AlertWhereInput
    none?: AlertWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CareTaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VitalReadingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AlertOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CarePlanCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    condition?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    goals?: SortOrder
    interventions?: SortOrder
    reviewSchedule?: SortOrder
    nextReviewDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CarePlanMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    condition?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    reviewSchedule?: SortOrder
    nextReviewDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CarePlanMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    condition?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    reviewSchedule?: SortOrder
    nextReviewDate?: SortOrder
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

  export type EnumPlanStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanStatus | EnumPlanStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlanStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanStatusFilter<$PrismaModel>
    _max?: NestedEnumPlanStatusFilter<$PrismaModel>
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

  export type EnumTaskTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeFilter<$PrismaModel> | $Enums.TaskType
  }

  export type EnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type CarePlanRelationFilter = {
    is?: CarePlanWhereInput
    isNot?: CarePlanWhereInput
  }

  export type CareTaskCountOrderByAggregateInput = {
    id?: SortOrder
    carePlanId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    taskType?: SortOrder
    frequency?: SortOrder
    dueDate?: SortOrder
    completedAt?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CareTaskMaxOrderByAggregateInput = {
    id?: SortOrder
    carePlanId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    taskType?: SortOrder
    frequency?: SortOrder
    dueDate?: SortOrder
    completedAt?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CareTaskMinOrderByAggregateInput = {
    id?: SortOrder
    carePlanId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    taskType?: SortOrder
    frequency?: SortOrder
    dueDate?: SortOrder
    completedAt?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTaskTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel> | $Enums.TaskType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskTypeFilter<$PrismaModel>
    _max?: NestedEnumTaskTypeFilter<$PrismaModel>
  }

  export type EnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type EnumDeviceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceTypeFilter<$PrismaModel> | $Enums.DeviceType
  }

  export type EnumDeviceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceStatus | EnumDeviceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceStatusFilter<$PrismaModel> | $Enums.DeviceStatus
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

  export type MonitoringDeviceCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    deviceType?: SortOrder
    manufacturer?: SortOrder
    model?: SortOrder
    serialNumber?: SortOrder
    status?: SortOrder
    lastSyncAt?: SortOrder
    batteryLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MonitoringDeviceAvgOrderByAggregateInput = {
    batteryLevel?: SortOrder
  }

  export type MonitoringDeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    deviceType?: SortOrder
    manufacturer?: SortOrder
    model?: SortOrder
    serialNumber?: SortOrder
    status?: SortOrder
    lastSyncAt?: SortOrder
    batteryLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MonitoringDeviceMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    deviceType?: SortOrder
    manufacturer?: SortOrder
    model?: SortOrder
    serialNumber?: SortOrder
    status?: SortOrder
    lastSyncAt?: SortOrder
    batteryLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MonitoringDeviceSumOrderByAggregateInput = {
    batteryLevel?: SortOrder
  }

  export type EnumDeviceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceTypeWithAggregatesFilter<$PrismaModel> | $Enums.DeviceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceTypeFilter<$PrismaModel>
    _max?: NestedEnumDeviceTypeFilter<$PrismaModel>
  }

  export type EnumDeviceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceStatus | EnumDeviceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceStatusWithAggregatesFilter<$PrismaModel> | $Enums.DeviceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceStatusFilter<$PrismaModel>
    _max?: NestedEnumDeviceStatusFilter<$PrismaModel>
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

  export type EnumVitalTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.VitalType | EnumVitalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.VitalType[] | ListEnumVitalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VitalType[] | ListEnumVitalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumVitalTypeFilter<$PrismaModel> | $Enums.VitalType
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CarePlanNullableRelationFilter = {
    is?: CarePlanWhereInput | null
    isNot?: CarePlanWhereInput | null
  }

  export type MonitoringDeviceNullableRelationFilter = {
    is?: MonitoringDeviceWhereInput | null
    isNot?: MonitoringDeviceWhereInput | null
  }

  export type VitalReadingCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    deviceId?: SortOrder
    vitalType?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    isAbnormal?: SortOrder
    notes?: SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type VitalReadingAvgOrderByAggregateInput = {
    value?: SortOrder
  }

  export type VitalReadingMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    deviceId?: SortOrder
    vitalType?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    isAbnormal?: SortOrder
    notes?: SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type VitalReadingMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    deviceId?: SortOrder
    vitalType?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    isAbnormal?: SortOrder
    notes?: SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type VitalReadingSumOrderByAggregateInput = {
    value?: SortOrder
  }

  export type EnumVitalTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VitalType | EnumVitalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.VitalType[] | ListEnumVitalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VitalType[] | ListEnumVitalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumVitalTypeWithAggregatesFilter<$PrismaModel> | $Enums.VitalType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVitalTypeFilter<$PrismaModel>
    _max?: NestedEnumVitalTypeFilter<$PrismaModel>
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumAlertTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertType | EnumAlertTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertTypeFilter<$PrismaModel> | $Enums.AlertType
  }

  export type EnumAlertSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertSeverity | EnumAlertSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertSeverityFilter<$PrismaModel> | $Enums.AlertSeverity
  }

  export type EnumAlertStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertStatus | EnumAlertStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AlertStatus[] | ListEnumAlertStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertStatus[] | ListEnumAlertStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertStatusFilter<$PrismaModel> | $Enums.AlertStatus
  }

  export type AlertCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    alertType?: SortOrder
    severity?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    acknowledgedBy?: SortOrder
    acknowledgedAt?: SortOrder
    resolvedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AlertMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    alertType?: SortOrder
    severity?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    acknowledgedBy?: SortOrder
    acknowledgedAt?: SortOrder
    resolvedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AlertMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    alertType?: SortOrder
    severity?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    acknowledgedBy?: SortOrder
    acknowledgedAt?: SortOrder
    resolvedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumAlertTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertType | EnumAlertTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertTypeWithAggregatesFilter<$PrismaModel> | $Enums.AlertType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAlertTypeFilter<$PrismaModel>
    _max?: NestedEnumAlertTypeFilter<$PrismaModel>
  }

  export type EnumAlertSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertSeverity | EnumAlertSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertSeverityWithAggregatesFilter<$PrismaModel> | $Enums.AlertSeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAlertSeverityFilter<$PrismaModel>
    _max?: NestedEnumAlertSeverityFilter<$PrismaModel>
  }

  export type EnumAlertStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertStatus | EnumAlertStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AlertStatus[] | ListEnumAlertStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertStatus[] | ListEnumAlertStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertStatusWithAggregatesFilter<$PrismaModel> | $Enums.AlertStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAlertStatusFilter<$PrismaModel>
    _max?: NestedEnumAlertStatusFilter<$PrismaModel>
  }

  export type EnumGoalTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.GoalType | EnumGoalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GoalType[] | ListEnumGoalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.GoalType[] | ListEnumGoalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumGoalTypeFilter<$PrismaModel> | $Enums.GoalType
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

  export type EnumGoalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GoalStatus | EnumGoalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GoalStatus[] | ListEnumGoalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GoalStatus[] | ListEnumGoalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGoalStatusFilter<$PrismaModel> | $Enums.GoalStatus
  }

  export type GoalProgressListRelationFilter = {
    every?: GoalProgressWhereInput
    some?: GoalProgressWhereInput
    none?: GoalProgressWhereInput
  }

  export type GoalProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GoalCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    goalType?: SortOrder
    targetValue?: SortOrder
    targetUnit?: SortOrder
    targetDate?: SortOrder
    frequency?: SortOrder
    status?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoalAvgOrderByAggregateInput = {
    targetValue?: SortOrder
  }

  export type GoalMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    goalType?: SortOrder
    targetValue?: SortOrder
    targetUnit?: SortOrder
    targetDate?: SortOrder
    frequency?: SortOrder
    status?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoalMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    goalType?: SortOrder
    targetValue?: SortOrder
    targetUnit?: SortOrder
    targetDate?: SortOrder
    frequency?: SortOrder
    status?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoalSumOrderByAggregateInput = {
    targetValue?: SortOrder
  }

  export type EnumGoalTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GoalType | EnumGoalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GoalType[] | ListEnumGoalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.GoalType[] | ListEnumGoalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumGoalTypeWithAggregatesFilter<$PrismaModel> | $Enums.GoalType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGoalTypeFilter<$PrismaModel>
    _max?: NestedEnumGoalTypeFilter<$PrismaModel>
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

  export type EnumGoalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GoalStatus | EnumGoalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GoalStatus[] | ListEnumGoalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GoalStatus[] | ListEnumGoalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGoalStatusWithAggregatesFilter<$PrismaModel> | $Enums.GoalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGoalStatusFilter<$PrismaModel>
    _max?: NestedEnumGoalStatusFilter<$PrismaModel>
  }

  export type GoalRelationFilter = {
    is?: GoalWhereInput
    isNot?: GoalWhereInput
  }

  export type GoalProgressCountOrderByAggregateInput = {
    id?: SortOrder
    goalId?: SortOrder
    value?: SortOrder
    currentValue?: SortOrder
    currentUnit?: SortOrder
    notes?: SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GoalProgressAvgOrderByAggregateInput = {
    value?: SortOrder
    currentValue?: SortOrder
  }

  export type GoalProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    goalId?: SortOrder
    value?: SortOrder
    currentValue?: SortOrder
    currentUnit?: SortOrder
    notes?: SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GoalProgressMinOrderByAggregateInput = {
    id?: SortOrder
    goalId?: SortOrder
    value?: SortOrder
    currentValue?: SortOrder
    currentUnit?: SortOrder
    notes?: SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GoalProgressSumOrderByAggregateInput = {
    value?: SortOrder
    currentValue?: SortOrder
  }

  export type AlertThresholdCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    vitalType?: SortOrder
    condition?: SortOrder
    minValue?: SortOrder
    maxValue?: SortOrder
    criticalMin?: SortOrder
    criticalMax?: SortOrder
    warningMin?: SortOrder
    warningMax?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AlertThresholdAvgOrderByAggregateInput = {
    minValue?: SortOrder
    maxValue?: SortOrder
    criticalMin?: SortOrder
    criticalMax?: SortOrder
    warningMin?: SortOrder
    warningMax?: SortOrder
  }

  export type AlertThresholdMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    vitalType?: SortOrder
    condition?: SortOrder
    minValue?: SortOrder
    maxValue?: SortOrder
    criticalMin?: SortOrder
    criticalMax?: SortOrder
    warningMin?: SortOrder
    warningMax?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AlertThresholdMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    vitalType?: SortOrder
    condition?: SortOrder
    minValue?: SortOrder
    maxValue?: SortOrder
    criticalMin?: SortOrder
    criticalMax?: SortOrder
    warningMin?: SortOrder
    warningMax?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AlertThresholdSumOrderByAggregateInput = {
    minValue?: SortOrder
    maxValue?: SortOrder
    criticalMin?: SortOrder
    criticalMax?: SortOrder
    warningMin?: SortOrder
    warningMax?: SortOrder
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

  export type CarePlanTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    condition?: SortOrder
    goals?: SortOrder
    interventions?: SortOrder
    tasks?: SortOrder
    reviewSchedule?: SortOrder
    thresholds?: SortOrder
    version?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CarePlanTemplateAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type CarePlanTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    condition?: SortOrder
    reviewSchedule?: SortOrder
    version?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CarePlanTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    condition?: SortOrder
    reviewSchedule?: SortOrder
    version?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CarePlanTemplateSumOrderByAggregateInput = {
    version?: SortOrder
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

  export type EnumEngagementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EngagementType | EnumEngagementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EngagementType[] | ListEnumEngagementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EngagementType[] | ListEnumEngagementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEngagementTypeFilter<$PrismaModel> | $Enums.EngagementType
  }

  export type PatientEngagementCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    engagementType?: SortOrder
    activityType?: SortOrder
    description?: SortOrder
    metadata?: SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PatientEngagementMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    engagementType?: SortOrder
    activityType?: SortOrder
    description?: SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PatientEngagementMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    carePlanId?: SortOrder
    engagementType?: SortOrder
    activityType?: SortOrder
    description?: SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumEngagementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EngagementType | EnumEngagementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EngagementType[] | ListEnumEngagementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EngagementType[] | ListEnumEngagementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEngagementTypeWithAggregatesFilter<$PrismaModel> | $Enums.EngagementType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEngagementTypeFilter<$PrismaModel>
    _max?: NestedEnumEngagementTypeFilter<$PrismaModel>
  }

  export type CareTaskCreateNestedManyWithoutCarePlanInput = {
    create?: XOR<CareTaskCreateWithoutCarePlanInput, CareTaskUncheckedCreateWithoutCarePlanInput> | CareTaskCreateWithoutCarePlanInput[] | CareTaskUncheckedCreateWithoutCarePlanInput[]
    connectOrCreate?: CareTaskCreateOrConnectWithoutCarePlanInput | CareTaskCreateOrConnectWithoutCarePlanInput[]
    createMany?: CareTaskCreateManyCarePlanInputEnvelope
    connect?: CareTaskWhereUniqueInput | CareTaskWhereUniqueInput[]
  }

  export type VitalReadingCreateNestedManyWithoutCarePlanInput = {
    create?: XOR<VitalReadingCreateWithoutCarePlanInput, VitalReadingUncheckedCreateWithoutCarePlanInput> | VitalReadingCreateWithoutCarePlanInput[] | VitalReadingUncheckedCreateWithoutCarePlanInput[]
    connectOrCreate?: VitalReadingCreateOrConnectWithoutCarePlanInput | VitalReadingCreateOrConnectWithoutCarePlanInput[]
    createMany?: VitalReadingCreateManyCarePlanInputEnvelope
    connect?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
  }

  export type AlertCreateNestedManyWithoutCarePlanInput = {
    create?: XOR<AlertCreateWithoutCarePlanInput, AlertUncheckedCreateWithoutCarePlanInput> | AlertCreateWithoutCarePlanInput[] | AlertUncheckedCreateWithoutCarePlanInput[]
    connectOrCreate?: AlertCreateOrConnectWithoutCarePlanInput | AlertCreateOrConnectWithoutCarePlanInput[]
    createMany?: AlertCreateManyCarePlanInputEnvelope
    connect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
  }

  export type CareTaskUncheckedCreateNestedManyWithoutCarePlanInput = {
    create?: XOR<CareTaskCreateWithoutCarePlanInput, CareTaskUncheckedCreateWithoutCarePlanInput> | CareTaskCreateWithoutCarePlanInput[] | CareTaskUncheckedCreateWithoutCarePlanInput[]
    connectOrCreate?: CareTaskCreateOrConnectWithoutCarePlanInput | CareTaskCreateOrConnectWithoutCarePlanInput[]
    createMany?: CareTaskCreateManyCarePlanInputEnvelope
    connect?: CareTaskWhereUniqueInput | CareTaskWhereUniqueInput[]
  }

  export type VitalReadingUncheckedCreateNestedManyWithoutCarePlanInput = {
    create?: XOR<VitalReadingCreateWithoutCarePlanInput, VitalReadingUncheckedCreateWithoutCarePlanInput> | VitalReadingCreateWithoutCarePlanInput[] | VitalReadingUncheckedCreateWithoutCarePlanInput[]
    connectOrCreate?: VitalReadingCreateOrConnectWithoutCarePlanInput | VitalReadingCreateOrConnectWithoutCarePlanInput[]
    createMany?: VitalReadingCreateManyCarePlanInputEnvelope
    connect?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
  }

  export type AlertUncheckedCreateNestedManyWithoutCarePlanInput = {
    create?: XOR<AlertCreateWithoutCarePlanInput, AlertUncheckedCreateWithoutCarePlanInput> | AlertCreateWithoutCarePlanInput[] | AlertUncheckedCreateWithoutCarePlanInput[]
    connectOrCreate?: AlertCreateOrConnectWithoutCarePlanInput | AlertCreateOrConnectWithoutCarePlanInput[]
    createMany?: AlertCreateManyCarePlanInputEnvelope
    connect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumPlanStatusFieldUpdateOperationsInput = {
    set?: $Enums.PlanStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type CareTaskUpdateManyWithoutCarePlanNestedInput = {
    create?: XOR<CareTaskCreateWithoutCarePlanInput, CareTaskUncheckedCreateWithoutCarePlanInput> | CareTaskCreateWithoutCarePlanInput[] | CareTaskUncheckedCreateWithoutCarePlanInput[]
    connectOrCreate?: CareTaskCreateOrConnectWithoutCarePlanInput | CareTaskCreateOrConnectWithoutCarePlanInput[]
    upsert?: CareTaskUpsertWithWhereUniqueWithoutCarePlanInput | CareTaskUpsertWithWhereUniqueWithoutCarePlanInput[]
    createMany?: CareTaskCreateManyCarePlanInputEnvelope
    set?: CareTaskWhereUniqueInput | CareTaskWhereUniqueInput[]
    disconnect?: CareTaskWhereUniqueInput | CareTaskWhereUniqueInput[]
    delete?: CareTaskWhereUniqueInput | CareTaskWhereUniqueInput[]
    connect?: CareTaskWhereUniqueInput | CareTaskWhereUniqueInput[]
    update?: CareTaskUpdateWithWhereUniqueWithoutCarePlanInput | CareTaskUpdateWithWhereUniqueWithoutCarePlanInput[]
    updateMany?: CareTaskUpdateManyWithWhereWithoutCarePlanInput | CareTaskUpdateManyWithWhereWithoutCarePlanInput[]
    deleteMany?: CareTaskScalarWhereInput | CareTaskScalarWhereInput[]
  }

  export type VitalReadingUpdateManyWithoutCarePlanNestedInput = {
    create?: XOR<VitalReadingCreateWithoutCarePlanInput, VitalReadingUncheckedCreateWithoutCarePlanInput> | VitalReadingCreateWithoutCarePlanInput[] | VitalReadingUncheckedCreateWithoutCarePlanInput[]
    connectOrCreate?: VitalReadingCreateOrConnectWithoutCarePlanInput | VitalReadingCreateOrConnectWithoutCarePlanInput[]
    upsert?: VitalReadingUpsertWithWhereUniqueWithoutCarePlanInput | VitalReadingUpsertWithWhereUniqueWithoutCarePlanInput[]
    createMany?: VitalReadingCreateManyCarePlanInputEnvelope
    set?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    disconnect?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    delete?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    connect?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    update?: VitalReadingUpdateWithWhereUniqueWithoutCarePlanInput | VitalReadingUpdateWithWhereUniqueWithoutCarePlanInput[]
    updateMany?: VitalReadingUpdateManyWithWhereWithoutCarePlanInput | VitalReadingUpdateManyWithWhereWithoutCarePlanInput[]
    deleteMany?: VitalReadingScalarWhereInput | VitalReadingScalarWhereInput[]
  }

  export type AlertUpdateManyWithoutCarePlanNestedInput = {
    create?: XOR<AlertCreateWithoutCarePlanInput, AlertUncheckedCreateWithoutCarePlanInput> | AlertCreateWithoutCarePlanInput[] | AlertUncheckedCreateWithoutCarePlanInput[]
    connectOrCreate?: AlertCreateOrConnectWithoutCarePlanInput | AlertCreateOrConnectWithoutCarePlanInput[]
    upsert?: AlertUpsertWithWhereUniqueWithoutCarePlanInput | AlertUpsertWithWhereUniqueWithoutCarePlanInput[]
    createMany?: AlertCreateManyCarePlanInputEnvelope
    set?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    disconnect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    delete?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    connect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    update?: AlertUpdateWithWhereUniqueWithoutCarePlanInput | AlertUpdateWithWhereUniqueWithoutCarePlanInput[]
    updateMany?: AlertUpdateManyWithWhereWithoutCarePlanInput | AlertUpdateManyWithWhereWithoutCarePlanInput[]
    deleteMany?: AlertScalarWhereInput | AlertScalarWhereInput[]
  }

  export type CareTaskUncheckedUpdateManyWithoutCarePlanNestedInput = {
    create?: XOR<CareTaskCreateWithoutCarePlanInput, CareTaskUncheckedCreateWithoutCarePlanInput> | CareTaskCreateWithoutCarePlanInput[] | CareTaskUncheckedCreateWithoutCarePlanInput[]
    connectOrCreate?: CareTaskCreateOrConnectWithoutCarePlanInput | CareTaskCreateOrConnectWithoutCarePlanInput[]
    upsert?: CareTaskUpsertWithWhereUniqueWithoutCarePlanInput | CareTaskUpsertWithWhereUniqueWithoutCarePlanInput[]
    createMany?: CareTaskCreateManyCarePlanInputEnvelope
    set?: CareTaskWhereUniqueInput | CareTaskWhereUniqueInput[]
    disconnect?: CareTaskWhereUniqueInput | CareTaskWhereUniqueInput[]
    delete?: CareTaskWhereUniqueInput | CareTaskWhereUniqueInput[]
    connect?: CareTaskWhereUniqueInput | CareTaskWhereUniqueInput[]
    update?: CareTaskUpdateWithWhereUniqueWithoutCarePlanInput | CareTaskUpdateWithWhereUniqueWithoutCarePlanInput[]
    updateMany?: CareTaskUpdateManyWithWhereWithoutCarePlanInput | CareTaskUpdateManyWithWhereWithoutCarePlanInput[]
    deleteMany?: CareTaskScalarWhereInput | CareTaskScalarWhereInput[]
  }

  export type VitalReadingUncheckedUpdateManyWithoutCarePlanNestedInput = {
    create?: XOR<VitalReadingCreateWithoutCarePlanInput, VitalReadingUncheckedCreateWithoutCarePlanInput> | VitalReadingCreateWithoutCarePlanInput[] | VitalReadingUncheckedCreateWithoutCarePlanInput[]
    connectOrCreate?: VitalReadingCreateOrConnectWithoutCarePlanInput | VitalReadingCreateOrConnectWithoutCarePlanInput[]
    upsert?: VitalReadingUpsertWithWhereUniqueWithoutCarePlanInput | VitalReadingUpsertWithWhereUniqueWithoutCarePlanInput[]
    createMany?: VitalReadingCreateManyCarePlanInputEnvelope
    set?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    disconnect?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    delete?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    connect?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    update?: VitalReadingUpdateWithWhereUniqueWithoutCarePlanInput | VitalReadingUpdateWithWhereUniqueWithoutCarePlanInput[]
    updateMany?: VitalReadingUpdateManyWithWhereWithoutCarePlanInput | VitalReadingUpdateManyWithWhereWithoutCarePlanInput[]
    deleteMany?: VitalReadingScalarWhereInput | VitalReadingScalarWhereInput[]
  }

  export type AlertUncheckedUpdateManyWithoutCarePlanNestedInput = {
    create?: XOR<AlertCreateWithoutCarePlanInput, AlertUncheckedCreateWithoutCarePlanInput> | AlertCreateWithoutCarePlanInput[] | AlertUncheckedCreateWithoutCarePlanInput[]
    connectOrCreate?: AlertCreateOrConnectWithoutCarePlanInput | AlertCreateOrConnectWithoutCarePlanInput[]
    upsert?: AlertUpsertWithWhereUniqueWithoutCarePlanInput | AlertUpsertWithWhereUniqueWithoutCarePlanInput[]
    createMany?: AlertCreateManyCarePlanInputEnvelope
    set?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    disconnect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    delete?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    connect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    update?: AlertUpdateWithWhereUniqueWithoutCarePlanInput | AlertUpdateWithWhereUniqueWithoutCarePlanInput[]
    updateMany?: AlertUpdateManyWithWhereWithoutCarePlanInput | AlertUpdateManyWithWhereWithoutCarePlanInput[]
    deleteMany?: AlertScalarWhereInput | AlertScalarWhereInput[]
  }

  export type CarePlanCreateNestedOneWithoutTasksInput = {
    create?: XOR<CarePlanCreateWithoutTasksInput, CarePlanUncheckedCreateWithoutTasksInput>
    connectOrCreate?: CarePlanCreateOrConnectWithoutTasksInput
    connect?: CarePlanWhereUniqueInput
  }

  export type EnumTaskTypeFieldUpdateOperationsInput = {
    set?: $Enums.TaskType
  }

  export type EnumTaskStatusFieldUpdateOperationsInput = {
    set?: $Enums.TaskStatus
  }

  export type CarePlanUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<CarePlanCreateWithoutTasksInput, CarePlanUncheckedCreateWithoutTasksInput>
    connectOrCreate?: CarePlanCreateOrConnectWithoutTasksInput
    upsert?: CarePlanUpsertWithoutTasksInput
    connect?: CarePlanWhereUniqueInput
    update?: XOR<XOR<CarePlanUpdateToOneWithWhereWithoutTasksInput, CarePlanUpdateWithoutTasksInput>, CarePlanUncheckedUpdateWithoutTasksInput>
  }

  export type VitalReadingCreateNestedManyWithoutDeviceInput = {
    create?: XOR<VitalReadingCreateWithoutDeviceInput, VitalReadingUncheckedCreateWithoutDeviceInput> | VitalReadingCreateWithoutDeviceInput[] | VitalReadingUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: VitalReadingCreateOrConnectWithoutDeviceInput | VitalReadingCreateOrConnectWithoutDeviceInput[]
    createMany?: VitalReadingCreateManyDeviceInputEnvelope
    connect?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
  }

  export type VitalReadingUncheckedCreateNestedManyWithoutDeviceInput = {
    create?: XOR<VitalReadingCreateWithoutDeviceInput, VitalReadingUncheckedCreateWithoutDeviceInput> | VitalReadingCreateWithoutDeviceInput[] | VitalReadingUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: VitalReadingCreateOrConnectWithoutDeviceInput | VitalReadingCreateOrConnectWithoutDeviceInput[]
    createMany?: VitalReadingCreateManyDeviceInputEnvelope
    connect?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
  }

  export type EnumDeviceTypeFieldUpdateOperationsInput = {
    set?: $Enums.DeviceType
  }

  export type EnumDeviceStatusFieldUpdateOperationsInput = {
    set?: $Enums.DeviceStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type VitalReadingUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<VitalReadingCreateWithoutDeviceInput, VitalReadingUncheckedCreateWithoutDeviceInput> | VitalReadingCreateWithoutDeviceInput[] | VitalReadingUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: VitalReadingCreateOrConnectWithoutDeviceInput | VitalReadingCreateOrConnectWithoutDeviceInput[]
    upsert?: VitalReadingUpsertWithWhereUniqueWithoutDeviceInput | VitalReadingUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: VitalReadingCreateManyDeviceInputEnvelope
    set?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    disconnect?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    delete?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    connect?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    update?: VitalReadingUpdateWithWhereUniqueWithoutDeviceInput | VitalReadingUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: VitalReadingUpdateManyWithWhereWithoutDeviceInput | VitalReadingUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: VitalReadingScalarWhereInput | VitalReadingScalarWhereInput[]
  }

  export type VitalReadingUncheckedUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<VitalReadingCreateWithoutDeviceInput, VitalReadingUncheckedCreateWithoutDeviceInput> | VitalReadingCreateWithoutDeviceInput[] | VitalReadingUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: VitalReadingCreateOrConnectWithoutDeviceInput | VitalReadingCreateOrConnectWithoutDeviceInput[]
    upsert?: VitalReadingUpsertWithWhereUniqueWithoutDeviceInput | VitalReadingUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: VitalReadingCreateManyDeviceInputEnvelope
    set?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    disconnect?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    delete?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    connect?: VitalReadingWhereUniqueInput | VitalReadingWhereUniqueInput[]
    update?: VitalReadingUpdateWithWhereUniqueWithoutDeviceInput | VitalReadingUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: VitalReadingUpdateManyWithWhereWithoutDeviceInput | VitalReadingUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: VitalReadingScalarWhereInput | VitalReadingScalarWhereInput[]
  }

  export type CarePlanCreateNestedOneWithoutVitalsInput = {
    create?: XOR<CarePlanCreateWithoutVitalsInput, CarePlanUncheckedCreateWithoutVitalsInput>
    connectOrCreate?: CarePlanCreateOrConnectWithoutVitalsInput
    connect?: CarePlanWhereUniqueInput
  }

  export type MonitoringDeviceCreateNestedOneWithoutReadingsInput = {
    create?: XOR<MonitoringDeviceCreateWithoutReadingsInput, MonitoringDeviceUncheckedCreateWithoutReadingsInput>
    connectOrCreate?: MonitoringDeviceCreateOrConnectWithoutReadingsInput
    connect?: MonitoringDeviceWhereUniqueInput
  }

  export type EnumVitalTypeFieldUpdateOperationsInput = {
    set?: $Enums.VitalType
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type CarePlanUpdateOneWithoutVitalsNestedInput = {
    create?: XOR<CarePlanCreateWithoutVitalsInput, CarePlanUncheckedCreateWithoutVitalsInput>
    connectOrCreate?: CarePlanCreateOrConnectWithoutVitalsInput
    upsert?: CarePlanUpsertWithoutVitalsInput
    disconnect?: CarePlanWhereInput | boolean
    delete?: CarePlanWhereInput | boolean
    connect?: CarePlanWhereUniqueInput
    update?: XOR<XOR<CarePlanUpdateToOneWithWhereWithoutVitalsInput, CarePlanUpdateWithoutVitalsInput>, CarePlanUncheckedUpdateWithoutVitalsInput>
  }

  export type MonitoringDeviceUpdateOneWithoutReadingsNestedInput = {
    create?: XOR<MonitoringDeviceCreateWithoutReadingsInput, MonitoringDeviceUncheckedCreateWithoutReadingsInput>
    connectOrCreate?: MonitoringDeviceCreateOrConnectWithoutReadingsInput
    upsert?: MonitoringDeviceUpsertWithoutReadingsInput
    disconnect?: MonitoringDeviceWhereInput | boolean
    delete?: MonitoringDeviceWhereInput | boolean
    connect?: MonitoringDeviceWhereUniqueInput
    update?: XOR<XOR<MonitoringDeviceUpdateToOneWithWhereWithoutReadingsInput, MonitoringDeviceUpdateWithoutReadingsInput>, MonitoringDeviceUncheckedUpdateWithoutReadingsInput>
  }

  export type CarePlanCreateNestedOneWithoutAlertsInput = {
    create?: XOR<CarePlanCreateWithoutAlertsInput, CarePlanUncheckedCreateWithoutAlertsInput>
    connectOrCreate?: CarePlanCreateOrConnectWithoutAlertsInput
    connect?: CarePlanWhereUniqueInput
  }

  export type EnumAlertTypeFieldUpdateOperationsInput = {
    set?: $Enums.AlertType
  }

  export type EnumAlertSeverityFieldUpdateOperationsInput = {
    set?: $Enums.AlertSeverity
  }

  export type EnumAlertStatusFieldUpdateOperationsInput = {
    set?: $Enums.AlertStatus
  }

  export type CarePlanUpdateOneWithoutAlertsNestedInput = {
    create?: XOR<CarePlanCreateWithoutAlertsInput, CarePlanUncheckedCreateWithoutAlertsInput>
    connectOrCreate?: CarePlanCreateOrConnectWithoutAlertsInput
    upsert?: CarePlanUpsertWithoutAlertsInput
    disconnect?: CarePlanWhereInput | boolean
    delete?: CarePlanWhereInput | boolean
    connect?: CarePlanWhereUniqueInput
    update?: XOR<XOR<CarePlanUpdateToOneWithWhereWithoutAlertsInput, CarePlanUpdateWithoutAlertsInput>, CarePlanUncheckedUpdateWithoutAlertsInput>
  }

  export type GoalProgressCreateNestedManyWithoutGoalInput = {
    create?: XOR<GoalProgressCreateWithoutGoalInput, GoalProgressUncheckedCreateWithoutGoalInput> | GoalProgressCreateWithoutGoalInput[] | GoalProgressUncheckedCreateWithoutGoalInput[]
    connectOrCreate?: GoalProgressCreateOrConnectWithoutGoalInput | GoalProgressCreateOrConnectWithoutGoalInput[]
    createMany?: GoalProgressCreateManyGoalInputEnvelope
    connect?: GoalProgressWhereUniqueInput | GoalProgressWhereUniqueInput[]
  }

  export type GoalProgressUncheckedCreateNestedManyWithoutGoalInput = {
    create?: XOR<GoalProgressCreateWithoutGoalInput, GoalProgressUncheckedCreateWithoutGoalInput> | GoalProgressCreateWithoutGoalInput[] | GoalProgressUncheckedCreateWithoutGoalInput[]
    connectOrCreate?: GoalProgressCreateOrConnectWithoutGoalInput | GoalProgressCreateOrConnectWithoutGoalInput[]
    createMany?: GoalProgressCreateManyGoalInputEnvelope
    connect?: GoalProgressWhereUniqueInput | GoalProgressWhereUniqueInput[]
  }

  export type EnumGoalTypeFieldUpdateOperationsInput = {
    set?: $Enums.GoalType
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumGoalStatusFieldUpdateOperationsInput = {
    set?: $Enums.GoalStatus
  }

  export type GoalProgressUpdateManyWithoutGoalNestedInput = {
    create?: XOR<GoalProgressCreateWithoutGoalInput, GoalProgressUncheckedCreateWithoutGoalInput> | GoalProgressCreateWithoutGoalInput[] | GoalProgressUncheckedCreateWithoutGoalInput[]
    connectOrCreate?: GoalProgressCreateOrConnectWithoutGoalInput | GoalProgressCreateOrConnectWithoutGoalInput[]
    upsert?: GoalProgressUpsertWithWhereUniqueWithoutGoalInput | GoalProgressUpsertWithWhereUniqueWithoutGoalInput[]
    createMany?: GoalProgressCreateManyGoalInputEnvelope
    set?: GoalProgressWhereUniqueInput | GoalProgressWhereUniqueInput[]
    disconnect?: GoalProgressWhereUniqueInput | GoalProgressWhereUniqueInput[]
    delete?: GoalProgressWhereUniqueInput | GoalProgressWhereUniqueInput[]
    connect?: GoalProgressWhereUniqueInput | GoalProgressWhereUniqueInput[]
    update?: GoalProgressUpdateWithWhereUniqueWithoutGoalInput | GoalProgressUpdateWithWhereUniqueWithoutGoalInput[]
    updateMany?: GoalProgressUpdateManyWithWhereWithoutGoalInput | GoalProgressUpdateManyWithWhereWithoutGoalInput[]
    deleteMany?: GoalProgressScalarWhereInput | GoalProgressScalarWhereInput[]
  }

  export type GoalProgressUncheckedUpdateManyWithoutGoalNestedInput = {
    create?: XOR<GoalProgressCreateWithoutGoalInput, GoalProgressUncheckedCreateWithoutGoalInput> | GoalProgressCreateWithoutGoalInput[] | GoalProgressUncheckedCreateWithoutGoalInput[]
    connectOrCreate?: GoalProgressCreateOrConnectWithoutGoalInput | GoalProgressCreateOrConnectWithoutGoalInput[]
    upsert?: GoalProgressUpsertWithWhereUniqueWithoutGoalInput | GoalProgressUpsertWithWhereUniqueWithoutGoalInput[]
    createMany?: GoalProgressCreateManyGoalInputEnvelope
    set?: GoalProgressWhereUniqueInput | GoalProgressWhereUniqueInput[]
    disconnect?: GoalProgressWhereUniqueInput | GoalProgressWhereUniqueInput[]
    delete?: GoalProgressWhereUniqueInput | GoalProgressWhereUniqueInput[]
    connect?: GoalProgressWhereUniqueInput | GoalProgressWhereUniqueInput[]
    update?: GoalProgressUpdateWithWhereUniqueWithoutGoalInput | GoalProgressUpdateWithWhereUniqueWithoutGoalInput[]
    updateMany?: GoalProgressUpdateManyWithWhereWithoutGoalInput | GoalProgressUpdateManyWithWhereWithoutGoalInput[]
    deleteMany?: GoalProgressScalarWhereInput | GoalProgressScalarWhereInput[]
  }

  export type GoalCreateNestedOneWithoutProgressInput = {
    create?: XOR<GoalCreateWithoutProgressInput, GoalUncheckedCreateWithoutProgressInput>
    connectOrCreate?: GoalCreateOrConnectWithoutProgressInput
    connect?: GoalWhereUniqueInput
  }

  export type GoalUpdateOneRequiredWithoutProgressNestedInput = {
    create?: XOR<GoalCreateWithoutProgressInput, GoalUncheckedCreateWithoutProgressInput>
    connectOrCreate?: GoalCreateOrConnectWithoutProgressInput
    upsert?: GoalUpsertWithoutProgressInput
    connect?: GoalWhereUniqueInput
    update?: XOR<XOR<GoalUpdateToOneWithWhereWithoutProgressInput, GoalUpdateWithoutProgressInput>, GoalUncheckedUpdateWithoutProgressInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumEngagementTypeFieldUpdateOperationsInput = {
    set?: $Enums.EngagementType
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

  export type NestedEnumPlanStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanStatus | EnumPlanStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanStatusFilter<$PrismaModel> | $Enums.PlanStatus
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

  export type NestedEnumPlanStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanStatus | EnumPlanStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlanStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanStatusFilter<$PrismaModel>
    _max?: NestedEnumPlanStatusFilter<$PrismaModel>
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

  export type NestedEnumTaskTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeFilter<$PrismaModel> | $Enums.TaskType
  }

  export type NestedEnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel> | $Enums.TaskType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskTypeFilter<$PrismaModel>
    _max?: NestedEnumTaskTypeFilter<$PrismaModel>
  }

  export type NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type NestedEnumDeviceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceTypeFilter<$PrismaModel> | $Enums.DeviceType
  }

  export type NestedEnumDeviceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceStatus | EnumDeviceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceStatusFilter<$PrismaModel> | $Enums.DeviceStatus
  }

  export type NestedEnumDeviceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceTypeWithAggregatesFilter<$PrismaModel> | $Enums.DeviceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceTypeFilter<$PrismaModel>
    _max?: NestedEnumDeviceTypeFilter<$PrismaModel>
  }

  export type NestedEnumDeviceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceStatus | EnumDeviceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceStatusWithAggregatesFilter<$PrismaModel> | $Enums.DeviceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceStatusFilter<$PrismaModel>
    _max?: NestedEnumDeviceStatusFilter<$PrismaModel>
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

  export type NestedEnumVitalTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.VitalType | EnumVitalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.VitalType[] | ListEnumVitalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VitalType[] | ListEnumVitalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumVitalTypeFilter<$PrismaModel> | $Enums.VitalType
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumVitalTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VitalType | EnumVitalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.VitalType[] | ListEnumVitalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VitalType[] | ListEnumVitalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumVitalTypeWithAggregatesFilter<$PrismaModel> | $Enums.VitalType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVitalTypeFilter<$PrismaModel>
    _max?: NestedEnumVitalTypeFilter<$PrismaModel>
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumAlertTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertType | EnumAlertTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertTypeFilter<$PrismaModel> | $Enums.AlertType
  }

  export type NestedEnumAlertSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertSeverity | EnumAlertSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertSeverityFilter<$PrismaModel> | $Enums.AlertSeverity
  }

  export type NestedEnumAlertStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertStatus | EnumAlertStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AlertStatus[] | ListEnumAlertStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertStatus[] | ListEnumAlertStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertStatusFilter<$PrismaModel> | $Enums.AlertStatus
  }

  export type NestedEnumAlertTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertType | EnumAlertTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertTypeWithAggregatesFilter<$PrismaModel> | $Enums.AlertType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAlertTypeFilter<$PrismaModel>
    _max?: NestedEnumAlertTypeFilter<$PrismaModel>
  }

  export type NestedEnumAlertSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertSeverity | EnumAlertSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertSeverityWithAggregatesFilter<$PrismaModel> | $Enums.AlertSeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAlertSeverityFilter<$PrismaModel>
    _max?: NestedEnumAlertSeverityFilter<$PrismaModel>
  }

  export type NestedEnumAlertStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertStatus | EnumAlertStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AlertStatus[] | ListEnumAlertStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertStatus[] | ListEnumAlertStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertStatusWithAggregatesFilter<$PrismaModel> | $Enums.AlertStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAlertStatusFilter<$PrismaModel>
    _max?: NestedEnumAlertStatusFilter<$PrismaModel>
  }

  export type NestedEnumGoalTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.GoalType | EnumGoalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GoalType[] | ListEnumGoalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.GoalType[] | ListEnumGoalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumGoalTypeFilter<$PrismaModel> | $Enums.GoalType
  }

  export type NestedEnumGoalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GoalStatus | EnumGoalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GoalStatus[] | ListEnumGoalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GoalStatus[] | ListEnumGoalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGoalStatusFilter<$PrismaModel> | $Enums.GoalStatus
  }

  export type NestedEnumGoalTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GoalType | EnumGoalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GoalType[] | ListEnumGoalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.GoalType[] | ListEnumGoalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumGoalTypeWithAggregatesFilter<$PrismaModel> | $Enums.GoalType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGoalTypeFilter<$PrismaModel>
    _max?: NestedEnumGoalTypeFilter<$PrismaModel>
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

  export type NestedEnumGoalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GoalStatus | EnumGoalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GoalStatus[] | ListEnumGoalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GoalStatus[] | ListEnumGoalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGoalStatusWithAggregatesFilter<$PrismaModel> | $Enums.GoalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGoalStatusFilter<$PrismaModel>
    _max?: NestedEnumGoalStatusFilter<$PrismaModel>
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

  export type NestedEnumEngagementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EngagementType | EnumEngagementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EngagementType[] | ListEnumEngagementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EngagementType[] | ListEnumEngagementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEngagementTypeFilter<$PrismaModel> | $Enums.EngagementType
  }

  export type NestedEnumEngagementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EngagementType | EnumEngagementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EngagementType[] | ListEnumEngagementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EngagementType[] | ListEnumEngagementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEngagementTypeWithAggregatesFilter<$PrismaModel> | $Enums.EngagementType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEngagementTypeFilter<$PrismaModel>
    _max?: NestedEnumEngagementTypeFilter<$PrismaModel>
  }

  export type CareTaskCreateWithoutCarePlanInput = {
    id?: string
    title: string
    description?: string | null
    taskType: $Enums.TaskType
    frequency: string
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    status?: $Enums.TaskStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CareTaskUncheckedCreateWithoutCarePlanInput = {
    id?: string
    title: string
    description?: string | null
    taskType: $Enums.TaskType
    frequency: string
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    status?: $Enums.TaskStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CareTaskCreateOrConnectWithoutCarePlanInput = {
    where: CareTaskWhereUniqueInput
    create: XOR<CareTaskCreateWithoutCarePlanInput, CareTaskUncheckedCreateWithoutCarePlanInput>
  }

  export type CareTaskCreateManyCarePlanInputEnvelope = {
    data: CareTaskCreateManyCarePlanInput | CareTaskCreateManyCarePlanInput[]
    skipDuplicates?: boolean
  }

  export type VitalReadingCreateWithoutCarePlanInput = {
    id?: string
    patientId: string
    vitalType: $Enums.VitalType
    value: number
    unit: string
    isAbnormal?: boolean
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
    device?: MonitoringDeviceCreateNestedOneWithoutReadingsInput
  }

  export type VitalReadingUncheckedCreateWithoutCarePlanInput = {
    id?: string
    patientId: string
    deviceId?: string | null
    vitalType: $Enums.VitalType
    value: number
    unit: string
    isAbnormal?: boolean
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type VitalReadingCreateOrConnectWithoutCarePlanInput = {
    where: VitalReadingWhereUniqueInput
    create: XOR<VitalReadingCreateWithoutCarePlanInput, VitalReadingUncheckedCreateWithoutCarePlanInput>
  }

  export type VitalReadingCreateManyCarePlanInputEnvelope = {
    data: VitalReadingCreateManyCarePlanInput | VitalReadingCreateManyCarePlanInput[]
    skipDuplicates?: boolean
  }

  export type AlertCreateWithoutCarePlanInput = {
    id?: string
    patientId: string
    alertType: $Enums.AlertType
    severity: $Enums.AlertSeverity
    title: string
    description: string
    status?: $Enums.AlertStatus
    acknowledgedBy?: string | null
    acknowledgedAt?: Date | string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertUncheckedCreateWithoutCarePlanInput = {
    id?: string
    patientId: string
    alertType: $Enums.AlertType
    severity: $Enums.AlertSeverity
    title: string
    description: string
    status?: $Enums.AlertStatus
    acknowledgedBy?: string | null
    acknowledgedAt?: Date | string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertCreateOrConnectWithoutCarePlanInput = {
    where: AlertWhereUniqueInput
    create: XOR<AlertCreateWithoutCarePlanInput, AlertUncheckedCreateWithoutCarePlanInput>
  }

  export type AlertCreateManyCarePlanInputEnvelope = {
    data: AlertCreateManyCarePlanInput | AlertCreateManyCarePlanInput[]
    skipDuplicates?: boolean
  }

  export type CareTaskUpsertWithWhereUniqueWithoutCarePlanInput = {
    where: CareTaskWhereUniqueInput
    update: XOR<CareTaskUpdateWithoutCarePlanInput, CareTaskUncheckedUpdateWithoutCarePlanInput>
    create: XOR<CareTaskCreateWithoutCarePlanInput, CareTaskUncheckedCreateWithoutCarePlanInput>
  }

  export type CareTaskUpdateWithWhereUniqueWithoutCarePlanInput = {
    where: CareTaskWhereUniqueInput
    data: XOR<CareTaskUpdateWithoutCarePlanInput, CareTaskUncheckedUpdateWithoutCarePlanInput>
  }

  export type CareTaskUpdateManyWithWhereWithoutCarePlanInput = {
    where: CareTaskScalarWhereInput
    data: XOR<CareTaskUpdateManyMutationInput, CareTaskUncheckedUpdateManyWithoutCarePlanInput>
  }

  export type CareTaskScalarWhereInput = {
    AND?: CareTaskScalarWhereInput | CareTaskScalarWhereInput[]
    OR?: CareTaskScalarWhereInput[]
    NOT?: CareTaskScalarWhereInput | CareTaskScalarWhereInput[]
    id?: StringFilter<"CareTask"> | string
    carePlanId?: StringFilter<"CareTask"> | string
    title?: StringFilter<"CareTask"> | string
    description?: StringNullableFilter<"CareTask"> | string | null
    taskType?: EnumTaskTypeFilter<"CareTask"> | $Enums.TaskType
    frequency?: StringFilter<"CareTask"> | string
    dueDate?: DateTimeNullableFilter<"CareTask"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"CareTask"> | Date | string | null
    status?: EnumTaskStatusFilter<"CareTask"> | $Enums.TaskStatus
    notes?: StringNullableFilter<"CareTask"> | string | null
    createdAt?: DateTimeFilter<"CareTask"> | Date | string
    updatedAt?: DateTimeFilter<"CareTask"> | Date | string
  }

  export type VitalReadingUpsertWithWhereUniqueWithoutCarePlanInput = {
    where: VitalReadingWhereUniqueInput
    update: XOR<VitalReadingUpdateWithoutCarePlanInput, VitalReadingUncheckedUpdateWithoutCarePlanInput>
    create: XOR<VitalReadingCreateWithoutCarePlanInput, VitalReadingUncheckedCreateWithoutCarePlanInput>
  }

  export type VitalReadingUpdateWithWhereUniqueWithoutCarePlanInput = {
    where: VitalReadingWhereUniqueInput
    data: XOR<VitalReadingUpdateWithoutCarePlanInput, VitalReadingUncheckedUpdateWithoutCarePlanInput>
  }

  export type VitalReadingUpdateManyWithWhereWithoutCarePlanInput = {
    where: VitalReadingScalarWhereInput
    data: XOR<VitalReadingUpdateManyMutationInput, VitalReadingUncheckedUpdateManyWithoutCarePlanInput>
  }

  export type VitalReadingScalarWhereInput = {
    AND?: VitalReadingScalarWhereInput | VitalReadingScalarWhereInput[]
    OR?: VitalReadingScalarWhereInput[]
    NOT?: VitalReadingScalarWhereInput | VitalReadingScalarWhereInput[]
    id?: StringFilter<"VitalReading"> | string
    patientId?: StringFilter<"VitalReading"> | string
    carePlanId?: StringNullableFilter<"VitalReading"> | string | null
    deviceId?: StringNullableFilter<"VitalReading"> | string | null
    vitalType?: EnumVitalTypeFilter<"VitalReading"> | $Enums.VitalType
    value?: FloatFilter<"VitalReading"> | number
    unit?: StringFilter<"VitalReading"> | string
    isAbnormal?: BoolFilter<"VitalReading"> | boolean
    notes?: StringNullableFilter<"VitalReading"> | string | null
    recordedAt?: DateTimeFilter<"VitalReading"> | Date | string
    createdAt?: DateTimeFilter<"VitalReading"> | Date | string
  }

  export type AlertUpsertWithWhereUniqueWithoutCarePlanInput = {
    where: AlertWhereUniqueInput
    update: XOR<AlertUpdateWithoutCarePlanInput, AlertUncheckedUpdateWithoutCarePlanInput>
    create: XOR<AlertCreateWithoutCarePlanInput, AlertUncheckedCreateWithoutCarePlanInput>
  }

  export type AlertUpdateWithWhereUniqueWithoutCarePlanInput = {
    where: AlertWhereUniqueInput
    data: XOR<AlertUpdateWithoutCarePlanInput, AlertUncheckedUpdateWithoutCarePlanInput>
  }

  export type AlertUpdateManyWithWhereWithoutCarePlanInput = {
    where: AlertScalarWhereInput
    data: XOR<AlertUpdateManyMutationInput, AlertUncheckedUpdateManyWithoutCarePlanInput>
  }

  export type AlertScalarWhereInput = {
    AND?: AlertScalarWhereInput | AlertScalarWhereInput[]
    OR?: AlertScalarWhereInput[]
    NOT?: AlertScalarWhereInput | AlertScalarWhereInput[]
    id?: StringFilter<"Alert"> | string
    patientId?: StringFilter<"Alert"> | string
    carePlanId?: StringNullableFilter<"Alert"> | string | null
    alertType?: EnumAlertTypeFilter<"Alert"> | $Enums.AlertType
    severity?: EnumAlertSeverityFilter<"Alert"> | $Enums.AlertSeverity
    title?: StringFilter<"Alert"> | string
    description?: StringFilter<"Alert"> | string
    status?: EnumAlertStatusFilter<"Alert"> | $Enums.AlertStatus
    acknowledgedBy?: StringNullableFilter<"Alert"> | string | null
    acknowledgedAt?: DateTimeNullableFilter<"Alert"> | Date | string | null
    resolvedAt?: DateTimeNullableFilter<"Alert"> | Date | string | null
    createdAt?: DateTimeFilter<"Alert"> | Date | string
    updatedAt?: DateTimeFilter<"Alert"> | Date | string
  }

  export type CarePlanCreateWithoutTasksInput = {
    id?: string
    patientId: string
    providerId: string
    condition: string
    status?: $Enums.PlanStatus
    startDate?: Date | string
    endDate?: Date | string | null
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    reviewSchedule?: string | null
    nextReviewDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vitals?: VitalReadingCreateNestedManyWithoutCarePlanInput
    alerts?: AlertCreateNestedManyWithoutCarePlanInput
  }

  export type CarePlanUncheckedCreateWithoutTasksInput = {
    id?: string
    patientId: string
    providerId: string
    condition: string
    status?: $Enums.PlanStatus
    startDate?: Date | string
    endDate?: Date | string | null
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    reviewSchedule?: string | null
    nextReviewDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vitals?: VitalReadingUncheckedCreateNestedManyWithoutCarePlanInput
    alerts?: AlertUncheckedCreateNestedManyWithoutCarePlanInput
  }

  export type CarePlanCreateOrConnectWithoutTasksInput = {
    where: CarePlanWhereUniqueInput
    create: XOR<CarePlanCreateWithoutTasksInput, CarePlanUncheckedCreateWithoutTasksInput>
  }

  export type CarePlanUpsertWithoutTasksInput = {
    update: XOR<CarePlanUpdateWithoutTasksInput, CarePlanUncheckedUpdateWithoutTasksInput>
    create: XOR<CarePlanCreateWithoutTasksInput, CarePlanUncheckedCreateWithoutTasksInput>
    where?: CarePlanWhereInput
  }

  export type CarePlanUpdateToOneWithWhereWithoutTasksInput = {
    where?: CarePlanWhereInput
    data: XOR<CarePlanUpdateWithoutTasksInput, CarePlanUncheckedUpdateWithoutTasksInput>
  }

  export type CarePlanUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    nextReviewDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vitals?: VitalReadingUpdateManyWithoutCarePlanNestedInput
    alerts?: AlertUpdateManyWithoutCarePlanNestedInput
  }

  export type CarePlanUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    nextReviewDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vitals?: VitalReadingUncheckedUpdateManyWithoutCarePlanNestedInput
    alerts?: AlertUncheckedUpdateManyWithoutCarePlanNestedInput
  }

  export type VitalReadingCreateWithoutDeviceInput = {
    id?: string
    patientId: string
    vitalType: $Enums.VitalType
    value: number
    unit: string
    isAbnormal?: boolean
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
    carePlan?: CarePlanCreateNestedOneWithoutVitalsInput
  }

  export type VitalReadingUncheckedCreateWithoutDeviceInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    vitalType: $Enums.VitalType
    value: number
    unit: string
    isAbnormal?: boolean
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type VitalReadingCreateOrConnectWithoutDeviceInput = {
    where: VitalReadingWhereUniqueInput
    create: XOR<VitalReadingCreateWithoutDeviceInput, VitalReadingUncheckedCreateWithoutDeviceInput>
  }

  export type VitalReadingCreateManyDeviceInputEnvelope = {
    data: VitalReadingCreateManyDeviceInput | VitalReadingCreateManyDeviceInput[]
    skipDuplicates?: boolean
  }

  export type VitalReadingUpsertWithWhereUniqueWithoutDeviceInput = {
    where: VitalReadingWhereUniqueInput
    update: XOR<VitalReadingUpdateWithoutDeviceInput, VitalReadingUncheckedUpdateWithoutDeviceInput>
    create: XOR<VitalReadingCreateWithoutDeviceInput, VitalReadingUncheckedCreateWithoutDeviceInput>
  }

  export type VitalReadingUpdateWithWhereUniqueWithoutDeviceInput = {
    where: VitalReadingWhereUniqueInput
    data: XOR<VitalReadingUpdateWithoutDeviceInput, VitalReadingUncheckedUpdateWithoutDeviceInput>
  }

  export type VitalReadingUpdateManyWithWhereWithoutDeviceInput = {
    where: VitalReadingScalarWhereInput
    data: XOR<VitalReadingUpdateManyMutationInput, VitalReadingUncheckedUpdateManyWithoutDeviceInput>
  }

  export type CarePlanCreateWithoutVitalsInput = {
    id?: string
    patientId: string
    providerId: string
    condition: string
    status?: $Enums.PlanStatus
    startDate?: Date | string
    endDate?: Date | string | null
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    reviewSchedule?: string | null
    nextReviewDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: CareTaskCreateNestedManyWithoutCarePlanInput
    alerts?: AlertCreateNestedManyWithoutCarePlanInput
  }

  export type CarePlanUncheckedCreateWithoutVitalsInput = {
    id?: string
    patientId: string
    providerId: string
    condition: string
    status?: $Enums.PlanStatus
    startDate?: Date | string
    endDate?: Date | string | null
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    reviewSchedule?: string | null
    nextReviewDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: CareTaskUncheckedCreateNestedManyWithoutCarePlanInput
    alerts?: AlertUncheckedCreateNestedManyWithoutCarePlanInput
  }

  export type CarePlanCreateOrConnectWithoutVitalsInput = {
    where: CarePlanWhereUniqueInput
    create: XOR<CarePlanCreateWithoutVitalsInput, CarePlanUncheckedCreateWithoutVitalsInput>
  }

  export type MonitoringDeviceCreateWithoutReadingsInput = {
    id?: string
    patientId: string
    deviceType: $Enums.DeviceType
    manufacturer?: string | null
    model?: string | null
    serialNumber: string
    status?: $Enums.DeviceStatus
    lastSyncAt?: Date | string | null
    batteryLevel?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MonitoringDeviceUncheckedCreateWithoutReadingsInput = {
    id?: string
    patientId: string
    deviceType: $Enums.DeviceType
    manufacturer?: string | null
    model?: string | null
    serialNumber: string
    status?: $Enums.DeviceStatus
    lastSyncAt?: Date | string | null
    batteryLevel?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MonitoringDeviceCreateOrConnectWithoutReadingsInput = {
    where: MonitoringDeviceWhereUniqueInput
    create: XOR<MonitoringDeviceCreateWithoutReadingsInput, MonitoringDeviceUncheckedCreateWithoutReadingsInput>
  }

  export type CarePlanUpsertWithoutVitalsInput = {
    update: XOR<CarePlanUpdateWithoutVitalsInput, CarePlanUncheckedUpdateWithoutVitalsInput>
    create: XOR<CarePlanCreateWithoutVitalsInput, CarePlanUncheckedCreateWithoutVitalsInput>
    where?: CarePlanWhereInput
  }

  export type CarePlanUpdateToOneWithWhereWithoutVitalsInput = {
    where?: CarePlanWhereInput
    data: XOR<CarePlanUpdateWithoutVitalsInput, CarePlanUncheckedUpdateWithoutVitalsInput>
  }

  export type CarePlanUpdateWithoutVitalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    nextReviewDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: CareTaskUpdateManyWithoutCarePlanNestedInput
    alerts?: AlertUpdateManyWithoutCarePlanNestedInput
  }

  export type CarePlanUncheckedUpdateWithoutVitalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    nextReviewDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: CareTaskUncheckedUpdateManyWithoutCarePlanNestedInput
    alerts?: AlertUncheckedUpdateManyWithoutCarePlanNestedInput
  }

  export type MonitoringDeviceUpsertWithoutReadingsInput = {
    update: XOR<MonitoringDeviceUpdateWithoutReadingsInput, MonitoringDeviceUncheckedUpdateWithoutReadingsInput>
    create: XOR<MonitoringDeviceCreateWithoutReadingsInput, MonitoringDeviceUncheckedCreateWithoutReadingsInput>
    where?: MonitoringDeviceWhereInput
  }

  export type MonitoringDeviceUpdateToOneWithWhereWithoutReadingsInput = {
    where?: MonitoringDeviceWhereInput
    data: XOR<MonitoringDeviceUpdateWithoutReadingsInput, MonitoringDeviceUncheckedUpdateWithoutReadingsInput>
  }

  export type MonitoringDeviceUpdateWithoutReadingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batteryLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MonitoringDeviceUncheckedUpdateWithoutReadingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batteryLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CarePlanCreateWithoutAlertsInput = {
    id?: string
    patientId: string
    providerId: string
    condition: string
    status?: $Enums.PlanStatus
    startDate?: Date | string
    endDate?: Date | string | null
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    reviewSchedule?: string | null
    nextReviewDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: CareTaskCreateNestedManyWithoutCarePlanInput
    vitals?: VitalReadingCreateNestedManyWithoutCarePlanInput
  }

  export type CarePlanUncheckedCreateWithoutAlertsInput = {
    id?: string
    patientId: string
    providerId: string
    condition: string
    status?: $Enums.PlanStatus
    startDate?: Date | string
    endDate?: Date | string | null
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    reviewSchedule?: string | null
    nextReviewDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: CareTaskUncheckedCreateNestedManyWithoutCarePlanInput
    vitals?: VitalReadingUncheckedCreateNestedManyWithoutCarePlanInput
  }

  export type CarePlanCreateOrConnectWithoutAlertsInput = {
    where: CarePlanWhereUniqueInput
    create: XOR<CarePlanCreateWithoutAlertsInput, CarePlanUncheckedCreateWithoutAlertsInput>
  }

  export type CarePlanUpsertWithoutAlertsInput = {
    update: XOR<CarePlanUpdateWithoutAlertsInput, CarePlanUncheckedUpdateWithoutAlertsInput>
    create: XOR<CarePlanCreateWithoutAlertsInput, CarePlanUncheckedCreateWithoutAlertsInput>
    where?: CarePlanWhereInput
  }

  export type CarePlanUpdateToOneWithWhereWithoutAlertsInput = {
    where?: CarePlanWhereInput
    data: XOR<CarePlanUpdateWithoutAlertsInput, CarePlanUncheckedUpdateWithoutAlertsInput>
  }

  export type CarePlanUpdateWithoutAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    nextReviewDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: CareTaskUpdateManyWithoutCarePlanNestedInput
    vitals?: VitalReadingUpdateManyWithoutCarePlanNestedInput
  }

  export type CarePlanUncheckedUpdateWithoutAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    reviewSchedule?: NullableStringFieldUpdateOperationsInput | string | null
    nextReviewDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: CareTaskUncheckedUpdateManyWithoutCarePlanNestedInput
    vitals?: VitalReadingUncheckedUpdateManyWithoutCarePlanNestedInput
  }

  export type GoalProgressCreateWithoutGoalInput = {
    id?: string
    value: number
    currentValue?: number | null
    currentUnit?: string | null
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type GoalProgressUncheckedCreateWithoutGoalInput = {
    id?: string
    value: number
    currentValue?: number | null
    currentUnit?: string | null
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type GoalProgressCreateOrConnectWithoutGoalInput = {
    where: GoalProgressWhereUniqueInput
    create: XOR<GoalProgressCreateWithoutGoalInput, GoalProgressUncheckedCreateWithoutGoalInput>
  }

  export type GoalProgressCreateManyGoalInputEnvelope = {
    data: GoalProgressCreateManyGoalInput | GoalProgressCreateManyGoalInput[]
    skipDuplicates?: boolean
  }

  export type GoalProgressUpsertWithWhereUniqueWithoutGoalInput = {
    where: GoalProgressWhereUniqueInput
    update: XOR<GoalProgressUpdateWithoutGoalInput, GoalProgressUncheckedUpdateWithoutGoalInput>
    create: XOR<GoalProgressCreateWithoutGoalInput, GoalProgressUncheckedCreateWithoutGoalInput>
  }

  export type GoalProgressUpdateWithWhereUniqueWithoutGoalInput = {
    where: GoalProgressWhereUniqueInput
    data: XOR<GoalProgressUpdateWithoutGoalInput, GoalProgressUncheckedUpdateWithoutGoalInput>
  }

  export type GoalProgressUpdateManyWithWhereWithoutGoalInput = {
    where: GoalProgressScalarWhereInput
    data: XOR<GoalProgressUpdateManyMutationInput, GoalProgressUncheckedUpdateManyWithoutGoalInput>
  }

  export type GoalProgressScalarWhereInput = {
    AND?: GoalProgressScalarWhereInput | GoalProgressScalarWhereInput[]
    OR?: GoalProgressScalarWhereInput[]
    NOT?: GoalProgressScalarWhereInput | GoalProgressScalarWhereInput[]
    id?: StringFilter<"GoalProgress"> | string
    goalId?: StringFilter<"GoalProgress"> | string
    value?: FloatFilter<"GoalProgress"> | number
    currentValue?: FloatNullableFilter<"GoalProgress"> | number | null
    currentUnit?: StringNullableFilter<"GoalProgress"> | string | null
    notes?: StringNullableFilter<"GoalProgress"> | string | null
    recordedAt?: DateTimeFilter<"GoalProgress"> | Date | string
    createdAt?: DateTimeFilter<"GoalProgress"> | Date | string
  }

  export type GoalCreateWithoutProgressInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    title: string
    description?: string | null
    goalType: $Enums.GoalType
    targetValue?: number | null
    targetUnit?: string | null
    targetDate?: Date | string | null
    frequency?: string | null
    status?: $Enums.GoalStatus
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoalUncheckedCreateWithoutProgressInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    title: string
    description?: string | null
    goalType: $Enums.GoalType
    targetValue?: number | null
    targetUnit?: string | null
    targetDate?: Date | string | null
    frequency?: string | null
    status?: $Enums.GoalStatus
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoalCreateOrConnectWithoutProgressInput = {
    where: GoalWhereUniqueInput
    create: XOR<GoalCreateWithoutProgressInput, GoalUncheckedCreateWithoutProgressInput>
  }

  export type GoalUpsertWithoutProgressInput = {
    update: XOR<GoalUpdateWithoutProgressInput, GoalUncheckedUpdateWithoutProgressInput>
    create: XOR<GoalCreateWithoutProgressInput, GoalUncheckedCreateWithoutProgressInput>
    where?: GoalWhereInput
  }

  export type GoalUpdateToOneWithWhereWithoutProgressInput = {
    where?: GoalWhereInput
    data: XOR<GoalUpdateWithoutProgressInput, GoalUncheckedUpdateWithoutProgressInput>
  }

  export type GoalUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goalType?: EnumGoalTypeFieldUpdateOperationsInput | $Enums.GoalType
    targetValue?: NullableFloatFieldUpdateOperationsInput | number | null
    targetUnit?: NullableStringFieldUpdateOperationsInput | string | null
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumGoalStatusFieldUpdateOperationsInput | $Enums.GoalStatus
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoalUncheckedUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goalType?: EnumGoalTypeFieldUpdateOperationsInput | $Enums.GoalType
    targetValue?: NullableFloatFieldUpdateOperationsInput | number | null
    targetUnit?: NullableStringFieldUpdateOperationsInput | string | null
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumGoalStatusFieldUpdateOperationsInput | $Enums.GoalStatus
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CareTaskCreateManyCarePlanInput = {
    id?: string
    title: string
    description?: string | null
    taskType: $Enums.TaskType
    frequency: string
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    status?: $Enums.TaskStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VitalReadingCreateManyCarePlanInput = {
    id?: string
    patientId: string
    deviceId?: string | null
    vitalType: $Enums.VitalType
    value: number
    unit: string
    isAbnormal?: boolean
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type AlertCreateManyCarePlanInput = {
    id?: string
    patientId: string
    alertType: $Enums.AlertType
    severity: $Enums.AlertSeverity
    title: string
    description: string
    status?: $Enums.AlertStatus
    acknowledgedBy?: string | null
    acknowledgedAt?: Date | string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CareTaskUpdateWithoutCarePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CareTaskUncheckedUpdateWithoutCarePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CareTaskUncheckedUpdateManyWithoutCarePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VitalReadingUpdateWithoutCarePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    value?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    device?: MonitoringDeviceUpdateOneWithoutReadingsNestedInput
  }

  export type VitalReadingUncheckedUpdateWithoutCarePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    value?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VitalReadingUncheckedUpdateManyWithoutCarePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    value?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertUpdateWithoutCarePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    alertType?: EnumAlertTypeFieldUpdateOperationsInput | $Enums.AlertType
    severity?: EnumAlertSeverityFieldUpdateOperationsInput | $Enums.AlertSeverity
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumAlertStatusFieldUpdateOperationsInput | $Enums.AlertStatus
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertUncheckedUpdateWithoutCarePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    alertType?: EnumAlertTypeFieldUpdateOperationsInput | $Enums.AlertType
    severity?: EnumAlertSeverityFieldUpdateOperationsInput | $Enums.AlertSeverity
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumAlertStatusFieldUpdateOperationsInput | $Enums.AlertStatus
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertUncheckedUpdateManyWithoutCarePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    alertType?: EnumAlertTypeFieldUpdateOperationsInput | $Enums.AlertType
    severity?: EnumAlertSeverityFieldUpdateOperationsInput | $Enums.AlertSeverity
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumAlertStatusFieldUpdateOperationsInput | $Enums.AlertStatus
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VitalReadingCreateManyDeviceInput = {
    id?: string
    patientId: string
    carePlanId?: string | null
    vitalType: $Enums.VitalType
    value: number
    unit: string
    isAbnormal?: boolean
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type VitalReadingUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    value?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carePlan?: CarePlanUpdateOneWithoutVitalsNestedInput
  }

  export type VitalReadingUncheckedUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    value?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VitalReadingUncheckedUpdateManyWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    carePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    vitalType?: EnumVitalTypeFieldUpdateOperationsInput | $Enums.VitalType
    value?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoalProgressCreateManyGoalInput = {
    id?: string
    value: number
    currentValue?: number | null
    currentUnit?: string | null
    notes?: string | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type GoalProgressUpdateWithoutGoalInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    currentValue?: NullableFloatFieldUpdateOperationsInput | number | null
    currentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoalProgressUncheckedUpdateWithoutGoalInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    currentValue?: NullableFloatFieldUpdateOperationsInput | number | null
    currentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoalProgressUncheckedUpdateManyWithoutGoalInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    currentValue?: NullableFloatFieldUpdateOperationsInput | number | null
    currentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use CarePlanCountOutputTypeDefaultArgs instead
     */
    export type CarePlanCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CarePlanCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MonitoringDeviceCountOutputTypeDefaultArgs instead
     */
    export type MonitoringDeviceCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MonitoringDeviceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GoalCountOutputTypeDefaultArgs instead
     */
    export type GoalCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GoalCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CarePlanDefaultArgs instead
     */
    export type CarePlanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CarePlanDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CareTaskDefaultArgs instead
     */
    export type CareTaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CareTaskDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MonitoringDeviceDefaultArgs instead
     */
    export type MonitoringDeviceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MonitoringDeviceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VitalReadingDefaultArgs instead
     */
    export type VitalReadingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VitalReadingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AlertDefaultArgs instead
     */
    export type AlertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AlertDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GoalDefaultArgs instead
     */
    export type GoalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GoalDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GoalProgressDefaultArgs instead
     */
    export type GoalProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GoalProgressDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AlertThresholdDefaultArgs instead
     */
    export type AlertThresholdArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AlertThresholdDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CarePlanTemplateDefaultArgs instead
     */
    export type CarePlanTemplateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CarePlanTemplateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientEngagementDefaultArgs instead
     */
    export type PatientEngagementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientEngagementDefaultArgs<ExtArgs>

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