
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
 * Model ClinicalTrial
 * 
 */
export type ClinicalTrial = $Result.DefaultSelection<Prisma.$ClinicalTrialPayload>
/**
 * Model TrialSite
 * 
 */
export type TrialSite = $Result.DefaultSelection<Prisma.$TrialSitePayload>
/**
 * Model PatientMatch
 * 
 */
export type PatientMatch = $Result.DefaultSelection<Prisma.$PatientMatchPayload>
/**
 * Model Enrollment
 * 
 */
export type Enrollment = $Result.DefaultSelection<Prisma.$EnrollmentPayload>
/**
 * Model EnrollmentStatusHistory
 * 
 */
export type EnrollmentStatusHistory = $Result.DefaultSelection<Prisma.$EnrollmentStatusHistoryPayload>
/**
 * Model ConsentRecord
 * 
 */
export type ConsentRecord = $Result.DefaultSelection<Prisma.$ConsentRecordPayload>
/**
 * Model TrialVisit
 * 
 */
export type TrialVisit = $Result.DefaultSelection<Prisma.$TrialVisitPayload>
/**
 * Model Investigator
 * 
 */
export type Investigator = $Result.DefaultSelection<Prisma.$InvestigatorPayload>
/**
 * Model InvestigatorSiteAssignment
 * 
 */
export type InvestigatorSiteAssignment = $Result.DefaultSelection<Prisma.$InvestigatorSiteAssignmentPayload>
/**
 * Model TrialNotification
 * 
 */
export type TrialNotification = $Result.DefaultSelection<Prisma.$TrialNotificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TrialStatus: {
  not_yet_recruiting: 'not_yet_recruiting',
  recruiting: 'recruiting',
  enrolling_by_invitation: 'enrolling_by_invitation',
  active_not_recruiting: 'active_not_recruiting',
  suspended: 'suspended',
  terminated: 'terminated',
  completed: 'completed',
  withdrawn: 'withdrawn',
  unknown: 'unknown'
};

export type TrialStatus = (typeof TrialStatus)[keyof typeof TrialStatus]


export const TrialPhase: {
  early_phase_1: 'early_phase_1',
  phase_1: 'phase_1',
  phase_1_2: 'phase_1_2',
  phase_2: 'phase_2',
  phase_2_3: 'phase_2_3',
  phase_3: 'phase_3',
  phase_4: 'phase_4',
  not_applicable: 'not_applicable'
};

export type TrialPhase = (typeof TrialPhase)[keyof typeof TrialPhase]


export const StudyType: {
  interventional: 'interventional',
  observational: 'observational',
  expanded_access: 'expanded_access',
  patient_registry: 'patient_registry'
};

export type StudyType = (typeof StudyType)[keyof typeof StudyType]


export const SiteStatus: {
  pending: 'pending',
  active: 'active',
  recruiting: 'recruiting',
  closed: 'closed',
  suspended: 'suspended',
  withdrawn: 'withdrawn'
};

export type SiteStatus = (typeof SiteStatus)[keyof typeof SiteStatus]


export const EligibilityStatus: {
  eligible: 'eligible',
  potentially_eligible: 'potentially_eligible',
  ineligible: 'ineligible',
  unknown: 'unknown',
  requires_screening: 'requires_screening'
};

export type EligibilityStatus = (typeof EligibilityStatus)[keyof typeof EligibilityStatus]


export const ReviewStatus: {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  needs_info: 'needs_info'
};

export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus]


export const EnrollmentStatus: {
  screening: 'screening',
  screen_failed: 'screen_failed',
  enrolled: 'enrolled',
  randomized: 'randomized',
  active: 'active',
  on_hold: 'on_hold',
  withdrawn: 'withdrawn',
  completed: 'completed',
  lost_to_follow_up: 'lost_to_follow_up'
};

export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus]


export const ConsentType: {
  main_study: 'main_study',
  optional_sub_study: 'optional_sub_study',
  genetic_testing: 'genetic_testing',
  biobanking: 'biobanking',
  future_contact: 'future_contact',
  data_sharing: 'data_sharing',
  imaging: 'imaging',
  amendment: 'amendment',
  reconsent: 'reconsent'
};

export type ConsentType = (typeof ConsentType)[keyof typeof ConsentType]


export const VisitType: {
  screening: 'screening',
  baseline: 'baseline',
  scheduled: 'scheduled',
  unscheduled: 'unscheduled',
  early_termination: 'early_termination',
  follow_up: 'follow_up',
  closeout: 'closeout'
};

export type VisitType = (typeof VisitType)[keyof typeof VisitType]


export const VisitStatus: {
  scheduled: 'scheduled',
  completed: 'completed',
  missed: 'missed',
  rescheduled: 'rescheduled',
  cancelled: 'cancelled'
};

export type VisitStatus = (typeof VisitStatus)[keyof typeof VisitStatus]


export const InvestigatorRole: {
  principal_investigator: 'principal_investigator',
  sub_investigator: 'sub_investigator',
  study_coordinator: 'study_coordinator',
  research_nurse: 'research_nurse',
  data_manager: 'data_manager',
  pharmacist: 'pharmacist',
  laboratory: 'laboratory'
};

export type InvestigatorRole = (typeof InvestigatorRole)[keyof typeof InvestigatorRole]


export const RecipientType: {
  patient: 'patient',
  investigator: 'investigator',
  coordinator: 'coordinator',
  sponsor: 'sponsor',
  admin: 'admin'
};

export type RecipientType = (typeof RecipientType)[keyof typeof RecipientType]


export const NotificationType: {
  new_match: 'new_match',
  eligibility_update: 'eligibility_update',
  enrollment_status: 'enrollment_status',
  visit_reminder: 'visit_reminder',
  consent_required: 'consent_required',
  trial_status_change: 'trial_status_change',
  document_ready: 'document_ready',
  action_required: 'action_required',
  general: 'general'
};

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]


export const NotificationPriority: {
  low: 'low',
  normal: 'normal',
  high: 'high',
  urgent: 'urgent'
};

export type NotificationPriority = (typeof NotificationPriority)[keyof typeof NotificationPriority]


export const DeliveryMethod: {
  in_app: 'in_app',
  email: 'email',
  sms: 'sms',
  push: 'push'
};

export type DeliveryMethod = (typeof DeliveryMethod)[keyof typeof DeliveryMethod]

}

export type TrialStatus = $Enums.TrialStatus

export const TrialStatus: typeof $Enums.TrialStatus

export type TrialPhase = $Enums.TrialPhase

export const TrialPhase: typeof $Enums.TrialPhase

export type StudyType = $Enums.StudyType

export const StudyType: typeof $Enums.StudyType

export type SiteStatus = $Enums.SiteStatus

export const SiteStatus: typeof $Enums.SiteStatus

export type EligibilityStatus = $Enums.EligibilityStatus

export const EligibilityStatus: typeof $Enums.EligibilityStatus

export type ReviewStatus = $Enums.ReviewStatus

export const ReviewStatus: typeof $Enums.ReviewStatus

export type EnrollmentStatus = $Enums.EnrollmentStatus

export const EnrollmentStatus: typeof $Enums.EnrollmentStatus

export type ConsentType = $Enums.ConsentType

export const ConsentType: typeof $Enums.ConsentType

export type VisitType = $Enums.VisitType

export const VisitType: typeof $Enums.VisitType

export type VisitStatus = $Enums.VisitStatus

export const VisitStatus: typeof $Enums.VisitStatus

export type InvestigatorRole = $Enums.InvestigatorRole

export const InvestigatorRole: typeof $Enums.InvestigatorRole

export type RecipientType = $Enums.RecipientType

export const RecipientType: typeof $Enums.RecipientType

export type NotificationType = $Enums.NotificationType

export const NotificationType: typeof $Enums.NotificationType

export type NotificationPriority = $Enums.NotificationPriority

export const NotificationPriority: typeof $Enums.NotificationPriority

export type DeliveryMethod = $Enums.DeliveryMethod

export const DeliveryMethod: typeof $Enums.DeliveryMethod

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ClinicalTrials
 * const clinicalTrials = await prisma.clinicalTrial.findMany()
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
   * // Fetch zero or more ClinicalTrials
   * const clinicalTrials = await prisma.clinicalTrial.findMany()
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
   * `prisma.clinicalTrial`: Exposes CRUD operations for the **ClinicalTrial** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClinicalTrials
    * const clinicalTrials = await prisma.clinicalTrial.findMany()
    * ```
    */
  get clinicalTrial(): Prisma.ClinicalTrialDelegate<ExtArgs>;

  /**
   * `prisma.trialSite`: Exposes CRUD operations for the **TrialSite** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrialSites
    * const trialSites = await prisma.trialSite.findMany()
    * ```
    */
  get trialSite(): Prisma.TrialSiteDelegate<ExtArgs>;

  /**
   * `prisma.patientMatch`: Exposes CRUD operations for the **PatientMatch** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientMatches
    * const patientMatches = await prisma.patientMatch.findMany()
    * ```
    */
  get patientMatch(): Prisma.PatientMatchDelegate<ExtArgs>;

  /**
   * `prisma.enrollment`: Exposes CRUD operations for the **Enrollment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Enrollments
    * const enrollments = await prisma.enrollment.findMany()
    * ```
    */
  get enrollment(): Prisma.EnrollmentDelegate<ExtArgs>;

  /**
   * `prisma.enrollmentStatusHistory`: Exposes CRUD operations for the **EnrollmentStatusHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EnrollmentStatusHistories
    * const enrollmentStatusHistories = await prisma.enrollmentStatusHistory.findMany()
    * ```
    */
  get enrollmentStatusHistory(): Prisma.EnrollmentStatusHistoryDelegate<ExtArgs>;

  /**
   * `prisma.consentRecord`: Exposes CRUD operations for the **ConsentRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConsentRecords
    * const consentRecords = await prisma.consentRecord.findMany()
    * ```
    */
  get consentRecord(): Prisma.ConsentRecordDelegate<ExtArgs>;

  /**
   * `prisma.trialVisit`: Exposes CRUD operations for the **TrialVisit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrialVisits
    * const trialVisits = await prisma.trialVisit.findMany()
    * ```
    */
  get trialVisit(): Prisma.TrialVisitDelegate<ExtArgs>;

  /**
   * `prisma.investigator`: Exposes CRUD operations for the **Investigator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Investigators
    * const investigators = await prisma.investigator.findMany()
    * ```
    */
  get investigator(): Prisma.InvestigatorDelegate<ExtArgs>;

  /**
   * `prisma.investigatorSiteAssignment`: Exposes CRUD operations for the **InvestigatorSiteAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InvestigatorSiteAssignments
    * const investigatorSiteAssignments = await prisma.investigatorSiteAssignment.findMany()
    * ```
    */
  get investigatorSiteAssignment(): Prisma.InvestigatorSiteAssignmentDelegate<ExtArgs>;

  /**
   * `prisma.trialNotification`: Exposes CRUD operations for the **TrialNotification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrialNotifications
    * const trialNotifications = await prisma.trialNotification.findMany()
    * ```
    */
  get trialNotification(): Prisma.TrialNotificationDelegate<ExtArgs>;
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
    ClinicalTrial: 'ClinicalTrial',
    TrialSite: 'TrialSite',
    PatientMatch: 'PatientMatch',
    Enrollment: 'Enrollment',
    EnrollmentStatusHistory: 'EnrollmentStatusHistory',
    ConsentRecord: 'ConsentRecord',
    TrialVisit: 'TrialVisit',
    Investigator: 'Investigator',
    InvestigatorSiteAssignment: 'InvestigatorSiteAssignment',
    TrialNotification: 'TrialNotification'
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
      modelProps: "clinicalTrial" | "trialSite" | "patientMatch" | "enrollment" | "enrollmentStatusHistory" | "consentRecord" | "trialVisit" | "investigator" | "investigatorSiteAssignment" | "trialNotification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ClinicalTrial: {
        payload: Prisma.$ClinicalTrialPayload<ExtArgs>
        fields: Prisma.ClinicalTrialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClinicalTrialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalTrialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClinicalTrialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalTrialPayload>
          }
          findFirst: {
            args: Prisma.ClinicalTrialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalTrialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClinicalTrialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalTrialPayload>
          }
          findMany: {
            args: Prisma.ClinicalTrialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalTrialPayload>[]
          }
          create: {
            args: Prisma.ClinicalTrialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalTrialPayload>
          }
          createMany: {
            args: Prisma.ClinicalTrialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClinicalTrialCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalTrialPayload>[]
          }
          delete: {
            args: Prisma.ClinicalTrialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalTrialPayload>
          }
          update: {
            args: Prisma.ClinicalTrialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalTrialPayload>
          }
          deleteMany: {
            args: Prisma.ClinicalTrialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClinicalTrialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClinicalTrialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalTrialPayload>
          }
          aggregate: {
            args: Prisma.ClinicalTrialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClinicalTrial>
          }
          groupBy: {
            args: Prisma.ClinicalTrialGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClinicalTrialGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClinicalTrialCountArgs<ExtArgs>
            result: $Utils.Optional<ClinicalTrialCountAggregateOutputType> | number
          }
        }
      }
      TrialSite: {
        payload: Prisma.$TrialSitePayload<ExtArgs>
        fields: Prisma.TrialSiteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrialSiteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialSitePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrialSiteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialSitePayload>
          }
          findFirst: {
            args: Prisma.TrialSiteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialSitePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrialSiteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialSitePayload>
          }
          findMany: {
            args: Prisma.TrialSiteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialSitePayload>[]
          }
          create: {
            args: Prisma.TrialSiteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialSitePayload>
          }
          createMany: {
            args: Prisma.TrialSiteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrialSiteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialSitePayload>[]
          }
          delete: {
            args: Prisma.TrialSiteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialSitePayload>
          }
          update: {
            args: Prisma.TrialSiteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialSitePayload>
          }
          deleteMany: {
            args: Prisma.TrialSiteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrialSiteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TrialSiteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialSitePayload>
          }
          aggregate: {
            args: Prisma.TrialSiteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrialSite>
          }
          groupBy: {
            args: Prisma.TrialSiteGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrialSiteGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrialSiteCountArgs<ExtArgs>
            result: $Utils.Optional<TrialSiteCountAggregateOutputType> | number
          }
        }
      }
      PatientMatch: {
        payload: Prisma.$PatientMatchPayload<ExtArgs>
        fields: Prisma.PatientMatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientMatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientMatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMatchPayload>
          }
          findFirst: {
            args: Prisma.PatientMatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientMatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMatchPayload>
          }
          findMany: {
            args: Prisma.PatientMatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMatchPayload>[]
          }
          create: {
            args: Prisma.PatientMatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMatchPayload>
          }
          createMany: {
            args: Prisma.PatientMatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientMatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMatchPayload>[]
          }
          delete: {
            args: Prisma.PatientMatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMatchPayload>
          }
          update: {
            args: Prisma.PatientMatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMatchPayload>
          }
          deleteMany: {
            args: Prisma.PatientMatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientMatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientMatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMatchPayload>
          }
          aggregate: {
            args: Prisma.PatientMatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientMatch>
          }
          groupBy: {
            args: Prisma.PatientMatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientMatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientMatchCountArgs<ExtArgs>
            result: $Utils.Optional<PatientMatchCountAggregateOutputType> | number
          }
        }
      }
      Enrollment: {
        payload: Prisma.$EnrollmentPayload<ExtArgs>
        fields: Prisma.EnrollmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EnrollmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EnrollmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentPayload>
          }
          findFirst: {
            args: Prisma.EnrollmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EnrollmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentPayload>
          }
          findMany: {
            args: Prisma.EnrollmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentPayload>[]
          }
          create: {
            args: Prisma.EnrollmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentPayload>
          }
          createMany: {
            args: Prisma.EnrollmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EnrollmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentPayload>[]
          }
          delete: {
            args: Prisma.EnrollmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentPayload>
          }
          update: {
            args: Prisma.EnrollmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentPayload>
          }
          deleteMany: {
            args: Prisma.EnrollmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EnrollmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EnrollmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentPayload>
          }
          aggregate: {
            args: Prisma.EnrollmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnrollment>
          }
          groupBy: {
            args: Prisma.EnrollmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnrollmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.EnrollmentCountArgs<ExtArgs>
            result: $Utils.Optional<EnrollmentCountAggregateOutputType> | number
          }
        }
      }
      EnrollmentStatusHistory: {
        payload: Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>
        fields: Prisma.EnrollmentStatusHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EnrollmentStatusHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentStatusHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EnrollmentStatusHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentStatusHistoryPayload>
          }
          findFirst: {
            args: Prisma.EnrollmentStatusHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentStatusHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EnrollmentStatusHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentStatusHistoryPayload>
          }
          findMany: {
            args: Prisma.EnrollmentStatusHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentStatusHistoryPayload>[]
          }
          create: {
            args: Prisma.EnrollmentStatusHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentStatusHistoryPayload>
          }
          createMany: {
            args: Prisma.EnrollmentStatusHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EnrollmentStatusHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentStatusHistoryPayload>[]
          }
          delete: {
            args: Prisma.EnrollmentStatusHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentStatusHistoryPayload>
          }
          update: {
            args: Prisma.EnrollmentStatusHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentStatusHistoryPayload>
          }
          deleteMany: {
            args: Prisma.EnrollmentStatusHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EnrollmentStatusHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EnrollmentStatusHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrollmentStatusHistoryPayload>
          }
          aggregate: {
            args: Prisma.EnrollmentStatusHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnrollmentStatusHistory>
          }
          groupBy: {
            args: Prisma.EnrollmentStatusHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnrollmentStatusHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.EnrollmentStatusHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<EnrollmentStatusHistoryCountAggregateOutputType> | number
          }
        }
      }
      ConsentRecord: {
        payload: Prisma.$ConsentRecordPayload<ExtArgs>
        fields: Prisma.ConsentRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConsentRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConsentRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>
          }
          findFirst: {
            args: Prisma.ConsentRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConsentRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>
          }
          findMany: {
            args: Prisma.ConsentRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>[]
          }
          create: {
            args: Prisma.ConsentRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>
          }
          createMany: {
            args: Prisma.ConsentRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConsentRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>[]
          }
          delete: {
            args: Prisma.ConsentRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>
          }
          update: {
            args: Prisma.ConsentRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>
          }
          deleteMany: {
            args: Prisma.ConsentRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConsentRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConsentRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>
          }
          aggregate: {
            args: Prisma.ConsentRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConsentRecord>
          }
          groupBy: {
            args: Prisma.ConsentRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConsentRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConsentRecordCountArgs<ExtArgs>
            result: $Utils.Optional<ConsentRecordCountAggregateOutputType> | number
          }
        }
      }
      TrialVisit: {
        payload: Prisma.$TrialVisitPayload<ExtArgs>
        fields: Prisma.TrialVisitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrialVisitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialVisitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrialVisitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialVisitPayload>
          }
          findFirst: {
            args: Prisma.TrialVisitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialVisitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrialVisitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialVisitPayload>
          }
          findMany: {
            args: Prisma.TrialVisitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialVisitPayload>[]
          }
          create: {
            args: Prisma.TrialVisitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialVisitPayload>
          }
          createMany: {
            args: Prisma.TrialVisitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrialVisitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialVisitPayload>[]
          }
          delete: {
            args: Prisma.TrialVisitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialVisitPayload>
          }
          update: {
            args: Prisma.TrialVisitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialVisitPayload>
          }
          deleteMany: {
            args: Prisma.TrialVisitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrialVisitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TrialVisitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialVisitPayload>
          }
          aggregate: {
            args: Prisma.TrialVisitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrialVisit>
          }
          groupBy: {
            args: Prisma.TrialVisitGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrialVisitGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrialVisitCountArgs<ExtArgs>
            result: $Utils.Optional<TrialVisitCountAggregateOutputType> | number
          }
        }
      }
      Investigator: {
        payload: Prisma.$InvestigatorPayload<ExtArgs>
        fields: Prisma.InvestigatorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvestigatorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvestigatorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorPayload>
          }
          findFirst: {
            args: Prisma.InvestigatorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvestigatorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorPayload>
          }
          findMany: {
            args: Prisma.InvestigatorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorPayload>[]
          }
          create: {
            args: Prisma.InvestigatorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorPayload>
          }
          createMany: {
            args: Prisma.InvestigatorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvestigatorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorPayload>[]
          }
          delete: {
            args: Prisma.InvestigatorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorPayload>
          }
          update: {
            args: Prisma.InvestigatorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorPayload>
          }
          deleteMany: {
            args: Prisma.InvestigatorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvestigatorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvestigatorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorPayload>
          }
          aggregate: {
            args: Prisma.InvestigatorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvestigator>
          }
          groupBy: {
            args: Prisma.InvestigatorGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvestigatorGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvestigatorCountArgs<ExtArgs>
            result: $Utils.Optional<InvestigatorCountAggregateOutputType> | number
          }
        }
      }
      InvestigatorSiteAssignment: {
        payload: Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>
        fields: Prisma.InvestigatorSiteAssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvestigatorSiteAssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorSiteAssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvestigatorSiteAssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorSiteAssignmentPayload>
          }
          findFirst: {
            args: Prisma.InvestigatorSiteAssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorSiteAssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvestigatorSiteAssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorSiteAssignmentPayload>
          }
          findMany: {
            args: Prisma.InvestigatorSiteAssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorSiteAssignmentPayload>[]
          }
          create: {
            args: Prisma.InvestigatorSiteAssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorSiteAssignmentPayload>
          }
          createMany: {
            args: Prisma.InvestigatorSiteAssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvestigatorSiteAssignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorSiteAssignmentPayload>[]
          }
          delete: {
            args: Prisma.InvestigatorSiteAssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorSiteAssignmentPayload>
          }
          update: {
            args: Prisma.InvestigatorSiteAssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorSiteAssignmentPayload>
          }
          deleteMany: {
            args: Prisma.InvestigatorSiteAssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvestigatorSiteAssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvestigatorSiteAssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigatorSiteAssignmentPayload>
          }
          aggregate: {
            args: Prisma.InvestigatorSiteAssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvestigatorSiteAssignment>
          }
          groupBy: {
            args: Prisma.InvestigatorSiteAssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvestigatorSiteAssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvestigatorSiteAssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<InvestigatorSiteAssignmentCountAggregateOutputType> | number
          }
        }
      }
      TrialNotification: {
        payload: Prisma.$TrialNotificationPayload<ExtArgs>
        fields: Prisma.TrialNotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrialNotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialNotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrialNotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialNotificationPayload>
          }
          findFirst: {
            args: Prisma.TrialNotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialNotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrialNotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialNotificationPayload>
          }
          findMany: {
            args: Prisma.TrialNotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialNotificationPayload>[]
          }
          create: {
            args: Prisma.TrialNotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialNotificationPayload>
          }
          createMany: {
            args: Prisma.TrialNotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrialNotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialNotificationPayload>[]
          }
          delete: {
            args: Prisma.TrialNotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialNotificationPayload>
          }
          update: {
            args: Prisma.TrialNotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialNotificationPayload>
          }
          deleteMany: {
            args: Prisma.TrialNotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrialNotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TrialNotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrialNotificationPayload>
          }
          aggregate: {
            args: Prisma.TrialNotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrialNotification>
          }
          groupBy: {
            args: Prisma.TrialNotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrialNotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrialNotificationCountArgs<ExtArgs>
            result: $Utils.Optional<TrialNotificationCountAggregateOutputType> | number
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
   * Count Type ClinicalTrialCountOutputType
   */

  export type ClinicalTrialCountOutputType = {
    sites: number
    patientMatches: number
    enrollments: number
  }

  export type ClinicalTrialCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sites?: boolean | ClinicalTrialCountOutputTypeCountSitesArgs
    patientMatches?: boolean | ClinicalTrialCountOutputTypeCountPatientMatchesArgs
    enrollments?: boolean | ClinicalTrialCountOutputTypeCountEnrollmentsArgs
  }

  // Custom InputTypes
  /**
   * ClinicalTrialCountOutputType without action
   */
  export type ClinicalTrialCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalTrialCountOutputType
     */
    select?: ClinicalTrialCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClinicalTrialCountOutputType without action
   */
  export type ClinicalTrialCountOutputTypeCountSitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrialSiteWhereInput
  }

  /**
   * ClinicalTrialCountOutputType without action
   */
  export type ClinicalTrialCountOutputTypeCountPatientMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientMatchWhereInput
  }

  /**
   * ClinicalTrialCountOutputType without action
   */
  export type ClinicalTrialCountOutputTypeCountEnrollmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnrollmentWhereInput
  }


  /**
   * Count Type TrialSiteCountOutputType
   */

  export type TrialSiteCountOutputType = {
    enrollments: number
  }

  export type TrialSiteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollments?: boolean | TrialSiteCountOutputTypeCountEnrollmentsArgs
  }

  // Custom InputTypes
  /**
   * TrialSiteCountOutputType without action
   */
  export type TrialSiteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSiteCountOutputType
     */
    select?: TrialSiteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TrialSiteCountOutputType without action
   */
  export type TrialSiteCountOutputTypeCountEnrollmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnrollmentWhereInput
  }


  /**
   * Count Type EnrollmentCountOutputType
   */

  export type EnrollmentCountOutputType = {
    consentRecords: number
    statusHistory: number
    visits: number
  }

  export type EnrollmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    consentRecords?: boolean | EnrollmentCountOutputTypeCountConsentRecordsArgs
    statusHistory?: boolean | EnrollmentCountOutputTypeCountStatusHistoryArgs
    visits?: boolean | EnrollmentCountOutputTypeCountVisitsArgs
  }

  // Custom InputTypes
  /**
   * EnrollmentCountOutputType without action
   */
  export type EnrollmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentCountOutputType
     */
    select?: EnrollmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EnrollmentCountOutputType without action
   */
  export type EnrollmentCountOutputTypeCountConsentRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsentRecordWhereInput
  }

  /**
   * EnrollmentCountOutputType without action
   */
  export type EnrollmentCountOutputTypeCountStatusHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnrollmentStatusHistoryWhereInput
  }

  /**
   * EnrollmentCountOutputType without action
   */
  export type EnrollmentCountOutputTypeCountVisitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrialVisitWhereInput
  }


  /**
   * Count Type InvestigatorCountOutputType
   */

  export type InvestigatorCountOutputType = {
    siteAssignments: number
  }

  export type InvestigatorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    siteAssignments?: boolean | InvestigatorCountOutputTypeCountSiteAssignmentsArgs
  }

  // Custom InputTypes
  /**
   * InvestigatorCountOutputType without action
   */
  export type InvestigatorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorCountOutputType
     */
    select?: InvestigatorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InvestigatorCountOutputType without action
   */
  export type InvestigatorCountOutputTypeCountSiteAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvestigatorSiteAssignmentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ClinicalTrial
   */

  export type AggregateClinicalTrial = {
    _count: ClinicalTrialCountAggregateOutputType | null
    _avg: ClinicalTrialAvgAggregateOutputType | null
    _sum: ClinicalTrialSumAggregateOutputType | null
    _min: ClinicalTrialMinAggregateOutputType | null
    _max: ClinicalTrialMaxAggregateOutputType | null
  }

  export type ClinicalTrialAvgAggregateOutputType = {
    enrollmentCount: number | null
    minimumAge: number | null
    maximumAge: number | null
  }

  export type ClinicalTrialSumAggregateOutputType = {
    enrollmentCount: number | null
    minimumAge: number | null
    maximumAge: number | null
  }

  export type ClinicalTrialMinAggregateOutputType = {
    id: string | null
    nctId: string | null
    title: string | null
    officialTitle: string | null
    briefSummary: string | null
    detailedDescription: string | null
    status: $Enums.TrialStatus | null
    phase: $Enums.TrialPhase | null
    studyType: $Enums.StudyType | null
    primaryPurpose: string | null
    interventionModel: string | null
    masking: string | null
    allocation: string | null
    enrollmentCount: number | null
    enrollmentType: string | null
    startDate: Date | null
    completionDate: Date | null
    primaryCompletionDate: Date | null
    lastUpdatedDate: Date | null
    sponsorName: string | null
    sponsorType: string | null
    leadSponsorClass: string | null
    eligibilityText: string | null
    healthyVolunteers: boolean | null
    minimumAge: number | null
    maximumAge: number | null
    gender: string | null
    contactName: string | null
    contactPhone: string | null
    contactEmail: string | null
    lastSyncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClinicalTrialMaxAggregateOutputType = {
    id: string | null
    nctId: string | null
    title: string | null
    officialTitle: string | null
    briefSummary: string | null
    detailedDescription: string | null
    status: $Enums.TrialStatus | null
    phase: $Enums.TrialPhase | null
    studyType: $Enums.StudyType | null
    primaryPurpose: string | null
    interventionModel: string | null
    masking: string | null
    allocation: string | null
    enrollmentCount: number | null
    enrollmentType: string | null
    startDate: Date | null
    completionDate: Date | null
    primaryCompletionDate: Date | null
    lastUpdatedDate: Date | null
    sponsorName: string | null
    sponsorType: string | null
    leadSponsorClass: string | null
    eligibilityText: string | null
    healthyVolunteers: boolean | null
    minimumAge: number | null
    maximumAge: number | null
    gender: string | null
    contactName: string | null
    contactPhone: string | null
    contactEmail: string | null
    lastSyncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClinicalTrialCountAggregateOutputType = {
    id: number
    nctId: number
    title: number
    officialTitle: number
    briefSummary: number
    detailedDescription: number
    status: number
    phase: number
    studyType: number
    primaryPurpose: number
    interventionModel: number
    masking: number
    allocation: number
    enrollmentCount: number
    enrollmentType: number
    startDate: number
    completionDate: number
    primaryCompletionDate: number
    lastUpdatedDate: number
    sponsorName: number
    sponsorType: number
    leadSponsorClass: number
    collaborators: number
    conditions: number
    interventions: number
    keywords: number
    meshTerms: number
    primaryOutcomes: number
    secondaryOutcomes: number
    eligibilityCriteria: number
    eligibilityText: number
    healthyVolunteers: number
    minimumAge: number
    maximumAge: number
    gender: number
    contactName: number
    contactPhone: number
    contactEmail: number
    overallOfficial: number
    locations: number
    fhirResearchStudy: number
    lastSyncedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClinicalTrialAvgAggregateInputType = {
    enrollmentCount?: true
    minimumAge?: true
    maximumAge?: true
  }

  export type ClinicalTrialSumAggregateInputType = {
    enrollmentCount?: true
    minimumAge?: true
    maximumAge?: true
  }

  export type ClinicalTrialMinAggregateInputType = {
    id?: true
    nctId?: true
    title?: true
    officialTitle?: true
    briefSummary?: true
    detailedDescription?: true
    status?: true
    phase?: true
    studyType?: true
    primaryPurpose?: true
    interventionModel?: true
    masking?: true
    allocation?: true
    enrollmentCount?: true
    enrollmentType?: true
    startDate?: true
    completionDate?: true
    primaryCompletionDate?: true
    lastUpdatedDate?: true
    sponsorName?: true
    sponsorType?: true
    leadSponsorClass?: true
    eligibilityText?: true
    healthyVolunteers?: true
    minimumAge?: true
    maximumAge?: true
    gender?: true
    contactName?: true
    contactPhone?: true
    contactEmail?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClinicalTrialMaxAggregateInputType = {
    id?: true
    nctId?: true
    title?: true
    officialTitle?: true
    briefSummary?: true
    detailedDescription?: true
    status?: true
    phase?: true
    studyType?: true
    primaryPurpose?: true
    interventionModel?: true
    masking?: true
    allocation?: true
    enrollmentCount?: true
    enrollmentType?: true
    startDate?: true
    completionDate?: true
    primaryCompletionDate?: true
    lastUpdatedDate?: true
    sponsorName?: true
    sponsorType?: true
    leadSponsorClass?: true
    eligibilityText?: true
    healthyVolunteers?: true
    minimumAge?: true
    maximumAge?: true
    gender?: true
    contactName?: true
    contactPhone?: true
    contactEmail?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClinicalTrialCountAggregateInputType = {
    id?: true
    nctId?: true
    title?: true
    officialTitle?: true
    briefSummary?: true
    detailedDescription?: true
    status?: true
    phase?: true
    studyType?: true
    primaryPurpose?: true
    interventionModel?: true
    masking?: true
    allocation?: true
    enrollmentCount?: true
    enrollmentType?: true
    startDate?: true
    completionDate?: true
    primaryCompletionDate?: true
    lastUpdatedDate?: true
    sponsorName?: true
    sponsorType?: true
    leadSponsorClass?: true
    collaborators?: true
    conditions?: true
    interventions?: true
    keywords?: true
    meshTerms?: true
    primaryOutcomes?: true
    secondaryOutcomes?: true
    eligibilityCriteria?: true
    eligibilityText?: true
    healthyVolunteers?: true
    minimumAge?: true
    maximumAge?: true
    gender?: true
    contactName?: true
    contactPhone?: true
    contactEmail?: true
    overallOfficial?: true
    locations?: true
    fhirResearchStudy?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClinicalTrialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClinicalTrial to aggregate.
     */
    where?: ClinicalTrialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalTrials to fetch.
     */
    orderBy?: ClinicalTrialOrderByWithRelationInput | ClinicalTrialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClinicalTrialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalTrials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalTrials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClinicalTrials
    **/
    _count?: true | ClinicalTrialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClinicalTrialAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClinicalTrialSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClinicalTrialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClinicalTrialMaxAggregateInputType
  }

  export type GetClinicalTrialAggregateType<T extends ClinicalTrialAggregateArgs> = {
        [P in keyof T & keyof AggregateClinicalTrial]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClinicalTrial[P]>
      : GetScalarType<T[P], AggregateClinicalTrial[P]>
  }




  export type ClinicalTrialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClinicalTrialWhereInput
    orderBy?: ClinicalTrialOrderByWithAggregationInput | ClinicalTrialOrderByWithAggregationInput[]
    by: ClinicalTrialScalarFieldEnum[] | ClinicalTrialScalarFieldEnum
    having?: ClinicalTrialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClinicalTrialCountAggregateInputType | true
    _avg?: ClinicalTrialAvgAggregateInputType
    _sum?: ClinicalTrialSumAggregateInputType
    _min?: ClinicalTrialMinAggregateInputType
    _max?: ClinicalTrialMaxAggregateInputType
  }

  export type ClinicalTrialGroupByOutputType = {
    id: string
    nctId: string
    title: string
    officialTitle: string | null
    briefSummary: string | null
    detailedDescription: string | null
    status: $Enums.TrialStatus
    phase: $Enums.TrialPhase | null
    studyType: $Enums.StudyType
    primaryPurpose: string | null
    interventionModel: string | null
    masking: string | null
    allocation: string | null
    enrollmentCount: number | null
    enrollmentType: string | null
    startDate: Date | null
    completionDate: Date | null
    primaryCompletionDate: Date | null
    lastUpdatedDate: Date | null
    sponsorName: string | null
    sponsorType: string | null
    leadSponsorClass: string | null
    collaborators: string[]
    conditions: string[]
    interventions: JsonValue[]
    keywords: string[]
    meshTerms: string[]
    primaryOutcomes: JsonValue[]
    secondaryOutcomes: JsonValue[]
    eligibilityCriteria: JsonValue | null
    eligibilityText: string | null
    healthyVolunteers: boolean
    minimumAge: number | null
    maximumAge: number | null
    gender: string | null
    contactName: string | null
    contactPhone: string | null
    contactEmail: string | null
    overallOfficial: JsonValue | null
    locations: JsonValue[]
    fhirResearchStudy: JsonValue | null
    lastSyncedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ClinicalTrialCountAggregateOutputType | null
    _avg: ClinicalTrialAvgAggregateOutputType | null
    _sum: ClinicalTrialSumAggregateOutputType | null
    _min: ClinicalTrialMinAggregateOutputType | null
    _max: ClinicalTrialMaxAggregateOutputType | null
  }

  type GetClinicalTrialGroupByPayload<T extends ClinicalTrialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClinicalTrialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClinicalTrialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClinicalTrialGroupByOutputType[P]>
            : GetScalarType<T[P], ClinicalTrialGroupByOutputType[P]>
        }
      >
    >


  export type ClinicalTrialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nctId?: boolean
    title?: boolean
    officialTitle?: boolean
    briefSummary?: boolean
    detailedDescription?: boolean
    status?: boolean
    phase?: boolean
    studyType?: boolean
    primaryPurpose?: boolean
    interventionModel?: boolean
    masking?: boolean
    allocation?: boolean
    enrollmentCount?: boolean
    enrollmentType?: boolean
    startDate?: boolean
    completionDate?: boolean
    primaryCompletionDate?: boolean
    lastUpdatedDate?: boolean
    sponsorName?: boolean
    sponsorType?: boolean
    leadSponsorClass?: boolean
    collaborators?: boolean
    conditions?: boolean
    interventions?: boolean
    keywords?: boolean
    meshTerms?: boolean
    primaryOutcomes?: boolean
    secondaryOutcomes?: boolean
    eligibilityCriteria?: boolean
    eligibilityText?: boolean
    healthyVolunteers?: boolean
    minimumAge?: boolean
    maximumAge?: boolean
    gender?: boolean
    contactName?: boolean
    contactPhone?: boolean
    contactEmail?: boolean
    overallOfficial?: boolean
    locations?: boolean
    fhirResearchStudy?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sites?: boolean | ClinicalTrial$sitesArgs<ExtArgs>
    patientMatches?: boolean | ClinicalTrial$patientMatchesArgs<ExtArgs>
    enrollments?: boolean | ClinicalTrial$enrollmentsArgs<ExtArgs>
    _count?: boolean | ClinicalTrialCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clinicalTrial"]>

  export type ClinicalTrialSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nctId?: boolean
    title?: boolean
    officialTitle?: boolean
    briefSummary?: boolean
    detailedDescription?: boolean
    status?: boolean
    phase?: boolean
    studyType?: boolean
    primaryPurpose?: boolean
    interventionModel?: boolean
    masking?: boolean
    allocation?: boolean
    enrollmentCount?: boolean
    enrollmentType?: boolean
    startDate?: boolean
    completionDate?: boolean
    primaryCompletionDate?: boolean
    lastUpdatedDate?: boolean
    sponsorName?: boolean
    sponsorType?: boolean
    leadSponsorClass?: boolean
    collaborators?: boolean
    conditions?: boolean
    interventions?: boolean
    keywords?: boolean
    meshTerms?: boolean
    primaryOutcomes?: boolean
    secondaryOutcomes?: boolean
    eligibilityCriteria?: boolean
    eligibilityText?: boolean
    healthyVolunteers?: boolean
    minimumAge?: boolean
    maximumAge?: boolean
    gender?: boolean
    contactName?: boolean
    contactPhone?: boolean
    contactEmail?: boolean
    overallOfficial?: boolean
    locations?: boolean
    fhirResearchStudy?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["clinicalTrial"]>

  export type ClinicalTrialSelectScalar = {
    id?: boolean
    nctId?: boolean
    title?: boolean
    officialTitle?: boolean
    briefSummary?: boolean
    detailedDescription?: boolean
    status?: boolean
    phase?: boolean
    studyType?: boolean
    primaryPurpose?: boolean
    interventionModel?: boolean
    masking?: boolean
    allocation?: boolean
    enrollmentCount?: boolean
    enrollmentType?: boolean
    startDate?: boolean
    completionDate?: boolean
    primaryCompletionDate?: boolean
    lastUpdatedDate?: boolean
    sponsorName?: boolean
    sponsorType?: boolean
    leadSponsorClass?: boolean
    collaborators?: boolean
    conditions?: boolean
    interventions?: boolean
    keywords?: boolean
    meshTerms?: boolean
    primaryOutcomes?: boolean
    secondaryOutcomes?: boolean
    eligibilityCriteria?: boolean
    eligibilityText?: boolean
    healthyVolunteers?: boolean
    minimumAge?: boolean
    maximumAge?: boolean
    gender?: boolean
    contactName?: boolean
    contactPhone?: boolean
    contactEmail?: boolean
    overallOfficial?: boolean
    locations?: boolean
    fhirResearchStudy?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClinicalTrialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sites?: boolean | ClinicalTrial$sitesArgs<ExtArgs>
    patientMatches?: boolean | ClinicalTrial$patientMatchesArgs<ExtArgs>
    enrollments?: boolean | ClinicalTrial$enrollmentsArgs<ExtArgs>
    _count?: boolean | ClinicalTrialCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClinicalTrialIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ClinicalTrialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClinicalTrial"
    objects: {
      sites: Prisma.$TrialSitePayload<ExtArgs>[]
      patientMatches: Prisma.$PatientMatchPayload<ExtArgs>[]
      enrollments: Prisma.$EnrollmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nctId: string
      title: string
      officialTitle: string | null
      briefSummary: string | null
      detailedDescription: string | null
      status: $Enums.TrialStatus
      phase: $Enums.TrialPhase | null
      studyType: $Enums.StudyType
      primaryPurpose: string | null
      interventionModel: string | null
      masking: string | null
      allocation: string | null
      enrollmentCount: number | null
      enrollmentType: string | null
      startDate: Date | null
      completionDate: Date | null
      primaryCompletionDate: Date | null
      lastUpdatedDate: Date | null
      sponsorName: string | null
      sponsorType: string | null
      leadSponsorClass: string | null
      collaborators: string[]
      conditions: string[]
      interventions: Prisma.JsonValue[]
      keywords: string[]
      meshTerms: string[]
      primaryOutcomes: Prisma.JsonValue[]
      secondaryOutcomes: Prisma.JsonValue[]
      eligibilityCriteria: Prisma.JsonValue | null
      eligibilityText: string | null
      healthyVolunteers: boolean
      minimumAge: number | null
      maximumAge: number | null
      gender: string | null
      contactName: string | null
      contactPhone: string | null
      contactEmail: string | null
      overallOfficial: Prisma.JsonValue | null
      locations: Prisma.JsonValue[]
      fhirResearchStudy: Prisma.JsonValue | null
      lastSyncedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["clinicalTrial"]>
    composites: {}
  }

  type ClinicalTrialGetPayload<S extends boolean | null | undefined | ClinicalTrialDefaultArgs> = $Result.GetResult<Prisma.$ClinicalTrialPayload, S>

  type ClinicalTrialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClinicalTrialFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClinicalTrialCountAggregateInputType | true
    }

  export interface ClinicalTrialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClinicalTrial'], meta: { name: 'ClinicalTrial' } }
    /**
     * Find zero or one ClinicalTrial that matches the filter.
     * @param {ClinicalTrialFindUniqueArgs} args - Arguments to find a ClinicalTrial
     * @example
     * // Get one ClinicalTrial
     * const clinicalTrial = await prisma.clinicalTrial.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClinicalTrialFindUniqueArgs>(args: SelectSubset<T, ClinicalTrialFindUniqueArgs<ExtArgs>>): Prisma__ClinicalTrialClient<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ClinicalTrial that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClinicalTrialFindUniqueOrThrowArgs} args - Arguments to find a ClinicalTrial
     * @example
     * // Get one ClinicalTrial
     * const clinicalTrial = await prisma.clinicalTrial.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClinicalTrialFindUniqueOrThrowArgs>(args: SelectSubset<T, ClinicalTrialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClinicalTrialClient<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ClinicalTrial that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalTrialFindFirstArgs} args - Arguments to find a ClinicalTrial
     * @example
     * // Get one ClinicalTrial
     * const clinicalTrial = await prisma.clinicalTrial.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClinicalTrialFindFirstArgs>(args?: SelectSubset<T, ClinicalTrialFindFirstArgs<ExtArgs>>): Prisma__ClinicalTrialClient<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ClinicalTrial that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalTrialFindFirstOrThrowArgs} args - Arguments to find a ClinicalTrial
     * @example
     * // Get one ClinicalTrial
     * const clinicalTrial = await prisma.clinicalTrial.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClinicalTrialFindFirstOrThrowArgs>(args?: SelectSubset<T, ClinicalTrialFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClinicalTrialClient<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ClinicalTrials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalTrialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClinicalTrials
     * const clinicalTrials = await prisma.clinicalTrial.findMany()
     * 
     * // Get first 10 ClinicalTrials
     * const clinicalTrials = await prisma.clinicalTrial.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clinicalTrialWithIdOnly = await prisma.clinicalTrial.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClinicalTrialFindManyArgs>(args?: SelectSubset<T, ClinicalTrialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ClinicalTrial.
     * @param {ClinicalTrialCreateArgs} args - Arguments to create a ClinicalTrial.
     * @example
     * // Create one ClinicalTrial
     * const ClinicalTrial = await prisma.clinicalTrial.create({
     *   data: {
     *     // ... data to create a ClinicalTrial
     *   }
     * })
     * 
     */
    create<T extends ClinicalTrialCreateArgs>(args: SelectSubset<T, ClinicalTrialCreateArgs<ExtArgs>>): Prisma__ClinicalTrialClient<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ClinicalTrials.
     * @param {ClinicalTrialCreateManyArgs} args - Arguments to create many ClinicalTrials.
     * @example
     * // Create many ClinicalTrials
     * const clinicalTrial = await prisma.clinicalTrial.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClinicalTrialCreateManyArgs>(args?: SelectSubset<T, ClinicalTrialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClinicalTrials and returns the data saved in the database.
     * @param {ClinicalTrialCreateManyAndReturnArgs} args - Arguments to create many ClinicalTrials.
     * @example
     * // Create many ClinicalTrials
     * const clinicalTrial = await prisma.clinicalTrial.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClinicalTrials and only return the `id`
     * const clinicalTrialWithIdOnly = await prisma.clinicalTrial.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClinicalTrialCreateManyAndReturnArgs>(args?: SelectSubset<T, ClinicalTrialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ClinicalTrial.
     * @param {ClinicalTrialDeleteArgs} args - Arguments to delete one ClinicalTrial.
     * @example
     * // Delete one ClinicalTrial
     * const ClinicalTrial = await prisma.clinicalTrial.delete({
     *   where: {
     *     // ... filter to delete one ClinicalTrial
     *   }
     * })
     * 
     */
    delete<T extends ClinicalTrialDeleteArgs>(args: SelectSubset<T, ClinicalTrialDeleteArgs<ExtArgs>>): Prisma__ClinicalTrialClient<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ClinicalTrial.
     * @param {ClinicalTrialUpdateArgs} args - Arguments to update one ClinicalTrial.
     * @example
     * // Update one ClinicalTrial
     * const clinicalTrial = await prisma.clinicalTrial.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClinicalTrialUpdateArgs>(args: SelectSubset<T, ClinicalTrialUpdateArgs<ExtArgs>>): Prisma__ClinicalTrialClient<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ClinicalTrials.
     * @param {ClinicalTrialDeleteManyArgs} args - Arguments to filter ClinicalTrials to delete.
     * @example
     * // Delete a few ClinicalTrials
     * const { count } = await prisma.clinicalTrial.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClinicalTrialDeleteManyArgs>(args?: SelectSubset<T, ClinicalTrialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClinicalTrials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalTrialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClinicalTrials
     * const clinicalTrial = await prisma.clinicalTrial.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClinicalTrialUpdateManyArgs>(args: SelectSubset<T, ClinicalTrialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ClinicalTrial.
     * @param {ClinicalTrialUpsertArgs} args - Arguments to update or create a ClinicalTrial.
     * @example
     * // Update or create a ClinicalTrial
     * const clinicalTrial = await prisma.clinicalTrial.upsert({
     *   create: {
     *     // ... data to create a ClinicalTrial
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClinicalTrial we want to update
     *   }
     * })
     */
    upsert<T extends ClinicalTrialUpsertArgs>(args: SelectSubset<T, ClinicalTrialUpsertArgs<ExtArgs>>): Prisma__ClinicalTrialClient<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ClinicalTrials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalTrialCountArgs} args - Arguments to filter ClinicalTrials to count.
     * @example
     * // Count the number of ClinicalTrials
     * const count = await prisma.clinicalTrial.count({
     *   where: {
     *     // ... the filter for the ClinicalTrials we want to count
     *   }
     * })
    **/
    count<T extends ClinicalTrialCountArgs>(
      args?: Subset<T, ClinicalTrialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClinicalTrialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClinicalTrial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalTrialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClinicalTrialAggregateArgs>(args: Subset<T, ClinicalTrialAggregateArgs>): Prisma.PrismaPromise<GetClinicalTrialAggregateType<T>>

    /**
     * Group by ClinicalTrial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalTrialGroupByArgs} args - Group by arguments.
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
      T extends ClinicalTrialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClinicalTrialGroupByArgs['orderBy'] }
        : { orderBy?: ClinicalTrialGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ClinicalTrialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClinicalTrialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClinicalTrial model
   */
  readonly fields: ClinicalTrialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClinicalTrial.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClinicalTrialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sites<T extends ClinicalTrial$sitesArgs<ExtArgs> = {}>(args?: Subset<T, ClinicalTrial$sitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrialSitePayload<ExtArgs>, T, "findMany"> | Null>
    patientMatches<T extends ClinicalTrial$patientMatchesArgs<ExtArgs> = {}>(args?: Subset<T, ClinicalTrial$patientMatchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientMatchPayload<ExtArgs>, T, "findMany"> | Null>
    enrollments<T extends ClinicalTrial$enrollmentsArgs<ExtArgs> = {}>(args?: Subset<T, ClinicalTrial$enrollmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the ClinicalTrial model
   */ 
  interface ClinicalTrialFieldRefs {
    readonly id: FieldRef<"ClinicalTrial", 'String'>
    readonly nctId: FieldRef<"ClinicalTrial", 'String'>
    readonly title: FieldRef<"ClinicalTrial", 'String'>
    readonly officialTitle: FieldRef<"ClinicalTrial", 'String'>
    readonly briefSummary: FieldRef<"ClinicalTrial", 'String'>
    readonly detailedDescription: FieldRef<"ClinicalTrial", 'String'>
    readonly status: FieldRef<"ClinicalTrial", 'TrialStatus'>
    readonly phase: FieldRef<"ClinicalTrial", 'TrialPhase'>
    readonly studyType: FieldRef<"ClinicalTrial", 'StudyType'>
    readonly primaryPurpose: FieldRef<"ClinicalTrial", 'String'>
    readonly interventionModel: FieldRef<"ClinicalTrial", 'String'>
    readonly masking: FieldRef<"ClinicalTrial", 'String'>
    readonly allocation: FieldRef<"ClinicalTrial", 'String'>
    readonly enrollmentCount: FieldRef<"ClinicalTrial", 'Int'>
    readonly enrollmentType: FieldRef<"ClinicalTrial", 'String'>
    readonly startDate: FieldRef<"ClinicalTrial", 'DateTime'>
    readonly completionDate: FieldRef<"ClinicalTrial", 'DateTime'>
    readonly primaryCompletionDate: FieldRef<"ClinicalTrial", 'DateTime'>
    readonly lastUpdatedDate: FieldRef<"ClinicalTrial", 'DateTime'>
    readonly sponsorName: FieldRef<"ClinicalTrial", 'String'>
    readonly sponsorType: FieldRef<"ClinicalTrial", 'String'>
    readonly leadSponsorClass: FieldRef<"ClinicalTrial", 'String'>
    readonly collaborators: FieldRef<"ClinicalTrial", 'String[]'>
    readonly conditions: FieldRef<"ClinicalTrial", 'String[]'>
    readonly interventions: FieldRef<"ClinicalTrial", 'Json[]'>
    readonly keywords: FieldRef<"ClinicalTrial", 'String[]'>
    readonly meshTerms: FieldRef<"ClinicalTrial", 'String[]'>
    readonly primaryOutcomes: FieldRef<"ClinicalTrial", 'Json[]'>
    readonly secondaryOutcomes: FieldRef<"ClinicalTrial", 'Json[]'>
    readonly eligibilityCriteria: FieldRef<"ClinicalTrial", 'Json'>
    readonly eligibilityText: FieldRef<"ClinicalTrial", 'String'>
    readonly healthyVolunteers: FieldRef<"ClinicalTrial", 'Boolean'>
    readonly minimumAge: FieldRef<"ClinicalTrial", 'Int'>
    readonly maximumAge: FieldRef<"ClinicalTrial", 'Int'>
    readonly gender: FieldRef<"ClinicalTrial", 'String'>
    readonly contactName: FieldRef<"ClinicalTrial", 'String'>
    readonly contactPhone: FieldRef<"ClinicalTrial", 'String'>
    readonly contactEmail: FieldRef<"ClinicalTrial", 'String'>
    readonly overallOfficial: FieldRef<"ClinicalTrial", 'Json'>
    readonly locations: FieldRef<"ClinicalTrial", 'Json[]'>
    readonly fhirResearchStudy: FieldRef<"ClinicalTrial", 'Json'>
    readonly lastSyncedAt: FieldRef<"ClinicalTrial", 'DateTime'>
    readonly createdAt: FieldRef<"ClinicalTrial", 'DateTime'>
    readonly updatedAt: FieldRef<"ClinicalTrial", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClinicalTrial findUnique
   */
  export type ClinicalTrialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalTrial
     */
    select?: ClinicalTrialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalTrialInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalTrial to fetch.
     */
    where: ClinicalTrialWhereUniqueInput
  }

  /**
   * ClinicalTrial findUniqueOrThrow
   */
  export type ClinicalTrialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalTrial
     */
    select?: ClinicalTrialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalTrialInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalTrial to fetch.
     */
    where: ClinicalTrialWhereUniqueInput
  }

  /**
   * ClinicalTrial findFirst
   */
  export type ClinicalTrialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalTrial
     */
    select?: ClinicalTrialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalTrialInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalTrial to fetch.
     */
    where?: ClinicalTrialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalTrials to fetch.
     */
    orderBy?: ClinicalTrialOrderByWithRelationInput | ClinicalTrialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClinicalTrials.
     */
    cursor?: ClinicalTrialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalTrials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalTrials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClinicalTrials.
     */
    distinct?: ClinicalTrialScalarFieldEnum | ClinicalTrialScalarFieldEnum[]
  }

  /**
   * ClinicalTrial findFirstOrThrow
   */
  export type ClinicalTrialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalTrial
     */
    select?: ClinicalTrialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalTrialInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalTrial to fetch.
     */
    where?: ClinicalTrialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalTrials to fetch.
     */
    orderBy?: ClinicalTrialOrderByWithRelationInput | ClinicalTrialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClinicalTrials.
     */
    cursor?: ClinicalTrialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalTrials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalTrials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClinicalTrials.
     */
    distinct?: ClinicalTrialScalarFieldEnum | ClinicalTrialScalarFieldEnum[]
  }

  /**
   * ClinicalTrial findMany
   */
  export type ClinicalTrialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalTrial
     */
    select?: ClinicalTrialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalTrialInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalTrials to fetch.
     */
    where?: ClinicalTrialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalTrials to fetch.
     */
    orderBy?: ClinicalTrialOrderByWithRelationInput | ClinicalTrialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClinicalTrials.
     */
    cursor?: ClinicalTrialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalTrials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalTrials.
     */
    skip?: number
    distinct?: ClinicalTrialScalarFieldEnum | ClinicalTrialScalarFieldEnum[]
  }

  /**
   * ClinicalTrial create
   */
  export type ClinicalTrialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalTrial
     */
    select?: ClinicalTrialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalTrialInclude<ExtArgs> | null
    /**
     * The data needed to create a ClinicalTrial.
     */
    data: XOR<ClinicalTrialCreateInput, ClinicalTrialUncheckedCreateInput>
  }

  /**
   * ClinicalTrial createMany
   */
  export type ClinicalTrialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClinicalTrials.
     */
    data: ClinicalTrialCreateManyInput | ClinicalTrialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClinicalTrial createManyAndReturn
   */
  export type ClinicalTrialCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalTrial
     */
    select?: ClinicalTrialSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ClinicalTrials.
     */
    data: ClinicalTrialCreateManyInput | ClinicalTrialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClinicalTrial update
   */
  export type ClinicalTrialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalTrial
     */
    select?: ClinicalTrialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalTrialInclude<ExtArgs> | null
    /**
     * The data needed to update a ClinicalTrial.
     */
    data: XOR<ClinicalTrialUpdateInput, ClinicalTrialUncheckedUpdateInput>
    /**
     * Choose, which ClinicalTrial to update.
     */
    where: ClinicalTrialWhereUniqueInput
  }

  /**
   * ClinicalTrial updateMany
   */
  export type ClinicalTrialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClinicalTrials.
     */
    data: XOR<ClinicalTrialUpdateManyMutationInput, ClinicalTrialUncheckedUpdateManyInput>
    /**
     * Filter which ClinicalTrials to update
     */
    where?: ClinicalTrialWhereInput
  }

  /**
   * ClinicalTrial upsert
   */
  export type ClinicalTrialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalTrial
     */
    select?: ClinicalTrialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalTrialInclude<ExtArgs> | null
    /**
     * The filter to search for the ClinicalTrial to update in case it exists.
     */
    where: ClinicalTrialWhereUniqueInput
    /**
     * In case the ClinicalTrial found by the `where` argument doesn't exist, create a new ClinicalTrial with this data.
     */
    create: XOR<ClinicalTrialCreateInput, ClinicalTrialUncheckedCreateInput>
    /**
     * In case the ClinicalTrial was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClinicalTrialUpdateInput, ClinicalTrialUncheckedUpdateInput>
  }

  /**
   * ClinicalTrial delete
   */
  export type ClinicalTrialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalTrial
     */
    select?: ClinicalTrialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalTrialInclude<ExtArgs> | null
    /**
     * Filter which ClinicalTrial to delete.
     */
    where: ClinicalTrialWhereUniqueInput
  }

  /**
   * ClinicalTrial deleteMany
   */
  export type ClinicalTrialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClinicalTrials to delete
     */
    where?: ClinicalTrialWhereInput
  }

  /**
   * ClinicalTrial.sites
   */
  export type ClinicalTrial$sitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSite
     */
    select?: TrialSiteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialSiteInclude<ExtArgs> | null
    where?: TrialSiteWhereInput
    orderBy?: TrialSiteOrderByWithRelationInput | TrialSiteOrderByWithRelationInput[]
    cursor?: TrialSiteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrialSiteScalarFieldEnum | TrialSiteScalarFieldEnum[]
  }

  /**
   * ClinicalTrial.patientMatches
   */
  export type ClinicalTrial$patientMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMatch
     */
    select?: PatientMatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMatchInclude<ExtArgs> | null
    where?: PatientMatchWhereInput
    orderBy?: PatientMatchOrderByWithRelationInput | PatientMatchOrderByWithRelationInput[]
    cursor?: PatientMatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientMatchScalarFieldEnum | PatientMatchScalarFieldEnum[]
  }

  /**
   * ClinicalTrial.enrollments
   */
  export type ClinicalTrial$enrollmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentInclude<ExtArgs> | null
    where?: EnrollmentWhereInput
    orderBy?: EnrollmentOrderByWithRelationInput | EnrollmentOrderByWithRelationInput[]
    cursor?: EnrollmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EnrollmentScalarFieldEnum | EnrollmentScalarFieldEnum[]
  }

  /**
   * ClinicalTrial without action
   */
  export type ClinicalTrialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalTrial
     */
    select?: ClinicalTrialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalTrialInclude<ExtArgs> | null
  }


  /**
   * Model TrialSite
   */

  export type AggregateTrialSite = {
    _count: TrialSiteCountAggregateOutputType | null
    _avg: TrialSiteAvgAggregateOutputType | null
    _sum: TrialSiteSumAggregateOutputType | null
    _min: TrialSiteMinAggregateOutputType | null
    _max: TrialSiteMaxAggregateOutputType | null
  }

  export type TrialSiteAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    targetEnrollment: number | null
    currentEnrollment: number | null
  }

  export type TrialSiteSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    targetEnrollment: number | null
    currentEnrollment: number | null
  }

  export type TrialSiteMinAggregateOutputType = {
    id: string | null
    trialId: string | null
    facilityName: string | null
    facilityId: string | null
    status: $Enums.SiteStatus | null
    city: string | null
    state: string | null
    country: string | null
    zipCode: string | null
    latitude: number | null
    longitude: number | null
    contactName: string | null
    contactPhone: string | null
    contactEmail: string | null
    principalInvestigator: string | null
    recruitmentStatus: string | null
    targetEnrollment: number | null
    currentEnrollment: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrialSiteMaxAggregateOutputType = {
    id: string | null
    trialId: string | null
    facilityName: string | null
    facilityId: string | null
    status: $Enums.SiteStatus | null
    city: string | null
    state: string | null
    country: string | null
    zipCode: string | null
    latitude: number | null
    longitude: number | null
    contactName: string | null
    contactPhone: string | null
    contactEmail: string | null
    principalInvestigator: string | null
    recruitmentStatus: string | null
    targetEnrollment: number | null
    currentEnrollment: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrialSiteCountAggregateOutputType = {
    id: number
    trialId: number
    facilityName: number
    facilityId: number
    status: number
    city: number
    state: number
    country: number
    zipCode: number
    latitude: number
    longitude: number
    contactName: number
    contactPhone: number
    contactEmail: number
    principalInvestigator: number
    recruitmentStatus: number
    targetEnrollment: number
    currentEnrollment: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TrialSiteAvgAggregateInputType = {
    latitude?: true
    longitude?: true
    targetEnrollment?: true
    currentEnrollment?: true
  }

  export type TrialSiteSumAggregateInputType = {
    latitude?: true
    longitude?: true
    targetEnrollment?: true
    currentEnrollment?: true
  }

  export type TrialSiteMinAggregateInputType = {
    id?: true
    trialId?: true
    facilityName?: true
    facilityId?: true
    status?: true
    city?: true
    state?: true
    country?: true
    zipCode?: true
    latitude?: true
    longitude?: true
    contactName?: true
    contactPhone?: true
    contactEmail?: true
    principalInvestigator?: true
    recruitmentStatus?: true
    targetEnrollment?: true
    currentEnrollment?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrialSiteMaxAggregateInputType = {
    id?: true
    trialId?: true
    facilityName?: true
    facilityId?: true
    status?: true
    city?: true
    state?: true
    country?: true
    zipCode?: true
    latitude?: true
    longitude?: true
    contactName?: true
    contactPhone?: true
    contactEmail?: true
    principalInvestigator?: true
    recruitmentStatus?: true
    targetEnrollment?: true
    currentEnrollment?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrialSiteCountAggregateInputType = {
    id?: true
    trialId?: true
    facilityName?: true
    facilityId?: true
    status?: true
    city?: true
    state?: true
    country?: true
    zipCode?: true
    latitude?: true
    longitude?: true
    contactName?: true
    contactPhone?: true
    contactEmail?: true
    principalInvestigator?: true
    recruitmentStatus?: true
    targetEnrollment?: true
    currentEnrollment?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TrialSiteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrialSite to aggregate.
     */
    where?: TrialSiteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrialSites to fetch.
     */
    orderBy?: TrialSiteOrderByWithRelationInput | TrialSiteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrialSiteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrialSites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrialSites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrialSites
    **/
    _count?: true | TrialSiteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrialSiteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrialSiteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrialSiteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrialSiteMaxAggregateInputType
  }

  export type GetTrialSiteAggregateType<T extends TrialSiteAggregateArgs> = {
        [P in keyof T & keyof AggregateTrialSite]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrialSite[P]>
      : GetScalarType<T[P], AggregateTrialSite[P]>
  }




  export type TrialSiteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrialSiteWhereInput
    orderBy?: TrialSiteOrderByWithAggregationInput | TrialSiteOrderByWithAggregationInput[]
    by: TrialSiteScalarFieldEnum[] | TrialSiteScalarFieldEnum
    having?: TrialSiteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrialSiteCountAggregateInputType | true
    _avg?: TrialSiteAvgAggregateInputType
    _sum?: TrialSiteSumAggregateInputType
    _min?: TrialSiteMinAggregateInputType
    _max?: TrialSiteMaxAggregateInputType
  }

  export type TrialSiteGroupByOutputType = {
    id: string
    trialId: string
    facilityName: string
    facilityId: string | null
    status: $Enums.SiteStatus
    city: string
    state: string | null
    country: string
    zipCode: string | null
    latitude: number | null
    longitude: number | null
    contactName: string | null
    contactPhone: string | null
    contactEmail: string | null
    principalInvestigator: string | null
    recruitmentStatus: string | null
    targetEnrollment: number | null
    currentEnrollment: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: TrialSiteCountAggregateOutputType | null
    _avg: TrialSiteAvgAggregateOutputType | null
    _sum: TrialSiteSumAggregateOutputType | null
    _min: TrialSiteMinAggregateOutputType | null
    _max: TrialSiteMaxAggregateOutputType | null
  }

  type GetTrialSiteGroupByPayload<T extends TrialSiteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrialSiteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrialSiteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrialSiteGroupByOutputType[P]>
            : GetScalarType<T[P], TrialSiteGroupByOutputType[P]>
        }
      >
    >


  export type TrialSiteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    trialId?: boolean
    facilityName?: boolean
    facilityId?: boolean
    status?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    zipCode?: boolean
    latitude?: boolean
    longitude?: boolean
    contactName?: boolean
    contactPhone?: boolean
    contactEmail?: boolean
    principalInvestigator?: boolean
    recruitmentStatus?: boolean
    targetEnrollment?: boolean
    currentEnrollment?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    trial?: boolean | ClinicalTrialDefaultArgs<ExtArgs>
    enrollments?: boolean | TrialSite$enrollmentsArgs<ExtArgs>
    _count?: boolean | TrialSiteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trialSite"]>

  export type TrialSiteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    trialId?: boolean
    facilityName?: boolean
    facilityId?: boolean
    status?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    zipCode?: boolean
    latitude?: boolean
    longitude?: boolean
    contactName?: boolean
    contactPhone?: boolean
    contactEmail?: boolean
    principalInvestigator?: boolean
    recruitmentStatus?: boolean
    targetEnrollment?: boolean
    currentEnrollment?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    trial?: boolean | ClinicalTrialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trialSite"]>

  export type TrialSiteSelectScalar = {
    id?: boolean
    trialId?: boolean
    facilityName?: boolean
    facilityId?: boolean
    status?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    zipCode?: boolean
    latitude?: boolean
    longitude?: boolean
    contactName?: boolean
    contactPhone?: boolean
    contactEmail?: boolean
    principalInvestigator?: boolean
    recruitmentStatus?: boolean
    targetEnrollment?: boolean
    currentEnrollment?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TrialSiteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trial?: boolean | ClinicalTrialDefaultArgs<ExtArgs>
    enrollments?: boolean | TrialSite$enrollmentsArgs<ExtArgs>
    _count?: boolean | TrialSiteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TrialSiteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trial?: boolean | ClinicalTrialDefaultArgs<ExtArgs>
  }

  export type $TrialSitePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrialSite"
    objects: {
      trial: Prisma.$ClinicalTrialPayload<ExtArgs>
      enrollments: Prisma.$EnrollmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      trialId: string
      facilityName: string
      facilityId: string | null
      status: $Enums.SiteStatus
      city: string
      state: string | null
      country: string
      zipCode: string | null
      latitude: number | null
      longitude: number | null
      contactName: string | null
      contactPhone: string | null
      contactEmail: string | null
      principalInvestigator: string | null
      recruitmentStatus: string | null
      targetEnrollment: number | null
      currentEnrollment: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["trialSite"]>
    composites: {}
  }

  type TrialSiteGetPayload<S extends boolean | null | undefined | TrialSiteDefaultArgs> = $Result.GetResult<Prisma.$TrialSitePayload, S>

  type TrialSiteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TrialSiteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TrialSiteCountAggregateInputType | true
    }

  export interface TrialSiteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrialSite'], meta: { name: 'TrialSite' } }
    /**
     * Find zero or one TrialSite that matches the filter.
     * @param {TrialSiteFindUniqueArgs} args - Arguments to find a TrialSite
     * @example
     * // Get one TrialSite
     * const trialSite = await prisma.trialSite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrialSiteFindUniqueArgs>(args: SelectSubset<T, TrialSiteFindUniqueArgs<ExtArgs>>): Prisma__TrialSiteClient<$Result.GetResult<Prisma.$TrialSitePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TrialSite that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TrialSiteFindUniqueOrThrowArgs} args - Arguments to find a TrialSite
     * @example
     * // Get one TrialSite
     * const trialSite = await prisma.trialSite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrialSiteFindUniqueOrThrowArgs>(args: SelectSubset<T, TrialSiteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrialSiteClient<$Result.GetResult<Prisma.$TrialSitePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TrialSite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialSiteFindFirstArgs} args - Arguments to find a TrialSite
     * @example
     * // Get one TrialSite
     * const trialSite = await prisma.trialSite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrialSiteFindFirstArgs>(args?: SelectSubset<T, TrialSiteFindFirstArgs<ExtArgs>>): Prisma__TrialSiteClient<$Result.GetResult<Prisma.$TrialSitePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TrialSite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialSiteFindFirstOrThrowArgs} args - Arguments to find a TrialSite
     * @example
     * // Get one TrialSite
     * const trialSite = await prisma.trialSite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrialSiteFindFirstOrThrowArgs>(args?: SelectSubset<T, TrialSiteFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrialSiteClient<$Result.GetResult<Prisma.$TrialSitePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TrialSites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialSiteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrialSites
     * const trialSites = await prisma.trialSite.findMany()
     * 
     * // Get first 10 TrialSites
     * const trialSites = await prisma.trialSite.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trialSiteWithIdOnly = await prisma.trialSite.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrialSiteFindManyArgs>(args?: SelectSubset<T, TrialSiteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrialSitePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TrialSite.
     * @param {TrialSiteCreateArgs} args - Arguments to create a TrialSite.
     * @example
     * // Create one TrialSite
     * const TrialSite = await prisma.trialSite.create({
     *   data: {
     *     // ... data to create a TrialSite
     *   }
     * })
     * 
     */
    create<T extends TrialSiteCreateArgs>(args: SelectSubset<T, TrialSiteCreateArgs<ExtArgs>>): Prisma__TrialSiteClient<$Result.GetResult<Prisma.$TrialSitePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TrialSites.
     * @param {TrialSiteCreateManyArgs} args - Arguments to create many TrialSites.
     * @example
     * // Create many TrialSites
     * const trialSite = await prisma.trialSite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrialSiteCreateManyArgs>(args?: SelectSubset<T, TrialSiteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrialSites and returns the data saved in the database.
     * @param {TrialSiteCreateManyAndReturnArgs} args - Arguments to create many TrialSites.
     * @example
     * // Create many TrialSites
     * const trialSite = await prisma.trialSite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrialSites and only return the `id`
     * const trialSiteWithIdOnly = await prisma.trialSite.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrialSiteCreateManyAndReturnArgs>(args?: SelectSubset<T, TrialSiteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrialSitePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TrialSite.
     * @param {TrialSiteDeleteArgs} args - Arguments to delete one TrialSite.
     * @example
     * // Delete one TrialSite
     * const TrialSite = await prisma.trialSite.delete({
     *   where: {
     *     // ... filter to delete one TrialSite
     *   }
     * })
     * 
     */
    delete<T extends TrialSiteDeleteArgs>(args: SelectSubset<T, TrialSiteDeleteArgs<ExtArgs>>): Prisma__TrialSiteClient<$Result.GetResult<Prisma.$TrialSitePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TrialSite.
     * @param {TrialSiteUpdateArgs} args - Arguments to update one TrialSite.
     * @example
     * // Update one TrialSite
     * const trialSite = await prisma.trialSite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrialSiteUpdateArgs>(args: SelectSubset<T, TrialSiteUpdateArgs<ExtArgs>>): Prisma__TrialSiteClient<$Result.GetResult<Prisma.$TrialSitePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TrialSites.
     * @param {TrialSiteDeleteManyArgs} args - Arguments to filter TrialSites to delete.
     * @example
     * // Delete a few TrialSites
     * const { count } = await prisma.trialSite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrialSiteDeleteManyArgs>(args?: SelectSubset<T, TrialSiteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrialSites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialSiteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrialSites
     * const trialSite = await prisma.trialSite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrialSiteUpdateManyArgs>(args: SelectSubset<T, TrialSiteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TrialSite.
     * @param {TrialSiteUpsertArgs} args - Arguments to update or create a TrialSite.
     * @example
     * // Update or create a TrialSite
     * const trialSite = await prisma.trialSite.upsert({
     *   create: {
     *     // ... data to create a TrialSite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrialSite we want to update
     *   }
     * })
     */
    upsert<T extends TrialSiteUpsertArgs>(args: SelectSubset<T, TrialSiteUpsertArgs<ExtArgs>>): Prisma__TrialSiteClient<$Result.GetResult<Prisma.$TrialSitePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TrialSites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialSiteCountArgs} args - Arguments to filter TrialSites to count.
     * @example
     * // Count the number of TrialSites
     * const count = await prisma.trialSite.count({
     *   where: {
     *     // ... the filter for the TrialSites we want to count
     *   }
     * })
    **/
    count<T extends TrialSiteCountArgs>(
      args?: Subset<T, TrialSiteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrialSiteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrialSite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialSiteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TrialSiteAggregateArgs>(args: Subset<T, TrialSiteAggregateArgs>): Prisma.PrismaPromise<GetTrialSiteAggregateType<T>>

    /**
     * Group by TrialSite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialSiteGroupByArgs} args - Group by arguments.
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
      T extends TrialSiteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrialSiteGroupByArgs['orderBy'] }
        : { orderBy?: TrialSiteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TrialSiteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrialSiteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrialSite model
   */
  readonly fields: TrialSiteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrialSite.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrialSiteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    trial<T extends ClinicalTrialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClinicalTrialDefaultArgs<ExtArgs>>): Prisma__ClinicalTrialClient<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    enrollments<T extends TrialSite$enrollmentsArgs<ExtArgs> = {}>(args?: Subset<T, TrialSite$enrollmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the TrialSite model
   */ 
  interface TrialSiteFieldRefs {
    readonly id: FieldRef<"TrialSite", 'String'>
    readonly trialId: FieldRef<"TrialSite", 'String'>
    readonly facilityName: FieldRef<"TrialSite", 'String'>
    readonly facilityId: FieldRef<"TrialSite", 'String'>
    readonly status: FieldRef<"TrialSite", 'SiteStatus'>
    readonly city: FieldRef<"TrialSite", 'String'>
    readonly state: FieldRef<"TrialSite", 'String'>
    readonly country: FieldRef<"TrialSite", 'String'>
    readonly zipCode: FieldRef<"TrialSite", 'String'>
    readonly latitude: FieldRef<"TrialSite", 'Float'>
    readonly longitude: FieldRef<"TrialSite", 'Float'>
    readonly contactName: FieldRef<"TrialSite", 'String'>
    readonly contactPhone: FieldRef<"TrialSite", 'String'>
    readonly contactEmail: FieldRef<"TrialSite", 'String'>
    readonly principalInvestigator: FieldRef<"TrialSite", 'String'>
    readonly recruitmentStatus: FieldRef<"TrialSite", 'String'>
    readonly targetEnrollment: FieldRef<"TrialSite", 'Int'>
    readonly currentEnrollment: FieldRef<"TrialSite", 'Int'>
    readonly isActive: FieldRef<"TrialSite", 'Boolean'>
    readonly createdAt: FieldRef<"TrialSite", 'DateTime'>
    readonly updatedAt: FieldRef<"TrialSite", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrialSite findUnique
   */
  export type TrialSiteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSite
     */
    select?: TrialSiteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialSiteInclude<ExtArgs> | null
    /**
     * Filter, which TrialSite to fetch.
     */
    where: TrialSiteWhereUniqueInput
  }

  /**
   * TrialSite findUniqueOrThrow
   */
  export type TrialSiteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSite
     */
    select?: TrialSiteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialSiteInclude<ExtArgs> | null
    /**
     * Filter, which TrialSite to fetch.
     */
    where: TrialSiteWhereUniqueInput
  }

  /**
   * TrialSite findFirst
   */
  export type TrialSiteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSite
     */
    select?: TrialSiteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialSiteInclude<ExtArgs> | null
    /**
     * Filter, which TrialSite to fetch.
     */
    where?: TrialSiteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrialSites to fetch.
     */
    orderBy?: TrialSiteOrderByWithRelationInput | TrialSiteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrialSites.
     */
    cursor?: TrialSiteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrialSites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrialSites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrialSites.
     */
    distinct?: TrialSiteScalarFieldEnum | TrialSiteScalarFieldEnum[]
  }

  /**
   * TrialSite findFirstOrThrow
   */
  export type TrialSiteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSite
     */
    select?: TrialSiteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialSiteInclude<ExtArgs> | null
    /**
     * Filter, which TrialSite to fetch.
     */
    where?: TrialSiteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrialSites to fetch.
     */
    orderBy?: TrialSiteOrderByWithRelationInput | TrialSiteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrialSites.
     */
    cursor?: TrialSiteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrialSites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrialSites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrialSites.
     */
    distinct?: TrialSiteScalarFieldEnum | TrialSiteScalarFieldEnum[]
  }

  /**
   * TrialSite findMany
   */
  export type TrialSiteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSite
     */
    select?: TrialSiteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialSiteInclude<ExtArgs> | null
    /**
     * Filter, which TrialSites to fetch.
     */
    where?: TrialSiteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrialSites to fetch.
     */
    orderBy?: TrialSiteOrderByWithRelationInput | TrialSiteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrialSites.
     */
    cursor?: TrialSiteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrialSites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrialSites.
     */
    skip?: number
    distinct?: TrialSiteScalarFieldEnum | TrialSiteScalarFieldEnum[]
  }

  /**
   * TrialSite create
   */
  export type TrialSiteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSite
     */
    select?: TrialSiteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialSiteInclude<ExtArgs> | null
    /**
     * The data needed to create a TrialSite.
     */
    data: XOR<TrialSiteCreateInput, TrialSiteUncheckedCreateInput>
  }

  /**
   * TrialSite createMany
   */
  export type TrialSiteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrialSites.
     */
    data: TrialSiteCreateManyInput | TrialSiteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrialSite createManyAndReturn
   */
  export type TrialSiteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSite
     */
    select?: TrialSiteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TrialSites.
     */
    data: TrialSiteCreateManyInput | TrialSiteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialSiteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrialSite update
   */
  export type TrialSiteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSite
     */
    select?: TrialSiteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialSiteInclude<ExtArgs> | null
    /**
     * The data needed to update a TrialSite.
     */
    data: XOR<TrialSiteUpdateInput, TrialSiteUncheckedUpdateInput>
    /**
     * Choose, which TrialSite to update.
     */
    where: TrialSiteWhereUniqueInput
  }

  /**
   * TrialSite updateMany
   */
  export type TrialSiteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrialSites.
     */
    data: XOR<TrialSiteUpdateManyMutationInput, TrialSiteUncheckedUpdateManyInput>
    /**
     * Filter which TrialSites to update
     */
    where?: TrialSiteWhereInput
  }

  /**
   * TrialSite upsert
   */
  export type TrialSiteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSite
     */
    select?: TrialSiteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialSiteInclude<ExtArgs> | null
    /**
     * The filter to search for the TrialSite to update in case it exists.
     */
    where: TrialSiteWhereUniqueInput
    /**
     * In case the TrialSite found by the `where` argument doesn't exist, create a new TrialSite with this data.
     */
    create: XOR<TrialSiteCreateInput, TrialSiteUncheckedCreateInput>
    /**
     * In case the TrialSite was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrialSiteUpdateInput, TrialSiteUncheckedUpdateInput>
  }

  /**
   * TrialSite delete
   */
  export type TrialSiteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSite
     */
    select?: TrialSiteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialSiteInclude<ExtArgs> | null
    /**
     * Filter which TrialSite to delete.
     */
    where: TrialSiteWhereUniqueInput
  }

  /**
   * TrialSite deleteMany
   */
  export type TrialSiteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrialSites to delete
     */
    where?: TrialSiteWhereInput
  }

  /**
   * TrialSite.enrollments
   */
  export type TrialSite$enrollmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentInclude<ExtArgs> | null
    where?: EnrollmentWhereInput
    orderBy?: EnrollmentOrderByWithRelationInput | EnrollmentOrderByWithRelationInput[]
    cursor?: EnrollmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EnrollmentScalarFieldEnum | EnrollmentScalarFieldEnum[]
  }

  /**
   * TrialSite without action
   */
  export type TrialSiteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialSite
     */
    select?: TrialSiteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialSiteInclude<ExtArgs> | null
  }


  /**
   * Model PatientMatch
   */

  export type AggregatePatientMatch = {
    _count: PatientMatchCountAggregateOutputType | null
    _avg: PatientMatchAvgAggregateOutputType | null
    _sum: PatientMatchSumAggregateOutputType | null
    _min: PatientMatchMinAggregateOutputType | null
    _max: PatientMatchMaxAggregateOutputType | null
  }

  export type PatientMatchAvgAggregateOutputType = {
    matchScore: number | null
    distance: number | null
  }

  export type PatientMatchSumAggregateOutputType = {
    matchScore: number | null
    distance: number | null
  }

  export type PatientMatchMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    trialId: string | null
    matchScore: number | null
    eligibilityStatus: $Enums.EligibilityStatus | null
    distance: number | null
    nearestSiteId: string | null
    reviewStatus: $Enums.ReviewStatus | null
    reviewedBy: string | null
    reviewedAt: Date | null
    reviewNotes: string | null
    patientNotified: boolean | null
    notifiedAt: Date | null
    isInterested: boolean | null
    interestExpressedAt: Date | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientMatchMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    trialId: string | null
    matchScore: number | null
    eligibilityStatus: $Enums.EligibilityStatus | null
    distance: number | null
    nearestSiteId: string | null
    reviewStatus: $Enums.ReviewStatus | null
    reviewedBy: string | null
    reviewedAt: Date | null
    reviewNotes: string | null
    patientNotified: boolean | null
    notifiedAt: Date | null
    isInterested: boolean | null
    interestExpressedAt: Date | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientMatchCountAggregateOutputType = {
    id: number
    patientId: number
    trialId: number
    matchScore: number
    eligibilityStatus: number
    matchedCriteria: number
    unmatchedCriteria: number
    uncertainCriteria: number
    matchDetails: number
    distance: number
    nearestSiteId: number
    reviewStatus: number
    reviewedBy: number
    reviewedAt: number
    reviewNotes: number
    patientNotified: number
    notifiedAt: number
    isInterested: number
    interestExpressedAt: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PatientMatchAvgAggregateInputType = {
    matchScore?: true
    distance?: true
  }

  export type PatientMatchSumAggregateInputType = {
    matchScore?: true
    distance?: true
  }

  export type PatientMatchMinAggregateInputType = {
    id?: true
    patientId?: true
    trialId?: true
    matchScore?: true
    eligibilityStatus?: true
    distance?: true
    nearestSiteId?: true
    reviewStatus?: true
    reviewedBy?: true
    reviewedAt?: true
    reviewNotes?: true
    patientNotified?: true
    notifiedAt?: true
    isInterested?: true
    interestExpressedAt?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientMatchMaxAggregateInputType = {
    id?: true
    patientId?: true
    trialId?: true
    matchScore?: true
    eligibilityStatus?: true
    distance?: true
    nearestSiteId?: true
    reviewStatus?: true
    reviewedBy?: true
    reviewedAt?: true
    reviewNotes?: true
    patientNotified?: true
    notifiedAt?: true
    isInterested?: true
    interestExpressedAt?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientMatchCountAggregateInputType = {
    id?: true
    patientId?: true
    trialId?: true
    matchScore?: true
    eligibilityStatus?: true
    matchedCriteria?: true
    unmatchedCriteria?: true
    uncertainCriteria?: true
    matchDetails?: true
    distance?: true
    nearestSiteId?: true
    reviewStatus?: true
    reviewedBy?: true
    reviewedAt?: true
    reviewNotes?: true
    patientNotified?: true
    notifiedAt?: true
    isInterested?: true
    interestExpressedAt?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PatientMatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientMatch to aggregate.
     */
    where?: PatientMatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientMatches to fetch.
     */
    orderBy?: PatientMatchOrderByWithRelationInput | PatientMatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientMatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientMatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientMatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientMatches
    **/
    _count?: true | PatientMatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PatientMatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PatientMatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientMatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientMatchMaxAggregateInputType
  }

  export type GetPatientMatchAggregateType<T extends PatientMatchAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientMatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientMatch[P]>
      : GetScalarType<T[P], AggregatePatientMatch[P]>
  }




  export type PatientMatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientMatchWhereInput
    orderBy?: PatientMatchOrderByWithAggregationInput | PatientMatchOrderByWithAggregationInput[]
    by: PatientMatchScalarFieldEnum[] | PatientMatchScalarFieldEnum
    having?: PatientMatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientMatchCountAggregateInputType | true
    _avg?: PatientMatchAvgAggregateInputType
    _sum?: PatientMatchSumAggregateInputType
    _min?: PatientMatchMinAggregateInputType
    _max?: PatientMatchMaxAggregateInputType
  }

  export type PatientMatchGroupByOutputType = {
    id: string
    patientId: string
    trialId: string
    matchScore: number
    eligibilityStatus: $Enums.EligibilityStatus
    matchedCriteria: JsonValue
    unmatchedCriteria: JsonValue
    uncertainCriteria: JsonValue | null
    matchDetails: JsonValue | null
    distance: number | null
    nearestSiteId: string | null
    reviewStatus: $Enums.ReviewStatus
    reviewedBy: string | null
    reviewedAt: Date | null
    reviewNotes: string | null
    patientNotified: boolean
    notifiedAt: Date | null
    isInterested: boolean | null
    interestExpressedAt: Date | null
    expiresAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PatientMatchCountAggregateOutputType | null
    _avg: PatientMatchAvgAggregateOutputType | null
    _sum: PatientMatchSumAggregateOutputType | null
    _min: PatientMatchMinAggregateOutputType | null
    _max: PatientMatchMaxAggregateOutputType | null
  }

  type GetPatientMatchGroupByPayload<T extends PatientMatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientMatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientMatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientMatchGroupByOutputType[P]>
            : GetScalarType<T[P], PatientMatchGroupByOutputType[P]>
        }
      >
    >


  export type PatientMatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    trialId?: boolean
    matchScore?: boolean
    eligibilityStatus?: boolean
    matchedCriteria?: boolean
    unmatchedCriteria?: boolean
    uncertainCriteria?: boolean
    matchDetails?: boolean
    distance?: boolean
    nearestSiteId?: boolean
    reviewStatus?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    reviewNotes?: boolean
    patientNotified?: boolean
    notifiedAt?: boolean
    isInterested?: boolean
    interestExpressedAt?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    trial?: boolean | ClinicalTrialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientMatch"]>

  export type PatientMatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    trialId?: boolean
    matchScore?: boolean
    eligibilityStatus?: boolean
    matchedCriteria?: boolean
    unmatchedCriteria?: boolean
    uncertainCriteria?: boolean
    matchDetails?: boolean
    distance?: boolean
    nearestSiteId?: boolean
    reviewStatus?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    reviewNotes?: boolean
    patientNotified?: boolean
    notifiedAt?: boolean
    isInterested?: boolean
    interestExpressedAt?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    trial?: boolean | ClinicalTrialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientMatch"]>

  export type PatientMatchSelectScalar = {
    id?: boolean
    patientId?: boolean
    trialId?: boolean
    matchScore?: boolean
    eligibilityStatus?: boolean
    matchedCriteria?: boolean
    unmatchedCriteria?: boolean
    uncertainCriteria?: boolean
    matchDetails?: boolean
    distance?: boolean
    nearestSiteId?: boolean
    reviewStatus?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    reviewNotes?: boolean
    patientNotified?: boolean
    notifiedAt?: boolean
    isInterested?: boolean
    interestExpressedAt?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PatientMatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trial?: boolean | ClinicalTrialDefaultArgs<ExtArgs>
  }
  export type PatientMatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trial?: boolean | ClinicalTrialDefaultArgs<ExtArgs>
  }

  export type $PatientMatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientMatch"
    objects: {
      trial: Prisma.$ClinicalTrialPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      trialId: string
      matchScore: number
      eligibilityStatus: $Enums.EligibilityStatus
      matchedCriteria: Prisma.JsonValue
      unmatchedCriteria: Prisma.JsonValue
      uncertainCriteria: Prisma.JsonValue | null
      matchDetails: Prisma.JsonValue | null
      distance: number | null
      nearestSiteId: string | null
      reviewStatus: $Enums.ReviewStatus
      reviewedBy: string | null
      reviewedAt: Date | null
      reviewNotes: string | null
      patientNotified: boolean
      notifiedAt: Date | null
      isInterested: boolean | null
      interestExpressedAt: Date | null
      expiresAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["patientMatch"]>
    composites: {}
  }

  type PatientMatchGetPayload<S extends boolean | null | undefined | PatientMatchDefaultArgs> = $Result.GetResult<Prisma.$PatientMatchPayload, S>

  type PatientMatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientMatchFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientMatchCountAggregateInputType | true
    }

  export interface PatientMatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientMatch'], meta: { name: 'PatientMatch' } }
    /**
     * Find zero or one PatientMatch that matches the filter.
     * @param {PatientMatchFindUniqueArgs} args - Arguments to find a PatientMatch
     * @example
     * // Get one PatientMatch
     * const patientMatch = await prisma.patientMatch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientMatchFindUniqueArgs>(args: SelectSubset<T, PatientMatchFindUniqueArgs<ExtArgs>>): Prisma__PatientMatchClient<$Result.GetResult<Prisma.$PatientMatchPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PatientMatch that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientMatchFindUniqueOrThrowArgs} args - Arguments to find a PatientMatch
     * @example
     * // Get one PatientMatch
     * const patientMatch = await prisma.patientMatch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientMatchFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientMatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientMatchClient<$Result.GetResult<Prisma.$PatientMatchPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PatientMatch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMatchFindFirstArgs} args - Arguments to find a PatientMatch
     * @example
     * // Get one PatientMatch
     * const patientMatch = await prisma.patientMatch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientMatchFindFirstArgs>(args?: SelectSubset<T, PatientMatchFindFirstArgs<ExtArgs>>): Prisma__PatientMatchClient<$Result.GetResult<Prisma.$PatientMatchPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PatientMatch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMatchFindFirstOrThrowArgs} args - Arguments to find a PatientMatch
     * @example
     * // Get one PatientMatch
     * const patientMatch = await prisma.patientMatch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientMatchFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientMatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientMatchClient<$Result.GetResult<Prisma.$PatientMatchPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PatientMatches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientMatches
     * const patientMatches = await prisma.patientMatch.findMany()
     * 
     * // Get first 10 PatientMatches
     * const patientMatches = await prisma.patientMatch.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientMatchWithIdOnly = await prisma.patientMatch.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientMatchFindManyArgs>(args?: SelectSubset<T, PatientMatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientMatchPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PatientMatch.
     * @param {PatientMatchCreateArgs} args - Arguments to create a PatientMatch.
     * @example
     * // Create one PatientMatch
     * const PatientMatch = await prisma.patientMatch.create({
     *   data: {
     *     // ... data to create a PatientMatch
     *   }
     * })
     * 
     */
    create<T extends PatientMatchCreateArgs>(args: SelectSubset<T, PatientMatchCreateArgs<ExtArgs>>): Prisma__PatientMatchClient<$Result.GetResult<Prisma.$PatientMatchPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PatientMatches.
     * @param {PatientMatchCreateManyArgs} args - Arguments to create many PatientMatches.
     * @example
     * // Create many PatientMatches
     * const patientMatch = await prisma.patientMatch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientMatchCreateManyArgs>(args?: SelectSubset<T, PatientMatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientMatches and returns the data saved in the database.
     * @param {PatientMatchCreateManyAndReturnArgs} args - Arguments to create many PatientMatches.
     * @example
     * // Create many PatientMatches
     * const patientMatch = await prisma.patientMatch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientMatches and only return the `id`
     * const patientMatchWithIdOnly = await prisma.patientMatch.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientMatchCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientMatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientMatchPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PatientMatch.
     * @param {PatientMatchDeleteArgs} args - Arguments to delete one PatientMatch.
     * @example
     * // Delete one PatientMatch
     * const PatientMatch = await prisma.patientMatch.delete({
     *   where: {
     *     // ... filter to delete one PatientMatch
     *   }
     * })
     * 
     */
    delete<T extends PatientMatchDeleteArgs>(args: SelectSubset<T, PatientMatchDeleteArgs<ExtArgs>>): Prisma__PatientMatchClient<$Result.GetResult<Prisma.$PatientMatchPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PatientMatch.
     * @param {PatientMatchUpdateArgs} args - Arguments to update one PatientMatch.
     * @example
     * // Update one PatientMatch
     * const patientMatch = await prisma.patientMatch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientMatchUpdateArgs>(args: SelectSubset<T, PatientMatchUpdateArgs<ExtArgs>>): Prisma__PatientMatchClient<$Result.GetResult<Prisma.$PatientMatchPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PatientMatches.
     * @param {PatientMatchDeleteManyArgs} args - Arguments to filter PatientMatches to delete.
     * @example
     * // Delete a few PatientMatches
     * const { count } = await prisma.patientMatch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientMatchDeleteManyArgs>(args?: SelectSubset<T, PatientMatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientMatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientMatches
     * const patientMatch = await prisma.patientMatch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientMatchUpdateManyArgs>(args: SelectSubset<T, PatientMatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PatientMatch.
     * @param {PatientMatchUpsertArgs} args - Arguments to update or create a PatientMatch.
     * @example
     * // Update or create a PatientMatch
     * const patientMatch = await prisma.patientMatch.upsert({
     *   create: {
     *     // ... data to create a PatientMatch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientMatch we want to update
     *   }
     * })
     */
    upsert<T extends PatientMatchUpsertArgs>(args: SelectSubset<T, PatientMatchUpsertArgs<ExtArgs>>): Prisma__PatientMatchClient<$Result.GetResult<Prisma.$PatientMatchPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PatientMatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMatchCountArgs} args - Arguments to filter PatientMatches to count.
     * @example
     * // Count the number of PatientMatches
     * const count = await prisma.patientMatch.count({
     *   where: {
     *     // ... the filter for the PatientMatches we want to count
     *   }
     * })
    **/
    count<T extends PatientMatchCountArgs>(
      args?: Subset<T, PatientMatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientMatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientMatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PatientMatchAggregateArgs>(args: Subset<T, PatientMatchAggregateArgs>): Prisma.PrismaPromise<GetPatientMatchAggregateType<T>>

    /**
     * Group by PatientMatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMatchGroupByArgs} args - Group by arguments.
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
      T extends PatientMatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientMatchGroupByArgs['orderBy'] }
        : { orderBy?: PatientMatchGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PatientMatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientMatch model
   */
  readonly fields: PatientMatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientMatch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientMatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    trial<T extends ClinicalTrialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClinicalTrialDefaultArgs<ExtArgs>>): Prisma__ClinicalTrialClient<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the PatientMatch model
   */ 
  interface PatientMatchFieldRefs {
    readonly id: FieldRef<"PatientMatch", 'String'>
    readonly patientId: FieldRef<"PatientMatch", 'String'>
    readonly trialId: FieldRef<"PatientMatch", 'String'>
    readonly matchScore: FieldRef<"PatientMatch", 'Float'>
    readonly eligibilityStatus: FieldRef<"PatientMatch", 'EligibilityStatus'>
    readonly matchedCriteria: FieldRef<"PatientMatch", 'Json'>
    readonly unmatchedCriteria: FieldRef<"PatientMatch", 'Json'>
    readonly uncertainCriteria: FieldRef<"PatientMatch", 'Json'>
    readonly matchDetails: FieldRef<"PatientMatch", 'Json'>
    readonly distance: FieldRef<"PatientMatch", 'Float'>
    readonly nearestSiteId: FieldRef<"PatientMatch", 'String'>
    readonly reviewStatus: FieldRef<"PatientMatch", 'ReviewStatus'>
    readonly reviewedBy: FieldRef<"PatientMatch", 'String'>
    readonly reviewedAt: FieldRef<"PatientMatch", 'DateTime'>
    readonly reviewNotes: FieldRef<"PatientMatch", 'String'>
    readonly patientNotified: FieldRef<"PatientMatch", 'Boolean'>
    readonly notifiedAt: FieldRef<"PatientMatch", 'DateTime'>
    readonly isInterested: FieldRef<"PatientMatch", 'Boolean'>
    readonly interestExpressedAt: FieldRef<"PatientMatch", 'DateTime'>
    readonly expiresAt: FieldRef<"PatientMatch", 'DateTime'>
    readonly createdAt: FieldRef<"PatientMatch", 'DateTime'>
    readonly updatedAt: FieldRef<"PatientMatch", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PatientMatch findUnique
   */
  export type PatientMatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMatch
     */
    select?: PatientMatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMatchInclude<ExtArgs> | null
    /**
     * Filter, which PatientMatch to fetch.
     */
    where: PatientMatchWhereUniqueInput
  }

  /**
   * PatientMatch findUniqueOrThrow
   */
  export type PatientMatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMatch
     */
    select?: PatientMatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMatchInclude<ExtArgs> | null
    /**
     * Filter, which PatientMatch to fetch.
     */
    where: PatientMatchWhereUniqueInput
  }

  /**
   * PatientMatch findFirst
   */
  export type PatientMatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMatch
     */
    select?: PatientMatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMatchInclude<ExtArgs> | null
    /**
     * Filter, which PatientMatch to fetch.
     */
    where?: PatientMatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientMatches to fetch.
     */
    orderBy?: PatientMatchOrderByWithRelationInput | PatientMatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientMatches.
     */
    cursor?: PatientMatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientMatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientMatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientMatches.
     */
    distinct?: PatientMatchScalarFieldEnum | PatientMatchScalarFieldEnum[]
  }

  /**
   * PatientMatch findFirstOrThrow
   */
  export type PatientMatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMatch
     */
    select?: PatientMatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMatchInclude<ExtArgs> | null
    /**
     * Filter, which PatientMatch to fetch.
     */
    where?: PatientMatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientMatches to fetch.
     */
    orderBy?: PatientMatchOrderByWithRelationInput | PatientMatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientMatches.
     */
    cursor?: PatientMatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientMatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientMatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientMatches.
     */
    distinct?: PatientMatchScalarFieldEnum | PatientMatchScalarFieldEnum[]
  }

  /**
   * PatientMatch findMany
   */
  export type PatientMatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMatch
     */
    select?: PatientMatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMatchInclude<ExtArgs> | null
    /**
     * Filter, which PatientMatches to fetch.
     */
    where?: PatientMatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientMatches to fetch.
     */
    orderBy?: PatientMatchOrderByWithRelationInput | PatientMatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientMatches.
     */
    cursor?: PatientMatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientMatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientMatches.
     */
    skip?: number
    distinct?: PatientMatchScalarFieldEnum | PatientMatchScalarFieldEnum[]
  }

  /**
   * PatientMatch create
   */
  export type PatientMatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMatch
     */
    select?: PatientMatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMatchInclude<ExtArgs> | null
    /**
     * The data needed to create a PatientMatch.
     */
    data: XOR<PatientMatchCreateInput, PatientMatchUncheckedCreateInput>
  }

  /**
   * PatientMatch createMany
   */
  export type PatientMatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientMatches.
     */
    data: PatientMatchCreateManyInput | PatientMatchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientMatch createManyAndReturn
   */
  export type PatientMatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMatch
     */
    select?: PatientMatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PatientMatches.
     */
    data: PatientMatchCreateManyInput | PatientMatchCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMatchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PatientMatch update
   */
  export type PatientMatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMatch
     */
    select?: PatientMatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMatchInclude<ExtArgs> | null
    /**
     * The data needed to update a PatientMatch.
     */
    data: XOR<PatientMatchUpdateInput, PatientMatchUncheckedUpdateInput>
    /**
     * Choose, which PatientMatch to update.
     */
    where: PatientMatchWhereUniqueInput
  }

  /**
   * PatientMatch updateMany
   */
  export type PatientMatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientMatches.
     */
    data: XOR<PatientMatchUpdateManyMutationInput, PatientMatchUncheckedUpdateManyInput>
    /**
     * Filter which PatientMatches to update
     */
    where?: PatientMatchWhereInput
  }

  /**
   * PatientMatch upsert
   */
  export type PatientMatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMatch
     */
    select?: PatientMatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMatchInclude<ExtArgs> | null
    /**
     * The filter to search for the PatientMatch to update in case it exists.
     */
    where: PatientMatchWhereUniqueInput
    /**
     * In case the PatientMatch found by the `where` argument doesn't exist, create a new PatientMatch with this data.
     */
    create: XOR<PatientMatchCreateInput, PatientMatchUncheckedCreateInput>
    /**
     * In case the PatientMatch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientMatchUpdateInput, PatientMatchUncheckedUpdateInput>
  }

  /**
   * PatientMatch delete
   */
  export type PatientMatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMatch
     */
    select?: PatientMatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMatchInclude<ExtArgs> | null
    /**
     * Filter which PatientMatch to delete.
     */
    where: PatientMatchWhereUniqueInput
  }

  /**
   * PatientMatch deleteMany
   */
  export type PatientMatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientMatches to delete
     */
    where?: PatientMatchWhereInput
  }

  /**
   * PatientMatch without action
   */
  export type PatientMatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMatch
     */
    select?: PatientMatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMatchInclude<ExtArgs> | null
  }


  /**
   * Model Enrollment
   */

  export type AggregateEnrollment = {
    _count: EnrollmentCountAggregateOutputType | null
    _min: EnrollmentMinAggregateOutputType | null
    _max: EnrollmentMaxAggregateOutputType | null
  }

  export type EnrollmentMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    trialId: string | null
    siteId: string | null
    status: $Enums.EnrollmentStatus | null
    studySubjectId: string | null
    screeningDate: Date | null
    enrollmentDate: Date | null
    randomizationDate: Date | null
    armAssignment: string | null
    withdrawalDate: Date | null
    withdrawalReason: string | null
    completionDate: Date | null
    primaryInvestigator: string | null
    studyCoordinator: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EnrollmentMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    trialId: string | null
    siteId: string | null
    status: $Enums.EnrollmentStatus | null
    studySubjectId: string | null
    screeningDate: Date | null
    enrollmentDate: Date | null
    randomizationDate: Date | null
    armAssignment: string | null
    withdrawalDate: Date | null
    withdrawalReason: string | null
    completionDate: Date | null
    primaryInvestigator: string | null
    studyCoordinator: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EnrollmentCountAggregateOutputType = {
    id: number
    patientId: number
    trialId: number
    siteId: number
    status: number
    studySubjectId: number
    screeningDate: number
    enrollmentDate: number
    randomizationDate: number
    armAssignment: number
    withdrawalDate: number
    withdrawalReason: number
    completionDate: number
    primaryInvestigator: number
    studyCoordinator: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EnrollmentMinAggregateInputType = {
    id?: true
    patientId?: true
    trialId?: true
    siteId?: true
    status?: true
    studySubjectId?: true
    screeningDate?: true
    enrollmentDate?: true
    randomizationDate?: true
    armAssignment?: true
    withdrawalDate?: true
    withdrawalReason?: true
    completionDate?: true
    primaryInvestigator?: true
    studyCoordinator?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EnrollmentMaxAggregateInputType = {
    id?: true
    patientId?: true
    trialId?: true
    siteId?: true
    status?: true
    studySubjectId?: true
    screeningDate?: true
    enrollmentDate?: true
    randomizationDate?: true
    armAssignment?: true
    withdrawalDate?: true
    withdrawalReason?: true
    completionDate?: true
    primaryInvestigator?: true
    studyCoordinator?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EnrollmentCountAggregateInputType = {
    id?: true
    patientId?: true
    trialId?: true
    siteId?: true
    status?: true
    studySubjectId?: true
    screeningDate?: true
    enrollmentDate?: true
    randomizationDate?: true
    armAssignment?: true
    withdrawalDate?: true
    withdrawalReason?: true
    completionDate?: true
    primaryInvestigator?: true
    studyCoordinator?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EnrollmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Enrollment to aggregate.
     */
    where?: EnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enrollments to fetch.
     */
    orderBy?: EnrollmentOrderByWithRelationInput | EnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Enrollments
    **/
    _count?: true | EnrollmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnrollmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnrollmentMaxAggregateInputType
  }

  export type GetEnrollmentAggregateType<T extends EnrollmentAggregateArgs> = {
        [P in keyof T & keyof AggregateEnrollment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnrollment[P]>
      : GetScalarType<T[P], AggregateEnrollment[P]>
  }




  export type EnrollmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnrollmentWhereInput
    orderBy?: EnrollmentOrderByWithAggregationInput | EnrollmentOrderByWithAggregationInput[]
    by: EnrollmentScalarFieldEnum[] | EnrollmentScalarFieldEnum
    having?: EnrollmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnrollmentCountAggregateInputType | true
    _min?: EnrollmentMinAggregateInputType
    _max?: EnrollmentMaxAggregateInputType
  }

  export type EnrollmentGroupByOutputType = {
    id: string
    patientId: string
    trialId: string
    siteId: string
    status: $Enums.EnrollmentStatus
    studySubjectId: string | null
    screeningDate: Date | null
    enrollmentDate: Date | null
    randomizationDate: Date | null
    armAssignment: string | null
    withdrawalDate: Date | null
    withdrawalReason: string | null
    completionDate: Date | null
    primaryInvestigator: string | null
    studyCoordinator: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: EnrollmentCountAggregateOutputType | null
    _min: EnrollmentMinAggregateOutputType | null
    _max: EnrollmentMaxAggregateOutputType | null
  }

  type GetEnrollmentGroupByPayload<T extends EnrollmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnrollmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnrollmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnrollmentGroupByOutputType[P]>
            : GetScalarType<T[P], EnrollmentGroupByOutputType[P]>
        }
      >
    >


  export type EnrollmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    trialId?: boolean
    siteId?: boolean
    status?: boolean
    studySubjectId?: boolean
    screeningDate?: boolean
    enrollmentDate?: boolean
    randomizationDate?: boolean
    armAssignment?: boolean
    withdrawalDate?: boolean
    withdrawalReason?: boolean
    completionDate?: boolean
    primaryInvestigator?: boolean
    studyCoordinator?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    trial?: boolean | ClinicalTrialDefaultArgs<ExtArgs>
    site?: boolean | TrialSiteDefaultArgs<ExtArgs>
    consentRecords?: boolean | Enrollment$consentRecordsArgs<ExtArgs>
    statusHistory?: boolean | Enrollment$statusHistoryArgs<ExtArgs>
    visits?: boolean | Enrollment$visitsArgs<ExtArgs>
    _count?: boolean | EnrollmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["enrollment"]>

  export type EnrollmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    trialId?: boolean
    siteId?: boolean
    status?: boolean
    studySubjectId?: boolean
    screeningDate?: boolean
    enrollmentDate?: boolean
    randomizationDate?: boolean
    armAssignment?: boolean
    withdrawalDate?: boolean
    withdrawalReason?: boolean
    completionDate?: boolean
    primaryInvestigator?: boolean
    studyCoordinator?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    trial?: boolean | ClinicalTrialDefaultArgs<ExtArgs>
    site?: boolean | TrialSiteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["enrollment"]>

  export type EnrollmentSelectScalar = {
    id?: boolean
    patientId?: boolean
    trialId?: boolean
    siteId?: boolean
    status?: boolean
    studySubjectId?: boolean
    screeningDate?: boolean
    enrollmentDate?: boolean
    randomizationDate?: boolean
    armAssignment?: boolean
    withdrawalDate?: boolean
    withdrawalReason?: boolean
    completionDate?: boolean
    primaryInvestigator?: boolean
    studyCoordinator?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EnrollmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trial?: boolean | ClinicalTrialDefaultArgs<ExtArgs>
    site?: boolean | TrialSiteDefaultArgs<ExtArgs>
    consentRecords?: boolean | Enrollment$consentRecordsArgs<ExtArgs>
    statusHistory?: boolean | Enrollment$statusHistoryArgs<ExtArgs>
    visits?: boolean | Enrollment$visitsArgs<ExtArgs>
    _count?: boolean | EnrollmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EnrollmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trial?: boolean | ClinicalTrialDefaultArgs<ExtArgs>
    site?: boolean | TrialSiteDefaultArgs<ExtArgs>
  }

  export type $EnrollmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Enrollment"
    objects: {
      trial: Prisma.$ClinicalTrialPayload<ExtArgs>
      site: Prisma.$TrialSitePayload<ExtArgs>
      consentRecords: Prisma.$ConsentRecordPayload<ExtArgs>[]
      statusHistory: Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>[]
      visits: Prisma.$TrialVisitPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      trialId: string
      siteId: string
      status: $Enums.EnrollmentStatus
      studySubjectId: string | null
      screeningDate: Date | null
      enrollmentDate: Date | null
      randomizationDate: Date | null
      armAssignment: string | null
      withdrawalDate: Date | null
      withdrawalReason: string | null
      completionDate: Date | null
      primaryInvestigator: string | null
      studyCoordinator: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["enrollment"]>
    composites: {}
  }

  type EnrollmentGetPayload<S extends boolean | null | undefined | EnrollmentDefaultArgs> = $Result.GetResult<Prisma.$EnrollmentPayload, S>

  type EnrollmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EnrollmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EnrollmentCountAggregateInputType | true
    }

  export interface EnrollmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Enrollment'], meta: { name: 'Enrollment' } }
    /**
     * Find zero or one Enrollment that matches the filter.
     * @param {EnrollmentFindUniqueArgs} args - Arguments to find a Enrollment
     * @example
     * // Get one Enrollment
     * const enrollment = await prisma.enrollment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnrollmentFindUniqueArgs>(args: SelectSubset<T, EnrollmentFindUniqueArgs<ExtArgs>>): Prisma__EnrollmentClient<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Enrollment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EnrollmentFindUniqueOrThrowArgs} args - Arguments to find a Enrollment
     * @example
     * // Get one Enrollment
     * const enrollment = await prisma.enrollment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnrollmentFindUniqueOrThrowArgs>(args: SelectSubset<T, EnrollmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EnrollmentClient<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Enrollment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentFindFirstArgs} args - Arguments to find a Enrollment
     * @example
     * // Get one Enrollment
     * const enrollment = await prisma.enrollment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnrollmentFindFirstArgs>(args?: SelectSubset<T, EnrollmentFindFirstArgs<ExtArgs>>): Prisma__EnrollmentClient<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Enrollment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentFindFirstOrThrowArgs} args - Arguments to find a Enrollment
     * @example
     * // Get one Enrollment
     * const enrollment = await prisma.enrollment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnrollmentFindFirstOrThrowArgs>(args?: SelectSubset<T, EnrollmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__EnrollmentClient<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Enrollments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Enrollments
     * const enrollments = await prisma.enrollment.findMany()
     * 
     * // Get first 10 Enrollments
     * const enrollments = await prisma.enrollment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const enrollmentWithIdOnly = await prisma.enrollment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EnrollmentFindManyArgs>(args?: SelectSubset<T, EnrollmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Enrollment.
     * @param {EnrollmentCreateArgs} args - Arguments to create a Enrollment.
     * @example
     * // Create one Enrollment
     * const Enrollment = await prisma.enrollment.create({
     *   data: {
     *     // ... data to create a Enrollment
     *   }
     * })
     * 
     */
    create<T extends EnrollmentCreateArgs>(args: SelectSubset<T, EnrollmentCreateArgs<ExtArgs>>): Prisma__EnrollmentClient<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Enrollments.
     * @param {EnrollmentCreateManyArgs} args - Arguments to create many Enrollments.
     * @example
     * // Create many Enrollments
     * const enrollment = await prisma.enrollment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EnrollmentCreateManyArgs>(args?: SelectSubset<T, EnrollmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Enrollments and returns the data saved in the database.
     * @param {EnrollmentCreateManyAndReturnArgs} args - Arguments to create many Enrollments.
     * @example
     * // Create many Enrollments
     * const enrollment = await prisma.enrollment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Enrollments and only return the `id`
     * const enrollmentWithIdOnly = await prisma.enrollment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EnrollmentCreateManyAndReturnArgs>(args?: SelectSubset<T, EnrollmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Enrollment.
     * @param {EnrollmentDeleteArgs} args - Arguments to delete one Enrollment.
     * @example
     * // Delete one Enrollment
     * const Enrollment = await prisma.enrollment.delete({
     *   where: {
     *     // ... filter to delete one Enrollment
     *   }
     * })
     * 
     */
    delete<T extends EnrollmentDeleteArgs>(args: SelectSubset<T, EnrollmentDeleteArgs<ExtArgs>>): Prisma__EnrollmentClient<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Enrollment.
     * @param {EnrollmentUpdateArgs} args - Arguments to update one Enrollment.
     * @example
     * // Update one Enrollment
     * const enrollment = await prisma.enrollment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EnrollmentUpdateArgs>(args: SelectSubset<T, EnrollmentUpdateArgs<ExtArgs>>): Prisma__EnrollmentClient<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Enrollments.
     * @param {EnrollmentDeleteManyArgs} args - Arguments to filter Enrollments to delete.
     * @example
     * // Delete a few Enrollments
     * const { count } = await prisma.enrollment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EnrollmentDeleteManyArgs>(args?: SelectSubset<T, EnrollmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Enrollments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Enrollments
     * const enrollment = await prisma.enrollment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EnrollmentUpdateManyArgs>(args: SelectSubset<T, EnrollmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Enrollment.
     * @param {EnrollmentUpsertArgs} args - Arguments to update or create a Enrollment.
     * @example
     * // Update or create a Enrollment
     * const enrollment = await prisma.enrollment.upsert({
     *   create: {
     *     // ... data to create a Enrollment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Enrollment we want to update
     *   }
     * })
     */
    upsert<T extends EnrollmentUpsertArgs>(args: SelectSubset<T, EnrollmentUpsertArgs<ExtArgs>>): Prisma__EnrollmentClient<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Enrollments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentCountArgs} args - Arguments to filter Enrollments to count.
     * @example
     * // Count the number of Enrollments
     * const count = await prisma.enrollment.count({
     *   where: {
     *     // ... the filter for the Enrollments we want to count
     *   }
     * })
    **/
    count<T extends EnrollmentCountArgs>(
      args?: Subset<T, EnrollmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnrollmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Enrollment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EnrollmentAggregateArgs>(args: Subset<T, EnrollmentAggregateArgs>): Prisma.PrismaPromise<GetEnrollmentAggregateType<T>>

    /**
     * Group by Enrollment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentGroupByArgs} args - Group by arguments.
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
      T extends EnrollmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnrollmentGroupByArgs['orderBy'] }
        : { orderBy?: EnrollmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EnrollmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnrollmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Enrollment model
   */
  readonly fields: EnrollmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Enrollment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnrollmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    trial<T extends ClinicalTrialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClinicalTrialDefaultArgs<ExtArgs>>): Prisma__ClinicalTrialClient<$Result.GetResult<Prisma.$ClinicalTrialPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    site<T extends TrialSiteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TrialSiteDefaultArgs<ExtArgs>>): Prisma__TrialSiteClient<$Result.GetResult<Prisma.$TrialSitePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    consentRecords<T extends Enrollment$consentRecordsArgs<ExtArgs> = {}>(args?: Subset<T, Enrollment$consentRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "findMany"> | Null>
    statusHistory<T extends Enrollment$statusHistoryArgs<ExtArgs> = {}>(args?: Subset<T, Enrollment$statusHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>, T, "findMany"> | Null>
    visits<T extends Enrollment$visitsArgs<ExtArgs> = {}>(args?: Subset<T, Enrollment$visitsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrialVisitPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Enrollment model
   */ 
  interface EnrollmentFieldRefs {
    readonly id: FieldRef<"Enrollment", 'String'>
    readonly patientId: FieldRef<"Enrollment", 'String'>
    readonly trialId: FieldRef<"Enrollment", 'String'>
    readonly siteId: FieldRef<"Enrollment", 'String'>
    readonly status: FieldRef<"Enrollment", 'EnrollmentStatus'>
    readonly studySubjectId: FieldRef<"Enrollment", 'String'>
    readonly screeningDate: FieldRef<"Enrollment", 'DateTime'>
    readonly enrollmentDate: FieldRef<"Enrollment", 'DateTime'>
    readonly randomizationDate: FieldRef<"Enrollment", 'DateTime'>
    readonly armAssignment: FieldRef<"Enrollment", 'String'>
    readonly withdrawalDate: FieldRef<"Enrollment", 'DateTime'>
    readonly withdrawalReason: FieldRef<"Enrollment", 'String'>
    readonly completionDate: FieldRef<"Enrollment", 'DateTime'>
    readonly primaryInvestigator: FieldRef<"Enrollment", 'String'>
    readonly studyCoordinator: FieldRef<"Enrollment", 'String'>
    readonly notes: FieldRef<"Enrollment", 'String'>
    readonly createdAt: FieldRef<"Enrollment", 'DateTime'>
    readonly updatedAt: FieldRef<"Enrollment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Enrollment findUnique
   */
  export type EnrollmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which Enrollment to fetch.
     */
    where: EnrollmentWhereUniqueInput
  }

  /**
   * Enrollment findUniqueOrThrow
   */
  export type EnrollmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which Enrollment to fetch.
     */
    where: EnrollmentWhereUniqueInput
  }

  /**
   * Enrollment findFirst
   */
  export type EnrollmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which Enrollment to fetch.
     */
    where?: EnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enrollments to fetch.
     */
    orderBy?: EnrollmentOrderByWithRelationInput | EnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Enrollments.
     */
    cursor?: EnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Enrollments.
     */
    distinct?: EnrollmentScalarFieldEnum | EnrollmentScalarFieldEnum[]
  }

  /**
   * Enrollment findFirstOrThrow
   */
  export type EnrollmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which Enrollment to fetch.
     */
    where?: EnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enrollments to fetch.
     */
    orderBy?: EnrollmentOrderByWithRelationInput | EnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Enrollments.
     */
    cursor?: EnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Enrollments.
     */
    distinct?: EnrollmentScalarFieldEnum | EnrollmentScalarFieldEnum[]
  }

  /**
   * Enrollment findMany
   */
  export type EnrollmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which Enrollments to fetch.
     */
    where?: EnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enrollments to fetch.
     */
    orderBy?: EnrollmentOrderByWithRelationInput | EnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Enrollments.
     */
    cursor?: EnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enrollments.
     */
    skip?: number
    distinct?: EnrollmentScalarFieldEnum | EnrollmentScalarFieldEnum[]
  }

  /**
   * Enrollment create
   */
  export type EnrollmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Enrollment.
     */
    data: XOR<EnrollmentCreateInput, EnrollmentUncheckedCreateInput>
  }

  /**
   * Enrollment createMany
   */
  export type EnrollmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Enrollments.
     */
    data: EnrollmentCreateManyInput | EnrollmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Enrollment createManyAndReturn
   */
  export type EnrollmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Enrollments.
     */
    data: EnrollmentCreateManyInput | EnrollmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Enrollment update
   */
  export type EnrollmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Enrollment.
     */
    data: XOR<EnrollmentUpdateInput, EnrollmentUncheckedUpdateInput>
    /**
     * Choose, which Enrollment to update.
     */
    where: EnrollmentWhereUniqueInput
  }

  /**
   * Enrollment updateMany
   */
  export type EnrollmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Enrollments.
     */
    data: XOR<EnrollmentUpdateManyMutationInput, EnrollmentUncheckedUpdateManyInput>
    /**
     * Filter which Enrollments to update
     */
    where?: EnrollmentWhereInput
  }

  /**
   * Enrollment upsert
   */
  export type EnrollmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Enrollment to update in case it exists.
     */
    where: EnrollmentWhereUniqueInput
    /**
     * In case the Enrollment found by the `where` argument doesn't exist, create a new Enrollment with this data.
     */
    create: XOR<EnrollmentCreateInput, EnrollmentUncheckedCreateInput>
    /**
     * In case the Enrollment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnrollmentUpdateInput, EnrollmentUncheckedUpdateInput>
  }

  /**
   * Enrollment delete
   */
  export type EnrollmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentInclude<ExtArgs> | null
    /**
     * Filter which Enrollment to delete.
     */
    where: EnrollmentWhereUniqueInput
  }

  /**
   * Enrollment deleteMany
   */
  export type EnrollmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Enrollments to delete
     */
    where?: EnrollmentWhereInput
  }

  /**
   * Enrollment.consentRecords
   */
  export type Enrollment$consentRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    where?: ConsentRecordWhereInput
    orderBy?: ConsentRecordOrderByWithRelationInput | ConsentRecordOrderByWithRelationInput[]
    cursor?: ConsentRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConsentRecordScalarFieldEnum | ConsentRecordScalarFieldEnum[]
  }

  /**
   * Enrollment.statusHistory
   */
  export type Enrollment$statusHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentStatusHistory
     */
    select?: EnrollmentStatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentStatusHistoryInclude<ExtArgs> | null
    where?: EnrollmentStatusHistoryWhereInput
    orderBy?: EnrollmentStatusHistoryOrderByWithRelationInput | EnrollmentStatusHistoryOrderByWithRelationInput[]
    cursor?: EnrollmentStatusHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EnrollmentStatusHistoryScalarFieldEnum | EnrollmentStatusHistoryScalarFieldEnum[]
  }

  /**
   * Enrollment.visits
   */
  export type Enrollment$visitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialVisit
     */
    select?: TrialVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialVisitInclude<ExtArgs> | null
    where?: TrialVisitWhereInput
    orderBy?: TrialVisitOrderByWithRelationInput | TrialVisitOrderByWithRelationInput[]
    cursor?: TrialVisitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrialVisitScalarFieldEnum | TrialVisitScalarFieldEnum[]
  }

  /**
   * Enrollment without action
   */
  export type EnrollmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enrollment
     */
    select?: EnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentInclude<ExtArgs> | null
  }


  /**
   * Model EnrollmentStatusHistory
   */

  export type AggregateEnrollmentStatusHistory = {
    _count: EnrollmentStatusHistoryCountAggregateOutputType | null
    _min: EnrollmentStatusHistoryMinAggregateOutputType | null
    _max: EnrollmentStatusHistoryMaxAggregateOutputType | null
  }

  export type EnrollmentStatusHistoryMinAggregateOutputType = {
    id: string | null
    enrollmentId: string | null
    fromStatus: $Enums.EnrollmentStatus | null
    toStatus: $Enums.EnrollmentStatus | null
    reason: string | null
    changedBy: string | null
    changedAt: Date | null
  }

  export type EnrollmentStatusHistoryMaxAggregateOutputType = {
    id: string | null
    enrollmentId: string | null
    fromStatus: $Enums.EnrollmentStatus | null
    toStatus: $Enums.EnrollmentStatus | null
    reason: string | null
    changedBy: string | null
    changedAt: Date | null
  }

  export type EnrollmentStatusHistoryCountAggregateOutputType = {
    id: number
    enrollmentId: number
    fromStatus: number
    toStatus: number
    reason: number
    changedBy: number
    changedAt: number
    _all: number
  }


  export type EnrollmentStatusHistoryMinAggregateInputType = {
    id?: true
    enrollmentId?: true
    fromStatus?: true
    toStatus?: true
    reason?: true
    changedBy?: true
    changedAt?: true
  }

  export type EnrollmentStatusHistoryMaxAggregateInputType = {
    id?: true
    enrollmentId?: true
    fromStatus?: true
    toStatus?: true
    reason?: true
    changedBy?: true
    changedAt?: true
  }

  export type EnrollmentStatusHistoryCountAggregateInputType = {
    id?: true
    enrollmentId?: true
    fromStatus?: true
    toStatus?: true
    reason?: true
    changedBy?: true
    changedAt?: true
    _all?: true
  }

  export type EnrollmentStatusHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EnrollmentStatusHistory to aggregate.
     */
    where?: EnrollmentStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnrollmentStatusHistories to fetch.
     */
    orderBy?: EnrollmentStatusHistoryOrderByWithRelationInput | EnrollmentStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EnrollmentStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnrollmentStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnrollmentStatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EnrollmentStatusHistories
    **/
    _count?: true | EnrollmentStatusHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnrollmentStatusHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnrollmentStatusHistoryMaxAggregateInputType
  }

  export type GetEnrollmentStatusHistoryAggregateType<T extends EnrollmentStatusHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateEnrollmentStatusHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnrollmentStatusHistory[P]>
      : GetScalarType<T[P], AggregateEnrollmentStatusHistory[P]>
  }




  export type EnrollmentStatusHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnrollmentStatusHistoryWhereInput
    orderBy?: EnrollmentStatusHistoryOrderByWithAggregationInput | EnrollmentStatusHistoryOrderByWithAggregationInput[]
    by: EnrollmentStatusHistoryScalarFieldEnum[] | EnrollmentStatusHistoryScalarFieldEnum
    having?: EnrollmentStatusHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnrollmentStatusHistoryCountAggregateInputType | true
    _min?: EnrollmentStatusHistoryMinAggregateInputType
    _max?: EnrollmentStatusHistoryMaxAggregateInputType
  }

  export type EnrollmentStatusHistoryGroupByOutputType = {
    id: string
    enrollmentId: string
    fromStatus: $Enums.EnrollmentStatus | null
    toStatus: $Enums.EnrollmentStatus
    reason: string | null
    changedBy: string
    changedAt: Date
    _count: EnrollmentStatusHistoryCountAggregateOutputType | null
    _min: EnrollmentStatusHistoryMinAggregateOutputType | null
    _max: EnrollmentStatusHistoryMaxAggregateOutputType | null
  }

  type GetEnrollmentStatusHistoryGroupByPayload<T extends EnrollmentStatusHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnrollmentStatusHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnrollmentStatusHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnrollmentStatusHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], EnrollmentStatusHistoryGroupByOutputType[P]>
        }
      >
    >


  export type EnrollmentStatusHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enrollmentId?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    reason?: boolean
    changedBy?: boolean
    changedAt?: boolean
    enrollment?: boolean | EnrollmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["enrollmentStatusHistory"]>

  export type EnrollmentStatusHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enrollmentId?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    reason?: boolean
    changedBy?: boolean
    changedAt?: boolean
    enrollment?: boolean | EnrollmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["enrollmentStatusHistory"]>

  export type EnrollmentStatusHistorySelectScalar = {
    id?: boolean
    enrollmentId?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    reason?: boolean
    changedBy?: boolean
    changedAt?: boolean
  }

  export type EnrollmentStatusHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollment?: boolean | EnrollmentDefaultArgs<ExtArgs>
  }
  export type EnrollmentStatusHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollment?: boolean | EnrollmentDefaultArgs<ExtArgs>
  }

  export type $EnrollmentStatusHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EnrollmentStatusHistory"
    objects: {
      enrollment: Prisma.$EnrollmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      enrollmentId: string
      fromStatus: $Enums.EnrollmentStatus | null
      toStatus: $Enums.EnrollmentStatus
      reason: string | null
      changedBy: string
      changedAt: Date
    }, ExtArgs["result"]["enrollmentStatusHistory"]>
    composites: {}
  }

  type EnrollmentStatusHistoryGetPayload<S extends boolean | null | undefined | EnrollmentStatusHistoryDefaultArgs> = $Result.GetResult<Prisma.$EnrollmentStatusHistoryPayload, S>

  type EnrollmentStatusHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EnrollmentStatusHistoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EnrollmentStatusHistoryCountAggregateInputType | true
    }

  export interface EnrollmentStatusHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EnrollmentStatusHistory'], meta: { name: 'EnrollmentStatusHistory' } }
    /**
     * Find zero or one EnrollmentStatusHistory that matches the filter.
     * @param {EnrollmentStatusHistoryFindUniqueArgs} args - Arguments to find a EnrollmentStatusHistory
     * @example
     * // Get one EnrollmentStatusHistory
     * const enrollmentStatusHistory = await prisma.enrollmentStatusHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnrollmentStatusHistoryFindUniqueArgs>(args: SelectSubset<T, EnrollmentStatusHistoryFindUniqueArgs<ExtArgs>>): Prisma__EnrollmentStatusHistoryClient<$Result.GetResult<Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EnrollmentStatusHistory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EnrollmentStatusHistoryFindUniqueOrThrowArgs} args - Arguments to find a EnrollmentStatusHistory
     * @example
     * // Get one EnrollmentStatusHistory
     * const enrollmentStatusHistory = await prisma.enrollmentStatusHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnrollmentStatusHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, EnrollmentStatusHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EnrollmentStatusHistoryClient<$Result.GetResult<Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EnrollmentStatusHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentStatusHistoryFindFirstArgs} args - Arguments to find a EnrollmentStatusHistory
     * @example
     * // Get one EnrollmentStatusHistory
     * const enrollmentStatusHistory = await prisma.enrollmentStatusHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnrollmentStatusHistoryFindFirstArgs>(args?: SelectSubset<T, EnrollmentStatusHistoryFindFirstArgs<ExtArgs>>): Prisma__EnrollmentStatusHistoryClient<$Result.GetResult<Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EnrollmentStatusHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentStatusHistoryFindFirstOrThrowArgs} args - Arguments to find a EnrollmentStatusHistory
     * @example
     * // Get one EnrollmentStatusHistory
     * const enrollmentStatusHistory = await prisma.enrollmentStatusHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnrollmentStatusHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, EnrollmentStatusHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__EnrollmentStatusHistoryClient<$Result.GetResult<Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EnrollmentStatusHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentStatusHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EnrollmentStatusHistories
     * const enrollmentStatusHistories = await prisma.enrollmentStatusHistory.findMany()
     * 
     * // Get first 10 EnrollmentStatusHistories
     * const enrollmentStatusHistories = await prisma.enrollmentStatusHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const enrollmentStatusHistoryWithIdOnly = await prisma.enrollmentStatusHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EnrollmentStatusHistoryFindManyArgs>(args?: SelectSubset<T, EnrollmentStatusHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EnrollmentStatusHistory.
     * @param {EnrollmentStatusHistoryCreateArgs} args - Arguments to create a EnrollmentStatusHistory.
     * @example
     * // Create one EnrollmentStatusHistory
     * const EnrollmentStatusHistory = await prisma.enrollmentStatusHistory.create({
     *   data: {
     *     // ... data to create a EnrollmentStatusHistory
     *   }
     * })
     * 
     */
    create<T extends EnrollmentStatusHistoryCreateArgs>(args: SelectSubset<T, EnrollmentStatusHistoryCreateArgs<ExtArgs>>): Prisma__EnrollmentStatusHistoryClient<$Result.GetResult<Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EnrollmentStatusHistories.
     * @param {EnrollmentStatusHistoryCreateManyArgs} args - Arguments to create many EnrollmentStatusHistories.
     * @example
     * // Create many EnrollmentStatusHistories
     * const enrollmentStatusHistory = await prisma.enrollmentStatusHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EnrollmentStatusHistoryCreateManyArgs>(args?: SelectSubset<T, EnrollmentStatusHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EnrollmentStatusHistories and returns the data saved in the database.
     * @param {EnrollmentStatusHistoryCreateManyAndReturnArgs} args - Arguments to create many EnrollmentStatusHistories.
     * @example
     * // Create many EnrollmentStatusHistories
     * const enrollmentStatusHistory = await prisma.enrollmentStatusHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EnrollmentStatusHistories and only return the `id`
     * const enrollmentStatusHistoryWithIdOnly = await prisma.enrollmentStatusHistory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EnrollmentStatusHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, EnrollmentStatusHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EnrollmentStatusHistory.
     * @param {EnrollmentStatusHistoryDeleteArgs} args - Arguments to delete one EnrollmentStatusHistory.
     * @example
     * // Delete one EnrollmentStatusHistory
     * const EnrollmentStatusHistory = await prisma.enrollmentStatusHistory.delete({
     *   where: {
     *     // ... filter to delete one EnrollmentStatusHistory
     *   }
     * })
     * 
     */
    delete<T extends EnrollmentStatusHistoryDeleteArgs>(args: SelectSubset<T, EnrollmentStatusHistoryDeleteArgs<ExtArgs>>): Prisma__EnrollmentStatusHistoryClient<$Result.GetResult<Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EnrollmentStatusHistory.
     * @param {EnrollmentStatusHistoryUpdateArgs} args - Arguments to update one EnrollmentStatusHistory.
     * @example
     * // Update one EnrollmentStatusHistory
     * const enrollmentStatusHistory = await prisma.enrollmentStatusHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EnrollmentStatusHistoryUpdateArgs>(args: SelectSubset<T, EnrollmentStatusHistoryUpdateArgs<ExtArgs>>): Prisma__EnrollmentStatusHistoryClient<$Result.GetResult<Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EnrollmentStatusHistories.
     * @param {EnrollmentStatusHistoryDeleteManyArgs} args - Arguments to filter EnrollmentStatusHistories to delete.
     * @example
     * // Delete a few EnrollmentStatusHistories
     * const { count } = await prisma.enrollmentStatusHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EnrollmentStatusHistoryDeleteManyArgs>(args?: SelectSubset<T, EnrollmentStatusHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EnrollmentStatusHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentStatusHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EnrollmentStatusHistories
     * const enrollmentStatusHistory = await prisma.enrollmentStatusHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EnrollmentStatusHistoryUpdateManyArgs>(args: SelectSubset<T, EnrollmentStatusHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EnrollmentStatusHistory.
     * @param {EnrollmentStatusHistoryUpsertArgs} args - Arguments to update or create a EnrollmentStatusHistory.
     * @example
     * // Update or create a EnrollmentStatusHistory
     * const enrollmentStatusHistory = await prisma.enrollmentStatusHistory.upsert({
     *   create: {
     *     // ... data to create a EnrollmentStatusHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EnrollmentStatusHistory we want to update
     *   }
     * })
     */
    upsert<T extends EnrollmentStatusHistoryUpsertArgs>(args: SelectSubset<T, EnrollmentStatusHistoryUpsertArgs<ExtArgs>>): Prisma__EnrollmentStatusHistoryClient<$Result.GetResult<Prisma.$EnrollmentStatusHistoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EnrollmentStatusHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentStatusHistoryCountArgs} args - Arguments to filter EnrollmentStatusHistories to count.
     * @example
     * // Count the number of EnrollmentStatusHistories
     * const count = await prisma.enrollmentStatusHistory.count({
     *   where: {
     *     // ... the filter for the EnrollmentStatusHistories we want to count
     *   }
     * })
    **/
    count<T extends EnrollmentStatusHistoryCountArgs>(
      args?: Subset<T, EnrollmentStatusHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnrollmentStatusHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EnrollmentStatusHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentStatusHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EnrollmentStatusHistoryAggregateArgs>(args: Subset<T, EnrollmentStatusHistoryAggregateArgs>): Prisma.PrismaPromise<GetEnrollmentStatusHistoryAggregateType<T>>

    /**
     * Group by EnrollmentStatusHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentStatusHistoryGroupByArgs} args - Group by arguments.
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
      T extends EnrollmentStatusHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnrollmentStatusHistoryGroupByArgs['orderBy'] }
        : { orderBy?: EnrollmentStatusHistoryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EnrollmentStatusHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnrollmentStatusHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EnrollmentStatusHistory model
   */
  readonly fields: EnrollmentStatusHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EnrollmentStatusHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnrollmentStatusHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    enrollment<T extends EnrollmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EnrollmentDefaultArgs<ExtArgs>>): Prisma__EnrollmentClient<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the EnrollmentStatusHistory model
   */ 
  interface EnrollmentStatusHistoryFieldRefs {
    readonly id: FieldRef<"EnrollmentStatusHistory", 'String'>
    readonly enrollmentId: FieldRef<"EnrollmentStatusHistory", 'String'>
    readonly fromStatus: FieldRef<"EnrollmentStatusHistory", 'EnrollmentStatus'>
    readonly toStatus: FieldRef<"EnrollmentStatusHistory", 'EnrollmentStatus'>
    readonly reason: FieldRef<"EnrollmentStatusHistory", 'String'>
    readonly changedBy: FieldRef<"EnrollmentStatusHistory", 'String'>
    readonly changedAt: FieldRef<"EnrollmentStatusHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EnrollmentStatusHistory findUnique
   */
  export type EnrollmentStatusHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentStatusHistory
     */
    select?: EnrollmentStatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which EnrollmentStatusHistory to fetch.
     */
    where: EnrollmentStatusHistoryWhereUniqueInput
  }

  /**
   * EnrollmentStatusHistory findUniqueOrThrow
   */
  export type EnrollmentStatusHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentStatusHistory
     */
    select?: EnrollmentStatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which EnrollmentStatusHistory to fetch.
     */
    where: EnrollmentStatusHistoryWhereUniqueInput
  }

  /**
   * EnrollmentStatusHistory findFirst
   */
  export type EnrollmentStatusHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentStatusHistory
     */
    select?: EnrollmentStatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which EnrollmentStatusHistory to fetch.
     */
    where?: EnrollmentStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnrollmentStatusHistories to fetch.
     */
    orderBy?: EnrollmentStatusHistoryOrderByWithRelationInput | EnrollmentStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EnrollmentStatusHistories.
     */
    cursor?: EnrollmentStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnrollmentStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnrollmentStatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EnrollmentStatusHistories.
     */
    distinct?: EnrollmentStatusHistoryScalarFieldEnum | EnrollmentStatusHistoryScalarFieldEnum[]
  }

  /**
   * EnrollmentStatusHistory findFirstOrThrow
   */
  export type EnrollmentStatusHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentStatusHistory
     */
    select?: EnrollmentStatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which EnrollmentStatusHistory to fetch.
     */
    where?: EnrollmentStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnrollmentStatusHistories to fetch.
     */
    orderBy?: EnrollmentStatusHistoryOrderByWithRelationInput | EnrollmentStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EnrollmentStatusHistories.
     */
    cursor?: EnrollmentStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnrollmentStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnrollmentStatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EnrollmentStatusHistories.
     */
    distinct?: EnrollmentStatusHistoryScalarFieldEnum | EnrollmentStatusHistoryScalarFieldEnum[]
  }

  /**
   * EnrollmentStatusHistory findMany
   */
  export type EnrollmentStatusHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentStatusHistory
     */
    select?: EnrollmentStatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which EnrollmentStatusHistories to fetch.
     */
    where?: EnrollmentStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnrollmentStatusHistories to fetch.
     */
    orderBy?: EnrollmentStatusHistoryOrderByWithRelationInput | EnrollmentStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EnrollmentStatusHistories.
     */
    cursor?: EnrollmentStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnrollmentStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnrollmentStatusHistories.
     */
    skip?: number
    distinct?: EnrollmentStatusHistoryScalarFieldEnum | EnrollmentStatusHistoryScalarFieldEnum[]
  }

  /**
   * EnrollmentStatusHistory create
   */
  export type EnrollmentStatusHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentStatusHistory
     */
    select?: EnrollmentStatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentStatusHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a EnrollmentStatusHistory.
     */
    data: XOR<EnrollmentStatusHistoryCreateInput, EnrollmentStatusHistoryUncheckedCreateInput>
  }

  /**
   * EnrollmentStatusHistory createMany
   */
  export type EnrollmentStatusHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EnrollmentStatusHistories.
     */
    data: EnrollmentStatusHistoryCreateManyInput | EnrollmentStatusHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EnrollmentStatusHistory createManyAndReturn
   */
  export type EnrollmentStatusHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentStatusHistory
     */
    select?: EnrollmentStatusHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EnrollmentStatusHistories.
     */
    data: EnrollmentStatusHistoryCreateManyInput | EnrollmentStatusHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentStatusHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EnrollmentStatusHistory update
   */
  export type EnrollmentStatusHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentStatusHistory
     */
    select?: EnrollmentStatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentStatusHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a EnrollmentStatusHistory.
     */
    data: XOR<EnrollmentStatusHistoryUpdateInput, EnrollmentStatusHistoryUncheckedUpdateInput>
    /**
     * Choose, which EnrollmentStatusHistory to update.
     */
    where: EnrollmentStatusHistoryWhereUniqueInput
  }

  /**
   * EnrollmentStatusHistory updateMany
   */
  export type EnrollmentStatusHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EnrollmentStatusHistories.
     */
    data: XOR<EnrollmentStatusHistoryUpdateManyMutationInput, EnrollmentStatusHistoryUncheckedUpdateManyInput>
    /**
     * Filter which EnrollmentStatusHistories to update
     */
    where?: EnrollmentStatusHistoryWhereInput
  }

  /**
   * EnrollmentStatusHistory upsert
   */
  export type EnrollmentStatusHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentStatusHistory
     */
    select?: EnrollmentStatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentStatusHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the EnrollmentStatusHistory to update in case it exists.
     */
    where: EnrollmentStatusHistoryWhereUniqueInput
    /**
     * In case the EnrollmentStatusHistory found by the `where` argument doesn't exist, create a new EnrollmentStatusHistory with this data.
     */
    create: XOR<EnrollmentStatusHistoryCreateInput, EnrollmentStatusHistoryUncheckedCreateInput>
    /**
     * In case the EnrollmentStatusHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnrollmentStatusHistoryUpdateInput, EnrollmentStatusHistoryUncheckedUpdateInput>
  }

  /**
   * EnrollmentStatusHistory delete
   */
  export type EnrollmentStatusHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentStatusHistory
     */
    select?: EnrollmentStatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter which EnrollmentStatusHistory to delete.
     */
    where: EnrollmentStatusHistoryWhereUniqueInput
  }

  /**
   * EnrollmentStatusHistory deleteMany
   */
  export type EnrollmentStatusHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EnrollmentStatusHistories to delete
     */
    where?: EnrollmentStatusHistoryWhereInput
  }

  /**
   * EnrollmentStatusHistory without action
   */
  export type EnrollmentStatusHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrollmentStatusHistory
     */
    select?: EnrollmentStatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrollmentStatusHistoryInclude<ExtArgs> | null
  }


  /**
   * Model ConsentRecord
   */

  export type AggregateConsentRecord = {
    _count: ConsentRecordCountAggregateOutputType | null
    _min: ConsentRecordMinAggregateOutputType | null
    _max: ConsentRecordMaxAggregateOutputType | null
  }

  export type ConsentRecordMinAggregateOutputType = {
    id: string | null
    enrollmentId: string | null
    consentType: $Enums.ConsentType | null
    consentFormId: string | null
    consentFormVersion: string | null
    signedAt: Date | null
    signedBy: string | null
    witnessName: string | null
    witnessSignedAt: Date | null
    coordinatorName: string | null
    coordinatorId: string | null
    documentUrl: string | null
    isActive: boolean | null
    revokedAt: Date | null
    revokedReason: string | null
    expiresAt: Date | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConsentRecordMaxAggregateOutputType = {
    id: string | null
    enrollmentId: string | null
    consentType: $Enums.ConsentType | null
    consentFormId: string | null
    consentFormVersion: string | null
    signedAt: Date | null
    signedBy: string | null
    witnessName: string | null
    witnessSignedAt: Date | null
    coordinatorName: string | null
    coordinatorId: string | null
    documentUrl: string | null
    isActive: boolean | null
    revokedAt: Date | null
    revokedReason: string | null
    expiresAt: Date | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConsentRecordCountAggregateOutputType = {
    id: number
    enrollmentId: number
    consentType: number
    consentFormId: number
    consentFormVersion: number
    signedAt: number
    signedBy: number
    witnessName: number
    witnessSignedAt: number
    coordinatorName: number
    coordinatorId: number
    documentUrl: number
    isActive: number
    revokedAt: number
    revokedReason: number
    expiresAt: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConsentRecordMinAggregateInputType = {
    id?: true
    enrollmentId?: true
    consentType?: true
    consentFormId?: true
    consentFormVersion?: true
    signedAt?: true
    signedBy?: true
    witnessName?: true
    witnessSignedAt?: true
    coordinatorName?: true
    coordinatorId?: true
    documentUrl?: true
    isActive?: true
    revokedAt?: true
    revokedReason?: true
    expiresAt?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConsentRecordMaxAggregateInputType = {
    id?: true
    enrollmentId?: true
    consentType?: true
    consentFormId?: true
    consentFormVersion?: true
    signedAt?: true
    signedBy?: true
    witnessName?: true
    witnessSignedAt?: true
    coordinatorName?: true
    coordinatorId?: true
    documentUrl?: true
    isActive?: true
    revokedAt?: true
    revokedReason?: true
    expiresAt?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConsentRecordCountAggregateInputType = {
    id?: true
    enrollmentId?: true
    consentType?: true
    consentFormId?: true
    consentFormVersion?: true
    signedAt?: true
    signedBy?: true
    witnessName?: true
    witnessSignedAt?: true
    coordinatorName?: true
    coordinatorId?: true
    documentUrl?: true
    isActive?: true
    revokedAt?: true
    revokedReason?: true
    expiresAt?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConsentRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsentRecord to aggregate.
     */
    where?: ConsentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentRecords to fetch.
     */
    orderBy?: ConsentRecordOrderByWithRelationInput | ConsentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConsentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConsentRecords
    **/
    _count?: true | ConsentRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConsentRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConsentRecordMaxAggregateInputType
  }

  export type GetConsentRecordAggregateType<T extends ConsentRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateConsentRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConsentRecord[P]>
      : GetScalarType<T[P], AggregateConsentRecord[P]>
  }




  export type ConsentRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsentRecordWhereInput
    orderBy?: ConsentRecordOrderByWithAggregationInput | ConsentRecordOrderByWithAggregationInput[]
    by: ConsentRecordScalarFieldEnum[] | ConsentRecordScalarFieldEnum
    having?: ConsentRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConsentRecordCountAggregateInputType | true
    _min?: ConsentRecordMinAggregateInputType
    _max?: ConsentRecordMaxAggregateInputType
  }

  export type ConsentRecordGroupByOutputType = {
    id: string
    enrollmentId: string
    consentType: $Enums.ConsentType
    consentFormId: string | null
    consentFormVersion: string | null
    signedAt: Date
    signedBy: string
    witnessName: string | null
    witnessSignedAt: Date | null
    coordinatorName: string | null
    coordinatorId: string | null
    documentUrl: string | null
    isActive: boolean
    revokedAt: Date | null
    revokedReason: string | null
    expiresAt: Date | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: ConsentRecordCountAggregateOutputType | null
    _min: ConsentRecordMinAggregateOutputType | null
    _max: ConsentRecordMaxAggregateOutputType | null
  }

  type GetConsentRecordGroupByPayload<T extends ConsentRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConsentRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConsentRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConsentRecordGroupByOutputType[P]>
            : GetScalarType<T[P], ConsentRecordGroupByOutputType[P]>
        }
      >
    >


  export type ConsentRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enrollmentId?: boolean
    consentType?: boolean
    consentFormId?: boolean
    consentFormVersion?: boolean
    signedAt?: boolean
    signedBy?: boolean
    witnessName?: boolean
    witnessSignedAt?: boolean
    coordinatorName?: boolean
    coordinatorId?: boolean
    documentUrl?: boolean
    isActive?: boolean
    revokedAt?: boolean
    revokedReason?: boolean
    expiresAt?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enrollment?: boolean | EnrollmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["consentRecord"]>

  export type ConsentRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enrollmentId?: boolean
    consentType?: boolean
    consentFormId?: boolean
    consentFormVersion?: boolean
    signedAt?: boolean
    signedBy?: boolean
    witnessName?: boolean
    witnessSignedAt?: boolean
    coordinatorName?: boolean
    coordinatorId?: boolean
    documentUrl?: boolean
    isActive?: boolean
    revokedAt?: boolean
    revokedReason?: boolean
    expiresAt?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enrollment?: boolean | EnrollmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["consentRecord"]>

  export type ConsentRecordSelectScalar = {
    id?: boolean
    enrollmentId?: boolean
    consentType?: boolean
    consentFormId?: boolean
    consentFormVersion?: boolean
    signedAt?: boolean
    signedBy?: boolean
    witnessName?: boolean
    witnessSignedAt?: boolean
    coordinatorName?: boolean
    coordinatorId?: boolean
    documentUrl?: boolean
    isActive?: boolean
    revokedAt?: boolean
    revokedReason?: boolean
    expiresAt?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConsentRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollment?: boolean | EnrollmentDefaultArgs<ExtArgs>
  }
  export type ConsentRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollment?: boolean | EnrollmentDefaultArgs<ExtArgs>
  }

  export type $ConsentRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConsentRecord"
    objects: {
      enrollment: Prisma.$EnrollmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      enrollmentId: string
      consentType: $Enums.ConsentType
      consentFormId: string | null
      consentFormVersion: string | null
      signedAt: Date
      signedBy: string
      witnessName: string | null
      witnessSignedAt: Date | null
      coordinatorName: string | null
      coordinatorId: string | null
      documentUrl: string | null
      isActive: boolean
      revokedAt: Date | null
      revokedReason: string | null
      expiresAt: Date | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["consentRecord"]>
    composites: {}
  }

  type ConsentRecordGetPayload<S extends boolean | null | undefined | ConsentRecordDefaultArgs> = $Result.GetResult<Prisma.$ConsentRecordPayload, S>

  type ConsentRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConsentRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConsentRecordCountAggregateInputType | true
    }

  export interface ConsentRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConsentRecord'], meta: { name: 'ConsentRecord' } }
    /**
     * Find zero or one ConsentRecord that matches the filter.
     * @param {ConsentRecordFindUniqueArgs} args - Arguments to find a ConsentRecord
     * @example
     * // Get one ConsentRecord
     * const consentRecord = await prisma.consentRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConsentRecordFindUniqueArgs>(args: SelectSubset<T, ConsentRecordFindUniqueArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ConsentRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConsentRecordFindUniqueOrThrowArgs} args - Arguments to find a ConsentRecord
     * @example
     * // Get one ConsentRecord
     * const consentRecord = await prisma.consentRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConsentRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, ConsentRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ConsentRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordFindFirstArgs} args - Arguments to find a ConsentRecord
     * @example
     * // Get one ConsentRecord
     * const consentRecord = await prisma.consentRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConsentRecordFindFirstArgs>(args?: SelectSubset<T, ConsentRecordFindFirstArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ConsentRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordFindFirstOrThrowArgs} args - Arguments to find a ConsentRecord
     * @example
     * // Get one ConsentRecord
     * const consentRecord = await prisma.consentRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConsentRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, ConsentRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ConsentRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConsentRecords
     * const consentRecords = await prisma.consentRecord.findMany()
     * 
     * // Get first 10 ConsentRecords
     * const consentRecords = await prisma.consentRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const consentRecordWithIdOnly = await prisma.consentRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConsentRecordFindManyArgs>(args?: SelectSubset<T, ConsentRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ConsentRecord.
     * @param {ConsentRecordCreateArgs} args - Arguments to create a ConsentRecord.
     * @example
     * // Create one ConsentRecord
     * const ConsentRecord = await prisma.consentRecord.create({
     *   data: {
     *     // ... data to create a ConsentRecord
     *   }
     * })
     * 
     */
    create<T extends ConsentRecordCreateArgs>(args: SelectSubset<T, ConsentRecordCreateArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ConsentRecords.
     * @param {ConsentRecordCreateManyArgs} args - Arguments to create many ConsentRecords.
     * @example
     * // Create many ConsentRecords
     * const consentRecord = await prisma.consentRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConsentRecordCreateManyArgs>(args?: SelectSubset<T, ConsentRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConsentRecords and returns the data saved in the database.
     * @param {ConsentRecordCreateManyAndReturnArgs} args - Arguments to create many ConsentRecords.
     * @example
     * // Create many ConsentRecords
     * const consentRecord = await prisma.consentRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConsentRecords and only return the `id`
     * const consentRecordWithIdOnly = await prisma.consentRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConsentRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, ConsentRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ConsentRecord.
     * @param {ConsentRecordDeleteArgs} args - Arguments to delete one ConsentRecord.
     * @example
     * // Delete one ConsentRecord
     * const ConsentRecord = await prisma.consentRecord.delete({
     *   where: {
     *     // ... filter to delete one ConsentRecord
     *   }
     * })
     * 
     */
    delete<T extends ConsentRecordDeleteArgs>(args: SelectSubset<T, ConsentRecordDeleteArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ConsentRecord.
     * @param {ConsentRecordUpdateArgs} args - Arguments to update one ConsentRecord.
     * @example
     * // Update one ConsentRecord
     * const consentRecord = await prisma.consentRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConsentRecordUpdateArgs>(args: SelectSubset<T, ConsentRecordUpdateArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ConsentRecords.
     * @param {ConsentRecordDeleteManyArgs} args - Arguments to filter ConsentRecords to delete.
     * @example
     * // Delete a few ConsentRecords
     * const { count } = await prisma.consentRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConsentRecordDeleteManyArgs>(args?: SelectSubset<T, ConsentRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConsentRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConsentRecords
     * const consentRecord = await prisma.consentRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConsentRecordUpdateManyArgs>(args: SelectSubset<T, ConsentRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ConsentRecord.
     * @param {ConsentRecordUpsertArgs} args - Arguments to update or create a ConsentRecord.
     * @example
     * // Update or create a ConsentRecord
     * const consentRecord = await prisma.consentRecord.upsert({
     *   create: {
     *     // ... data to create a ConsentRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConsentRecord we want to update
     *   }
     * })
     */
    upsert<T extends ConsentRecordUpsertArgs>(args: SelectSubset<T, ConsentRecordUpsertArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ConsentRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordCountArgs} args - Arguments to filter ConsentRecords to count.
     * @example
     * // Count the number of ConsentRecords
     * const count = await prisma.consentRecord.count({
     *   where: {
     *     // ... the filter for the ConsentRecords we want to count
     *   }
     * })
    **/
    count<T extends ConsentRecordCountArgs>(
      args?: Subset<T, ConsentRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConsentRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConsentRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ConsentRecordAggregateArgs>(args: Subset<T, ConsentRecordAggregateArgs>): Prisma.PrismaPromise<GetConsentRecordAggregateType<T>>

    /**
     * Group by ConsentRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordGroupByArgs} args - Group by arguments.
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
      T extends ConsentRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConsentRecordGroupByArgs['orderBy'] }
        : { orderBy?: ConsentRecordGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ConsentRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConsentRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConsentRecord model
   */
  readonly fields: ConsentRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConsentRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConsentRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    enrollment<T extends EnrollmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EnrollmentDefaultArgs<ExtArgs>>): Prisma__EnrollmentClient<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ConsentRecord model
   */ 
  interface ConsentRecordFieldRefs {
    readonly id: FieldRef<"ConsentRecord", 'String'>
    readonly enrollmentId: FieldRef<"ConsentRecord", 'String'>
    readonly consentType: FieldRef<"ConsentRecord", 'ConsentType'>
    readonly consentFormId: FieldRef<"ConsentRecord", 'String'>
    readonly consentFormVersion: FieldRef<"ConsentRecord", 'String'>
    readonly signedAt: FieldRef<"ConsentRecord", 'DateTime'>
    readonly signedBy: FieldRef<"ConsentRecord", 'String'>
    readonly witnessName: FieldRef<"ConsentRecord", 'String'>
    readonly witnessSignedAt: FieldRef<"ConsentRecord", 'DateTime'>
    readonly coordinatorName: FieldRef<"ConsentRecord", 'String'>
    readonly coordinatorId: FieldRef<"ConsentRecord", 'String'>
    readonly documentUrl: FieldRef<"ConsentRecord", 'String'>
    readonly isActive: FieldRef<"ConsentRecord", 'Boolean'>
    readonly revokedAt: FieldRef<"ConsentRecord", 'DateTime'>
    readonly revokedReason: FieldRef<"ConsentRecord", 'String'>
    readonly expiresAt: FieldRef<"ConsentRecord", 'DateTime'>
    readonly notes: FieldRef<"ConsentRecord", 'String'>
    readonly createdAt: FieldRef<"ConsentRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"ConsentRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConsentRecord findUnique
   */
  export type ConsentRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * Filter, which ConsentRecord to fetch.
     */
    where: ConsentRecordWhereUniqueInput
  }

  /**
   * ConsentRecord findUniqueOrThrow
   */
  export type ConsentRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * Filter, which ConsentRecord to fetch.
     */
    where: ConsentRecordWhereUniqueInput
  }

  /**
   * ConsentRecord findFirst
   */
  export type ConsentRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * Filter, which ConsentRecord to fetch.
     */
    where?: ConsentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentRecords to fetch.
     */
    orderBy?: ConsentRecordOrderByWithRelationInput | ConsentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsentRecords.
     */
    cursor?: ConsentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsentRecords.
     */
    distinct?: ConsentRecordScalarFieldEnum | ConsentRecordScalarFieldEnum[]
  }

  /**
   * ConsentRecord findFirstOrThrow
   */
  export type ConsentRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * Filter, which ConsentRecord to fetch.
     */
    where?: ConsentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentRecords to fetch.
     */
    orderBy?: ConsentRecordOrderByWithRelationInput | ConsentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsentRecords.
     */
    cursor?: ConsentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsentRecords.
     */
    distinct?: ConsentRecordScalarFieldEnum | ConsentRecordScalarFieldEnum[]
  }

  /**
   * ConsentRecord findMany
   */
  export type ConsentRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * Filter, which ConsentRecords to fetch.
     */
    where?: ConsentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentRecords to fetch.
     */
    orderBy?: ConsentRecordOrderByWithRelationInput | ConsentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConsentRecords.
     */
    cursor?: ConsentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentRecords.
     */
    skip?: number
    distinct?: ConsentRecordScalarFieldEnum | ConsentRecordScalarFieldEnum[]
  }

  /**
   * ConsentRecord create
   */
  export type ConsentRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a ConsentRecord.
     */
    data: XOR<ConsentRecordCreateInput, ConsentRecordUncheckedCreateInput>
  }

  /**
   * ConsentRecord createMany
   */
  export type ConsentRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConsentRecords.
     */
    data: ConsentRecordCreateManyInput | ConsentRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConsentRecord createManyAndReturn
   */
  export type ConsentRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ConsentRecords.
     */
    data: ConsentRecordCreateManyInput | ConsentRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConsentRecord update
   */
  export type ConsentRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a ConsentRecord.
     */
    data: XOR<ConsentRecordUpdateInput, ConsentRecordUncheckedUpdateInput>
    /**
     * Choose, which ConsentRecord to update.
     */
    where: ConsentRecordWhereUniqueInput
  }

  /**
   * ConsentRecord updateMany
   */
  export type ConsentRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConsentRecords.
     */
    data: XOR<ConsentRecordUpdateManyMutationInput, ConsentRecordUncheckedUpdateManyInput>
    /**
     * Filter which ConsentRecords to update
     */
    where?: ConsentRecordWhereInput
  }

  /**
   * ConsentRecord upsert
   */
  export type ConsentRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the ConsentRecord to update in case it exists.
     */
    where: ConsentRecordWhereUniqueInput
    /**
     * In case the ConsentRecord found by the `where` argument doesn't exist, create a new ConsentRecord with this data.
     */
    create: XOR<ConsentRecordCreateInput, ConsentRecordUncheckedCreateInput>
    /**
     * In case the ConsentRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConsentRecordUpdateInput, ConsentRecordUncheckedUpdateInput>
  }

  /**
   * ConsentRecord delete
   */
  export type ConsentRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * Filter which ConsentRecord to delete.
     */
    where: ConsentRecordWhereUniqueInput
  }

  /**
   * ConsentRecord deleteMany
   */
  export type ConsentRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsentRecords to delete
     */
    where?: ConsentRecordWhereInput
  }

  /**
   * ConsentRecord without action
   */
  export type ConsentRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
  }


  /**
   * Model TrialVisit
   */

  export type AggregateTrialVisit = {
    _count: TrialVisitCountAggregateOutputType | null
    _avg: TrialVisitAvgAggregateOutputType | null
    _sum: TrialVisitSumAggregateOutputType | null
    _min: TrialVisitMinAggregateOutputType | null
    _max: TrialVisitMaxAggregateOutputType | null
  }

  export type TrialVisitAvgAggregateOutputType = {
    visitNumber: number | null
  }

  export type TrialVisitSumAggregateOutputType = {
    visitNumber: number | null
  }

  export type TrialVisitMinAggregateOutputType = {
    id: string | null
    enrollmentId: string | null
    visitNumber: number | null
    visitName: string | null
    visitType: $Enums.VisitType | null
    scheduledDate: Date | null
    actualDate: Date | null
    status: $Enums.VisitStatus | null
    completedBy: string | null
    notes: string | null
    protocolDeviations: string | null
    missedReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrialVisitMaxAggregateOutputType = {
    id: string | null
    enrollmentId: string | null
    visitNumber: number | null
    visitName: string | null
    visitType: $Enums.VisitType | null
    scheduledDate: Date | null
    actualDate: Date | null
    status: $Enums.VisitStatus | null
    completedBy: string | null
    notes: string | null
    protocolDeviations: string | null
    missedReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrialVisitCountAggregateOutputType = {
    id: number
    enrollmentId: number
    visitNumber: number
    visitName: number
    visitType: number
    scheduledDate: number
    actualDate: number
    status: number
    completedBy: number
    notes: number
    protocolDeviations: number
    missedReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TrialVisitAvgAggregateInputType = {
    visitNumber?: true
  }

  export type TrialVisitSumAggregateInputType = {
    visitNumber?: true
  }

  export type TrialVisitMinAggregateInputType = {
    id?: true
    enrollmentId?: true
    visitNumber?: true
    visitName?: true
    visitType?: true
    scheduledDate?: true
    actualDate?: true
    status?: true
    completedBy?: true
    notes?: true
    protocolDeviations?: true
    missedReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrialVisitMaxAggregateInputType = {
    id?: true
    enrollmentId?: true
    visitNumber?: true
    visitName?: true
    visitType?: true
    scheduledDate?: true
    actualDate?: true
    status?: true
    completedBy?: true
    notes?: true
    protocolDeviations?: true
    missedReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrialVisitCountAggregateInputType = {
    id?: true
    enrollmentId?: true
    visitNumber?: true
    visitName?: true
    visitType?: true
    scheduledDate?: true
    actualDate?: true
    status?: true
    completedBy?: true
    notes?: true
    protocolDeviations?: true
    missedReason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TrialVisitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrialVisit to aggregate.
     */
    where?: TrialVisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrialVisits to fetch.
     */
    orderBy?: TrialVisitOrderByWithRelationInput | TrialVisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrialVisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrialVisits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrialVisits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrialVisits
    **/
    _count?: true | TrialVisitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrialVisitAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrialVisitSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrialVisitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrialVisitMaxAggregateInputType
  }

  export type GetTrialVisitAggregateType<T extends TrialVisitAggregateArgs> = {
        [P in keyof T & keyof AggregateTrialVisit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrialVisit[P]>
      : GetScalarType<T[P], AggregateTrialVisit[P]>
  }




  export type TrialVisitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrialVisitWhereInput
    orderBy?: TrialVisitOrderByWithAggregationInput | TrialVisitOrderByWithAggregationInput[]
    by: TrialVisitScalarFieldEnum[] | TrialVisitScalarFieldEnum
    having?: TrialVisitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrialVisitCountAggregateInputType | true
    _avg?: TrialVisitAvgAggregateInputType
    _sum?: TrialVisitSumAggregateInputType
    _min?: TrialVisitMinAggregateInputType
    _max?: TrialVisitMaxAggregateInputType
  }

  export type TrialVisitGroupByOutputType = {
    id: string
    enrollmentId: string
    visitNumber: number
    visitName: string
    visitType: $Enums.VisitType
    scheduledDate: Date | null
    actualDate: Date | null
    status: $Enums.VisitStatus
    completedBy: string | null
    notes: string | null
    protocolDeviations: string | null
    missedReason: string | null
    createdAt: Date
    updatedAt: Date
    _count: TrialVisitCountAggregateOutputType | null
    _avg: TrialVisitAvgAggregateOutputType | null
    _sum: TrialVisitSumAggregateOutputType | null
    _min: TrialVisitMinAggregateOutputType | null
    _max: TrialVisitMaxAggregateOutputType | null
  }

  type GetTrialVisitGroupByPayload<T extends TrialVisitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrialVisitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrialVisitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrialVisitGroupByOutputType[P]>
            : GetScalarType<T[P], TrialVisitGroupByOutputType[P]>
        }
      >
    >


  export type TrialVisitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enrollmentId?: boolean
    visitNumber?: boolean
    visitName?: boolean
    visitType?: boolean
    scheduledDate?: boolean
    actualDate?: boolean
    status?: boolean
    completedBy?: boolean
    notes?: boolean
    protocolDeviations?: boolean
    missedReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enrollment?: boolean | EnrollmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trialVisit"]>

  export type TrialVisitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enrollmentId?: boolean
    visitNumber?: boolean
    visitName?: boolean
    visitType?: boolean
    scheduledDate?: boolean
    actualDate?: boolean
    status?: boolean
    completedBy?: boolean
    notes?: boolean
    protocolDeviations?: boolean
    missedReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enrollment?: boolean | EnrollmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trialVisit"]>

  export type TrialVisitSelectScalar = {
    id?: boolean
    enrollmentId?: boolean
    visitNumber?: boolean
    visitName?: boolean
    visitType?: boolean
    scheduledDate?: boolean
    actualDate?: boolean
    status?: boolean
    completedBy?: boolean
    notes?: boolean
    protocolDeviations?: boolean
    missedReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TrialVisitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollment?: boolean | EnrollmentDefaultArgs<ExtArgs>
  }
  export type TrialVisitIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollment?: boolean | EnrollmentDefaultArgs<ExtArgs>
  }

  export type $TrialVisitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrialVisit"
    objects: {
      enrollment: Prisma.$EnrollmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      enrollmentId: string
      visitNumber: number
      visitName: string
      visitType: $Enums.VisitType
      scheduledDate: Date | null
      actualDate: Date | null
      status: $Enums.VisitStatus
      completedBy: string | null
      notes: string | null
      protocolDeviations: string | null
      missedReason: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["trialVisit"]>
    composites: {}
  }

  type TrialVisitGetPayload<S extends boolean | null | undefined | TrialVisitDefaultArgs> = $Result.GetResult<Prisma.$TrialVisitPayload, S>

  type TrialVisitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TrialVisitFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TrialVisitCountAggregateInputType | true
    }

  export interface TrialVisitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrialVisit'], meta: { name: 'TrialVisit' } }
    /**
     * Find zero or one TrialVisit that matches the filter.
     * @param {TrialVisitFindUniqueArgs} args - Arguments to find a TrialVisit
     * @example
     * // Get one TrialVisit
     * const trialVisit = await prisma.trialVisit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrialVisitFindUniqueArgs>(args: SelectSubset<T, TrialVisitFindUniqueArgs<ExtArgs>>): Prisma__TrialVisitClient<$Result.GetResult<Prisma.$TrialVisitPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TrialVisit that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TrialVisitFindUniqueOrThrowArgs} args - Arguments to find a TrialVisit
     * @example
     * // Get one TrialVisit
     * const trialVisit = await prisma.trialVisit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrialVisitFindUniqueOrThrowArgs>(args: SelectSubset<T, TrialVisitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrialVisitClient<$Result.GetResult<Prisma.$TrialVisitPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TrialVisit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialVisitFindFirstArgs} args - Arguments to find a TrialVisit
     * @example
     * // Get one TrialVisit
     * const trialVisit = await prisma.trialVisit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrialVisitFindFirstArgs>(args?: SelectSubset<T, TrialVisitFindFirstArgs<ExtArgs>>): Prisma__TrialVisitClient<$Result.GetResult<Prisma.$TrialVisitPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TrialVisit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialVisitFindFirstOrThrowArgs} args - Arguments to find a TrialVisit
     * @example
     * // Get one TrialVisit
     * const trialVisit = await prisma.trialVisit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrialVisitFindFirstOrThrowArgs>(args?: SelectSubset<T, TrialVisitFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrialVisitClient<$Result.GetResult<Prisma.$TrialVisitPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TrialVisits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialVisitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrialVisits
     * const trialVisits = await prisma.trialVisit.findMany()
     * 
     * // Get first 10 TrialVisits
     * const trialVisits = await prisma.trialVisit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trialVisitWithIdOnly = await prisma.trialVisit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrialVisitFindManyArgs>(args?: SelectSubset<T, TrialVisitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrialVisitPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TrialVisit.
     * @param {TrialVisitCreateArgs} args - Arguments to create a TrialVisit.
     * @example
     * // Create one TrialVisit
     * const TrialVisit = await prisma.trialVisit.create({
     *   data: {
     *     // ... data to create a TrialVisit
     *   }
     * })
     * 
     */
    create<T extends TrialVisitCreateArgs>(args: SelectSubset<T, TrialVisitCreateArgs<ExtArgs>>): Prisma__TrialVisitClient<$Result.GetResult<Prisma.$TrialVisitPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TrialVisits.
     * @param {TrialVisitCreateManyArgs} args - Arguments to create many TrialVisits.
     * @example
     * // Create many TrialVisits
     * const trialVisit = await prisma.trialVisit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrialVisitCreateManyArgs>(args?: SelectSubset<T, TrialVisitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrialVisits and returns the data saved in the database.
     * @param {TrialVisitCreateManyAndReturnArgs} args - Arguments to create many TrialVisits.
     * @example
     * // Create many TrialVisits
     * const trialVisit = await prisma.trialVisit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrialVisits and only return the `id`
     * const trialVisitWithIdOnly = await prisma.trialVisit.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrialVisitCreateManyAndReturnArgs>(args?: SelectSubset<T, TrialVisitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrialVisitPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TrialVisit.
     * @param {TrialVisitDeleteArgs} args - Arguments to delete one TrialVisit.
     * @example
     * // Delete one TrialVisit
     * const TrialVisit = await prisma.trialVisit.delete({
     *   where: {
     *     // ... filter to delete one TrialVisit
     *   }
     * })
     * 
     */
    delete<T extends TrialVisitDeleteArgs>(args: SelectSubset<T, TrialVisitDeleteArgs<ExtArgs>>): Prisma__TrialVisitClient<$Result.GetResult<Prisma.$TrialVisitPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TrialVisit.
     * @param {TrialVisitUpdateArgs} args - Arguments to update one TrialVisit.
     * @example
     * // Update one TrialVisit
     * const trialVisit = await prisma.trialVisit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrialVisitUpdateArgs>(args: SelectSubset<T, TrialVisitUpdateArgs<ExtArgs>>): Prisma__TrialVisitClient<$Result.GetResult<Prisma.$TrialVisitPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TrialVisits.
     * @param {TrialVisitDeleteManyArgs} args - Arguments to filter TrialVisits to delete.
     * @example
     * // Delete a few TrialVisits
     * const { count } = await prisma.trialVisit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrialVisitDeleteManyArgs>(args?: SelectSubset<T, TrialVisitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrialVisits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialVisitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrialVisits
     * const trialVisit = await prisma.trialVisit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrialVisitUpdateManyArgs>(args: SelectSubset<T, TrialVisitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TrialVisit.
     * @param {TrialVisitUpsertArgs} args - Arguments to update or create a TrialVisit.
     * @example
     * // Update or create a TrialVisit
     * const trialVisit = await prisma.trialVisit.upsert({
     *   create: {
     *     // ... data to create a TrialVisit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrialVisit we want to update
     *   }
     * })
     */
    upsert<T extends TrialVisitUpsertArgs>(args: SelectSubset<T, TrialVisitUpsertArgs<ExtArgs>>): Prisma__TrialVisitClient<$Result.GetResult<Prisma.$TrialVisitPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TrialVisits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialVisitCountArgs} args - Arguments to filter TrialVisits to count.
     * @example
     * // Count the number of TrialVisits
     * const count = await prisma.trialVisit.count({
     *   where: {
     *     // ... the filter for the TrialVisits we want to count
     *   }
     * })
    **/
    count<T extends TrialVisitCountArgs>(
      args?: Subset<T, TrialVisitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrialVisitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrialVisit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialVisitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TrialVisitAggregateArgs>(args: Subset<T, TrialVisitAggregateArgs>): Prisma.PrismaPromise<GetTrialVisitAggregateType<T>>

    /**
     * Group by TrialVisit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialVisitGroupByArgs} args - Group by arguments.
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
      T extends TrialVisitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrialVisitGroupByArgs['orderBy'] }
        : { orderBy?: TrialVisitGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TrialVisitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrialVisitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrialVisit model
   */
  readonly fields: TrialVisitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrialVisit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrialVisitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    enrollment<T extends EnrollmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EnrollmentDefaultArgs<ExtArgs>>): Prisma__EnrollmentClient<$Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the TrialVisit model
   */ 
  interface TrialVisitFieldRefs {
    readonly id: FieldRef<"TrialVisit", 'String'>
    readonly enrollmentId: FieldRef<"TrialVisit", 'String'>
    readonly visitNumber: FieldRef<"TrialVisit", 'Int'>
    readonly visitName: FieldRef<"TrialVisit", 'String'>
    readonly visitType: FieldRef<"TrialVisit", 'VisitType'>
    readonly scheduledDate: FieldRef<"TrialVisit", 'DateTime'>
    readonly actualDate: FieldRef<"TrialVisit", 'DateTime'>
    readonly status: FieldRef<"TrialVisit", 'VisitStatus'>
    readonly completedBy: FieldRef<"TrialVisit", 'String'>
    readonly notes: FieldRef<"TrialVisit", 'String'>
    readonly protocolDeviations: FieldRef<"TrialVisit", 'String'>
    readonly missedReason: FieldRef<"TrialVisit", 'String'>
    readonly createdAt: FieldRef<"TrialVisit", 'DateTime'>
    readonly updatedAt: FieldRef<"TrialVisit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrialVisit findUnique
   */
  export type TrialVisitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialVisit
     */
    select?: TrialVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialVisitInclude<ExtArgs> | null
    /**
     * Filter, which TrialVisit to fetch.
     */
    where: TrialVisitWhereUniqueInput
  }

  /**
   * TrialVisit findUniqueOrThrow
   */
  export type TrialVisitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialVisit
     */
    select?: TrialVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialVisitInclude<ExtArgs> | null
    /**
     * Filter, which TrialVisit to fetch.
     */
    where: TrialVisitWhereUniqueInput
  }

  /**
   * TrialVisit findFirst
   */
  export type TrialVisitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialVisit
     */
    select?: TrialVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialVisitInclude<ExtArgs> | null
    /**
     * Filter, which TrialVisit to fetch.
     */
    where?: TrialVisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrialVisits to fetch.
     */
    orderBy?: TrialVisitOrderByWithRelationInput | TrialVisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrialVisits.
     */
    cursor?: TrialVisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrialVisits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrialVisits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrialVisits.
     */
    distinct?: TrialVisitScalarFieldEnum | TrialVisitScalarFieldEnum[]
  }

  /**
   * TrialVisit findFirstOrThrow
   */
  export type TrialVisitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialVisit
     */
    select?: TrialVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialVisitInclude<ExtArgs> | null
    /**
     * Filter, which TrialVisit to fetch.
     */
    where?: TrialVisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrialVisits to fetch.
     */
    orderBy?: TrialVisitOrderByWithRelationInput | TrialVisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrialVisits.
     */
    cursor?: TrialVisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrialVisits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrialVisits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrialVisits.
     */
    distinct?: TrialVisitScalarFieldEnum | TrialVisitScalarFieldEnum[]
  }

  /**
   * TrialVisit findMany
   */
  export type TrialVisitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialVisit
     */
    select?: TrialVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialVisitInclude<ExtArgs> | null
    /**
     * Filter, which TrialVisits to fetch.
     */
    where?: TrialVisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrialVisits to fetch.
     */
    orderBy?: TrialVisitOrderByWithRelationInput | TrialVisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrialVisits.
     */
    cursor?: TrialVisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrialVisits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrialVisits.
     */
    skip?: number
    distinct?: TrialVisitScalarFieldEnum | TrialVisitScalarFieldEnum[]
  }

  /**
   * TrialVisit create
   */
  export type TrialVisitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialVisit
     */
    select?: TrialVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialVisitInclude<ExtArgs> | null
    /**
     * The data needed to create a TrialVisit.
     */
    data: XOR<TrialVisitCreateInput, TrialVisitUncheckedCreateInput>
  }

  /**
   * TrialVisit createMany
   */
  export type TrialVisitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrialVisits.
     */
    data: TrialVisitCreateManyInput | TrialVisitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrialVisit createManyAndReturn
   */
  export type TrialVisitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialVisit
     */
    select?: TrialVisitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TrialVisits.
     */
    data: TrialVisitCreateManyInput | TrialVisitCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialVisitIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrialVisit update
   */
  export type TrialVisitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialVisit
     */
    select?: TrialVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialVisitInclude<ExtArgs> | null
    /**
     * The data needed to update a TrialVisit.
     */
    data: XOR<TrialVisitUpdateInput, TrialVisitUncheckedUpdateInput>
    /**
     * Choose, which TrialVisit to update.
     */
    where: TrialVisitWhereUniqueInput
  }

  /**
   * TrialVisit updateMany
   */
  export type TrialVisitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrialVisits.
     */
    data: XOR<TrialVisitUpdateManyMutationInput, TrialVisitUncheckedUpdateManyInput>
    /**
     * Filter which TrialVisits to update
     */
    where?: TrialVisitWhereInput
  }

  /**
   * TrialVisit upsert
   */
  export type TrialVisitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialVisit
     */
    select?: TrialVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialVisitInclude<ExtArgs> | null
    /**
     * The filter to search for the TrialVisit to update in case it exists.
     */
    where: TrialVisitWhereUniqueInput
    /**
     * In case the TrialVisit found by the `where` argument doesn't exist, create a new TrialVisit with this data.
     */
    create: XOR<TrialVisitCreateInput, TrialVisitUncheckedCreateInput>
    /**
     * In case the TrialVisit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrialVisitUpdateInput, TrialVisitUncheckedUpdateInput>
  }

  /**
   * TrialVisit delete
   */
  export type TrialVisitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialVisit
     */
    select?: TrialVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialVisitInclude<ExtArgs> | null
    /**
     * Filter which TrialVisit to delete.
     */
    where: TrialVisitWhereUniqueInput
  }

  /**
   * TrialVisit deleteMany
   */
  export type TrialVisitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrialVisits to delete
     */
    where?: TrialVisitWhereInput
  }

  /**
   * TrialVisit without action
   */
  export type TrialVisitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialVisit
     */
    select?: TrialVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrialVisitInclude<ExtArgs> | null
  }


  /**
   * Model Investigator
   */

  export type AggregateInvestigator = {
    _count: InvestigatorCountAggregateOutputType | null
    _min: InvestigatorMinAggregateOutputType | null
    _max: InvestigatorMaxAggregateOutputType | null
  }

  export type InvestigatorMinAggregateOutputType = {
    id: string | null
    userId: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    specialty: string | null
    institution: string | null
    npiNumber: string | null
    licenseNumber: string | null
    licenseState: string | null
    cvUrl: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvestigatorMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    specialty: string | null
    institution: string | null
    npiNumber: string | null
    licenseNumber: string | null
    licenseState: string | null
    cvUrl: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvestigatorCountAggregateOutputType = {
    id: number
    userId: number
    firstName: number
    lastName: number
    email: number
    phone: number
    specialty: number
    institution: number
    npiNumber: number
    licenseNumber: number
    licenseState: number
    cvUrl: number
    isActive: number
    roles: number
    certifications: number
    trainingRecords: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InvestigatorMinAggregateInputType = {
    id?: true
    userId?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    specialty?: true
    institution?: true
    npiNumber?: true
    licenseNumber?: true
    licenseState?: true
    cvUrl?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvestigatorMaxAggregateInputType = {
    id?: true
    userId?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    specialty?: true
    institution?: true
    npiNumber?: true
    licenseNumber?: true
    licenseState?: true
    cvUrl?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvestigatorCountAggregateInputType = {
    id?: true
    userId?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    specialty?: true
    institution?: true
    npiNumber?: true
    licenseNumber?: true
    licenseState?: true
    cvUrl?: true
    isActive?: true
    roles?: true
    certifications?: true
    trainingRecords?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InvestigatorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Investigator to aggregate.
     */
    where?: InvestigatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Investigators to fetch.
     */
    orderBy?: InvestigatorOrderByWithRelationInput | InvestigatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvestigatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Investigators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Investigators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Investigators
    **/
    _count?: true | InvestigatorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvestigatorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvestigatorMaxAggregateInputType
  }

  export type GetInvestigatorAggregateType<T extends InvestigatorAggregateArgs> = {
        [P in keyof T & keyof AggregateInvestigator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvestigator[P]>
      : GetScalarType<T[P], AggregateInvestigator[P]>
  }




  export type InvestigatorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvestigatorWhereInput
    orderBy?: InvestigatorOrderByWithAggregationInput | InvestigatorOrderByWithAggregationInput[]
    by: InvestigatorScalarFieldEnum[] | InvestigatorScalarFieldEnum
    having?: InvestigatorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvestigatorCountAggregateInputType | true
    _min?: InvestigatorMinAggregateInputType
    _max?: InvestigatorMaxAggregateInputType
  }

  export type InvestigatorGroupByOutputType = {
    id: string
    userId: string | null
    firstName: string
    lastName: string
    email: string
    phone: string | null
    specialty: string | null
    institution: string | null
    npiNumber: string | null
    licenseNumber: string | null
    licenseState: string | null
    cvUrl: string | null
    isActive: boolean
    roles: $Enums.InvestigatorRole[]
    certifications: JsonValue[]
    trainingRecords: JsonValue[]
    createdAt: Date
    updatedAt: Date
    _count: InvestigatorCountAggregateOutputType | null
    _min: InvestigatorMinAggregateOutputType | null
    _max: InvestigatorMaxAggregateOutputType | null
  }

  type GetInvestigatorGroupByPayload<T extends InvestigatorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvestigatorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvestigatorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvestigatorGroupByOutputType[P]>
            : GetScalarType<T[P], InvestigatorGroupByOutputType[P]>
        }
      >
    >


  export type InvestigatorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    specialty?: boolean
    institution?: boolean
    npiNumber?: boolean
    licenseNumber?: boolean
    licenseState?: boolean
    cvUrl?: boolean
    isActive?: boolean
    roles?: boolean
    certifications?: boolean
    trainingRecords?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    siteAssignments?: boolean | Investigator$siteAssignmentsArgs<ExtArgs>
    _count?: boolean | InvestigatorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["investigator"]>

  export type InvestigatorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    specialty?: boolean
    institution?: boolean
    npiNumber?: boolean
    licenseNumber?: boolean
    licenseState?: boolean
    cvUrl?: boolean
    isActive?: boolean
    roles?: boolean
    certifications?: boolean
    trainingRecords?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["investigator"]>

  export type InvestigatorSelectScalar = {
    id?: boolean
    userId?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    specialty?: boolean
    institution?: boolean
    npiNumber?: boolean
    licenseNumber?: boolean
    licenseState?: boolean
    cvUrl?: boolean
    isActive?: boolean
    roles?: boolean
    certifications?: boolean
    trainingRecords?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InvestigatorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    siteAssignments?: boolean | Investigator$siteAssignmentsArgs<ExtArgs>
    _count?: boolean | InvestigatorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InvestigatorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $InvestigatorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Investigator"
    objects: {
      siteAssignments: Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      firstName: string
      lastName: string
      email: string
      phone: string | null
      specialty: string | null
      institution: string | null
      npiNumber: string | null
      licenseNumber: string | null
      licenseState: string | null
      cvUrl: string | null
      isActive: boolean
      roles: $Enums.InvestigatorRole[]
      certifications: Prisma.JsonValue[]
      trainingRecords: Prisma.JsonValue[]
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["investigator"]>
    composites: {}
  }

  type InvestigatorGetPayload<S extends boolean | null | undefined | InvestigatorDefaultArgs> = $Result.GetResult<Prisma.$InvestigatorPayload, S>

  type InvestigatorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InvestigatorFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InvestigatorCountAggregateInputType | true
    }

  export interface InvestigatorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Investigator'], meta: { name: 'Investigator' } }
    /**
     * Find zero or one Investigator that matches the filter.
     * @param {InvestigatorFindUniqueArgs} args - Arguments to find a Investigator
     * @example
     * // Get one Investigator
     * const investigator = await prisma.investigator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvestigatorFindUniqueArgs>(args: SelectSubset<T, InvestigatorFindUniqueArgs<ExtArgs>>): Prisma__InvestigatorClient<$Result.GetResult<Prisma.$InvestigatorPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Investigator that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InvestigatorFindUniqueOrThrowArgs} args - Arguments to find a Investigator
     * @example
     * // Get one Investigator
     * const investigator = await prisma.investigator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvestigatorFindUniqueOrThrowArgs>(args: SelectSubset<T, InvestigatorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvestigatorClient<$Result.GetResult<Prisma.$InvestigatorPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Investigator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorFindFirstArgs} args - Arguments to find a Investigator
     * @example
     * // Get one Investigator
     * const investigator = await prisma.investigator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvestigatorFindFirstArgs>(args?: SelectSubset<T, InvestigatorFindFirstArgs<ExtArgs>>): Prisma__InvestigatorClient<$Result.GetResult<Prisma.$InvestigatorPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Investigator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorFindFirstOrThrowArgs} args - Arguments to find a Investigator
     * @example
     * // Get one Investigator
     * const investigator = await prisma.investigator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvestigatorFindFirstOrThrowArgs>(args?: SelectSubset<T, InvestigatorFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvestigatorClient<$Result.GetResult<Prisma.$InvestigatorPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Investigators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Investigators
     * const investigators = await prisma.investigator.findMany()
     * 
     * // Get first 10 Investigators
     * const investigators = await prisma.investigator.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const investigatorWithIdOnly = await prisma.investigator.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvestigatorFindManyArgs>(args?: SelectSubset<T, InvestigatorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestigatorPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Investigator.
     * @param {InvestigatorCreateArgs} args - Arguments to create a Investigator.
     * @example
     * // Create one Investigator
     * const Investigator = await prisma.investigator.create({
     *   data: {
     *     // ... data to create a Investigator
     *   }
     * })
     * 
     */
    create<T extends InvestigatorCreateArgs>(args: SelectSubset<T, InvestigatorCreateArgs<ExtArgs>>): Prisma__InvestigatorClient<$Result.GetResult<Prisma.$InvestigatorPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Investigators.
     * @param {InvestigatorCreateManyArgs} args - Arguments to create many Investigators.
     * @example
     * // Create many Investigators
     * const investigator = await prisma.investigator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvestigatorCreateManyArgs>(args?: SelectSubset<T, InvestigatorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Investigators and returns the data saved in the database.
     * @param {InvestigatorCreateManyAndReturnArgs} args - Arguments to create many Investigators.
     * @example
     * // Create many Investigators
     * const investigator = await prisma.investigator.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Investigators and only return the `id`
     * const investigatorWithIdOnly = await prisma.investigator.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvestigatorCreateManyAndReturnArgs>(args?: SelectSubset<T, InvestigatorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestigatorPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Investigator.
     * @param {InvestigatorDeleteArgs} args - Arguments to delete one Investigator.
     * @example
     * // Delete one Investigator
     * const Investigator = await prisma.investigator.delete({
     *   where: {
     *     // ... filter to delete one Investigator
     *   }
     * })
     * 
     */
    delete<T extends InvestigatorDeleteArgs>(args: SelectSubset<T, InvestigatorDeleteArgs<ExtArgs>>): Prisma__InvestigatorClient<$Result.GetResult<Prisma.$InvestigatorPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Investigator.
     * @param {InvestigatorUpdateArgs} args - Arguments to update one Investigator.
     * @example
     * // Update one Investigator
     * const investigator = await prisma.investigator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvestigatorUpdateArgs>(args: SelectSubset<T, InvestigatorUpdateArgs<ExtArgs>>): Prisma__InvestigatorClient<$Result.GetResult<Prisma.$InvestigatorPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Investigators.
     * @param {InvestigatorDeleteManyArgs} args - Arguments to filter Investigators to delete.
     * @example
     * // Delete a few Investigators
     * const { count } = await prisma.investigator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvestigatorDeleteManyArgs>(args?: SelectSubset<T, InvestigatorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Investigators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Investigators
     * const investigator = await prisma.investigator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvestigatorUpdateManyArgs>(args: SelectSubset<T, InvestigatorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Investigator.
     * @param {InvestigatorUpsertArgs} args - Arguments to update or create a Investigator.
     * @example
     * // Update or create a Investigator
     * const investigator = await prisma.investigator.upsert({
     *   create: {
     *     // ... data to create a Investigator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Investigator we want to update
     *   }
     * })
     */
    upsert<T extends InvestigatorUpsertArgs>(args: SelectSubset<T, InvestigatorUpsertArgs<ExtArgs>>): Prisma__InvestigatorClient<$Result.GetResult<Prisma.$InvestigatorPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Investigators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorCountArgs} args - Arguments to filter Investigators to count.
     * @example
     * // Count the number of Investigators
     * const count = await prisma.investigator.count({
     *   where: {
     *     // ... the filter for the Investigators we want to count
     *   }
     * })
    **/
    count<T extends InvestigatorCountArgs>(
      args?: Subset<T, InvestigatorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvestigatorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Investigator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InvestigatorAggregateArgs>(args: Subset<T, InvestigatorAggregateArgs>): Prisma.PrismaPromise<GetInvestigatorAggregateType<T>>

    /**
     * Group by Investigator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorGroupByArgs} args - Group by arguments.
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
      T extends InvestigatorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvestigatorGroupByArgs['orderBy'] }
        : { orderBy?: InvestigatorGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InvestigatorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvestigatorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Investigator model
   */
  readonly fields: InvestigatorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Investigator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvestigatorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    siteAssignments<T extends Investigator$siteAssignmentsArgs<ExtArgs> = {}>(args?: Subset<T, Investigator$siteAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Investigator model
   */ 
  interface InvestigatorFieldRefs {
    readonly id: FieldRef<"Investigator", 'String'>
    readonly userId: FieldRef<"Investigator", 'String'>
    readonly firstName: FieldRef<"Investigator", 'String'>
    readonly lastName: FieldRef<"Investigator", 'String'>
    readonly email: FieldRef<"Investigator", 'String'>
    readonly phone: FieldRef<"Investigator", 'String'>
    readonly specialty: FieldRef<"Investigator", 'String'>
    readonly institution: FieldRef<"Investigator", 'String'>
    readonly npiNumber: FieldRef<"Investigator", 'String'>
    readonly licenseNumber: FieldRef<"Investigator", 'String'>
    readonly licenseState: FieldRef<"Investigator", 'String'>
    readonly cvUrl: FieldRef<"Investigator", 'String'>
    readonly isActive: FieldRef<"Investigator", 'Boolean'>
    readonly roles: FieldRef<"Investigator", 'InvestigatorRole[]'>
    readonly certifications: FieldRef<"Investigator", 'Json[]'>
    readonly trainingRecords: FieldRef<"Investigator", 'Json[]'>
    readonly createdAt: FieldRef<"Investigator", 'DateTime'>
    readonly updatedAt: FieldRef<"Investigator", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Investigator findUnique
   */
  export type InvestigatorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investigator
     */
    select?: InvestigatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorInclude<ExtArgs> | null
    /**
     * Filter, which Investigator to fetch.
     */
    where: InvestigatorWhereUniqueInput
  }

  /**
   * Investigator findUniqueOrThrow
   */
  export type InvestigatorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investigator
     */
    select?: InvestigatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorInclude<ExtArgs> | null
    /**
     * Filter, which Investigator to fetch.
     */
    where: InvestigatorWhereUniqueInput
  }

  /**
   * Investigator findFirst
   */
  export type InvestigatorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investigator
     */
    select?: InvestigatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorInclude<ExtArgs> | null
    /**
     * Filter, which Investigator to fetch.
     */
    where?: InvestigatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Investigators to fetch.
     */
    orderBy?: InvestigatorOrderByWithRelationInput | InvestigatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Investigators.
     */
    cursor?: InvestigatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Investigators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Investigators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Investigators.
     */
    distinct?: InvestigatorScalarFieldEnum | InvestigatorScalarFieldEnum[]
  }

  /**
   * Investigator findFirstOrThrow
   */
  export type InvestigatorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investigator
     */
    select?: InvestigatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorInclude<ExtArgs> | null
    /**
     * Filter, which Investigator to fetch.
     */
    where?: InvestigatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Investigators to fetch.
     */
    orderBy?: InvestigatorOrderByWithRelationInput | InvestigatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Investigators.
     */
    cursor?: InvestigatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Investigators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Investigators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Investigators.
     */
    distinct?: InvestigatorScalarFieldEnum | InvestigatorScalarFieldEnum[]
  }

  /**
   * Investigator findMany
   */
  export type InvestigatorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investigator
     */
    select?: InvestigatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorInclude<ExtArgs> | null
    /**
     * Filter, which Investigators to fetch.
     */
    where?: InvestigatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Investigators to fetch.
     */
    orderBy?: InvestigatorOrderByWithRelationInput | InvestigatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Investigators.
     */
    cursor?: InvestigatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Investigators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Investigators.
     */
    skip?: number
    distinct?: InvestigatorScalarFieldEnum | InvestigatorScalarFieldEnum[]
  }

  /**
   * Investigator create
   */
  export type InvestigatorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investigator
     */
    select?: InvestigatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorInclude<ExtArgs> | null
    /**
     * The data needed to create a Investigator.
     */
    data: XOR<InvestigatorCreateInput, InvestigatorUncheckedCreateInput>
  }

  /**
   * Investigator createMany
   */
  export type InvestigatorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Investigators.
     */
    data: InvestigatorCreateManyInput | InvestigatorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Investigator createManyAndReturn
   */
  export type InvestigatorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investigator
     */
    select?: InvestigatorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Investigators.
     */
    data: InvestigatorCreateManyInput | InvestigatorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Investigator update
   */
  export type InvestigatorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investigator
     */
    select?: InvestigatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorInclude<ExtArgs> | null
    /**
     * The data needed to update a Investigator.
     */
    data: XOR<InvestigatorUpdateInput, InvestigatorUncheckedUpdateInput>
    /**
     * Choose, which Investigator to update.
     */
    where: InvestigatorWhereUniqueInput
  }

  /**
   * Investigator updateMany
   */
  export type InvestigatorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Investigators.
     */
    data: XOR<InvestigatorUpdateManyMutationInput, InvestigatorUncheckedUpdateManyInput>
    /**
     * Filter which Investigators to update
     */
    where?: InvestigatorWhereInput
  }

  /**
   * Investigator upsert
   */
  export type InvestigatorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investigator
     */
    select?: InvestigatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorInclude<ExtArgs> | null
    /**
     * The filter to search for the Investigator to update in case it exists.
     */
    where: InvestigatorWhereUniqueInput
    /**
     * In case the Investigator found by the `where` argument doesn't exist, create a new Investigator with this data.
     */
    create: XOR<InvestigatorCreateInput, InvestigatorUncheckedCreateInput>
    /**
     * In case the Investigator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvestigatorUpdateInput, InvestigatorUncheckedUpdateInput>
  }

  /**
   * Investigator delete
   */
  export type InvestigatorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investigator
     */
    select?: InvestigatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorInclude<ExtArgs> | null
    /**
     * Filter which Investigator to delete.
     */
    where: InvestigatorWhereUniqueInput
  }

  /**
   * Investigator deleteMany
   */
  export type InvestigatorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Investigators to delete
     */
    where?: InvestigatorWhereInput
  }

  /**
   * Investigator.siteAssignments
   */
  export type Investigator$siteAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorSiteAssignment
     */
    select?: InvestigatorSiteAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorSiteAssignmentInclude<ExtArgs> | null
    where?: InvestigatorSiteAssignmentWhereInput
    orderBy?: InvestigatorSiteAssignmentOrderByWithRelationInput | InvestigatorSiteAssignmentOrderByWithRelationInput[]
    cursor?: InvestigatorSiteAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvestigatorSiteAssignmentScalarFieldEnum | InvestigatorSiteAssignmentScalarFieldEnum[]
  }

  /**
   * Investigator without action
   */
  export type InvestigatorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investigator
     */
    select?: InvestigatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorInclude<ExtArgs> | null
  }


  /**
   * Model InvestigatorSiteAssignment
   */

  export type AggregateInvestigatorSiteAssignment = {
    _count: InvestigatorSiteAssignmentCountAggregateOutputType | null
    _min: InvestigatorSiteAssignmentMinAggregateOutputType | null
    _max: InvestigatorSiteAssignmentMaxAggregateOutputType | null
  }

  export type InvestigatorSiteAssignmentMinAggregateOutputType = {
    id: string | null
    investigatorId: string | null
    siteId: string | null
    trialId: string | null
    role: $Enums.InvestigatorRole | null
    startDate: Date | null
    endDate: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvestigatorSiteAssignmentMaxAggregateOutputType = {
    id: string | null
    investigatorId: string | null
    siteId: string | null
    trialId: string | null
    role: $Enums.InvestigatorRole | null
    startDate: Date | null
    endDate: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvestigatorSiteAssignmentCountAggregateOutputType = {
    id: number
    investigatorId: number
    siteId: number
    trialId: number
    role: number
    startDate: number
    endDate: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InvestigatorSiteAssignmentMinAggregateInputType = {
    id?: true
    investigatorId?: true
    siteId?: true
    trialId?: true
    role?: true
    startDate?: true
    endDate?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvestigatorSiteAssignmentMaxAggregateInputType = {
    id?: true
    investigatorId?: true
    siteId?: true
    trialId?: true
    role?: true
    startDate?: true
    endDate?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvestigatorSiteAssignmentCountAggregateInputType = {
    id?: true
    investigatorId?: true
    siteId?: true
    trialId?: true
    role?: true
    startDate?: true
    endDate?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InvestigatorSiteAssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvestigatorSiteAssignment to aggregate.
     */
    where?: InvestigatorSiteAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvestigatorSiteAssignments to fetch.
     */
    orderBy?: InvestigatorSiteAssignmentOrderByWithRelationInput | InvestigatorSiteAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvestigatorSiteAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvestigatorSiteAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvestigatorSiteAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InvestigatorSiteAssignments
    **/
    _count?: true | InvestigatorSiteAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvestigatorSiteAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvestigatorSiteAssignmentMaxAggregateInputType
  }

  export type GetInvestigatorSiteAssignmentAggregateType<T extends InvestigatorSiteAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateInvestigatorSiteAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvestigatorSiteAssignment[P]>
      : GetScalarType<T[P], AggregateInvestigatorSiteAssignment[P]>
  }




  export type InvestigatorSiteAssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvestigatorSiteAssignmentWhereInput
    orderBy?: InvestigatorSiteAssignmentOrderByWithAggregationInput | InvestigatorSiteAssignmentOrderByWithAggregationInput[]
    by: InvestigatorSiteAssignmentScalarFieldEnum[] | InvestigatorSiteAssignmentScalarFieldEnum
    having?: InvestigatorSiteAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvestigatorSiteAssignmentCountAggregateInputType | true
    _min?: InvestigatorSiteAssignmentMinAggregateInputType
    _max?: InvestigatorSiteAssignmentMaxAggregateInputType
  }

  export type InvestigatorSiteAssignmentGroupByOutputType = {
    id: string
    investigatorId: string
    siteId: string
    trialId: string
    role: $Enums.InvestigatorRole
    startDate: Date
    endDate: Date | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: InvestigatorSiteAssignmentCountAggregateOutputType | null
    _min: InvestigatorSiteAssignmentMinAggregateOutputType | null
    _max: InvestigatorSiteAssignmentMaxAggregateOutputType | null
  }

  type GetInvestigatorSiteAssignmentGroupByPayload<T extends InvestigatorSiteAssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvestigatorSiteAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvestigatorSiteAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvestigatorSiteAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], InvestigatorSiteAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type InvestigatorSiteAssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    investigatorId?: boolean
    siteId?: boolean
    trialId?: boolean
    role?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    investigator?: boolean | InvestigatorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["investigatorSiteAssignment"]>

  export type InvestigatorSiteAssignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    investigatorId?: boolean
    siteId?: boolean
    trialId?: boolean
    role?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    investigator?: boolean | InvestigatorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["investigatorSiteAssignment"]>

  export type InvestigatorSiteAssignmentSelectScalar = {
    id?: boolean
    investigatorId?: boolean
    siteId?: boolean
    trialId?: boolean
    role?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InvestigatorSiteAssignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    investigator?: boolean | InvestigatorDefaultArgs<ExtArgs>
  }
  export type InvestigatorSiteAssignmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    investigator?: boolean | InvestigatorDefaultArgs<ExtArgs>
  }

  export type $InvestigatorSiteAssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InvestigatorSiteAssignment"
    objects: {
      investigator: Prisma.$InvestigatorPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      investigatorId: string
      siteId: string
      trialId: string
      role: $Enums.InvestigatorRole
      startDate: Date
      endDate: Date | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["investigatorSiteAssignment"]>
    composites: {}
  }

  type InvestigatorSiteAssignmentGetPayload<S extends boolean | null | undefined | InvestigatorSiteAssignmentDefaultArgs> = $Result.GetResult<Prisma.$InvestigatorSiteAssignmentPayload, S>

  type InvestigatorSiteAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InvestigatorSiteAssignmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InvestigatorSiteAssignmentCountAggregateInputType | true
    }

  export interface InvestigatorSiteAssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InvestigatorSiteAssignment'], meta: { name: 'InvestigatorSiteAssignment' } }
    /**
     * Find zero or one InvestigatorSiteAssignment that matches the filter.
     * @param {InvestigatorSiteAssignmentFindUniqueArgs} args - Arguments to find a InvestigatorSiteAssignment
     * @example
     * // Get one InvestigatorSiteAssignment
     * const investigatorSiteAssignment = await prisma.investigatorSiteAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvestigatorSiteAssignmentFindUniqueArgs>(args: SelectSubset<T, InvestigatorSiteAssignmentFindUniqueArgs<ExtArgs>>): Prisma__InvestigatorSiteAssignmentClient<$Result.GetResult<Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InvestigatorSiteAssignment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InvestigatorSiteAssignmentFindUniqueOrThrowArgs} args - Arguments to find a InvestigatorSiteAssignment
     * @example
     * // Get one InvestigatorSiteAssignment
     * const investigatorSiteAssignment = await prisma.investigatorSiteAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvestigatorSiteAssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, InvestigatorSiteAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvestigatorSiteAssignmentClient<$Result.GetResult<Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InvestigatorSiteAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorSiteAssignmentFindFirstArgs} args - Arguments to find a InvestigatorSiteAssignment
     * @example
     * // Get one InvestigatorSiteAssignment
     * const investigatorSiteAssignment = await prisma.investigatorSiteAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvestigatorSiteAssignmentFindFirstArgs>(args?: SelectSubset<T, InvestigatorSiteAssignmentFindFirstArgs<ExtArgs>>): Prisma__InvestigatorSiteAssignmentClient<$Result.GetResult<Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InvestigatorSiteAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorSiteAssignmentFindFirstOrThrowArgs} args - Arguments to find a InvestigatorSiteAssignment
     * @example
     * // Get one InvestigatorSiteAssignment
     * const investigatorSiteAssignment = await prisma.investigatorSiteAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvestigatorSiteAssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, InvestigatorSiteAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvestigatorSiteAssignmentClient<$Result.GetResult<Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InvestigatorSiteAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorSiteAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InvestigatorSiteAssignments
     * const investigatorSiteAssignments = await prisma.investigatorSiteAssignment.findMany()
     * 
     * // Get first 10 InvestigatorSiteAssignments
     * const investigatorSiteAssignments = await prisma.investigatorSiteAssignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const investigatorSiteAssignmentWithIdOnly = await prisma.investigatorSiteAssignment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvestigatorSiteAssignmentFindManyArgs>(args?: SelectSubset<T, InvestigatorSiteAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InvestigatorSiteAssignment.
     * @param {InvestigatorSiteAssignmentCreateArgs} args - Arguments to create a InvestigatorSiteAssignment.
     * @example
     * // Create one InvestigatorSiteAssignment
     * const InvestigatorSiteAssignment = await prisma.investigatorSiteAssignment.create({
     *   data: {
     *     // ... data to create a InvestigatorSiteAssignment
     *   }
     * })
     * 
     */
    create<T extends InvestigatorSiteAssignmentCreateArgs>(args: SelectSubset<T, InvestigatorSiteAssignmentCreateArgs<ExtArgs>>): Prisma__InvestigatorSiteAssignmentClient<$Result.GetResult<Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InvestigatorSiteAssignments.
     * @param {InvestigatorSiteAssignmentCreateManyArgs} args - Arguments to create many InvestigatorSiteAssignments.
     * @example
     * // Create many InvestigatorSiteAssignments
     * const investigatorSiteAssignment = await prisma.investigatorSiteAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvestigatorSiteAssignmentCreateManyArgs>(args?: SelectSubset<T, InvestigatorSiteAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InvestigatorSiteAssignments and returns the data saved in the database.
     * @param {InvestigatorSiteAssignmentCreateManyAndReturnArgs} args - Arguments to create many InvestigatorSiteAssignments.
     * @example
     * // Create many InvestigatorSiteAssignments
     * const investigatorSiteAssignment = await prisma.investigatorSiteAssignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InvestigatorSiteAssignments and only return the `id`
     * const investigatorSiteAssignmentWithIdOnly = await prisma.investigatorSiteAssignment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvestigatorSiteAssignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, InvestigatorSiteAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InvestigatorSiteAssignment.
     * @param {InvestigatorSiteAssignmentDeleteArgs} args - Arguments to delete one InvestigatorSiteAssignment.
     * @example
     * // Delete one InvestigatorSiteAssignment
     * const InvestigatorSiteAssignment = await prisma.investigatorSiteAssignment.delete({
     *   where: {
     *     // ... filter to delete one InvestigatorSiteAssignment
     *   }
     * })
     * 
     */
    delete<T extends InvestigatorSiteAssignmentDeleteArgs>(args: SelectSubset<T, InvestigatorSiteAssignmentDeleteArgs<ExtArgs>>): Prisma__InvestigatorSiteAssignmentClient<$Result.GetResult<Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InvestigatorSiteAssignment.
     * @param {InvestigatorSiteAssignmentUpdateArgs} args - Arguments to update one InvestigatorSiteAssignment.
     * @example
     * // Update one InvestigatorSiteAssignment
     * const investigatorSiteAssignment = await prisma.investigatorSiteAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvestigatorSiteAssignmentUpdateArgs>(args: SelectSubset<T, InvestigatorSiteAssignmentUpdateArgs<ExtArgs>>): Prisma__InvestigatorSiteAssignmentClient<$Result.GetResult<Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InvestigatorSiteAssignments.
     * @param {InvestigatorSiteAssignmentDeleteManyArgs} args - Arguments to filter InvestigatorSiteAssignments to delete.
     * @example
     * // Delete a few InvestigatorSiteAssignments
     * const { count } = await prisma.investigatorSiteAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvestigatorSiteAssignmentDeleteManyArgs>(args?: SelectSubset<T, InvestigatorSiteAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvestigatorSiteAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorSiteAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InvestigatorSiteAssignments
     * const investigatorSiteAssignment = await prisma.investigatorSiteAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvestigatorSiteAssignmentUpdateManyArgs>(args: SelectSubset<T, InvestigatorSiteAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InvestigatorSiteAssignment.
     * @param {InvestigatorSiteAssignmentUpsertArgs} args - Arguments to update or create a InvestigatorSiteAssignment.
     * @example
     * // Update or create a InvestigatorSiteAssignment
     * const investigatorSiteAssignment = await prisma.investigatorSiteAssignment.upsert({
     *   create: {
     *     // ... data to create a InvestigatorSiteAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InvestigatorSiteAssignment we want to update
     *   }
     * })
     */
    upsert<T extends InvestigatorSiteAssignmentUpsertArgs>(args: SelectSubset<T, InvestigatorSiteAssignmentUpsertArgs<ExtArgs>>): Prisma__InvestigatorSiteAssignmentClient<$Result.GetResult<Prisma.$InvestigatorSiteAssignmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InvestigatorSiteAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorSiteAssignmentCountArgs} args - Arguments to filter InvestigatorSiteAssignments to count.
     * @example
     * // Count the number of InvestigatorSiteAssignments
     * const count = await prisma.investigatorSiteAssignment.count({
     *   where: {
     *     // ... the filter for the InvestigatorSiteAssignments we want to count
     *   }
     * })
    **/
    count<T extends InvestigatorSiteAssignmentCountArgs>(
      args?: Subset<T, InvestigatorSiteAssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvestigatorSiteAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InvestigatorSiteAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorSiteAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InvestigatorSiteAssignmentAggregateArgs>(args: Subset<T, InvestigatorSiteAssignmentAggregateArgs>): Prisma.PrismaPromise<GetInvestigatorSiteAssignmentAggregateType<T>>

    /**
     * Group by InvestigatorSiteAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigatorSiteAssignmentGroupByArgs} args - Group by arguments.
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
      T extends InvestigatorSiteAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvestigatorSiteAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: InvestigatorSiteAssignmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InvestigatorSiteAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvestigatorSiteAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InvestigatorSiteAssignment model
   */
  readonly fields: InvestigatorSiteAssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InvestigatorSiteAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvestigatorSiteAssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    investigator<T extends InvestigatorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InvestigatorDefaultArgs<ExtArgs>>): Prisma__InvestigatorClient<$Result.GetResult<Prisma.$InvestigatorPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the InvestigatorSiteAssignment model
   */ 
  interface InvestigatorSiteAssignmentFieldRefs {
    readonly id: FieldRef<"InvestigatorSiteAssignment", 'String'>
    readonly investigatorId: FieldRef<"InvestigatorSiteAssignment", 'String'>
    readonly siteId: FieldRef<"InvestigatorSiteAssignment", 'String'>
    readonly trialId: FieldRef<"InvestigatorSiteAssignment", 'String'>
    readonly role: FieldRef<"InvestigatorSiteAssignment", 'InvestigatorRole'>
    readonly startDate: FieldRef<"InvestigatorSiteAssignment", 'DateTime'>
    readonly endDate: FieldRef<"InvestigatorSiteAssignment", 'DateTime'>
    readonly isActive: FieldRef<"InvestigatorSiteAssignment", 'Boolean'>
    readonly createdAt: FieldRef<"InvestigatorSiteAssignment", 'DateTime'>
    readonly updatedAt: FieldRef<"InvestigatorSiteAssignment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InvestigatorSiteAssignment findUnique
   */
  export type InvestigatorSiteAssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorSiteAssignment
     */
    select?: InvestigatorSiteAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorSiteAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which InvestigatorSiteAssignment to fetch.
     */
    where: InvestigatorSiteAssignmentWhereUniqueInput
  }

  /**
   * InvestigatorSiteAssignment findUniqueOrThrow
   */
  export type InvestigatorSiteAssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorSiteAssignment
     */
    select?: InvestigatorSiteAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorSiteAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which InvestigatorSiteAssignment to fetch.
     */
    where: InvestigatorSiteAssignmentWhereUniqueInput
  }

  /**
   * InvestigatorSiteAssignment findFirst
   */
  export type InvestigatorSiteAssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorSiteAssignment
     */
    select?: InvestigatorSiteAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorSiteAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which InvestigatorSiteAssignment to fetch.
     */
    where?: InvestigatorSiteAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvestigatorSiteAssignments to fetch.
     */
    orderBy?: InvestigatorSiteAssignmentOrderByWithRelationInput | InvestigatorSiteAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvestigatorSiteAssignments.
     */
    cursor?: InvestigatorSiteAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvestigatorSiteAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvestigatorSiteAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvestigatorSiteAssignments.
     */
    distinct?: InvestigatorSiteAssignmentScalarFieldEnum | InvestigatorSiteAssignmentScalarFieldEnum[]
  }

  /**
   * InvestigatorSiteAssignment findFirstOrThrow
   */
  export type InvestigatorSiteAssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorSiteAssignment
     */
    select?: InvestigatorSiteAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorSiteAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which InvestigatorSiteAssignment to fetch.
     */
    where?: InvestigatorSiteAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvestigatorSiteAssignments to fetch.
     */
    orderBy?: InvestigatorSiteAssignmentOrderByWithRelationInput | InvestigatorSiteAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvestigatorSiteAssignments.
     */
    cursor?: InvestigatorSiteAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvestigatorSiteAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvestigatorSiteAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvestigatorSiteAssignments.
     */
    distinct?: InvestigatorSiteAssignmentScalarFieldEnum | InvestigatorSiteAssignmentScalarFieldEnum[]
  }

  /**
   * InvestigatorSiteAssignment findMany
   */
  export type InvestigatorSiteAssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorSiteAssignment
     */
    select?: InvestigatorSiteAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorSiteAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which InvestigatorSiteAssignments to fetch.
     */
    where?: InvestigatorSiteAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvestigatorSiteAssignments to fetch.
     */
    orderBy?: InvestigatorSiteAssignmentOrderByWithRelationInput | InvestigatorSiteAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InvestigatorSiteAssignments.
     */
    cursor?: InvestigatorSiteAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvestigatorSiteAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvestigatorSiteAssignments.
     */
    skip?: number
    distinct?: InvestigatorSiteAssignmentScalarFieldEnum | InvestigatorSiteAssignmentScalarFieldEnum[]
  }

  /**
   * InvestigatorSiteAssignment create
   */
  export type InvestigatorSiteAssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorSiteAssignment
     */
    select?: InvestigatorSiteAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorSiteAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a InvestigatorSiteAssignment.
     */
    data: XOR<InvestigatorSiteAssignmentCreateInput, InvestigatorSiteAssignmentUncheckedCreateInput>
  }

  /**
   * InvestigatorSiteAssignment createMany
   */
  export type InvestigatorSiteAssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InvestigatorSiteAssignments.
     */
    data: InvestigatorSiteAssignmentCreateManyInput | InvestigatorSiteAssignmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InvestigatorSiteAssignment createManyAndReturn
   */
  export type InvestigatorSiteAssignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorSiteAssignment
     */
    select?: InvestigatorSiteAssignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InvestigatorSiteAssignments.
     */
    data: InvestigatorSiteAssignmentCreateManyInput | InvestigatorSiteAssignmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorSiteAssignmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InvestigatorSiteAssignment update
   */
  export type InvestigatorSiteAssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorSiteAssignment
     */
    select?: InvestigatorSiteAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorSiteAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a InvestigatorSiteAssignment.
     */
    data: XOR<InvestigatorSiteAssignmentUpdateInput, InvestigatorSiteAssignmentUncheckedUpdateInput>
    /**
     * Choose, which InvestigatorSiteAssignment to update.
     */
    where: InvestigatorSiteAssignmentWhereUniqueInput
  }

  /**
   * InvestigatorSiteAssignment updateMany
   */
  export type InvestigatorSiteAssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InvestigatorSiteAssignments.
     */
    data: XOR<InvestigatorSiteAssignmentUpdateManyMutationInput, InvestigatorSiteAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which InvestigatorSiteAssignments to update
     */
    where?: InvestigatorSiteAssignmentWhereInput
  }

  /**
   * InvestigatorSiteAssignment upsert
   */
  export type InvestigatorSiteAssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorSiteAssignment
     */
    select?: InvestigatorSiteAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorSiteAssignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the InvestigatorSiteAssignment to update in case it exists.
     */
    where: InvestigatorSiteAssignmentWhereUniqueInput
    /**
     * In case the InvestigatorSiteAssignment found by the `where` argument doesn't exist, create a new InvestigatorSiteAssignment with this data.
     */
    create: XOR<InvestigatorSiteAssignmentCreateInput, InvestigatorSiteAssignmentUncheckedCreateInput>
    /**
     * In case the InvestigatorSiteAssignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvestigatorSiteAssignmentUpdateInput, InvestigatorSiteAssignmentUncheckedUpdateInput>
  }

  /**
   * InvestigatorSiteAssignment delete
   */
  export type InvestigatorSiteAssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorSiteAssignment
     */
    select?: InvestigatorSiteAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorSiteAssignmentInclude<ExtArgs> | null
    /**
     * Filter which InvestigatorSiteAssignment to delete.
     */
    where: InvestigatorSiteAssignmentWhereUniqueInput
  }

  /**
   * InvestigatorSiteAssignment deleteMany
   */
  export type InvestigatorSiteAssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvestigatorSiteAssignments to delete
     */
    where?: InvestigatorSiteAssignmentWhereInput
  }

  /**
   * InvestigatorSiteAssignment without action
   */
  export type InvestigatorSiteAssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigatorSiteAssignment
     */
    select?: InvestigatorSiteAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigatorSiteAssignmentInclude<ExtArgs> | null
  }


  /**
   * Model TrialNotification
   */

  export type AggregateTrialNotification = {
    _count: TrialNotificationCountAggregateOutputType | null
    _min: TrialNotificationMinAggregateOutputType | null
    _max: TrialNotificationMaxAggregateOutputType | null
  }

  export type TrialNotificationMinAggregateOutputType = {
    id: string | null
    recipientId: string | null
    recipientType: $Enums.RecipientType | null
    type: $Enums.NotificationType | null
    title: string | null
    message: string | null
    trialId: string | null
    enrollmentId: string | null
    matchId: string | null
    priority: $Enums.NotificationPriority | null
    isRead: boolean | null
    readAt: Date | null
    sentAt: Date | null
    deliveryMethod: $Enums.DeliveryMethod | null
    externalId: string | null
    createdAt: Date | null
  }

  export type TrialNotificationMaxAggregateOutputType = {
    id: string | null
    recipientId: string | null
    recipientType: $Enums.RecipientType | null
    type: $Enums.NotificationType | null
    title: string | null
    message: string | null
    trialId: string | null
    enrollmentId: string | null
    matchId: string | null
    priority: $Enums.NotificationPriority | null
    isRead: boolean | null
    readAt: Date | null
    sentAt: Date | null
    deliveryMethod: $Enums.DeliveryMethod | null
    externalId: string | null
    createdAt: Date | null
  }

  export type TrialNotificationCountAggregateOutputType = {
    id: number
    recipientId: number
    recipientType: number
    type: number
    title: number
    message: number
    trialId: number
    enrollmentId: number
    matchId: number
    priority: number
    isRead: number
    readAt: number
    sentAt: number
    deliveryMethod: number
    externalId: number
    createdAt: number
    _all: number
  }


  export type TrialNotificationMinAggregateInputType = {
    id?: true
    recipientId?: true
    recipientType?: true
    type?: true
    title?: true
    message?: true
    trialId?: true
    enrollmentId?: true
    matchId?: true
    priority?: true
    isRead?: true
    readAt?: true
    sentAt?: true
    deliveryMethod?: true
    externalId?: true
    createdAt?: true
  }

  export type TrialNotificationMaxAggregateInputType = {
    id?: true
    recipientId?: true
    recipientType?: true
    type?: true
    title?: true
    message?: true
    trialId?: true
    enrollmentId?: true
    matchId?: true
    priority?: true
    isRead?: true
    readAt?: true
    sentAt?: true
    deliveryMethod?: true
    externalId?: true
    createdAt?: true
  }

  export type TrialNotificationCountAggregateInputType = {
    id?: true
    recipientId?: true
    recipientType?: true
    type?: true
    title?: true
    message?: true
    trialId?: true
    enrollmentId?: true
    matchId?: true
    priority?: true
    isRead?: true
    readAt?: true
    sentAt?: true
    deliveryMethod?: true
    externalId?: true
    createdAt?: true
    _all?: true
  }

  export type TrialNotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrialNotification to aggregate.
     */
    where?: TrialNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrialNotifications to fetch.
     */
    orderBy?: TrialNotificationOrderByWithRelationInput | TrialNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrialNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrialNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrialNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrialNotifications
    **/
    _count?: true | TrialNotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrialNotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrialNotificationMaxAggregateInputType
  }

  export type GetTrialNotificationAggregateType<T extends TrialNotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateTrialNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrialNotification[P]>
      : GetScalarType<T[P], AggregateTrialNotification[P]>
  }




  export type TrialNotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrialNotificationWhereInput
    orderBy?: TrialNotificationOrderByWithAggregationInput | TrialNotificationOrderByWithAggregationInput[]
    by: TrialNotificationScalarFieldEnum[] | TrialNotificationScalarFieldEnum
    having?: TrialNotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrialNotificationCountAggregateInputType | true
    _min?: TrialNotificationMinAggregateInputType
    _max?: TrialNotificationMaxAggregateInputType
  }

  export type TrialNotificationGroupByOutputType = {
    id: string
    recipientId: string
    recipientType: $Enums.RecipientType
    type: $Enums.NotificationType
    title: string
    message: string
    trialId: string | null
    enrollmentId: string | null
    matchId: string | null
    priority: $Enums.NotificationPriority
    isRead: boolean
    readAt: Date | null
    sentAt: Date
    deliveryMethod: $Enums.DeliveryMethod
    externalId: string | null
    createdAt: Date
    _count: TrialNotificationCountAggregateOutputType | null
    _min: TrialNotificationMinAggregateOutputType | null
    _max: TrialNotificationMaxAggregateOutputType | null
  }

  type GetTrialNotificationGroupByPayload<T extends TrialNotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrialNotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrialNotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrialNotificationGroupByOutputType[P]>
            : GetScalarType<T[P], TrialNotificationGroupByOutputType[P]>
        }
      >
    >


  export type TrialNotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recipientId?: boolean
    recipientType?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    trialId?: boolean
    enrollmentId?: boolean
    matchId?: boolean
    priority?: boolean
    isRead?: boolean
    readAt?: boolean
    sentAt?: boolean
    deliveryMethod?: boolean
    externalId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["trialNotification"]>

  export type TrialNotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recipientId?: boolean
    recipientType?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    trialId?: boolean
    enrollmentId?: boolean
    matchId?: boolean
    priority?: boolean
    isRead?: boolean
    readAt?: boolean
    sentAt?: boolean
    deliveryMethod?: boolean
    externalId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["trialNotification"]>

  export type TrialNotificationSelectScalar = {
    id?: boolean
    recipientId?: boolean
    recipientType?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    trialId?: boolean
    enrollmentId?: boolean
    matchId?: boolean
    priority?: boolean
    isRead?: boolean
    readAt?: boolean
    sentAt?: boolean
    deliveryMethod?: boolean
    externalId?: boolean
    createdAt?: boolean
  }


  export type $TrialNotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrialNotification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      recipientId: string
      recipientType: $Enums.RecipientType
      type: $Enums.NotificationType
      title: string
      message: string
      trialId: string | null
      enrollmentId: string | null
      matchId: string | null
      priority: $Enums.NotificationPriority
      isRead: boolean
      readAt: Date | null
      sentAt: Date
      deliveryMethod: $Enums.DeliveryMethod
      externalId: string | null
      createdAt: Date
    }, ExtArgs["result"]["trialNotification"]>
    composites: {}
  }

  type TrialNotificationGetPayload<S extends boolean | null | undefined | TrialNotificationDefaultArgs> = $Result.GetResult<Prisma.$TrialNotificationPayload, S>

  type TrialNotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TrialNotificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TrialNotificationCountAggregateInputType | true
    }

  export interface TrialNotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrialNotification'], meta: { name: 'TrialNotification' } }
    /**
     * Find zero or one TrialNotification that matches the filter.
     * @param {TrialNotificationFindUniqueArgs} args - Arguments to find a TrialNotification
     * @example
     * // Get one TrialNotification
     * const trialNotification = await prisma.trialNotification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrialNotificationFindUniqueArgs>(args: SelectSubset<T, TrialNotificationFindUniqueArgs<ExtArgs>>): Prisma__TrialNotificationClient<$Result.GetResult<Prisma.$TrialNotificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TrialNotification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TrialNotificationFindUniqueOrThrowArgs} args - Arguments to find a TrialNotification
     * @example
     * // Get one TrialNotification
     * const trialNotification = await prisma.trialNotification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrialNotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, TrialNotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrialNotificationClient<$Result.GetResult<Prisma.$TrialNotificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TrialNotification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialNotificationFindFirstArgs} args - Arguments to find a TrialNotification
     * @example
     * // Get one TrialNotification
     * const trialNotification = await prisma.trialNotification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrialNotificationFindFirstArgs>(args?: SelectSubset<T, TrialNotificationFindFirstArgs<ExtArgs>>): Prisma__TrialNotificationClient<$Result.GetResult<Prisma.$TrialNotificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TrialNotification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialNotificationFindFirstOrThrowArgs} args - Arguments to find a TrialNotification
     * @example
     * // Get one TrialNotification
     * const trialNotification = await prisma.trialNotification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrialNotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, TrialNotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrialNotificationClient<$Result.GetResult<Prisma.$TrialNotificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TrialNotifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialNotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrialNotifications
     * const trialNotifications = await prisma.trialNotification.findMany()
     * 
     * // Get first 10 TrialNotifications
     * const trialNotifications = await prisma.trialNotification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trialNotificationWithIdOnly = await prisma.trialNotification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrialNotificationFindManyArgs>(args?: SelectSubset<T, TrialNotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrialNotificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TrialNotification.
     * @param {TrialNotificationCreateArgs} args - Arguments to create a TrialNotification.
     * @example
     * // Create one TrialNotification
     * const TrialNotification = await prisma.trialNotification.create({
     *   data: {
     *     // ... data to create a TrialNotification
     *   }
     * })
     * 
     */
    create<T extends TrialNotificationCreateArgs>(args: SelectSubset<T, TrialNotificationCreateArgs<ExtArgs>>): Prisma__TrialNotificationClient<$Result.GetResult<Prisma.$TrialNotificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TrialNotifications.
     * @param {TrialNotificationCreateManyArgs} args - Arguments to create many TrialNotifications.
     * @example
     * // Create many TrialNotifications
     * const trialNotification = await prisma.trialNotification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrialNotificationCreateManyArgs>(args?: SelectSubset<T, TrialNotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrialNotifications and returns the data saved in the database.
     * @param {TrialNotificationCreateManyAndReturnArgs} args - Arguments to create many TrialNotifications.
     * @example
     * // Create many TrialNotifications
     * const trialNotification = await prisma.trialNotification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrialNotifications and only return the `id`
     * const trialNotificationWithIdOnly = await prisma.trialNotification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrialNotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, TrialNotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrialNotificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TrialNotification.
     * @param {TrialNotificationDeleteArgs} args - Arguments to delete one TrialNotification.
     * @example
     * // Delete one TrialNotification
     * const TrialNotification = await prisma.trialNotification.delete({
     *   where: {
     *     // ... filter to delete one TrialNotification
     *   }
     * })
     * 
     */
    delete<T extends TrialNotificationDeleteArgs>(args: SelectSubset<T, TrialNotificationDeleteArgs<ExtArgs>>): Prisma__TrialNotificationClient<$Result.GetResult<Prisma.$TrialNotificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TrialNotification.
     * @param {TrialNotificationUpdateArgs} args - Arguments to update one TrialNotification.
     * @example
     * // Update one TrialNotification
     * const trialNotification = await prisma.trialNotification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrialNotificationUpdateArgs>(args: SelectSubset<T, TrialNotificationUpdateArgs<ExtArgs>>): Prisma__TrialNotificationClient<$Result.GetResult<Prisma.$TrialNotificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TrialNotifications.
     * @param {TrialNotificationDeleteManyArgs} args - Arguments to filter TrialNotifications to delete.
     * @example
     * // Delete a few TrialNotifications
     * const { count } = await prisma.trialNotification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrialNotificationDeleteManyArgs>(args?: SelectSubset<T, TrialNotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrialNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialNotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrialNotifications
     * const trialNotification = await prisma.trialNotification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrialNotificationUpdateManyArgs>(args: SelectSubset<T, TrialNotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TrialNotification.
     * @param {TrialNotificationUpsertArgs} args - Arguments to update or create a TrialNotification.
     * @example
     * // Update or create a TrialNotification
     * const trialNotification = await prisma.trialNotification.upsert({
     *   create: {
     *     // ... data to create a TrialNotification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrialNotification we want to update
     *   }
     * })
     */
    upsert<T extends TrialNotificationUpsertArgs>(args: SelectSubset<T, TrialNotificationUpsertArgs<ExtArgs>>): Prisma__TrialNotificationClient<$Result.GetResult<Prisma.$TrialNotificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TrialNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialNotificationCountArgs} args - Arguments to filter TrialNotifications to count.
     * @example
     * // Count the number of TrialNotifications
     * const count = await prisma.trialNotification.count({
     *   where: {
     *     // ... the filter for the TrialNotifications we want to count
     *   }
     * })
    **/
    count<T extends TrialNotificationCountArgs>(
      args?: Subset<T, TrialNotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrialNotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrialNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialNotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TrialNotificationAggregateArgs>(args: Subset<T, TrialNotificationAggregateArgs>): Prisma.PrismaPromise<GetTrialNotificationAggregateType<T>>

    /**
     * Group by TrialNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrialNotificationGroupByArgs} args - Group by arguments.
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
      T extends TrialNotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrialNotificationGroupByArgs['orderBy'] }
        : { orderBy?: TrialNotificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TrialNotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrialNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrialNotification model
   */
  readonly fields: TrialNotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrialNotification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrialNotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the TrialNotification model
   */ 
  interface TrialNotificationFieldRefs {
    readonly id: FieldRef<"TrialNotification", 'String'>
    readonly recipientId: FieldRef<"TrialNotification", 'String'>
    readonly recipientType: FieldRef<"TrialNotification", 'RecipientType'>
    readonly type: FieldRef<"TrialNotification", 'NotificationType'>
    readonly title: FieldRef<"TrialNotification", 'String'>
    readonly message: FieldRef<"TrialNotification", 'String'>
    readonly trialId: FieldRef<"TrialNotification", 'String'>
    readonly enrollmentId: FieldRef<"TrialNotification", 'String'>
    readonly matchId: FieldRef<"TrialNotification", 'String'>
    readonly priority: FieldRef<"TrialNotification", 'NotificationPriority'>
    readonly isRead: FieldRef<"TrialNotification", 'Boolean'>
    readonly readAt: FieldRef<"TrialNotification", 'DateTime'>
    readonly sentAt: FieldRef<"TrialNotification", 'DateTime'>
    readonly deliveryMethod: FieldRef<"TrialNotification", 'DeliveryMethod'>
    readonly externalId: FieldRef<"TrialNotification", 'String'>
    readonly createdAt: FieldRef<"TrialNotification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrialNotification findUnique
   */
  export type TrialNotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialNotification
     */
    select?: TrialNotificationSelect<ExtArgs> | null
    /**
     * Filter, which TrialNotification to fetch.
     */
    where: TrialNotificationWhereUniqueInput
  }

  /**
   * TrialNotification findUniqueOrThrow
   */
  export type TrialNotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialNotification
     */
    select?: TrialNotificationSelect<ExtArgs> | null
    /**
     * Filter, which TrialNotification to fetch.
     */
    where: TrialNotificationWhereUniqueInput
  }

  /**
   * TrialNotification findFirst
   */
  export type TrialNotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialNotification
     */
    select?: TrialNotificationSelect<ExtArgs> | null
    /**
     * Filter, which TrialNotification to fetch.
     */
    where?: TrialNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrialNotifications to fetch.
     */
    orderBy?: TrialNotificationOrderByWithRelationInput | TrialNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrialNotifications.
     */
    cursor?: TrialNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrialNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrialNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrialNotifications.
     */
    distinct?: TrialNotificationScalarFieldEnum | TrialNotificationScalarFieldEnum[]
  }

  /**
   * TrialNotification findFirstOrThrow
   */
  export type TrialNotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialNotification
     */
    select?: TrialNotificationSelect<ExtArgs> | null
    /**
     * Filter, which TrialNotification to fetch.
     */
    where?: TrialNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrialNotifications to fetch.
     */
    orderBy?: TrialNotificationOrderByWithRelationInput | TrialNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrialNotifications.
     */
    cursor?: TrialNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrialNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrialNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrialNotifications.
     */
    distinct?: TrialNotificationScalarFieldEnum | TrialNotificationScalarFieldEnum[]
  }

  /**
   * TrialNotification findMany
   */
  export type TrialNotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialNotification
     */
    select?: TrialNotificationSelect<ExtArgs> | null
    /**
     * Filter, which TrialNotifications to fetch.
     */
    where?: TrialNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrialNotifications to fetch.
     */
    orderBy?: TrialNotificationOrderByWithRelationInput | TrialNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrialNotifications.
     */
    cursor?: TrialNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrialNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrialNotifications.
     */
    skip?: number
    distinct?: TrialNotificationScalarFieldEnum | TrialNotificationScalarFieldEnum[]
  }

  /**
   * TrialNotification create
   */
  export type TrialNotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialNotification
     */
    select?: TrialNotificationSelect<ExtArgs> | null
    /**
     * The data needed to create a TrialNotification.
     */
    data: XOR<TrialNotificationCreateInput, TrialNotificationUncheckedCreateInput>
  }

  /**
   * TrialNotification createMany
   */
  export type TrialNotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrialNotifications.
     */
    data: TrialNotificationCreateManyInput | TrialNotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrialNotification createManyAndReturn
   */
  export type TrialNotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialNotification
     */
    select?: TrialNotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TrialNotifications.
     */
    data: TrialNotificationCreateManyInput | TrialNotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrialNotification update
   */
  export type TrialNotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialNotification
     */
    select?: TrialNotificationSelect<ExtArgs> | null
    /**
     * The data needed to update a TrialNotification.
     */
    data: XOR<TrialNotificationUpdateInput, TrialNotificationUncheckedUpdateInput>
    /**
     * Choose, which TrialNotification to update.
     */
    where: TrialNotificationWhereUniqueInput
  }

  /**
   * TrialNotification updateMany
   */
  export type TrialNotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrialNotifications.
     */
    data: XOR<TrialNotificationUpdateManyMutationInput, TrialNotificationUncheckedUpdateManyInput>
    /**
     * Filter which TrialNotifications to update
     */
    where?: TrialNotificationWhereInput
  }

  /**
   * TrialNotification upsert
   */
  export type TrialNotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialNotification
     */
    select?: TrialNotificationSelect<ExtArgs> | null
    /**
     * The filter to search for the TrialNotification to update in case it exists.
     */
    where: TrialNotificationWhereUniqueInput
    /**
     * In case the TrialNotification found by the `where` argument doesn't exist, create a new TrialNotification with this data.
     */
    create: XOR<TrialNotificationCreateInput, TrialNotificationUncheckedCreateInput>
    /**
     * In case the TrialNotification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrialNotificationUpdateInput, TrialNotificationUncheckedUpdateInput>
  }

  /**
   * TrialNotification delete
   */
  export type TrialNotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialNotification
     */
    select?: TrialNotificationSelect<ExtArgs> | null
    /**
     * Filter which TrialNotification to delete.
     */
    where: TrialNotificationWhereUniqueInput
  }

  /**
   * TrialNotification deleteMany
   */
  export type TrialNotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrialNotifications to delete
     */
    where?: TrialNotificationWhereInput
  }

  /**
   * TrialNotification without action
   */
  export type TrialNotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrialNotification
     */
    select?: TrialNotificationSelect<ExtArgs> | null
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


  export const ClinicalTrialScalarFieldEnum: {
    id: 'id',
    nctId: 'nctId',
    title: 'title',
    officialTitle: 'officialTitle',
    briefSummary: 'briefSummary',
    detailedDescription: 'detailedDescription',
    status: 'status',
    phase: 'phase',
    studyType: 'studyType',
    primaryPurpose: 'primaryPurpose',
    interventionModel: 'interventionModel',
    masking: 'masking',
    allocation: 'allocation',
    enrollmentCount: 'enrollmentCount',
    enrollmentType: 'enrollmentType',
    startDate: 'startDate',
    completionDate: 'completionDate',
    primaryCompletionDate: 'primaryCompletionDate',
    lastUpdatedDate: 'lastUpdatedDate',
    sponsorName: 'sponsorName',
    sponsorType: 'sponsorType',
    leadSponsorClass: 'leadSponsorClass',
    collaborators: 'collaborators',
    conditions: 'conditions',
    interventions: 'interventions',
    keywords: 'keywords',
    meshTerms: 'meshTerms',
    primaryOutcomes: 'primaryOutcomes',
    secondaryOutcomes: 'secondaryOutcomes',
    eligibilityCriteria: 'eligibilityCriteria',
    eligibilityText: 'eligibilityText',
    healthyVolunteers: 'healthyVolunteers',
    minimumAge: 'minimumAge',
    maximumAge: 'maximumAge',
    gender: 'gender',
    contactName: 'contactName',
    contactPhone: 'contactPhone',
    contactEmail: 'contactEmail',
    overallOfficial: 'overallOfficial',
    locations: 'locations',
    fhirResearchStudy: 'fhirResearchStudy',
    lastSyncedAt: 'lastSyncedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClinicalTrialScalarFieldEnum = (typeof ClinicalTrialScalarFieldEnum)[keyof typeof ClinicalTrialScalarFieldEnum]


  export const TrialSiteScalarFieldEnum: {
    id: 'id',
    trialId: 'trialId',
    facilityName: 'facilityName',
    facilityId: 'facilityId',
    status: 'status',
    city: 'city',
    state: 'state',
    country: 'country',
    zipCode: 'zipCode',
    latitude: 'latitude',
    longitude: 'longitude',
    contactName: 'contactName',
    contactPhone: 'contactPhone',
    contactEmail: 'contactEmail',
    principalInvestigator: 'principalInvestigator',
    recruitmentStatus: 'recruitmentStatus',
    targetEnrollment: 'targetEnrollment',
    currentEnrollment: 'currentEnrollment',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TrialSiteScalarFieldEnum = (typeof TrialSiteScalarFieldEnum)[keyof typeof TrialSiteScalarFieldEnum]


  export const PatientMatchScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    trialId: 'trialId',
    matchScore: 'matchScore',
    eligibilityStatus: 'eligibilityStatus',
    matchedCriteria: 'matchedCriteria',
    unmatchedCriteria: 'unmatchedCriteria',
    uncertainCriteria: 'uncertainCriteria',
    matchDetails: 'matchDetails',
    distance: 'distance',
    nearestSiteId: 'nearestSiteId',
    reviewStatus: 'reviewStatus',
    reviewedBy: 'reviewedBy',
    reviewedAt: 'reviewedAt',
    reviewNotes: 'reviewNotes',
    patientNotified: 'patientNotified',
    notifiedAt: 'notifiedAt',
    isInterested: 'isInterested',
    interestExpressedAt: 'interestExpressedAt',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PatientMatchScalarFieldEnum = (typeof PatientMatchScalarFieldEnum)[keyof typeof PatientMatchScalarFieldEnum]


  export const EnrollmentScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    trialId: 'trialId',
    siteId: 'siteId',
    status: 'status',
    studySubjectId: 'studySubjectId',
    screeningDate: 'screeningDate',
    enrollmentDate: 'enrollmentDate',
    randomizationDate: 'randomizationDate',
    armAssignment: 'armAssignment',
    withdrawalDate: 'withdrawalDate',
    withdrawalReason: 'withdrawalReason',
    completionDate: 'completionDate',
    primaryInvestigator: 'primaryInvestigator',
    studyCoordinator: 'studyCoordinator',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EnrollmentScalarFieldEnum = (typeof EnrollmentScalarFieldEnum)[keyof typeof EnrollmentScalarFieldEnum]


  export const EnrollmentStatusHistoryScalarFieldEnum: {
    id: 'id',
    enrollmentId: 'enrollmentId',
    fromStatus: 'fromStatus',
    toStatus: 'toStatus',
    reason: 'reason',
    changedBy: 'changedBy',
    changedAt: 'changedAt'
  };

  export type EnrollmentStatusHistoryScalarFieldEnum = (typeof EnrollmentStatusHistoryScalarFieldEnum)[keyof typeof EnrollmentStatusHistoryScalarFieldEnum]


  export const ConsentRecordScalarFieldEnum: {
    id: 'id',
    enrollmentId: 'enrollmentId',
    consentType: 'consentType',
    consentFormId: 'consentFormId',
    consentFormVersion: 'consentFormVersion',
    signedAt: 'signedAt',
    signedBy: 'signedBy',
    witnessName: 'witnessName',
    witnessSignedAt: 'witnessSignedAt',
    coordinatorName: 'coordinatorName',
    coordinatorId: 'coordinatorId',
    documentUrl: 'documentUrl',
    isActive: 'isActive',
    revokedAt: 'revokedAt',
    revokedReason: 'revokedReason',
    expiresAt: 'expiresAt',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConsentRecordScalarFieldEnum = (typeof ConsentRecordScalarFieldEnum)[keyof typeof ConsentRecordScalarFieldEnum]


  export const TrialVisitScalarFieldEnum: {
    id: 'id',
    enrollmentId: 'enrollmentId',
    visitNumber: 'visitNumber',
    visitName: 'visitName',
    visitType: 'visitType',
    scheduledDate: 'scheduledDate',
    actualDate: 'actualDate',
    status: 'status',
    completedBy: 'completedBy',
    notes: 'notes',
    protocolDeviations: 'protocolDeviations',
    missedReason: 'missedReason',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TrialVisitScalarFieldEnum = (typeof TrialVisitScalarFieldEnum)[keyof typeof TrialVisitScalarFieldEnum]


  export const InvestigatorScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    phone: 'phone',
    specialty: 'specialty',
    institution: 'institution',
    npiNumber: 'npiNumber',
    licenseNumber: 'licenseNumber',
    licenseState: 'licenseState',
    cvUrl: 'cvUrl',
    isActive: 'isActive',
    roles: 'roles',
    certifications: 'certifications',
    trainingRecords: 'trainingRecords',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InvestigatorScalarFieldEnum = (typeof InvestigatorScalarFieldEnum)[keyof typeof InvestigatorScalarFieldEnum]


  export const InvestigatorSiteAssignmentScalarFieldEnum: {
    id: 'id',
    investigatorId: 'investigatorId',
    siteId: 'siteId',
    trialId: 'trialId',
    role: 'role',
    startDate: 'startDate',
    endDate: 'endDate',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InvestigatorSiteAssignmentScalarFieldEnum = (typeof InvestigatorSiteAssignmentScalarFieldEnum)[keyof typeof InvestigatorSiteAssignmentScalarFieldEnum]


  export const TrialNotificationScalarFieldEnum: {
    id: 'id',
    recipientId: 'recipientId',
    recipientType: 'recipientType',
    type: 'type',
    title: 'title',
    message: 'message',
    trialId: 'trialId',
    enrollmentId: 'enrollmentId',
    matchId: 'matchId',
    priority: 'priority',
    isRead: 'isRead',
    readAt: 'readAt',
    sentAt: 'sentAt',
    deliveryMethod: 'deliveryMethod',
    externalId: 'externalId',
    createdAt: 'createdAt'
  };

  export type TrialNotificationScalarFieldEnum = (typeof TrialNotificationScalarFieldEnum)[keyof typeof TrialNotificationScalarFieldEnum]


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
   * Reference to a field of type 'TrialStatus'
   */
  export type EnumTrialStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrialStatus'>
    


  /**
   * Reference to a field of type 'TrialStatus[]'
   */
  export type ListEnumTrialStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrialStatus[]'>
    


  /**
   * Reference to a field of type 'TrialPhase'
   */
  export type EnumTrialPhaseFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrialPhase'>
    


  /**
   * Reference to a field of type 'TrialPhase[]'
   */
  export type ListEnumTrialPhaseFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrialPhase[]'>
    


  /**
   * Reference to a field of type 'StudyType'
   */
  export type EnumStudyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StudyType'>
    


  /**
   * Reference to a field of type 'StudyType[]'
   */
  export type ListEnumStudyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StudyType[]'>
    


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
   * Reference to a field of type 'Json[]'
   */
  export type ListJsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'SiteStatus'
   */
  export type EnumSiteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SiteStatus'>
    


  /**
   * Reference to a field of type 'SiteStatus[]'
   */
  export type ListEnumSiteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SiteStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'EligibilityStatus'
   */
  export type EnumEligibilityStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EligibilityStatus'>
    


  /**
   * Reference to a field of type 'EligibilityStatus[]'
   */
  export type ListEnumEligibilityStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EligibilityStatus[]'>
    


  /**
   * Reference to a field of type 'ReviewStatus'
   */
  export type EnumReviewStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReviewStatus'>
    


  /**
   * Reference to a field of type 'ReviewStatus[]'
   */
  export type ListEnumReviewStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReviewStatus[]'>
    


  /**
   * Reference to a field of type 'EnrollmentStatus'
   */
  export type EnumEnrollmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EnrollmentStatus'>
    


  /**
   * Reference to a field of type 'EnrollmentStatus[]'
   */
  export type ListEnumEnrollmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EnrollmentStatus[]'>
    


  /**
   * Reference to a field of type 'ConsentType'
   */
  export type EnumConsentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConsentType'>
    


  /**
   * Reference to a field of type 'ConsentType[]'
   */
  export type ListEnumConsentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConsentType[]'>
    


  /**
   * Reference to a field of type 'VisitType'
   */
  export type EnumVisitTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VisitType'>
    


  /**
   * Reference to a field of type 'VisitType[]'
   */
  export type ListEnumVisitTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VisitType[]'>
    


  /**
   * Reference to a field of type 'VisitStatus'
   */
  export type EnumVisitStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VisitStatus'>
    


  /**
   * Reference to a field of type 'VisitStatus[]'
   */
  export type ListEnumVisitStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VisitStatus[]'>
    


  /**
   * Reference to a field of type 'InvestigatorRole[]'
   */
  export type ListEnumInvestigatorRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvestigatorRole[]'>
    


  /**
   * Reference to a field of type 'InvestigatorRole'
   */
  export type EnumInvestigatorRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvestigatorRole'>
    


  /**
   * Reference to a field of type 'RecipientType'
   */
  export type EnumRecipientTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RecipientType'>
    


  /**
   * Reference to a field of type 'RecipientType[]'
   */
  export type ListEnumRecipientTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RecipientType[]'>
    


  /**
   * Reference to a field of type 'NotificationType'
   */
  export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>
    


  /**
   * Reference to a field of type 'NotificationType[]'
   */
  export type ListEnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType[]'>
    


  /**
   * Reference to a field of type 'NotificationPriority'
   */
  export type EnumNotificationPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationPriority'>
    


  /**
   * Reference to a field of type 'NotificationPriority[]'
   */
  export type ListEnumNotificationPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationPriority[]'>
    


  /**
   * Reference to a field of type 'DeliveryMethod'
   */
  export type EnumDeliveryMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeliveryMethod'>
    


  /**
   * Reference to a field of type 'DeliveryMethod[]'
   */
  export type ListEnumDeliveryMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeliveryMethod[]'>
    
  /**
   * Deep Input Types
   */


  export type ClinicalTrialWhereInput = {
    AND?: ClinicalTrialWhereInput | ClinicalTrialWhereInput[]
    OR?: ClinicalTrialWhereInput[]
    NOT?: ClinicalTrialWhereInput | ClinicalTrialWhereInput[]
    id?: StringFilter<"ClinicalTrial"> | string
    nctId?: StringFilter<"ClinicalTrial"> | string
    title?: StringFilter<"ClinicalTrial"> | string
    officialTitle?: StringNullableFilter<"ClinicalTrial"> | string | null
    briefSummary?: StringNullableFilter<"ClinicalTrial"> | string | null
    detailedDescription?: StringNullableFilter<"ClinicalTrial"> | string | null
    status?: EnumTrialStatusFilter<"ClinicalTrial"> | $Enums.TrialStatus
    phase?: EnumTrialPhaseNullableFilter<"ClinicalTrial"> | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeFilter<"ClinicalTrial"> | $Enums.StudyType
    primaryPurpose?: StringNullableFilter<"ClinicalTrial"> | string | null
    interventionModel?: StringNullableFilter<"ClinicalTrial"> | string | null
    masking?: StringNullableFilter<"ClinicalTrial"> | string | null
    allocation?: StringNullableFilter<"ClinicalTrial"> | string | null
    enrollmentCount?: IntNullableFilter<"ClinicalTrial"> | number | null
    enrollmentType?: StringNullableFilter<"ClinicalTrial"> | string | null
    startDate?: DateTimeNullableFilter<"ClinicalTrial"> | Date | string | null
    completionDate?: DateTimeNullableFilter<"ClinicalTrial"> | Date | string | null
    primaryCompletionDate?: DateTimeNullableFilter<"ClinicalTrial"> | Date | string | null
    lastUpdatedDate?: DateTimeNullableFilter<"ClinicalTrial"> | Date | string | null
    sponsorName?: StringNullableFilter<"ClinicalTrial"> | string | null
    sponsorType?: StringNullableFilter<"ClinicalTrial"> | string | null
    leadSponsorClass?: StringNullableFilter<"ClinicalTrial"> | string | null
    collaborators?: StringNullableListFilter<"ClinicalTrial">
    conditions?: StringNullableListFilter<"ClinicalTrial">
    interventions?: JsonNullableListFilter<"ClinicalTrial">
    keywords?: StringNullableListFilter<"ClinicalTrial">
    meshTerms?: StringNullableListFilter<"ClinicalTrial">
    primaryOutcomes?: JsonNullableListFilter<"ClinicalTrial">
    secondaryOutcomes?: JsonNullableListFilter<"ClinicalTrial">
    eligibilityCriteria?: JsonNullableFilter<"ClinicalTrial">
    eligibilityText?: StringNullableFilter<"ClinicalTrial"> | string | null
    healthyVolunteers?: BoolFilter<"ClinicalTrial"> | boolean
    minimumAge?: IntNullableFilter<"ClinicalTrial"> | number | null
    maximumAge?: IntNullableFilter<"ClinicalTrial"> | number | null
    gender?: StringNullableFilter<"ClinicalTrial"> | string | null
    contactName?: StringNullableFilter<"ClinicalTrial"> | string | null
    contactPhone?: StringNullableFilter<"ClinicalTrial"> | string | null
    contactEmail?: StringNullableFilter<"ClinicalTrial"> | string | null
    overallOfficial?: JsonNullableFilter<"ClinicalTrial">
    locations?: JsonNullableListFilter<"ClinicalTrial">
    fhirResearchStudy?: JsonNullableFilter<"ClinicalTrial">
    lastSyncedAt?: DateTimeNullableFilter<"ClinicalTrial"> | Date | string | null
    createdAt?: DateTimeFilter<"ClinicalTrial"> | Date | string
    updatedAt?: DateTimeFilter<"ClinicalTrial"> | Date | string
    sites?: TrialSiteListRelationFilter
    patientMatches?: PatientMatchListRelationFilter
    enrollments?: EnrollmentListRelationFilter
  }

  export type ClinicalTrialOrderByWithRelationInput = {
    id?: SortOrder
    nctId?: SortOrder
    title?: SortOrder
    officialTitle?: SortOrderInput | SortOrder
    briefSummary?: SortOrderInput | SortOrder
    detailedDescription?: SortOrderInput | SortOrder
    status?: SortOrder
    phase?: SortOrderInput | SortOrder
    studyType?: SortOrder
    primaryPurpose?: SortOrderInput | SortOrder
    interventionModel?: SortOrderInput | SortOrder
    masking?: SortOrderInput | SortOrder
    allocation?: SortOrderInput | SortOrder
    enrollmentCount?: SortOrderInput | SortOrder
    enrollmentType?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    completionDate?: SortOrderInput | SortOrder
    primaryCompletionDate?: SortOrderInput | SortOrder
    lastUpdatedDate?: SortOrderInput | SortOrder
    sponsorName?: SortOrderInput | SortOrder
    sponsorType?: SortOrderInput | SortOrder
    leadSponsorClass?: SortOrderInput | SortOrder
    collaborators?: SortOrder
    conditions?: SortOrder
    interventions?: SortOrder
    keywords?: SortOrder
    meshTerms?: SortOrder
    primaryOutcomes?: SortOrder
    secondaryOutcomes?: SortOrder
    eligibilityCriteria?: SortOrderInput | SortOrder
    eligibilityText?: SortOrderInput | SortOrder
    healthyVolunteers?: SortOrder
    minimumAge?: SortOrderInput | SortOrder
    maximumAge?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    contactName?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    overallOfficial?: SortOrderInput | SortOrder
    locations?: SortOrder
    fhirResearchStudy?: SortOrderInput | SortOrder
    lastSyncedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sites?: TrialSiteOrderByRelationAggregateInput
    patientMatches?: PatientMatchOrderByRelationAggregateInput
    enrollments?: EnrollmentOrderByRelationAggregateInput
  }

  export type ClinicalTrialWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    nctId?: string
    AND?: ClinicalTrialWhereInput | ClinicalTrialWhereInput[]
    OR?: ClinicalTrialWhereInput[]
    NOT?: ClinicalTrialWhereInput | ClinicalTrialWhereInput[]
    title?: StringFilter<"ClinicalTrial"> | string
    officialTitle?: StringNullableFilter<"ClinicalTrial"> | string | null
    briefSummary?: StringNullableFilter<"ClinicalTrial"> | string | null
    detailedDescription?: StringNullableFilter<"ClinicalTrial"> | string | null
    status?: EnumTrialStatusFilter<"ClinicalTrial"> | $Enums.TrialStatus
    phase?: EnumTrialPhaseNullableFilter<"ClinicalTrial"> | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeFilter<"ClinicalTrial"> | $Enums.StudyType
    primaryPurpose?: StringNullableFilter<"ClinicalTrial"> | string | null
    interventionModel?: StringNullableFilter<"ClinicalTrial"> | string | null
    masking?: StringNullableFilter<"ClinicalTrial"> | string | null
    allocation?: StringNullableFilter<"ClinicalTrial"> | string | null
    enrollmentCount?: IntNullableFilter<"ClinicalTrial"> | number | null
    enrollmentType?: StringNullableFilter<"ClinicalTrial"> | string | null
    startDate?: DateTimeNullableFilter<"ClinicalTrial"> | Date | string | null
    completionDate?: DateTimeNullableFilter<"ClinicalTrial"> | Date | string | null
    primaryCompletionDate?: DateTimeNullableFilter<"ClinicalTrial"> | Date | string | null
    lastUpdatedDate?: DateTimeNullableFilter<"ClinicalTrial"> | Date | string | null
    sponsorName?: StringNullableFilter<"ClinicalTrial"> | string | null
    sponsorType?: StringNullableFilter<"ClinicalTrial"> | string | null
    leadSponsorClass?: StringNullableFilter<"ClinicalTrial"> | string | null
    collaborators?: StringNullableListFilter<"ClinicalTrial">
    conditions?: StringNullableListFilter<"ClinicalTrial">
    interventions?: JsonNullableListFilter<"ClinicalTrial">
    keywords?: StringNullableListFilter<"ClinicalTrial">
    meshTerms?: StringNullableListFilter<"ClinicalTrial">
    primaryOutcomes?: JsonNullableListFilter<"ClinicalTrial">
    secondaryOutcomes?: JsonNullableListFilter<"ClinicalTrial">
    eligibilityCriteria?: JsonNullableFilter<"ClinicalTrial">
    eligibilityText?: StringNullableFilter<"ClinicalTrial"> | string | null
    healthyVolunteers?: BoolFilter<"ClinicalTrial"> | boolean
    minimumAge?: IntNullableFilter<"ClinicalTrial"> | number | null
    maximumAge?: IntNullableFilter<"ClinicalTrial"> | number | null
    gender?: StringNullableFilter<"ClinicalTrial"> | string | null
    contactName?: StringNullableFilter<"ClinicalTrial"> | string | null
    contactPhone?: StringNullableFilter<"ClinicalTrial"> | string | null
    contactEmail?: StringNullableFilter<"ClinicalTrial"> | string | null
    overallOfficial?: JsonNullableFilter<"ClinicalTrial">
    locations?: JsonNullableListFilter<"ClinicalTrial">
    fhirResearchStudy?: JsonNullableFilter<"ClinicalTrial">
    lastSyncedAt?: DateTimeNullableFilter<"ClinicalTrial"> | Date | string | null
    createdAt?: DateTimeFilter<"ClinicalTrial"> | Date | string
    updatedAt?: DateTimeFilter<"ClinicalTrial"> | Date | string
    sites?: TrialSiteListRelationFilter
    patientMatches?: PatientMatchListRelationFilter
    enrollments?: EnrollmentListRelationFilter
  }, "id" | "nctId">

  export type ClinicalTrialOrderByWithAggregationInput = {
    id?: SortOrder
    nctId?: SortOrder
    title?: SortOrder
    officialTitle?: SortOrderInput | SortOrder
    briefSummary?: SortOrderInput | SortOrder
    detailedDescription?: SortOrderInput | SortOrder
    status?: SortOrder
    phase?: SortOrderInput | SortOrder
    studyType?: SortOrder
    primaryPurpose?: SortOrderInput | SortOrder
    interventionModel?: SortOrderInput | SortOrder
    masking?: SortOrderInput | SortOrder
    allocation?: SortOrderInput | SortOrder
    enrollmentCount?: SortOrderInput | SortOrder
    enrollmentType?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    completionDate?: SortOrderInput | SortOrder
    primaryCompletionDate?: SortOrderInput | SortOrder
    lastUpdatedDate?: SortOrderInput | SortOrder
    sponsorName?: SortOrderInput | SortOrder
    sponsorType?: SortOrderInput | SortOrder
    leadSponsorClass?: SortOrderInput | SortOrder
    collaborators?: SortOrder
    conditions?: SortOrder
    interventions?: SortOrder
    keywords?: SortOrder
    meshTerms?: SortOrder
    primaryOutcomes?: SortOrder
    secondaryOutcomes?: SortOrder
    eligibilityCriteria?: SortOrderInput | SortOrder
    eligibilityText?: SortOrderInput | SortOrder
    healthyVolunteers?: SortOrder
    minimumAge?: SortOrderInput | SortOrder
    maximumAge?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    contactName?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    overallOfficial?: SortOrderInput | SortOrder
    locations?: SortOrder
    fhirResearchStudy?: SortOrderInput | SortOrder
    lastSyncedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClinicalTrialCountOrderByAggregateInput
    _avg?: ClinicalTrialAvgOrderByAggregateInput
    _max?: ClinicalTrialMaxOrderByAggregateInput
    _min?: ClinicalTrialMinOrderByAggregateInput
    _sum?: ClinicalTrialSumOrderByAggregateInput
  }

  export type ClinicalTrialScalarWhereWithAggregatesInput = {
    AND?: ClinicalTrialScalarWhereWithAggregatesInput | ClinicalTrialScalarWhereWithAggregatesInput[]
    OR?: ClinicalTrialScalarWhereWithAggregatesInput[]
    NOT?: ClinicalTrialScalarWhereWithAggregatesInput | ClinicalTrialScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClinicalTrial"> | string
    nctId?: StringWithAggregatesFilter<"ClinicalTrial"> | string
    title?: StringWithAggregatesFilter<"ClinicalTrial"> | string
    officialTitle?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    briefSummary?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    detailedDescription?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    status?: EnumTrialStatusWithAggregatesFilter<"ClinicalTrial"> | $Enums.TrialStatus
    phase?: EnumTrialPhaseNullableWithAggregatesFilter<"ClinicalTrial"> | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeWithAggregatesFilter<"ClinicalTrial"> | $Enums.StudyType
    primaryPurpose?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    interventionModel?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    masking?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    allocation?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    enrollmentCount?: IntNullableWithAggregatesFilter<"ClinicalTrial"> | number | null
    enrollmentType?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    startDate?: DateTimeNullableWithAggregatesFilter<"ClinicalTrial"> | Date | string | null
    completionDate?: DateTimeNullableWithAggregatesFilter<"ClinicalTrial"> | Date | string | null
    primaryCompletionDate?: DateTimeNullableWithAggregatesFilter<"ClinicalTrial"> | Date | string | null
    lastUpdatedDate?: DateTimeNullableWithAggregatesFilter<"ClinicalTrial"> | Date | string | null
    sponsorName?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    sponsorType?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    leadSponsorClass?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    collaborators?: StringNullableListFilter<"ClinicalTrial">
    conditions?: StringNullableListFilter<"ClinicalTrial">
    interventions?: JsonNullableListFilter<"ClinicalTrial">
    keywords?: StringNullableListFilter<"ClinicalTrial">
    meshTerms?: StringNullableListFilter<"ClinicalTrial">
    primaryOutcomes?: JsonNullableListFilter<"ClinicalTrial">
    secondaryOutcomes?: JsonNullableListFilter<"ClinicalTrial">
    eligibilityCriteria?: JsonNullableWithAggregatesFilter<"ClinicalTrial">
    eligibilityText?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    healthyVolunteers?: BoolWithAggregatesFilter<"ClinicalTrial"> | boolean
    minimumAge?: IntNullableWithAggregatesFilter<"ClinicalTrial"> | number | null
    maximumAge?: IntNullableWithAggregatesFilter<"ClinicalTrial"> | number | null
    gender?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    contactName?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    contactPhone?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    contactEmail?: StringNullableWithAggregatesFilter<"ClinicalTrial"> | string | null
    overallOfficial?: JsonNullableWithAggregatesFilter<"ClinicalTrial">
    locations?: JsonNullableListFilter<"ClinicalTrial">
    fhirResearchStudy?: JsonNullableWithAggregatesFilter<"ClinicalTrial">
    lastSyncedAt?: DateTimeNullableWithAggregatesFilter<"ClinicalTrial"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ClinicalTrial"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ClinicalTrial"> | Date | string
  }

  export type TrialSiteWhereInput = {
    AND?: TrialSiteWhereInput | TrialSiteWhereInput[]
    OR?: TrialSiteWhereInput[]
    NOT?: TrialSiteWhereInput | TrialSiteWhereInput[]
    id?: StringFilter<"TrialSite"> | string
    trialId?: StringFilter<"TrialSite"> | string
    facilityName?: StringFilter<"TrialSite"> | string
    facilityId?: StringNullableFilter<"TrialSite"> | string | null
    status?: EnumSiteStatusFilter<"TrialSite"> | $Enums.SiteStatus
    city?: StringFilter<"TrialSite"> | string
    state?: StringNullableFilter<"TrialSite"> | string | null
    country?: StringFilter<"TrialSite"> | string
    zipCode?: StringNullableFilter<"TrialSite"> | string | null
    latitude?: FloatNullableFilter<"TrialSite"> | number | null
    longitude?: FloatNullableFilter<"TrialSite"> | number | null
    contactName?: StringNullableFilter<"TrialSite"> | string | null
    contactPhone?: StringNullableFilter<"TrialSite"> | string | null
    contactEmail?: StringNullableFilter<"TrialSite"> | string | null
    principalInvestigator?: StringNullableFilter<"TrialSite"> | string | null
    recruitmentStatus?: StringNullableFilter<"TrialSite"> | string | null
    targetEnrollment?: IntNullableFilter<"TrialSite"> | number | null
    currentEnrollment?: IntFilter<"TrialSite"> | number
    isActive?: BoolFilter<"TrialSite"> | boolean
    createdAt?: DateTimeFilter<"TrialSite"> | Date | string
    updatedAt?: DateTimeFilter<"TrialSite"> | Date | string
    trial?: XOR<ClinicalTrialRelationFilter, ClinicalTrialWhereInput>
    enrollments?: EnrollmentListRelationFilter
  }

  export type TrialSiteOrderByWithRelationInput = {
    id?: SortOrder
    trialId?: SortOrder
    facilityName?: SortOrder
    facilityId?: SortOrderInput | SortOrder
    status?: SortOrder
    city?: SortOrder
    state?: SortOrderInput | SortOrder
    country?: SortOrder
    zipCode?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    contactName?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    principalInvestigator?: SortOrderInput | SortOrder
    recruitmentStatus?: SortOrderInput | SortOrder
    targetEnrollment?: SortOrderInput | SortOrder
    currentEnrollment?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    trial?: ClinicalTrialOrderByWithRelationInput
    enrollments?: EnrollmentOrderByRelationAggregateInput
  }

  export type TrialSiteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    trialId_facilityName_city?: TrialSiteTrialIdFacilityNameCityCompoundUniqueInput
    AND?: TrialSiteWhereInput | TrialSiteWhereInput[]
    OR?: TrialSiteWhereInput[]
    NOT?: TrialSiteWhereInput | TrialSiteWhereInput[]
    trialId?: StringFilter<"TrialSite"> | string
    facilityName?: StringFilter<"TrialSite"> | string
    facilityId?: StringNullableFilter<"TrialSite"> | string | null
    status?: EnumSiteStatusFilter<"TrialSite"> | $Enums.SiteStatus
    city?: StringFilter<"TrialSite"> | string
    state?: StringNullableFilter<"TrialSite"> | string | null
    country?: StringFilter<"TrialSite"> | string
    zipCode?: StringNullableFilter<"TrialSite"> | string | null
    latitude?: FloatNullableFilter<"TrialSite"> | number | null
    longitude?: FloatNullableFilter<"TrialSite"> | number | null
    contactName?: StringNullableFilter<"TrialSite"> | string | null
    contactPhone?: StringNullableFilter<"TrialSite"> | string | null
    contactEmail?: StringNullableFilter<"TrialSite"> | string | null
    principalInvestigator?: StringNullableFilter<"TrialSite"> | string | null
    recruitmentStatus?: StringNullableFilter<"TrialSite"> | string | null
    targetEnrollment?: IntNullableFilter<"TrialSite"> | number | null
    currentEnrollment?: IntFilter<"TrialSite"> | number
    isActive?: BoolFilter<"TrialSite"> | boolean
    createdAt?: DateTimeFilter<"TrialSite"> | Date | string
    updatedAt?: DateTimeFilter<"TrialSite"> | Date | string
    trial?: XOR<ClinicalTrialRelationFilter, ClinicalTrialWhereInput>
    enrollments?: EnrollmentListRelationFilter
  }, "id" | "trialId_facilityName_city">

  export type TrialSiteOrderByWithAggregationInput = {
    id?: SortOrder
    trialId?: SortOrder
    facilityName?: SortOrder
    facilityId?: SortOrderInput | SortOrder
    status?: SortOrder
    city?: SortOrder
    state?: SortOrderInput | SortOrder
    country?: SortOrder
    zipCode?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    contactName?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    principalInvestigator?: SortOrderInput | SortOrder
    recruitmentStatus?: SortOrderInput | SortOrder
    targetEnrollment?: SortOrderInput | SortOrder
    currentEnrollment?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TrialSiteCountOrderByAggregateInput
    _avg?: TrialSiteAvgOrderByAggregateInput
    _max?: TrialSiteMaxOrderByAggregateInput
    _min?: TrialSiteMinOrderByAggregateInput
    _sum?: TrialSiteSumOrderByAggregateInput
  }

  export type TrialSiteScalarWhereWithAggregatesInput = {
    AND?: TrialSiteScalarWhereWithAggregatesInput | TrialSiteScalarWhereWithAggregatesInput[]
    OR?: TrialSiteScalarWhereWithAggregatesInput[]
    NOT?: TrialSiteScalarWhereWithAggregatesInput | TrialSiteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrialSite"> | string
    trialId?: StringWithAggregatesFilter<"TrialSite"> | string
    facilityName?: StringWithAggregatesFilter<"TrialSite"> | string
    facilityId?: StringNullableWithAggregatesFilter<"TrialSite"> | string | null
    status?: EnumSiteStatusWithAggregatesFilter<"TrialSite"> | $Enums.SiteStatus
    city?: StringWithAggregatesFilter<"TrialSite"> | string
    state?: StringNullableWithAggregatesFilter<"TrialSite"> | string | null
    country?: StringWithAggregatesFilter<"TrialSite"> | string
    zipCode?: StringNullableWithAggregatesFilter<"TrialSite"> | string | null
    latitude?: FloatNullableWithAggregatesFilter<"TrialSite"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"TrialSite"> | number | null
    contactName?: StringNullableWithAggregatesFilter<"TrialSite"> | string | null
    contactPhone?: StringNullableWithAggregatesFilter<"TrialSite"> | string | null
    contactEmail?: StringNullableWithAggregatesFilter<"TrialSite"> | string | null
    principalInvestigator?: StringNullableWithAggregatesFilter<"TrialSite"> | string | null
    recruitmentStatus?: StringNullableWithAggregatesFilter<"TrialSite"> | string | null
    targetEnrollment?: IntNullableWithAggregatesFilter<"TrialSite"> | number | null
    currentEnrollment?: IntWithAggregatesFilter<"TrialSite"> | number
    isActive?: BoolWithAggregatesFilter<"TrialSite"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"TrialSite"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TrialSite"> | Date | string
  }

  export type PatientMatchWhereInput = {
    AND?: PatientMatchWhereInput | PatientMatchWhereInput[]
    OR?: PatientMatchWhereInput[]
    NOT?: PatientMatchWhereInput | PatientMatchWhereInput[]
    id?: StringFilter<"PatientMatch"> | string
    patientId?: StringFilter<"PatientMatch"> | string
    trialId?: StringFilter<"PatientMatch"> | string
    matchScore?: FloatFilter<"PatientMatch"> | number
    eligibilityStatus?: EnumEligibilityStatusFilter<"PatientMatch"> | $Enums.EligibilityStatus
    matchedCriteria?: JsonFilter<"PatientMatch">
    unmatchedCriteria?: JsonFilter<"PatientMatch">
    uncertainCriteria?: JsonNullableFilter<"PatientMatch">
    matchDetails?: JsonNullableFilter<"PatientMatch">
    distance?: FloatNullableFilter<"PatientMatch"> | number | null
    nearestSiteId?: StringNullableFilter<"PatientMatch"> | string | null
    reviewStatus?: EnumReviewStatusFilter<"PatientMatch"> | $Enums.ReviewStatus
    reviewedBy?: StringNullableFilter<"PatientMatch"> | string | null
    reviewedAt?: DateTimeNullableFilter<"PatientMatch"> | Date | string | null
    reviewNotes?: StringNullableFilter<"PatientMatch"> | string | null
    patientNotified?: BoolFilter<"PatientMatch"> | boolean
    notifiedAt?: DateTimeNullableFilter<"PatientMatch"> | Date | string | null
    isInterested?: BoolNullableFilter<"PatientMatch"> | boolean | null
    interestExpressedAt?: DateTimeNullableFilter<"PatientMatch"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"PatientMatch"> | Date | string | null
    createdAt?: DateTimeFilter<"PatientMatch"> | Date | string
    updatedAt?: DateTimeFilter<"PatientMatch"> | Date | string
    trial?: XOR<ClinicalTrialRelationFilter, ClinicalTrialWhereInput>
  }

  export type PatientMatchOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    trialId?: SortOrder
    matchScore?: SortOrder
    eligibilityStatus?: SortOrder
    matchedCriteria?: SortOrder
    unmatchedCriteria?: SortOrder
    uncertainCriteria?: SortOrderInput | SortOrder
    matchDetails?: SortOrderInput | SortOrder
    distance?: SortOrderInput | SortOrder
    nearestSiteId?: SortOrderInput | SortOrder
    reviewStatus?: SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewNotes?: SortOrderInput | SortOrder
    patientNotified?: SortOrder
    notifiedAt?: SortOrderInput | SortOrder
    isInterested?: SortOrderInput | SortOrder
    interestExpressedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    trial?: ClinicalTrialOrderByWithRelationInput
  }

  export type PatientMatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    patientId_trialId?: PatientMatchPatientIdTrialIdCompoundUniqueInput
    AND?: PatientMatchWhereInput | PatientMatchWhereInput[]
    OR?: PatientMatchWhereInput[]
    NOT?: PatientMatchWhereInput | PatientMatchWhereInput[]
    patientId?: StringFilter<"PatientMatch"> | string
    trialId?: StringFilter<"PatientMatch"> | string
    matchScore?: FloatFilter<"PatientMatch"> | number
    eligibilityStatus?: EnumEligibilityStatusFilter<"PatientMatch"> | $Enums.EligibilityStatus
    matchedCriteria?: JsonFilter<"PatientMatch">
    unmatchedCriteria?: JsonFilter<"PatientMatch">
    uncertainCriteria?: JsonNullableFilter<"PatientMatch">
    matchDetails?: JsonNullableFilter<"PatientMatch">
    distance?: FloatNullableFilter<"PatientMatch"> | number | null
    nearestSiteId?: StringNullableFilter<"PatientMatch"> | string | null
    reviewStatus?: EnumReviewStatusFilter<"PatientMatch"> | $Enums.ReviewStatus
    reviewedBy?: StringNullableFilter<"PatientMatch"> | string | null
    reviewedAt?: DateTimeNullableFilter<"PatientMatch"> | Date | string | null
    reviewNotes?: StringNullableFilter<"PatientMatch"> | string | null
    patientNotified?: BoolFilter<"PatientMatch"> | boolean
    notifiedAt?: DateTimeNullableFilter<"PatientMatch"> | Date | string | null
    isInterested?: BoolNullableFilter<"PatientMatch"> | boolean | null
    interestExpressedAt?: DateTimeNullableFilter<"PatientMatch"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"PatientMatch"> | Date | string | null
    createdAt?: DateTimeFilter<"PatientMatch"> | Date | string
    updatedAt?: DateTimeFilter<"PatientMatch"> | Date | string
    trial?: XOR<ClinicalTrialRelationFilter, ClinicalTrialWhereInput>
  }, "id" | "patientId_trialId">

  export type PatientMatchOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    trialId?: SortOrder
    matchScore?: SortOrder
    eligibilityStatus?: SortOrder
    matchedCriteria?: SortOrder
    unmatchedCriteria?: SortOrder
    uncertainCriteria?: SortOrderInput | SortOrder
    matchDetails?: SortOrderInput | SortOrder
    distance?: SortOrderInput | SortOrder
    nearestSiteId?: SortOrderInput | SortOrder
    reviewStatus?: SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewNotes?: SortOrderInput | SortOrder
    patientNotified?: SortOrder
    notifiedAt?: SortOrderInput | SortOrder
    isInterested?: SortOrderInput | SortOrder
    interestExpressedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PatientMatchCountOrderByAggregateInput
    _avg?: PatientMatchAvgOrderByAggregateInput
    _max?: PatientMatchMaxOrderByAggregateInput
    _min?: PatientMatchMinOrderByAggregateInput
    _sum?: PatientMatchSumOrderByAggregateInput
  }

  export type PatientMatchScalarWhereWithAggregatesInput = {
    AND?: PatientMatchScalarWhereWithAggregatesInput | PatientMatchScalarWhereWithAggregatesInput[]
    OR?: PatientMatchScalarWhereWithAggregatesInput[]
    NOT?: PatientMatchScalarWhereWithAggregatesInput | PatientMatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PatientMatch"> | string
    patientId?: StringWithAggregatesFilter<"PatientMatch"> | string
    trialId?: StringWithAggregatesFilter<"PatientMatch"> | string
    matchScore?: FloatWithAggregatesFilter<"PatientMatch"> | number
    eligibilityStatus?: EnumEligibilityStatusWithAggregatesFilter<"PatientMatch"> | $Enums.EligibilityStatus
    matchedCriteria?: JsonWithAggregatesFilter<"PatientMatch">
    unmatchedCriteria?: JsonWithAggregatesFilter<"PatientMatch">
    uncertainCriteria?: JsonNullableWithAggregatesFilter<"PatientMatch">
    matchDetails?: JsonNullableWithAggregatesFilter<"PatientMatch">
    distance?: FloatNullableWithAggregatesFilter<"PatientMatch"> | number | null
    nearestSiteId?: StringNullableWithAggregatesFilter<"PatientMatch"> | string | null
    reviewStatus?: EnumReviewStatusWithAggregatesFilter<"PatientMatch"> | $Enums.ReviewStatus
    reviewedBy?: StringNullableWithAggregatesFilter<"PatientMatch"> | string | null
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"PatientMatch"> | Date | string | null
    reviewNotes?: StringNullableWithAggregatesFilter<"PatientMatch"> | string | null
    patientNotified?: BoolWithAggregatesFilter<"PatientMatch"> | boolean
    notifiedAt?: DateTimeNullableWithAggregatesFilter<"PatientMatch"> | Date | string | null
    isInterested?: BoolNullableWithAggregatesFilter<"PatientMatch"> | boolean | null
    interestExpressedAt?: DateTimeNullableWithAggregatesFilter<"PatientMatch"> | Date | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"PatientMatch"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PatientMatch"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PatientMatch"> | Date | string
  }

  export type EnrollmentWhereInput = {
    AND?: EnrollmentWhereInput | EnrollmentWhereInput[]
    OR?: EnrollmentWhereInput[]
    NOT?: EnrollmentWhereInput | EnrollmentWhereInput[]
    id?: StringFilter<"Enrollment"> | string
    patientId?: StringFilter<"Enrollment"> | string
    trialId?: StringFilter<"Enrollment"> | string
    siteId?: StringFilter<"Enrollment"> | string
    status?: EnumEnrollmentStatusFilter<"Enrollment"> | $Enums.EnrollmentStatus
    studySubjectId?: StringNullableFilter<"Enrollment"> | string | null
    screeningDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    enrollmentDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    randomizationDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    armAssignment?: StringNullableFilter<"Enrollment"> | string | null
    withdrawalDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    withdrawalReason?: StringNullableFilter<"Enrollment"> | string | null
    completionDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    primaryInvestigator?: StringNullableFilter<"Enrollment"> | string | null
    studyCoordinator?: StringNullableFilter<"Enrollment"> | string | null
    notes?: StringNullableFilter<"Enrollment"> | string | null
    createdAt?: DateTimeFilter<"Enrollment"> | Date | string
    updatedAt?: DateTimeFilter<"Enrollment"> | Date | string
    trial?: XOR<ClinicalTrialRelationFilter, ClinicalTrialWhereInput>
    site?: XOR<TrialSiteRelationFilter, TrialSiteWhereInput>
    consentRecords?: ConsentRecordListRelationFilter
    statusHistory?: EnrollmentStatusHistoryListRelationFilter
    visits?: TrialVisitListRelationFilter
  }

  export type EnrollmentOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    trialId?: SortOrder
    siteId?: SortOrder
    status?: SortOrder
    studySubjectId?: SortOrderInput | SortOrder
    screeningDate?: SortOrderInput | SortOrder
    enrollmentDate?: SortOrderInput | SortOrder
    randomizationDate?: SortOrderInput | SortOrder
    armAssignment?: SortOrderInput | SortOrder
    withdrawalDate?: SortOrderInput | SortOrder
    withdrawalReason?: SortOrderInput | SortOrder
    completionDate?: SortOrderInput | SortOrder
    primaryInvestigator?: SortOrderInput | SortOrder
    studyCoordinator?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    trial?: ClinicalTrialOrderByWithRelationInput
    site?: TrialSiteOrderByWithRelationInput
    consentRecords?: ConsentRecordOrderByRelationAggregateInput
    statusHistory?: EnrollmentStatusHistoryOrderByRelationAggregateInput
    visits?: TrialVisitOrderByRelationAggregateInput
  }

  export type EnrollmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    patientId_trialId?: EnrollmentPatientIdTrialIdCompoundUniqueInput
    AND?: EnrollmentWhereInput | EnrollmentWhereInput[]
    OR?: EnrollmentWhereInput[]
    NOT?: EnrollmentWhereInput | EnrollmentWhereInput[]
    patientId?: StringFilter<"Enrollment"> | string
    trialId?: StringFilter<"Enrollment"> | string
    siteId?: StringFilter<"Enrollment"> | string
    status?: EnumEnrollmentStatusFilter<"Enrollment"> | $Enums.EnrollmentStatus
    studySubjectId?: StringNullableFilter<"Enrollment"> | string | null
    screeningDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    enrollmentDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    randomizationDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    armAssignment?: StringNullableFilter<"Enrollment"> | string | null
    withdrawalDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    withdrawalReason?: StringNullableFilter<"Enrollment"> | string | null
    completionDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    primaryInvestigator?: StringNullableFilter<"Enrollment"> | string | null
    studyCoordinator?: StringNullableFilter<"Enrollment"> | string | null
    notes?: StringNullableFilter<"Enrollment"> | string | null
    createdAt?: DateTimeFilter<"Enrollment"> | Date | string
    updatedAt?: DateTimeFilter<"Enrollment"> | Date | string
    trial?: XOR<ClinicalTrialRelationFilter, ClinicalTrialWhereInput>
    site?: XOR<TrialSiteRelationFilter, TrialSiteWhereInput>
    consentRecords?: ConsentRecordListRelationFilter
    statusHistory?: EnrollmentStatusHistoryListRelationFilter
    visits?: TrialVisitListRelationFilter
  }, "id" | "patientId_trialId">

  export type EnrollmentOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    trialId?: SortOrder
    siteId?: SortOrder
    status?: SortOrder
    studySubjectId?: SortOrderInput | SortOrder
    screeningDate?: SortOrderInput | SortOrder
    enrollmentDate?: SortOrderInput | SortOrder
    randomizationDate?: SortOrderInput | SortOrder
    armAssignment?: SortOrderInput | SortOrder
    withdrawalDate?: SortOrderInput | SortOrder
    withdrawalReason?: SortOrderInput | SortOrder
    completionDate?: SortOrderInput | SortOrder
    primaryInvestigator?: SortOrderInput | SortOrder
    studyCoordinator?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EnrollmentCountOrderByAggregateInput
    _max?: EnrollmentMaxOrderByAggregateInput
    _min?: EnrollmentMinOrderByAggregateInput
  }

  export type EnrollmentScalarWhereWithAggregatesInput = {
    AND?: EnrollmentScalarWhereWithAggregatesInput | EnrollmentScalarWhereWithAggregatesInput[]
    OR?: EnrollmentScalarWhereWithAggregatesInput[]
    NOT?: EnrollmentScalarWhereWithAggregatesInput | EnrollmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Enrollment"> | string
    patientId?: StringWithAggregatesFilter<"Enrollment"> | string
    trialId?: StringWithAggregatesFilter<"Enrollment"> | string
    siteId?: StringWithAggregatesFilter<"Enrollment"> | string
    status?: EnumEnrollmentStatusWithAggregatesFilter<"Enrollment"> | $Enums.EnrollmentStatus
    studySubjectId?: StringNullableWithAggregatesFilter<"Enrollment"> | string | null
    screeningDate?: DateTimeNullableWithAggregatesFilter<"Enrollment"> | Date | string | null
    enrollmentDate?: DateTimeNullableWithAggregatesFilter<"Enrollment"> | Date | string | null
    randomizationDate?: DateTimeNullableWithAggregatesFilter<"Enrollment"> | Date | string | null
    armAssignment?: StringNullableWithAggregatesFilter<"Enrollment"> | string | null
    withdrawalDate?: DateTimeNullableWithAggregatesFilter<"Enrollment"> | Date | string | null
    withdrawalReason?: StringNullableWithAggregatesFilter<"Enrollment"> | string | null
    completionDate?: DateTimeNullableWithAggregatesFilter<"Enrollment"> | Date | string | null
    primaryInvestigator?: StringNullableWithAggregatesFilter<"Enrollment"> | string | null
    studyCoordinator?: StringNullableWithAggregatesFilter<"Enrollment"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Enrollment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Enrollment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Enrollment"> | Date | string
  }

  export type EnrollmentStatusHistoryWhereInput = {
    AND?: EnrollmentStatusHistoryWhereInput | EnrollmentStatusHistoryWhereInput[]
    OR?: EnrollmentStatusHistoryWhereInput[]
    NOT?: EnrollmentStatusHistoryWhereInput | EnrollmentStatusHistoryWhereInput[]
    id?: StringFilter<"EnrollmentStatusHistory"> | string
    enrollmentId?: StringFilter<"EnrollmentStatusHistory"> | string
    fromStatus?: EnumEnrollmentStatusNullableFilter<"EnrollmentStatusHistory"> | $Enums.EnrollmentStatus | null
    toStatus?: EnumEnrollmentStatusFilter<"EnrollmentStatusHistory"> | $Enums.EnrollmentStatus
    reason?: StringNullableFilter<"EnrollmentStatusHistory"> | string | null
    changedBy?: StringFilter<"EnrollmentStatusHistory"> | string
    changedAt?: DateTimeFilter<"EnrollmentStatusHistory"> | Date | string
    enrollment?: XOR<EnrollmentRelationFilter, EnrollmentWhereInput>
  }

  export type EnrollmentStatusHistoryOrderByWithRelationInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    fromStatus?: SortOrderInput | SortOrder
    toStatus?: SortOrder
    reason?: SortOrderInput | SortOrder
    changedBy?: SortOrder
    changedAt?: SortOrder
    enrollment?: EnrollmentOrderByWithRelationInput
  }

  export type EnrollmentStatusHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EnrollmentStatusHistoryWhereInput | EnrollmentStatusHistoryWhereInput[]
    OR?: EnrollmentStatusHistoryWhereInput[]
    NOT?: EnrollmentStatusHistoryWhereInput | EnrollmentStatusHistoryWhereInput[]
    enrollmentId?: StringFilter<"EnrollmentStatusHistory"> | string
    fromStatus?: EnumEnrollmentStatusNullableFilter<"EnrollmentStatusHistory"> | $Enums.EnrollmentStatus | null
    toStatus?: EnumEnrollmentStatusFilter<"EnrollmentStatusHistory"> | $Enums.EnrollmentStatus
    reason?: StringNullableFilter<"EnrollmentStatusHistory"> | string | null
    changedBy?: StringFilter<"EnrollmentStatusHistory"> | string
    changedAt?: DateTimeFilter<"EnrollmentStatusHistory"> | Date | string
    enrollment?: XOR<EnrollmentRelationFilter, EnrollmentWhereInput>
  }, "id">

  export type EnrollmentStatusHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    fromStatus?: SortOrderInput | SortOrder
    toStatus?: SortOrder
    reason?: SortOrderInput | SortOrder
    changedBy?: SortOrder
    changedAt?: SortOrder
    _count?: EnrollmentStatusHistoryCountOrderByAggregateInput
    _max?: EnrollmentStatusHistoryMaxOrderByAggregateInput
    _min?: EnrollmentStatusHistoryMinOrderByAggregateInput
  }

  export type EnrollmentStatusHistoryScalarWhereWithAggregatesInput = {
    AND?: EnrollmentStatusHistoryScalarWhereWithAggregatesInput | EnrollmentStatusHistoryScalarWhereWithAggregatesInput[]
    OR?: EnrollmentStatusHistoryScalarWhereWithAggregatesInput[]
    NOT?: EnrollmentStatusHistoryScalarWhereWithAggregatesInput | EnrollmentStatusHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EnrollmentStatusHistory"> | string
    enrollmentId?: StringWithAggregatesFilter<"EnrollmentStatusHistory"> | string
    fromStatus?: EnumEnrollmentStatusNullableWithAggregatesFilter<"EnrollmentStatusHistory"> | $Enums.EnrollmentStatus | null
    toStatus?: EnumEnrollmentStatusWithAggregatesFilter<"EnrollmentStatusHistory"> | $Enums.EnrollmentStatus
    reason?: StringNullableWithAggregatesFilter<"EnrollmentStatusHistory"> | string | null
    changedBy?: StringWithAggregatesFilter<"EnrollmentStatusHistory"> | string
    changedAt?: DateTimeWithAggregatesFilter<"EnrollmentStatusHistory"> | Date | string
  }

  export type ConsentRecordWhereInput = {
    AND?: ConsentRecordWhereInput | ConsentRecordWhereInput[]
    OR?: ConsentRecordWhereInput[]
    NOT?: ConsentRecordWhereInput | ConsentRecordWhereInput[]
    id?: StringFilter<"ConsentRecord"> | string
    enrollmentId?: StringFilter<"ConsentRecord"> | string
    consentType?: EnumConsentTypeFilter<"ConsentRecord"> | $Enums.ConsentType
    consentFormId?: StringNullableFilter<"ConsentRecord"> | string | null
    consentFormVersion?: StringNullableFilter<"ConsentRecord"> | string | null
    signedAt?: DateTimeFilter<"ConsentRecord"> | Date | string
    signedBy?: StringFilter<"ConsentRecord"> | string
    witnessName?: StringNullableFilter<"ConsentRecord"> | string | null
    witnessSignedAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    coordinatorName?: StringNullableFilter<"ConsentRecord"> | string | null
    coordinatorId?: StringNullableFilter<"ConsentRecord"> | string | null
    documentUrl?: StringNullableFilter<"ConsentRecord"> | string | null
    isActive?: BoolFilter<"ConsentRecord"> | boolean
    revokedAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    revokedReason?: StringNullableFilter<"ConsentRecord"> | string | null
    expiresAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    notes?: StringNullableFilter<"ConsentRecord"> | string | null
    createdAt?: DateTimeFilter<"ConsentRecord"> | Date | string
    updatedAt?: DateTimeFilter<"ConsentRecord"> | Date | string
    enrollment?: XOR<EnrollmentRelationFilter, EnrollmentWhereInput>
  }

  export type ConsentRecordOrderByWithRelationInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    consentType?: SortOrder
    consentFormId?: SortOrderInput | SortOrder
    consentFormVersion?: SortOrderInput | SortOrder
    signedAt?: SortOrder
    signedBy?: SortOrder
    witnessName?: SortOrderInput | SortOrder
    witnessSignedAt?: SortOrderInput | SortOrder
    coordinatorName?: SortOrderInput | SortOrder
    coordinatorId?: SortOrderInput | SortOrder
    documentUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    revokedReason?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enrollment?: EnrollmentOrderByWithRelationInput
  }

  export type ConsentRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConsentRecordWhereInput | ConsentRecordWhereInput[]
    OR?: ConsentRecordWhereInput[]
    NOT?: ConsentRecordWhereInput | ConsentRecordWhereInput[]
    enrollmentId?: StringFilter<"ConsentRecord"> | string
    consentType?: EnumConsentTypeFilter<"ConsentRecord"> | $Enums.ConsentType
    consentFormId?: StringNullableFilter<"ConsentRecord"> | string | null
    consentFormVersion?: StringNullableFilter<"ConsentRecord"> | string | null
    signedAt?: DateTimeFilter<"ConsentRecord"> | Date | string
    signedBy?: StringFilter<"ConsentRecord"> | string
    witnessName?: StringNullableFilter<"ConsentRecord"> | string | null
    witnessSignedAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    coordinatorName?: StringNullableFilter<"ConsentRecord"> | string | null
    coordinatorId?: StringNullableFilter<"ConsentRecord"> | string | null
    documentUrl?: StringNullableFilter<"ConsentRecord"> | string | null
    isActive?: BoolFilter<"ConsentRecord"> | boolean
    revokedAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    revokedReason?: StringNullableFilter<"ConsentRecord"> | string | null
    expiresAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    notes?: StringNullableFilter<"ConsentRecord"> | string | null
    createdAt?: DateTimeFilter<"ConsentRecord"> | Date | string
    updatedAt?: DateTimeFilter<"ConsentRecord"> | Date | string
    enrollment?: XOR<EnrollmentRelationFilter, EnrollmentWhereInput>
  }, "id">

  export type ConsentRecordOrderByWithAggregationInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    consentType?: SortOrder
    consentFormId?: SortOrderInput | SortOrder
    consentFormVersion?: SortOrderInput | SortOrder
    signedAt?: SortOrder
    signedBy?: SortOrder
    witnessName?: SortOrderInput | SortOrder
    witnessSignedAt?: SortOrderInput | SortOrder
    coordinatorName?: SortOrderInput | SortOrder
    coordinatorId?: SortOrderInput | SortOrder
    documentUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    revokedReason?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConsentRecordCountOrderByAggregateInput
    _max?: ConsentRecordMaxOrderByAggregateInput
    _min?: ConsentRecordMinOrderByAggregateInput
  }

  export type ConsentRecordScalarWhereWithAggregatesInput = {
    AND?: ConsentRecordScalarWhereWithAggregatesInput | ConsentRecordScalarWhereWithAggregatesInput[]
    OR?: ConsentRecordScalarWhereWithAggregatesInput[]
    NOT?: ConsentRecordScalarWhereWithAggregatesInput | ConsentRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConsentRecord"> | string
    enrollmentId?: StringWithAggregatesFilter<"ConsentRecord"> | string
    consentType?: EnumConsentTypeWithAggregatesFilter<"ConsentRecord"> | $Enums.ConsentType
    consentFormId?: StringNullableWithAggregatesFilter<"ConsentRecord"> | string | null
    consentFormVersion?: StringNullableWithAggregatesFilter<"ConsentRecord"> | string | null
    signedAt?: DateTimeWithAggregatesFilter<"ConsentRecord"> | Date | string
    signedBy?: StringWithAggregatesFilter<"ConsentRecord"> | string
    witnessName?: StringNullableWithAggregatesFilter<"ConsentRecord"> | string | null
    witnessSignedAt?: DateTimeNullableWithAggregatesFilter<"ConsentRecord"> | Date | string | null
    coordinatorName?: StringNullableWithAggregatesFilter<"ConsentRecord"> | string | null
    coordinatorId?: StringNullableWithAggregatesFilter<"ConsentRecord"> | string | null
    documentUrl?: StringNullableWithAggregatesFilter<"ConsentRecord"> | string | null
    isActive?: BoolWithAggregatesFilter<"ConsentRecord"> | boolean
    revokedAt?: DateTimeNullableWithAggregatesFilter<"ConsentRecord"> | Date | string | null
    revokedReason?: StringNullableWithAggregatesFilter<"ConsentRecord"> | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"ConsentRecord"> | Date | string | null
    notes?: StringNullableWithAggregatesFilter<"ConsentRecord"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ConsentRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ConsentRecord"> | Date | string
  }

  export type TrialVisitWhereInput = {
    AND?: TrialVisitWhereInput | TrialVisitWhereInput[]
    OR?: TrialVisitWhereInput[]
    NOT?: TrialVisitWhereInput | TrialVisitWhereInput[]
    id?: StringFilter<"TrialVisit"> | string
    enrollmentId?: StringFilter<"TrialVisit"> | string
    visitNumber?: IntFilter<"TrialVisit"> | number
    visitName?: StringFilter<"TrialVisit"> | string
    visitType?: EnumVisitTypeFilter<"TrialVisit"> | $Enums.VisitType
    scheduledDate?: DateTimeNullableFilter<"TrialVisit"> | Date | string | null
    actualDate?: DateTimeNullableFilter<"TrialVisit"> | Date | string | null
    status?: EnumVisitStatusFilter<"TrialVisit"> | $Enums.VisitStatus
    completedBy?: StringNullableFilter<"TrialVisit"> | string | null
    notes?: StringNullableFilter<"TrialVisit"> | string | null
    protocolDeviations?: StringNullableFilter<"TrialVisit"> | string | null
    missedReason?: StringNullableFilter<"TrialVisit"> | string | null
    createdAt?: DateTimeFilter<"TrialVisit"> | Date | string
    updatedAt?: DateTimeFilter<"TrialVisit"> | Date | string
    enrollment?: XOR<EnrollmentRelationFilter, EnrollmentWhereInput>
  }

  export type TrialVisitOrderByWithRelationInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    visitNumber?: SortOrder
    visitName?: SortOrder
    visitType?: SortOrder
    scheduledDate?: SortOrderInput | SortOrder
    actualDate?: SortOrderInput | SortOrder
    status?: SortOrder
    completedBy?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    protocolDeviations?: SortOrderInput | SortOrder
    missedReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enrollment?: EnrollmentOrderByWithRelationInput
  }

  export type TrialVisitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    enrollmentId_visitNumber?: TrialVisitEnrollmentIdVisitNumberCompoundUniqueInput
    AND?: TrialVisitWhereInput | TrialVisitWhereInput[]
    OR?: TrialVisitWhereInput[]
    NOT?: TrialVisitWhereInput | TrialVisitWhereInput[]
    enrollmentId?: StringFilter<"TrialVisit"> | string
    visitNumber?: IntFilter<"TrialVisit"> | number
    visitName?: StringFilter<"TrialVisit"> | string
    visitType?: EnumVisitTypeFilter<"TrialVisit"> | $Enums.VisitType
    scheduledDate?: DateTimeNullableFilter<"TrialVisit"> | Date | string | null
    actualDate?: DateTimeNullableFilter<"TrialVisit"> | Date | string | null
    status?: EnumVisitStatusFilter<"TrialVisit"> | $Enums.VisitStatus
    completedBy?: StringNullableFilter<"TrialVisit"> | string | null
    notes?: StringNullableFilter<"TrialVisit"> | string | null
    protocolDeviations?: StringNullableFilter<"TrialVisit"> | string | null
    missedReason?: StringNullableFilter<"TrialVisit"> | string | null
    createdAt?: DateTimeFilter<"TrialVisit"> | Date | string
    updatedAt?: DateTimeFilter<"TrialVisit"> | Date | string
    enrollment?: XOR<EnrollmentRelationFilter, EnrollmentWhereInput>
  }, "id" | "enrollmentId_visitNumber">

  export type TrialVisitOrderByWithAggregationInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    visitNumber?: SortOrder
    visitName?: SortOrder
    visitType?: SortOrder
    scheduledDate?: SortOrderInput | SortOrder
    actualDate?: SortOrderInput | SortOrder
    status?: SortOrder
    completedBy?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    protocolDeviations?: SortOrderInput | SortOrder
    missedReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TrialVisitCountOrderByAggregateInput
    _avg?: TrialVisitAvgOrderByAggregateInput
    _max?: TrialVisitMaxOrderByAggregateInput
    _min?: TrialVisitMinOrderByAggregateInput
    _sum?: TrialVisitSumOrderByAggregateInput
  }

  export type TrialVisitScalarWhereWithAggregatesInput = {
    AND?: TrialVisitScalarWhereWithAggregatesInput | TrialVisitScalarWhereWithAggregatesInput[]
    OR?: TrialVisitScalarWhereWithAggregatesInput[]
    NOT?: TrialVisitScalarWhereWithAggregatesInput | TrialVisitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrialVisit"> | string
    enrollmentId?: StringWithAggregatesFilter<"TrialVisit"> | string
    visitNumber?: IntWithAggregatesFilter<"TrialVisit"> | number
    visitName?: StringWithAggregatesFilter<"TrialVisit"> | string
    visitType?: EnumVisitTypeWithAggregatesFilter<"TrialVisit"> | $Enums.VisitType
    scheduledDate?: DateTimeNullableWithAggregatesFilter<"TrialVisit"> | Date | string | null
    actualDate?: DateTimeNullableWithAggregatesFilter<"TrialVisit"> | Date | string | null
    status?: EnumVisitStatusWithAggregatesFilter<"TrialVisit"> | $Enums.VisitStatus
    completedBy?: StringNullableWithAggregatesFilter<"TrialVisit"> | string | null
    notes?: StringNullableWithAggregatesFilter<"TrialVisit"> | string | null
    protocolDeviations?: StringNullableWithAggregatesFilter<"TrialVisit"> | string | null
    missedReason?: StringNullableWithAggregatesFilter<"TrialVisit"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TrialVisit"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TrialVisit"> | Date | string
  }

  export type InvestigatorWhereInput = {
    AND?: InvestigatorWhereInput | InvestigatorWhereInput[]
    OR?: InvestigatorWhereInput[]
    NOT?: InvestigatorWhereInput | InvestigatorWhereInput[]
    id?: StringFilter<"Investigator"> | string
    userId?: StringNullableFilter<"Investigator"> | string | null
    firstName?: StringFilter<"Investigator"> | string
    lastName?: StringFilter<"Investigator"> | string
    email?: StringFilter<"Investigator"> | string
    phone?: StringNullableFilter<"Investigator"> | string | null
    specialty?: StringNullableFilter<"Investigator"> | string | null
    institution?: StringNullableFilter<"Investigator"> | string | null
    npiNumber?: StringNullableFilter<"Investigator"> | string | null
    licenseNumber?: StringNullableFilter<"Investigator"> | string | null
    licenseState?: StringNullableFilter<"Investigator"> | string | null
    cvUrl?: StringNullableFilter<"Investigator"> | string | null
    isActive?: BoolFilter<"Investigator"> | boolean
    roles?: EnumInvestigatorRoleNullableListFilter<"Investigator">
    certifications?: JsonNullableListFilter<"Investigator">
    trainingRecords?: JsonNullableListFilter<"Investigator">
    createdAt?: DateTimeFilter<"Investigator"> | Date | string
    updatedAt?: DateTimeFilter<"Investigator"> | Date | string
    siteAssignments?: InvestigatorSiteAssignmentListRelationFilter
  }

  export type InvestigatorOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    specialty?: SortOrderInput | SortOrder
    institution?: SortOrderInput | SortOrder
    npiNumber?: SortOrderInput | SortOrder
    licenseNumber?: SortOrderInput | SortOrder
    licenseState?: SortOrderInput | SortOrder
    cvUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    roles?: SortOrder
    certifications?: SortOrder
    trainingRecords?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    siteAssignments?: InvestigatorSiteAssignmentOrderByRelationAggregateInput
  }

  export type InvestigatorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    npiNumber?: string
    AND?: InvestigatorWhereInput | InvestigatorWhereInput[]
    OR?: InvestigatorWhereInput[]
    NOT?: InvestigatorWhereInput | InvestigatorWhereInput[]
    userId?: StringNullableFilter<"Investigator"> | string | null
    firstName?: StringFilter<"Investigator"> | string
    lastName?: StringFilter<"Investigator"> | string
    phone?: StringNullableFilter<"Investigator"> | string | null
    specialty?: StringNullableFilter<"Investigator"> | string | null
    institution?: StringNullableFilter<"Investigator"> | string | null
    licenseNumber?: StringNullableFilter<"Investigator"> | string | null
    licenseState?: StringNullableFilter<"Investigator"> | string | null
    cvUrl?: StringNullableFilter<"Investigator"> | string | null
    isActive?: BoolFilter<"Investigator"> | boolean
    roles?: EnumInvestigatorRoleNullableListFilter<"Investigator">
    certifications?: JsonNullableListFilter<"Investigator">
    trainingRecords?: JsonNullableListFilter<"Investigator">
    createdAt?: DateTimeFilter<"Investigator"> | Date | string
    updatedAt?: DateTimeFilter<"Investigator"> | Date | string
    siteAssignments?: InvestigatorSiteAssignmentListRelationFilter
  }, "id" | "email" | "npiNumber">

  export type InvestigatorOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    specialty?: SortOrderInput | SortOrder
    institution?: SortOrderInput | SortOrder
    npiNumber?: SortOrderInput | SortOrder
    licenseNumber?: SortOrderInput | SortOrder
    licenseState?: SortOrderInput | SortOrder
    cvUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    roles?: SortOrder
    certifications?: SortOrder
    trainingRecords?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InvestigatorCountOrderByAggregateInput
    _max?: InvestigatorMaxOrderByAggregateInput
    _min?: InvestigatorMinOrderByAggregateInput
  }

  export type InvestigatorScalarWhereWithAggregatesInput = {
    AND?: InvestigatorScalarWhereWithAggregatesInput | InvestigatorScalarWhereWithAggregatesInput[]
    OR?: InvestigatorScalarWhereWithAggregatesInput[]
    NOT?: InvestigatorScalarWhereWithAggregatesInput | InvestigatorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Investigator"> | string
    userId?: StringNullableWithAggregatesFilter<"Investigator"> | string | null
    firstName?: StringWithAggregatesFilter<"Investigator"> | string
    lastName?: StringWithAggregatesFilter<"Investigator"> | string
    email?: StringWithAggregatesFilter<"Investigator"> | string
    phone?: StringNullableWithAggregatesFilter<"Investigator"> | string | null
    specialty?: StringNullableWithAggregatesFilter<"Investigator"> | string | null
    institution?: StringNullableWithAggregatesFilter<"Investigator"> | string | null
    npiNumber?: StringNullableWithAggregatesFilter<"Investigator"> | string | null
    licenseNumber?: StringNullableWithAggregatesFilter<"Investigator"> | string | null
    licenseState?: StringNullableWithAggregatesFilter<"Investigator"> | string | null
    cvUrl?: StringNullableWithAggregatesFilter<"Investigator"> | string | null
    isActive?: BoolWithAggregatesFilter<"Investigator"> | boolean
    roles?: EnumInvestigatorRoleNullableListFilter<"Investigator">
    certifications?: JsonNullableListFilter<"Investigator">
    trainingRecords?: JsonNullableListFilter<"Investigator">
    createdAt?: DateTimeWithAggregatesFilter<"Investigator"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Investigator"> | Date | string
  }

  export type InvestigatorSiteAssignmentWhereInput = {
    AND?: InvestigatorSiteAssignmentWhereInput | InvestigatorSiteAssignmentWhereInput[]
    OR?: InvestigatorSiteAssignmentWhereInput[]
    NOT?: InvestigatorSiteAssignmentWhereInput | InvestigatorSiteAssignmentWhereInput[]
    id?: StringFilter<"InvestigatorSiteAssignment"> | string
    investigatorId?: StringFilter<"InvestigatorSiteAssignment"> | string
    siteId?: StringFilter<"InvestigatorSiteAssignment"> | string
    trialId?: StringFilter<"InvestigatorSiteAssignment"> | string
    role?: EnumInvestigatorRoleFilter<"InvestigatorSiteAssignment"> | $Enums.InvestigatorRole
    startDate?: DateTimeFilter<"InvestigatorSiteAssignment"> | Date | string
    endDate?: DateTimeNullableFilter<"InvestigatorSiteAssignment"> | Date | string | null
    isActive?: BoolFilter<"InvestigatorSiteAssignment"> | boolean
    createdAt?: DateTimeFilter<"InvestigatorSiteAssignment"> | Date | string
    updatedAt?: DateTimeFilter<"InvestigatorSiteAssignment"> | Date | string
    investigator?: XOR<InvestigatorRelationFilter, InvestigatorWhereInput>
  }

  export type InvestigatorSiteAssignmentOrderByWithRelationInput = {
    id?: SortOrder
    investigatorId?: SortOrder
    siteId?: SortOrder
    trialId?: SortOrder
    role?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    investigator?: InvestigatorOrderByWithRelationInput
  }

  export type InvestigatorSiteAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    investigatorId_siteId_trialId_role?: InvestigatorSiteAssignmentInvestigatorIdSiteIdTrialIdRoleCompoundUniqueInput
    AND?: InvestigatorSiteAssignmentWhereInput | InvestigatorSiteAssignmentWhereInput[]
    OR?: InvestigatorSiteAssignmentWhereInput[]
    NOT?: InvestigatorSiteAssignmentWhereInput | InvestigatorSiteAssignmentWhereInput[]
    investigatorId?: StringFilter<"InvestigatorSiteAssignment"> | string
    siteId?: StringFilter<"InvestigatorSiteAssignment"> | string
    trialId?: StringFilter<"InvestigatorSiteAssignment"> | string
    role?: EnumInvestigatorRoleFilter<"InvestigatorSiteAssignment"> | $Enums.InvestigatorRole
    startDate?: DateTimeFilter<"InvestigatorSiteAssignment"> | Date | string
    endDate?: DateTimeNullableFilter<"InvestigatorSiteAssignment"> | Date | string | null
    isActive?: BoolFilter<"InvestigatorSiteAssignment"> | boolean
    createdAt?: DateTimeFilter<"InvestigatorSiteAssignment"> | Date | string
    updatedAt?: DateTimeFilter<"InvestigatorSiteAssignment"> | Date | string
    investigator?: XOR<InvestigatorRelationFilter, InvestigatorWhereInput>
  }, "id" | "investigatorId_siteId_trialId_role">

  export type InvestigatorSiteAssignmentOrderByWithAggregationInput = {
    id?: SortOrder
    investigatorId?: SortOrder
    siteId?: SortOrder
    trialId?: SortOrder
    role?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InvestigatorSiteAssignmentCountOrderByAggregateInput
    _max?: InvestigatorSiteAssignmentMaxOrderByAggregateInput
    _min?: InvestigatorSiteAssignmentMinOrderByAggregateInput
  }

  export type InvestigatorSiteAssignmentScalarWhereWithAggregatesInput = {
    AND?: InvestigatorSiteAssignmentScalarWhereWithAggregatesInput | InvestigatorSiteAssignmentScalarWhereWithAggregatesInput[]
    OR?: InvestigatorSiteAssignmentScalarWhereWithAggregatesInput[]
    NOT?: InvestigatorSiteAssignmentScalarWhereWithAggregatesInput | InvestigatorSiteAssignmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InvestigatorSiteAssignment"> | string
    investigatorId?: StringWithAggregatesFilter<"InvestigatorSiteAssignment"> | string
    siteId?: StringWithAggregatesFilter<"InvestigatorSiteAssignment"> | string
    trialId?: StringWithAggregatesFilter<"InvestigatorSiteAssignment"> | string
    role?: EnumInvestigatorRoleWithAggregatesFilter<"InvestigatorSiteAssignment"> | $Enums.InvestigatorRole
    startDate?: DateTimeWithAggregatesFilter<"InvestigatorSiteAssignment"> | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter<"InvestigatorSiteAssignment"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"InvestigatorSiteAssignment"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"InvestigatorSiteAssignment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InvestigatorSiteAssignment"> | Date | string
  }

  export type TrialNotificationWhereInput = {
    AND?: TrialNotificationWhereInput | TrialNotificationWhereInput[]
    OR?: TrialNotificationWhereInput[]
    NOT?: TrialNotificationWhereInput | TrialNotificationWhereInput[]
    id?: StringFilter<"TrialNotification"> | string
    recipientId?: StringFilter<"TrialNotification"> | string
    recipientType?: EnumRecipientTypeFilter<"TrialNotification"> | $Enums.RecipientType
    type?: EnumNotificationTypeFilter<"TrialNotification"> | $Enums.NotificationType
    title?: StringFilter<"TrialNotification"> | string
    message?: StringFilter<"TrialNotification"> | string
    trialId?: StringNullableFilter<"TrialNotification"> | string | null
    enrollmentId?: StringNullableFilter<"TrialNotification"> | string | null
    matchId?: StringNullableFilter<"TrialNotification"> | string | null
    priority?: EnumNotificationPriorityFilter<"TrialNotification"> | $Enums.NotificationPriority
    isRead?: BoolFilter<"TrialNotification"> | boolean
    readAt?: DateTimeNullableFilter<"TrialNotification"> | Date | string | null
    sentAt?: DateTimeFilter<"TrialNotification"> | Date | string
    deliveryMethod?: EnumDeliveryMethodFilter<"TrialNotification"> | $Enums.DeliveryMethod
    externalId?: StringNullableFilter<"TrialNotification"> | string | null
    createdAt?: DateTimeFilter<"TrialNotification"> | Date | string
  }

  export type TrialNotificationOrderByWithRelationInput = {
    id?: SortOrder
    recipientId?: SortOrder
    recipientType?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    trialId?: SortOrderInput | SortOrder
    enrollmentId?: SortOrderInput | SortOrder
    matchId?: SortOrderInput | SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrderInput | SortOrder
    sentAt?: SortOrder
    deliveryMethod?: SortOrder
    externalId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type TrialNotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TrialNotificationWhereInput | TrialNotificationWhereInput[]
    OR?: TrialNotificationWhereInput[]
    NOT?: TrialNotificationWhereInput | TrialNotificationWhereInput[]
    recipientId?: StringFilter<"TrialNotification"> | string
    recipientType?: EnumRecipientTypeFilter<"TrialNotification"> | $Enums.RecipientType
    type?: EnumNotificationTypeFilter<"TrialNotification"> | $Enums.NotificationType
    title?: StringFilter<"TrialNotification"> | string
    message?: StringFilter<"TrialNotification"> | string
    trialId?: StringNullableFilter<"TrialNotification"> | string | null
    enrollmentId?: StringNullableFilter<"TrialNotification"> | string | null
    matchId?: StringNullableFilter<"TrialNotification"> | string | null
    priority?: EnumNotificationPriorityFilter<"TrialNotification"> | $Enums.NotificationPriority
    isRead?: BoolFilter<"TrialNotification"> | boolean
    readAt?: DateTimeNullableFilter<"TrialNotification"> | Date | string | null
    sentAt?: DateTimeFilter<"TrialNotification"> | Date | string
    deliveryMethod?: EnumDeliveryMethodFilter<"TrialNotification"> | $Enums.DeliveryMethod
    externalId?: StringNullableFilter<"TrialNotification"> | string | null
    createdAt?: DateTimeFilter<"TrialNotification"> | Date | string
  }, "id">

  export type TrialNotificationOrderByWithAggregationInput = {
    id?: SortOrder
    recipientId?: SortOrder
    recipientType?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    trialId?: SortOrderInput | SortOrder
    enrollmentId?: SortOrderInput | SortOrder
    matchId?: SortOrderInput | SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrderInput | SortOrder
    sentAt?: SortOrder
    deliveryMethod?: SortOrder
    externalId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: TrialNotificationCountOrderByAggregateInput
    _max?: TrialNotificationMaxOrderByAggregateInput
    _min?: TrialNotificationMinOrderByAggregateInput
  }

  export type TrialNotificationScalarWhereWithAggregatesInput = {
    AND?: TrialNotificationScalarWhereWithAggregatesInput | TrialNotificationScalarWhereWithAggregatesInput[]
    OR?: TrialNotificationScalarWhereWithAggregatesInput[]
    NOT?: TrialNotificationScalarWhereWithAggregatesInput | TrialNotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrialNotification"> | string
    recipientId?: StringWithAggregatesFilter<"TrialNotification"> | string
    recipientType?: EnumRecipientTypeWithAggregatesFilter<"TrialNotification"> | $Enums.RecipientType
    type?: EnumNotificationTypeWithAggregatesFilter<"TrialNotification"> | $Enums.NotificationType
    title?: StringWithAggregatesFilter<"TrialNotification"> | string
    message?: StringWithAggregatesFilter<"TrialNotification"> | string
    trialId?: StringNullableWithAggregatesFilter<"TrialNotification"> | string | null
    enrollmentId?: StringNullableWithAggregatesFilter<"TrialNotification"> | string | null
    matchId?: StringNullableWithAggregatesFilter<"TrialNotification"> | string | null
    priority?: EnumNotificationPriorityWithAggregatesFilter<"TrialNotification"> | $Enums.NotificationPriority
    isRead?: BoolWithAggregatesFilter<"TrialNotification"> | boolean
    readAt?: DateTimeNullableWithAggregatesFilter<"TrialNotification"> | Date | string | null
    sentAt?: DateTimeWithAggregatesFilter<"TrialNotification"> | Date | string
    deliveryMethod?: EnumDeliveryMethodWithAggregatesFilter<"TrialNotification"> | $Enums.DeliveryMethod
    externalId?: StringNullableWithAggregatesFilter<"TrialNotification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TrialNotification"> | Date | string
  }

  export type ClinicalTrialCreateInput = {
    id?: string
    nctId: string
    title: string
    officialTitle?: string | null
    briefSummary?: string | null
    detailedDescription?: string | null
    status?: $Enums.TrialStatus
    phase?: $Enums.TrialPhase | null
    studyType?: $Enums.StudyType
    primaryPurpose?: string | null
    interventionModel?: string | null
    masking?: string | null
    allocation?: string | null
    enrollmentCount?: number | null
    enrollmentType?: string | null
    startDate?: Date | string | null
    completionDate?: Date | string | null
    primaryCompletionDate?: Date | string | null
    lastUpdatedDate?: Date | string | null
    sponsorName?: string | null
    sponsorType?: string | null
    leadSponsorClass?: string | null
    collaborators?: ClinicalTrialCreatecollaboratorsInput | string[]
    conditions?: ClinicalTrialCreateconditionsInput | string[]
    interventions?: ClinicalTrialCreateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialCreatekeywordsInput | string[]
    meshTerms?: ClinicalTrialCreatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialCreateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialCreatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: string | null
    healthyVolunteers?: boolean
    minimumAge?: number | null
    maximumAge?: number | null
    gender?: string | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialCreatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sites?: TrialSiteCreateNestedManyWithoutTrialInput
    patientMatches?: PatientMatchCreateNestedManyWithoutTrialInput
    enrollments?: EnrollmentCreateNestedManyWithoutTrialInput
  }

  export type ClinicalTrialUncheckedCreateInput = {
    id?: string
    nctId: string
    title: string
    officialTitle?: string | null
    briefSummary?: string | null
    detailedDescription?: string | null
    status?: $Enums.TrialStatus
    phase?: $Enums.TrialPhase | null
    studyType?: $Enums.StudyType
    primaryPurpose?: string | null
    interventionModel?: string | null
    masking?: string | null
    allocation?: string | null
    enrollmentCount?: number | null
    enrollmentType?: string | null
    startDate?: Date | string | null
    completionDate?: Date | string | null
    primaryCompletionDate?: Date | string | null
    lastUpdatedDate?: Date | string | null
    sponsorName?: string | null
    sponsorType?: string | null
    leadSponsorClass?: string | null
    collaborators?: ClinicalTrialCreatecollaboratorsInput | string[]
    conditions?: ClinicalTrialCreateconditionsInput | string[]
    interventions?: ClinicalTrialCreateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialCreatekeywordsInput | string[]
    meshTerms?: ClinicalTrialCreatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialCreateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialCreatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: string | null
    healthyVolunteers?: boolean
    minimumAge?: number | null
    maximumAge?: number | null
    gender?: string | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialCreatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sites?: TrialSiteUncheckedCreateNestedManyWithoutTrialInput
    patientMatches?: PatientMatchUncheckedCreateNestedManyWithoutTrialInput
    enrollments?: EnrollmentUncheckedCreateNestedManyWithoutTrialInput
  }

  export type ClinicalTrialUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nctId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    officialTitle?: NullableStringFieldUpdateOperationsInput | string | null
    briefSummary?: NullableStringFieldUpdateOperationsInput | string | null
    detailedDescription?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrialStatusFieldUpdateOperationsInput | $Enums.TrialStatus
    phase?: NullableEnumTrialPhaseFieldUpdateOperationsInput | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeFieldUpdateOperationsInput | $Enums.StudyType
    primaryPurpose?: NullableStringFieldUpdateOperationsInput | string | null
    interventionModel?: NullableStringFieldUpdateOperationsInput | string | null
    masking?: NullableStringFieldUpdateOperationsInput | string | null
    allocation?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentCount?: NullableIntFieldUpdateOperationsInput | number | null
    enrollmentType?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sponsorName?: NullableStringFieldUpdateOperationsInput | string | null
    sponsorType?: NullableStringFieldUpdateOperationsInput | string | null
    leadSponsorClass?: NullableStringFieldUpdateOperationsInput | string | null
    collaborators?: ClinicalTrialUpdatecollaboratorsInput | string[]
    conditions?: ClinicalTrialUpdateconditionsInput | string[]
    interventions?: ClinicalTrialUpdateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialUpdatekeywordsInput | string[]
    meshTerms?: ClinicalTrialUpdatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialUpdateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialUpdatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: NullableStringFieldUpdateOperationsInput | string | null
    healthyVolunteers?: BoolFieldUpdateOperationsInput | boolean
    minimumAge?: NullableIntFieldUpdateOperationsInput | number | null
    maximumAge?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialUpdatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sites?: TrialSiteUpdateManyWithoutTrialNestedInput
    patientMatches?: PatientMatchUpdateManyWithoutTrialNestedInput
    enrollments?: EnrollmentUpdateManyWithoutTrialNestedInput
  }

  export type ClinicalTrialUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nctId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    officialTitle?: NullableStringFieldUpdateOperationsInput | string | null
    briefSummary?: NullableStringFieldUpdateOperationsInput | string | null
    detailedDescription?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrialStatusFieldUpdateOperationsInput | $Enums.TrialStatus
    phase?: NullableEnumTrialPhaseFieldUpdateOperationsInput | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeFieldUpdateOperationsInput | $Enums.StudyType
    primaryPurpose?: NullableStringFieldUpdateOperationsInput | string | null
    interventionModel?: NullableStringFieldUpdateOperationsInput | string | null
    masking?: NullableStringFieldUpdateOperationsInput | string | null
    allocation?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentCount?: NullableIntFieldUpdateOperationsInput | number | null
    enrollmentType?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sponsorName?: NullableStringFieldUpdateOperationsInput | string | null
    sponsorType?: NullableStringFieldUpdateOperationsInput | string | null
    leadSponsorClass?: NullableStringFieldUpdateOperationsInput | string | null
    collaborators?: ClinicalTrialUpdatecollaboratorsInput | string[]
    conditions?: ClinicalTrialUpdateconditionsInput | string[]
    interventions?: ClinicalTrialUpdateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialUpdatekeywordsInput | string[]
    meshTerms?: ClinicalTrialUpdatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialUpdateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialUpdatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: NullableStringFieldUpdateOperationsInput | string | null
    healthyVolunteers?: BoolFieldUpdateOperationsInput | boolean
    minimumAge?: NullableIntFieldUpdateOperationsInput | number | null
    maximumAge?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialUpdatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sites?: TrialSiteUncheckedUpdateManyWithoutTrialNestedInput
    patientMatches?: PatientMatchUncheckedUpdateManyWithoutTrialNestedInput
    enrollments?: EnrollmentUncheckedUpdateManyWithoutTrialNestedInput
  }

  export type ClinicalTrialCreateManyInput = {
    id?: string
    nctId: string
    title: string
    officialTitle?: string | null
    briefSummary?: string | null
    detailedDescription?: string | null
    status?: $Enums.TrialStatus
    phase?: $Enums.TrialPhase | null
    studyType?: $Enums.StudyType
    primaryPurpose?: string | null
    interventionModel?: string | null
    masking?: string | null
    allocation?: string | null
    enrollmentCount?: number | null
    enrollmentType?: string | null
    startDate?: Date | string | null
    completionDate?: Date | string | null
    primaryCompletionDate?: Date | string | null
    lastUpdatedDate?: Date | string | null
    sponsorName?: string | null
    sponsorType?: string | null
    leadSponsorClass?: string | null
    collaborators?: ClinicalTrialCreatecollaboratorsInput | string[]
    conditions?: ClinicalTrialCreateconditionsInput | string[]
    interventions?: ClinicalTrialCreateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialCreatekeywordsInput | string[]
    meshTerms?: ClinicalTrialCreatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialCreateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialCreatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: string | null
    healthyVolunteers?: boolean
    minimumAge?: number | null
    maximumAge?: number | null
    gender?: string | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialCreatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClinicalTrialUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nctId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    officialTitle?: NullableStringFieldUpdateOperationsInput | string | null
    briefSummary?: NullableStringFieldUpdateOperationsInput | string | null
    detailedDescription?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrialStatusFieldUpdateOperationsInput | $Enums.TrialStatus
    phase?: NullableEnumTrialPhaseFieldUpdateOperationsInput | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeFieldUpdateOperationsInput | $Enums.StudyType
    primaryPurpose?: NullableStringFieldUpdateOperationsInput | string | null
    interventionModel?: NullableStringFieldUpdateOperationsInput | string | null
    masking?: NullableStringFieldUpdateOperationsInput | string | null
    allocation?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentCount?: NullableIntFieldUpdateOperationsInput | number | null
    enrollmentType?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sponsorName?: NullableStringFieldUpdateOperationsInput | string | null
    sponsorType?: NullableStringFieldUpdateOperationsInput | string | null
    leadSponsorClass?: NullableStringFieldUpdateOperationsInput | string | null
    collaborators?: ClinicalTrialUpdatecollaboratorsInput | string[]
    conditions?: ClinicalTrialUpdateconditionsInput | string[]
    interventions?: ClinicalTrialUpdateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialUpdatekeywordsInput | string[]
    meshTerms?: ClinicalTrialUpdatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialUpdateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialUpdatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: NullableStringFieldUpdateOperationsInput | string | null
    healthyVolunteers?: BoolFieldUpdateOperationsInput | boolean
    minimumAge?: NullableIntFieldUpdateOperationsInput | number | null
    maximumAge?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialUpdatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalTrialUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nctId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    officialTitle?: NullableStringFieldUpdateOperationsInput | string | null
    briefSummary?: NullableStringFieldUpdateOperationsInput | string | null
    detailedDescription?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrialStatusFieldUpdateOperationsInput | $Enums.TrialStatus
    phase?: NullableEnumTrialPhaseFieldUpdateOperationsInput | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeFieldUpdateOperationsInput | $Enums.StudyType
    primaryPurpose?: NullableStringFieldUpdateOperationsInput | string | null
    interventionModel?: NullableStringFieldUpdateOperationsInput | string | null
    masking?: NullableStringFieldUpdateOperationsInput | string | null
    allocation?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentCount?: NullableIntFieldUpdateOperationsInput | number | null
    enrollmentType?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sponsorName?: NullableStringFieldUpdateOperationsInput | string | null
    sponsorType?: NullableStringFieldUpdateOperationsInput | string | null
    leadSponsorClass?: NullableStringFieldUpdateOperationsInput | string | null
    collaborators?: ClinicalTrialUpdatecollaboratorsInput | string[]
    conditions?: ClinicalTrialUpdateconditionsInput | string[]
    interventions?: ClinicalTrialUpdateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialUpdatekeywordsInput | string[]
    meshTerms?: ClinicalTrialUpdatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialUpdateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialUpdatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: NullableStringFieldUpdateOperationsInput | string | null
    healthyVolunteers?: BoolFieldUpdateOperationsInput | boolean
    minimumAge?: NullableIntFieldUpdateOperationsInput | number | null
    maximumAge?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialUpdatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialSiteCreateInput = {
    id?: string
    facilityName: string
    facilityId?: string | null
    status?: $Enums.SiteStatus
    city: string
    state?: string | null
    country: string
    zipCode?: string | null
    latitude?: number | null
    longitude?: number | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    principalInvestigator?: string | null
    recruitmentStatus?: string | null
    targetEnrollment?: number | null
    currentEnrollment?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    trial: ClinicalTrialCreateNestedOneWithoutSitesInput
    enrollments?: EnrollmentCreateNestedManyWithoutSiteInput
  }

  export type TrialSiteUncheckedCreateInput = {
    id?: string
    trialId: string
    facilityName: string
    facilityId?: string | null
    status?: $Enums.SiteStatus
    city: string
    state?: string | null
    country: string
    zipCode?: string | null
    latitude?: number | null
    longitude?: number | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    principalInvestigator?: string | null
    recruitmentStatus?: string | null
    targetEnrollment?: number | null
    currentEnrollment?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    enrollments?: EnrollmentUncheckedCreateNestedManyWithoutSiteInput
  }

  export type TrialSiteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    facilityName?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSiteStatusFieldUpdateOperationsInput | $Enums.SiteStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    principalInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    recruitmentStatus?: NullableStringFieldUpdateOperationsInput | string | null
    targetEnrollment?: NullableIntFieldUpdateOperationsInput | number | null
    currentEnrollment?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trial?: ClinicalTrialUpdateOneRequiredWithoutSitesNestedInput
    enrollments?: EnrollmentUpdateManyWithoutSiteNestedInput
  }

  export type TrialSiteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    facilityName?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSiteStatusFieldUpdateOperationsInput | $Enums.SiteStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    principalInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    recruitmentStatus?: NullableStringFieldUpdateOperationsInput | string | null
    targetEnrollment?: NullableIntFieldUpdateOperationsInput | number | null
    currentEnrollment?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: EnrollmentUncheckedUpdateManyWithoutSiteNestedInput
  }

  export type TrialSiteCreateManyInput = {
    id?: string
    trialId: string
    facilityName: string
    facilityId?: string | null
    status?: $Enums.SiteStatus
    city: string
    state?: string | null
    country: string
    zipCode?: string | null
    latitude?: number | null
    longitude?: number | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    principalInvestigator?: string | null
    recruitmentStatus?: string | null
    targetEnrollment?: number | null
    currentEnrollment?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrialSiteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    facilityName?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSiteStatusFieldUpdateOperationsInput | $Enums.SiteStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    principalInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    recruitmentStatus?: NullableStringFieldUpdateOperationsInput | string | null
    targetEnrollment?: NullableIntFieldUpdateOperationsInput | number | null
    currentEnrollment?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialSiteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    facilityName?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSiteStatusFieldUpdateOperationsInput | $Enums.SiteStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    principalInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    recruitmentStatus?: NullableStringFieldUpdateOperationsInput | string | null
    targetEnrollment?: NullableIntFieldUpdateOperationsInput | number | null
    currentEnrollment?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientMatchCreateInput = {
    id?: string
    patientId: string
    matchScore: number
    eligibilityStatus?: $Enums.EligibilityStatus
    matchedCriteria: JsonNullValueInput | InputJsonValue
    unmatchedCriteria: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: number | null
    nearestSiteId?: string | null
    reviewStatus?: $Enums.ReviewStatus
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNotes?: string | null
    patientNotified?: boolean
    notifiedAt?: Date | string | null
    isInterested?: boolean | null
    interestExpressedAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    trial: ClinicalTrialCreateNestedOneWithoutPatientMatchesInput
  }

  export type PatientMatchUncheckedCreateInput = {
    id?: string
    patientId: string
    trialId: string
    matchScore: number
    eligibilityStatus?: $Enums.EligibilityStatus
    matchedCriteria: JsonNullValueInput | InputJsonValue
    unmatchedCriteria: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: number | null
    nearestSiteId?: string | null
    reviewStatus?: $Enums.ReviewStatus
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNotes?: string | null
    patientNotified?: boolean
    notifiedAt?: Date | string | null
    isInterested?: boolean | null
    interestExpressedAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientMatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    matchScore?: FloatFieldUpdateOperationsInput | number
    eligibilityStatus?: EnumEligibilityStatusFieldUpdateOperationsInput | $Enums.EligibilityStatus
    matchedCriteria?: JsonNullValueInput | InputJsonValue
    unmatchedCriteria?: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: NullableFloatFieldUpdateOperationsInput | number | null
    nearestSiteId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    patientNotified?: BoolFieldUpdateOperationsInput | boolean
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isInterested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    interestExpressedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trial?: ClinicalTrialUpdateOneRequiredWithoutPatientMatchesNestedInput
  }

  export type PatientMatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    matchScore?: FloatFieldUpdateOperationsInput | number
    eligibilityStatus?: EnumEligibilityStatusFieldUpdateOperationsInput | $Enums.EligibilityStatus
    matchedCriteria?: JsonNullValueInput | InputJsonValue
    unmatchedCriteria?: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: NullableFloatFieldUpdateOperationsInput | number | null
    nearestSiteId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    patientNotified?: BoolFieldUpdateOperationsInput | boolean
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isInterested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    interestExpressedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientMatchCreateManyInput = {
    id?: string
    patientId: string
    trialId: string
    matchScore: number
    eligibilityStatus?: $Enums.EligibilityStatus
    matchedCriteria: JsonNullValueInput | InputJsonValue
    unmatchedCriteria: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: number | null
    nearestSiteId?: string | null
    reviewStatus?: $Enums.ReviewStatus
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNotes?: string | null
    patientNotified?: boolean
    notifiedAt?: Date | string | null
    isInterested?: boolean | null
    interestExpressedAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientMatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    matchScore?: FloatFieldUpdateOperationsInput | number
    eligibilityStatus?: EnumEligibilityStatusFieldUpdateOperationsInput | $Enums.EligibilityStatus
    matchedCriteria?: JsonNullValueInput | InputJsonValue
    unmatchedCriteria?: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: NullableFloatFieldUpdateOperationsInput | number | null
    nearestSiteId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    patientNotified?: BoolFieldUpdateOperationsInput | boolean
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isInterested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    interestExpressedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientMatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    matchScore?: FloatFieldUpdateOperationsInput | number
    eligibilityStatus?: EnumEligibilityStatusFieldUpdateOperationsInput | $Enums.EligibilityStatus
    matchedCriteria?: JsonNullValueInput | InputJsonValue
    unmatchedCriteria?: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: NullableFloatFieldUpdateOperationsInput | number | null
    nearestSiteId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    patientNotified?: BoolFieldUpdateOperationsInput | boolean
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isInterested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    interestExpressedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnrollmentCreateInput = {
    id?: string
    patientId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    trial: ClinicalTrialCreateNestedOneWithoutEnrollmentsInput
    site: TrialSiteCreateNestedOneWithoutEnrollmentsInput
    consentRecords?: ConsentRecordCreateNestedManyWithoutEnrollmentInput
    statusHistory?: EnrollmentStatusHistoryCreateNestedManyWithoutEnrollmentInput
    visits?: TrialVisitCreateNestedManyWithoutEnrollmentInput
  }

  export type EnrollmentUncheckedCreateInput = {
    id?: string
    patientId: string
    trialId: string
    siteId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    consentRecords?: ConsentRecordUncheckedCreateNestedManyWithoutEnrollmentInput
    statusHistory?: EnrollmentStatusHistoryUncheckedCreateNestedManyWithoutEnrollmentInput
    visits?: TrialVisitUncheckedCreateNestedManyWithoutEnrollmentInput
  }

  export type EnrollmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trial?: ClinicalTrialUpdateOneRequiredWithoutEnrollmentsNestedInput
    site?: TrialSiteUpdateOneRequiredWithoutEnrollmentsNestedInput
    consentRecords?: ConsentRecordUpdateManyWithoutEnrollmentNestedInput
    statusHistory?: EnrollmentStatusHistoryUpdateManyWithoutEnrollmentNestedInput
    visits?: TrialVisitUpdateManyWithoutEnrollmentNestedInput
  }

  export type EnrollmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consentRecords?: ConsentRecordUncheckedUpdateManyWithoutEnrollmentNestedInput
    statusHistory?: EnrollmentStatusHistoryUncheckedUpdateManyWithoutEnrollmentNestedInput
    visits?: TrialVisitUncheckedUpdateManyWithoutEnrollmentNestedInput
  }

  export type EnrollmentCreateManyInput = {
    id?: string
    patientId: string
    trialId: string
    siteId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EnrollmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnrollmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnrollmentStatusHistoryCreateInput = {
    id?: string
    fromStatus?: $Enums.EnrollmentStatus | null
    toStatus: $Enums.EnrollmentStatus
    reason?: string | null
    changedBy: string
    changedAt?: Date | string
    enrollment: EnrollmentCreateNestedOneWithoutStatusHistoryInput
  }

  export type EnrollmentStatusHistoryUncheckedCreateInput = {
    id?: string
    enrollmentId: string
    fromStatus?: $Enums.EnrollmentStatus | null
    toStatus: $Enums.EnrollmentStatus
    reason?: string | null
    changedBy: string
    changedAt?: Date | string
  }

  export type EnrollmentStatusHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus | null
    toStatus?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollment?: EnrollmentUpdateOneRequiredWithoutStatusHistoryNestedInput
  }

  export type EnrollmentStatusHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    enrollmentId?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus | null
    toStatus?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnrollmentStatusHistoryCreateManyInput = {
    id?: string
    enrollmentId: string
    fromStatus?: $Enums.EnrollmentStatus | null
    toStatus: $Enums.EnrollmentStatus
    reason?: string | null
    changedBy: string
    changedAt?: Date | string
  }

  export type EnrollmentStatusHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus | null
    toStatus?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnrollmentStatusHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    enrollmentId?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus | null
    toStatus?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordCreateInput = {
    id?: string
    consentType: $Enums.ConsentType
    consentFormId?: string | null
    consentFormVersion?: string | null
    signedAt: Date | string
    signedBy: string
    witnessName?: string | null
    witnessSignedAt?: Date | string | null
    coordinatorName?: string | null
    coordinatorId?: string | null
    documentUrl?: string | null
    isActive?: boolean
    revokedAt?: Date | string | null
    revokedReason?: string | null
    expiresAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enrollment: EnrollmentCreateNestedOneWithoutConsentRecordsInput
  }

  export type ConsentRecordUncheckedCreateInput = {
    id?: string
    enrollmentId: string
    consentType: $Enums.ConsentType
    consentFormId?: string | null
    consentFormVersion?: string | null
    signedAt: Date | string
    signedBy: string
    witnessName?: string | null
    witnessSignedAt?: Date | string | null
    coordinatorName?: string | null
    coordinatorId?: string | null
    documentUrl?: string | null
    isActive?: boolean
    revokedAt?: Date | string | null
    revokedReason?: string | null
    expiresAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConsentRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentType?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType
    consentFormId?: NullableStringFieldUpdateOperationsInput | string | null
    consentFormVersion?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signedBy?: StringFieldUpdateOperationsInput | string
    witnessName?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coordinatorName?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatorId?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedReason?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollment?: EnrollmentUpdateOneRequiredWithoutConsentRecordsNestedInput
  }

  export type ConsentRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    enrollmentId?: StringFieldUpdateOperationsInput | string
    consentType?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType
    consentFormId?: NullableStringFieldUpdateOperationsInput | string | null
    consentFormVersion?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signedBy?: StringFieldUpdateOperationsInput | string
    witnessName?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coordinatorName?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatorId?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedReason?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordCreateManyInput = {
    id?: string
    enrollmentId: string
    consentType: $Enums.ConsentType
    consentFormId?: string | null
    consentFormVersion?: string | null
    signedAt: Date | string
    signedBy: string
    witnessName?: string | null
    witnessSignedAt?: Date | string | null
    coordinatorName?: string | null
    coordinatorId?: string | null
    documentUrl?: string | null
    isActive?: boolean
    revokedAt?: Date | string | null
    revokedReason?: string | null
    expiresAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConsentRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentType?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType
    consentFormId?: NullableStringFieldUpdateOperationsInput | string | null
    consentFormVersion?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signedBy?: StringFieldUpdateOperationsInput | string
    witnessName?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coordinatorName?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatorId?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedReason?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    enrollmentId?: StringFieldUpdateOperationsInput | string
    consentType?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType
    consentFormId?: NullableStringFieldUpdateOperationsInput | string | null
    consentFormVersion?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signedBy?: StringFieldUpdateOperationsInput | string
    witnessName?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coordinatorName?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatorId?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedReason?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialVisitCreateInput = {
    id?: string
    visitNumber: number
    visitName: string
    visitType?: $Enums.VisitType
    scheduledDate?: Date | string | null
    actualDate?: Date | string | null
    status?: $Enums.VisitStatus
    completedBy?: string | null
    notes?: string | null
    protocolDeviations?: string | null
    missedReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enrollment: EnrollmentCreateNestedOneWithoutVisitsInput
  }

  export type TrialVisitUncheckedCreateInput = {
    id?: string
    enrollmentId: string
    visitNumber: number
    visitName: string
    visitType?: $Enums.VisitType
    scheduledDate?: Date | string | null
    actualDate?: Date | string | null
    status?: $Enums.VisitStatus
    completedBy?: string | null
    notes?: string | null
    protocolDeviations?: string | null
    missedReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrialVisitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitNumber?: IntFieldUpdateOperationsInput | number
    visitName?: StringFieldUpdateOperationsInput | string
    visitType?: EnumVisitTypeFieldUpdateOperationsInput | $Enums.VisitType
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    protocolDeviations?: NullableStringFieldUpdateOperationsInput | string | null
    missedReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollment?: EnrollmentUpdateOneRequiredWithoutVisitsNestedInput
  }

  export type TrialVisitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    enrollmentId?: StringFieldUpdateOperationsInput | string
    visitNumber?: IntFieldUpdateOperationsInput | number
    visitName?: StringFieldUpdateOperationsInput | string
    visitType?: EnumVisitTypeFieldUpdateOperationsInput | $Enums.VisitType
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    protocolDeviations?: NullableStringFieldUpdateOperationsInput | string | null
    missedReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialVisitCreateManyInput = {
    id?: string
    enrollmentId: string
    visitNumber: number
    visitName: string
    visitType?: $Enums.VisitType
    scheduledDate?: Date | string | null
    actualDate?: Date | string | null
    status?: $Enums.VisitStatus
    completedBy?: string | null
    notes?: string | null
    protocolDeviations?: string | null
    missedReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrialVisitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitNumber?: IntFieldUpdateOperationsInput | number
    visitName?: StringFieldUpdateOperationsInput | string
    visitType?: EnumVisitTypeFieldUpdateOperationsInput | $Enums.VisitType
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    protocolDeviations?: NullableStringFieldUpdateOperationsInput | string | null
    missedReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialVisitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    enrollmentId?: StringFieldUpdateOperationsInput | string
    visitNumber?: IntFieldUpdateOperationsInput | number
    visitName?: StringFieldUpdateOperationsInput | string
    visitType?: EnumVisitTypeFieldUpdateOperationsInput | $Enums.VisitType
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    protocolDeviations?: NullableStringFieldUpdateOperationsInput | string | null
    missedReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigatorCreateInput = {
    id?: string
    userId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    specialty?: string | null
    institution?: string | null
    npiNumber?: string | null
    licenseNumber?: string | null
    licenseState?: string | null
    cvUrl?: string | null
    isActive?: boolean
    roles?: InvestigatorCreaterolesInput | $Enums.InvestigatorRole[]
    certifications?: InvestigatorCreatecertificationsInput | InputJsonValue[]
    trainingRecords?: InvestigatorCreatetrainingRecordsInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
    siteAssignments?: InvestigatorSiteAssignmentCreateNestedManyWithoutInvestigatorInput
  }

  export type InvestigatorUncheckedCreateInput = {
    id?: string
    userId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    specialty?: string | null
    institution?: string | null
    npiNumber?: string | null
    licenseNumber?: string | null
    licenseState?: string | null
    cvUrl?: string | null
    isActive?: boolean
    roles?: InvestigatorCreaterolesInput | $Enums.InvestigatorRole[]
    certifications?: InvestigatorCreatecertificationsInput | InputJsonValue[]
    trainingRecords?: InvestigatorCreatetrainingRecordsInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
    siteAssignments?: InvestigatorSiteAssignmentUncheckedCreateNestedManyWithoutInvestigatorInput
  }

  export type InvestigatorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: NullableStringFieldUpdateOperationsInput | string | null
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    npiNumber?: NullableStringFieldUpdateOperationsInput | string | null
    licenseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    licenseState?: NullableStringFieldUpdateOperationsInput | string | null
    cvUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    roles?: InvestigatorUpdaterolesInput | $Enums.InvestigatorRole[]
    certifications?: InvestigatorUpdatecertificationsInput | InputJsonValue[]
    trainingRecords?: InvestigatorUpdatetrainingRecordsInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    siteAssignments?: InvestigatorSiteAssignmentUpdateManyWithoutInvestigatorNestedInput
  }

  export type InvestigatorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: NullableStringFieldUpdateOperationsInput | string | null
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    npiNumber?: NullableStringFieldUpdateOperationsInput | string | null
    licenseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    licenseState?: NullableStringFieldUpdateOperationsInput | string | null
    cvUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    roles?: InvestigatorUpdaterolesInput | $Enums.InvestigatorRole[]
    certifications?: InvestigatorUpdatecertificationsInput | InputJsonValue[]
    trainingRecords?: InvestigatorUpdatetrainingRecordsInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    siteAssignments?: InvestigatorSiteAssignmentUncheckedUpdateManyWithoutInvestigatorNestedInput
  }

  export type InvestigatorCreateManyInput = {
    id?: string
    userId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    specialty?: string | null
    institution?: string | null
    npiNumber?: string | null
    licenseNumber?: string | null
    licenseState?: string | null
    cvUrl?: string | null
    isActive?: boolean
    roles?: InvestigatorCreaterolesInput | $Enums.InvestigatorRole[]
    certifications?: InvestigatorCreatecertificationsInput | InputJsonValue[]
    trainingRecords?: InvestigatorCreatetrainingRecordsInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestigatorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: NullableStringFieldUpdateOperationsInput | string | null
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    npiNumber?: NullableStringFieldUpdateOperationsInput | string | null
    licenseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    licenseState?: NullableStringFieldUpdateOperationsInput | string | null
    cvUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    roles?: InvestigatorUpdaterolesInput | $Enums.InvestigatorRole[]
    certifications?: InvestigatorUpdatecertificationsInput | InputJsonValue[]
    trainingRecords?: InvestigatorUpdatetrainingRecordsInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigatorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: NullableStringFieldUpdateOperationsInput | string | null
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    npiNumber?: NullableStringFieldUpdateOperationsInput | string | null
    licenseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    licenseState?: NullableStringFieldUpdateOperationsInput | string | null
    cvUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    roles?: InvestigatorUpdaterolesInput | $Enums.InvestigatorRole[]
    certifications?: InvestigatorUpdatecertificationsInput | InputJsonValue[]
    trainingRecords?: InvestigatorUpdatetrainingRecordsInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigatorSiteAssignmentCreateInput = {
    id?: string
    siteId: string
    trialId: string
    role: $Enums.InvestigatorRole
    startDate?: Date | string
    endDate?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    investigator: InvestigatorCreateNestedOneWithoutSiteAssignmentsInput
  }

  export type InvestigatorSiteAssignmentUncheckedCreateInput = {
    id?: string
    investigatorId: string
    siteId: string
    trialId: string
    role: $Enums.InvestigatorRole
    startDate?: Date | string
    endDate?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestigatorSiteAssignmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    role?: EnumInvestigatorRoleFieldUpdateOperationsInput | $Enums.InvestigatorRole
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    investigator?: InvestigatorUpdateOneRequiredWithoutSiteAssignmentsNestedInput
  }

  export type InvestigatorSiteAssignmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    investigatorId?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    role?: EnumInvestigatorRoleFieldUpdateOperationsInput | $Enums.InvestigatorRole
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigatorSiteAssignmentCreateManyInput = {
    id?: string
    investigatorId: string
    siteId: string
    trialId: string
    role: $Enums.InvestigatorRole
    startDate?: Date | string
    endDate?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestigatorSiteAssignmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    role?: EnumInvestigatorRoleFieldUpdateOperationsInput | $Enums.InvestigatorRole
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigatorSiteAssignmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    investigatorId?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    role?: EnumInvestigatorRoleFieldUpdateOperationsInput | $Enums.InvestigatorRole
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialNotificationCreateInput = {
    id?: string
    recipientId: string
    recipientType: $Enums.RecipientType
    type: $Enums.NotificationType
    title: string
    message: string
    trialId?: string | null
    enrollmentId?: string | null
    matchId?: string | null
    priority?: $Enums.NotificationPriority
    isRead?: boolean
    readAt?: Date | string | null
    sentAt?: Date | string
    deliveryMethod?: $Enums.DeliveryMethod
    externalId?: string | null
    createdAt?: Date | string
  }

  export type TrialNotificationUncheckedCreateInput = {
    id?: string
    recipientId: string
    recipientType: $Enums.RecipientType
    type: $Enums.NotificationType
    title: string
    message: string
    trialId?: string | null
    enrollmentId?: string | null
    matchId?: string | null
    priority?: $Enums.NotificationPriority
    isRead?: boolean
    readAt?: Date | string | null
    sentAt?: Date | string
    deliveryMethod?: $Enums.DeliveryMethod
    externalId?: string | null
    createdAt?: Date | string
  }

  export type TrialNotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    recipientType?: EnumRecipientTypeFieldUpdateOperationsInput | $Enums.RecipientType
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    trialId?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentId?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryMethod?: EnumDeliveryMethodFieldUpdateOperationsInput | $Enums.DeliveryMethod
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialNotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    recipientType?: EnumRecipientTypeFieldUpdateOperationsInput | $Enums.RecipientType
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    trialId?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentId?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryMethod?: EnumDeliveryMethodFieldUpdateOperationsInput | $Enums.DeliveryMethod
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialNotificationCreateManyInput = {
    id?: string
    recipientId: string
    recipientType: $Enums.RecipientType
    type: $Enums.NotificationType
    title: string
    message: string
    trialId?: string | null
    enrollmentId?: string | null
    matchId?: string | null
    priority?: $Enums.NotificationPriority
    isRead?: boolean
    readAt?: Date | string | null
    sentAt?: Date | string
    deliveryMethod?: $Enums.DeliveryMethod
    externalId?: string | null
    createdAt?: Date | string
  }

  export type TrialNotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    recipientType?: EnumRecipientTypeFieldUpdateOperationsInput | $Enums.RecipientType
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    trialId?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentId?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryMethod?: EnumDeliveryMethodFieldUpdateOperationsInput | $Enums.DeliveryMethod
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialNotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    recipientType?: EnumRecipientTypeFieldUpdateOperationsInput | $Enums.RecipientType
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    trialId?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentId?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryMethod?: EnumDeliveryMethodFieldUpdateOperationsInput | $Enums.DeliveryMethod
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type EnumTrialStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TrialStatus | EnumTrialStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrialStatus[] | ListEnumTrialStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrialStatus[] | ListEnumTrialStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrialStatusFilter<$PrismaModel> | $Enums.TrialStatus
  }

  export type EnumTrialPhaseNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TrialPhase | EnumTrialPhaseFieldRefInput<$PrismaModel> | null
    in?: $Enums.TrialPhase[] | ListEnumTrialPhaseFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TrialPhase[] | ListEnumTrialPhaseFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTrialPhaseNullableFilter<$PrismaModel> | $Enums.TrialPhase | null
  }

  export type EnumStudyTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StudyType | EnumStudyTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StudyType[] | ListEnumStudyTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StudyType[] | ListEnumStudyTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStudyTypeFilter<$PrismaModel> | $Enums.StudyType
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }
  export type JsonNullableListFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableListFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableListFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableListFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableListFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableListFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue[] | ListJsonFieldRefInput<$PrismaModel> | null
    has?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    hasEvery?: InputJsonValue[] | ListJsonFieldRefInput<$PrismaModel>
    hasSome?: InputJsonValue[] | ListJsonFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type TrialSiteListRelationFilter = {
    every?: TrialSiteWhereInput
    some?: TrialSiteWhereInput
    none?: TrialSiteWhereInput
  }

  export type PatientMatchListRelationFilter = {
    every?: PatientMatchWhereInput
    some?: PatientMatchWhereInput
    none?: PatientMatchWhereInput
  }

  export type EnrollmentListRelationFilter = {
    every?: EnrollmentWhereInput
    some?: EnrollmentWhereInput
    none?: EnrollmentWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TrialSiteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientMatchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EnrollmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClinicalTrialCountOrderByAggregateInput = {
    id?: SortOrder
    nctId?: SortOrder
    title?: SortOrder
    officialTitle?: SortOrder
    briefSummary?: SortOrder
    detailedDescription?: SortOrder
    status?: SortOrder
    phase?: SortOrder
    studyType?: SortOrder
    primaryPurpose?: SortOrder
    interventionModel?: SortOrder
    masking?: SortOrder
    allocation?: SortOrder
    enrollmentCount?: SortOrder
    enrollmentType?: SortOrder
    startDate?: SortOrder
    completionDate?: SortOrder
    primaryCompletionDate?: SortOrder
    lastUpdatedDate?: SortOrder
    sponsorName?: SortOrder
    sponsorType?: SortOrder
    leadSponsorClass?: SortOrder
    collaborators?: SortOrder
    conditions?: SortOrder
    interventions?: SortOrder
    keywords?: SortOrder
    meshTerms?: SortOrder
    primaryOutcomes?: SortOrder
    secondaryOutcomes?: SortOrder
    eligibilityCriteria?: SortOrder
    eligibilityText?: SortOrder
    healthyVolunteers?: SortOrder
    minimumAge?: SortOrder
    maximumAge?: SortOrder
    gender?: SortOrder
    contactName?: SortOrder
    contactPhone?: SortOrder
    contactEmail?: SortOrder
    overallOfficial?: SortOrder
    locations?: SortOrder
    fhirResearchStudy?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClinicalTrialAvgOrderByAggregateInput = {
    enrollmentCount?: SortOrder
    minimumAge?: SortOrder
    maximumAge?: SortOrder
  }

  export type ClinicalTrialMaxOrderByAggregateInput = {
    id?: SortOrder
    nctId?: SortOrder
    title?: SortOrder
    officialTitle?: SortOrder
    briefSummary?: SortOrder
    detailedDescription?: SortOrder
    status?: SortOrder
    phase?: SortOrder
    studyType?: SortOrder
    primaryPurpose?: SortOrder
    interventionModel?: SortOrder
    masking?: SortOrder
    allocation?: SortOrder
    enrollmentCount?: SortOrder
    enrollmentType?: SortOrder
    startDate?: SortOrder
    completionDate?: SortOrder
    primaryCompletionDate?: SortOrder
    lastUpdatedDate?: SortOrder
    sponsorName?: SortOrder
    sponsorType?: SortOrder
    leadSponsorClass?: SortOrder
    eligibilityText?: SortOrder
    healthyVolunteers?: SortOrder
    minimumAge?: SortOrder
    maximumAge?: SortOrder
    gender?: SortOrder
    contactName?: SortOrder
    contactPhone?: SortOrder
    contactEmail?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClinicalTrialMinOrderByAggregateInput = {
    id?: SortOrder
    nctId?: SortOrder
    title?: SortOrder
    officialTitle?: SortOrder
    briefSummary?: SortOrder
    detailedDescription?: SortOrder
    status?: SortOrder
    phase?: SortOrder
    studyType?: SortOrder
    primaryPurpose?: SortOrder
    interventionModel?: SortOrder
    masking?: SortOrder
    allocation?: SortOrder
    enrollmentCount?: SortOrder
    enrollmentType?: SortOrder
    startDate?: SortOrder
    completionDate?: SortOrder
    primaryCompletionDate?: SortOrder
    lastUpdatedDate?: SortOrder
    sponsorName?: SortOrder
    sponsorType?: SortOrder
    leadSponsorClass?: SortOrder
    eligibilityText?: SortOrder
    healthyVolunteers?: SortOrder
    minimumAge?: SortOrder
    maximumAge?: SortOrder
    gender?: SortOrder
    contactName?: SortOrder
    contactPhone?: SortOrder
    contactEmail?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClinicalTrialSumOrderByAggregateInput = {
    enrollmentCount?: SortOrder
    minimumAge?: SortOrder
    maximumAge?: SortOrder
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

  export type EnumTrialStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrialStatus | EnumTrialStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrialStatus[] | ListEnumTrialStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrialStatus[] | ListEnumTrialStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrialStatusWithAggregatesFilter<$PrismaModel> | $Enums.TrialStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrialStatusFilter<$PrismaModel>
    _max?: NestedEnumTrialStatusFilter<$PrismaModel>
  }

  export type EnumTrialPhaseNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrialPhase | EnumTrialPhaseFieldRefInput<$PrismaModel> | null
    in?: $Enums.TrialPhase[] | ListEnumTrialPhaseFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TrialPhase[] | ListEnumTrialPhaseFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTrialPhaseNullableWithAggregatesFilter<$PrismaModel> | $Enums.TrialPhase | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTrialPhaseNullableFilter<$PrismaModel>
    _max?: NestedEnumTrialPhaseNullableFilter<$PrismaModel>
  }

  export type EnumStudyTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StudyType | EnumStudyTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StudyType[] | ListEnumStudyTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StudyType[] | ListEnumStudyTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStudyTypeWithAggregatesFilter<$PrismaModel> | $Enums.StudyType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStudyTypeFilter<$PrismaModel>
    _max?: NestedEnumStudyTypeFilter<$PrismaModel>
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type EnumSiteStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SiteStatus | EnumSiteStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SiteStatus[] | ListEnumSiteStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SiteStatus[] | ListEnumSiteStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSiteStatusFilter<$PrismaModel> | $Enums.SiteStatus
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

  export type ClinicalTrialRelationFilter = {
    is?: ClinicalTrialWhereInput
    isNot?: ClinicalTrialWhereInput
  }

  export type TrialSiteTrialIdFacilityNameCityCompoundUniqueInput = {
    trialId: string
    facilityName: string
    city: string
  }

  export type TrialSiteCountOrderByAggregateInput = {
    id?: SortOrder
    trialId?: SortOrder
    facilityName?: SortOrder
    facilityId?: SortOrder
    status?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    zipCode?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    contactName?: SortOrder
    contactPhone?: SortOrder
    contactEmail?: SortOrder
    principalInvestigator?: SortOrder
    recruitmentStatus?: SortOrder
    targetEnrollment?: SortOrder
    currentEnrollment?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrialSiteAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    targetEnrollment?: SortOrder
    currentEnrollment?: SortOrder
  }

  export type TrialSiteMaxOrderByAggregateInput = {
    id?: SortOrder
    trialId?: SortOrder
    facilityName?: SortOrder
    facilityId?: SortOrder
    status?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    zipCode?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    contactName?: SortOrder
    contactPhone?: SortOrder
    contactEmail?: SortOrder
    principalInvestigator?: SortOrder
    recruitmentStatus?: SortOrder
    targetEnrollment?: SortOrder
    currentEnrollment?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrialSiteMinOrderByAggregateInput = {
    id?: SortOrder
    trialId?: SortOrder
    facilityName?: SortOrder
    facilityId?: SortOrder
    status?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    zipCode?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    contactName?: SortOrder
    contactPhone?: SortOrder
    contactEmail?: SortOrder
    principalInvestigator?: SortOrder
    recruitmentStatus?: SortOrder
    targetEnrollment?: SortOrder
    currentEnrollment?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrialSiteSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    targetEnrollment?: SortOrder
    currentEnrollment?: SortOrder
  }

  export type EnumSiteStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SiteStatus | EnumSiteStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SiteStatus[] | ListEnumSiteStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SiteStatus[] | ListEnumSiteStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSiteStatusWithAggregatesFilter<$PrismaModel> | $Enums.SiteStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSiteStatusFilter<$PrismaModel>
    _max?: NestedEnumSiteStatusFilter<$PrismaModel>
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

  export type EnumEligibilityStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EligibilityStatus | EnumEligibilityStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EligibilityStatus[] | ListEnumEligibilityStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EligibilityStatus[] | ListEnumEligibilityStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEligibilityStatusFilter<$PrismaModel> | $Enums.EligibilityStatus
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

  export type EnumReviewStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReviewStatus | EnumReviewStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReviewStatus[] | ListEnumReviewStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReviewStatus[] | ListEnumReviewStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReviewStatusFilter<$PrismaModel> | $Enums.ReviewStatus
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type PatientMatchPatientIdTrialIdCompoundUniqueInput = {
    patientId: string
    trialId: string
  }

  export type PatientMatchCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    trialId?: SortOrder
    matchScore?: SortOrder
    eligibilityStatus?: SortOrder
    matchedCriteria?: SortOrder
    unmatchedCriteria?: SortOrder
    uncertainCriteria?: SortOrder
    matchDetails?: SortOrder
    distance?: SortOrder
    nearestSiteId?: SortOrder
    reviewStatus?: SortOrder
    reviewedBy?: SortOrder
    reviewedAt?: SortOrder
    reviewNotes?: SortOrder
    patientNotified?: SortOrder
    notifiedAt?: SortOrder
    isInterested?: SortOrder
    interestExpressedAt?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMatchAvgOrderByAggregateInput = {
    matchScore?: SortOrder
    distance?: SortOrder
  }

  export type PatientMatchMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    trialId?: SortOrder
    matchScore?: SortOrder
    eligibilityStatus?: SortOrder
    distance?: SortOrder
    nearestSiteId?: SortOrder
    reviewStatus?: SortOrder
    reviewedBy?: SortOrder
    reviewedAt?: SortOrder
    reviewNotes?: SortOrder
    patientNotified?: SortOrder
    notifiedAt?: SortOrder
    isInterested?: SortOrder
    interestExpressedAt?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMatchMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    trialId?: SortOrder
    matchScore?: SortOrder
    eligibilityStatus?: SortOrder
    distance?: SortOrder
    nearestSiteId?: SortOrder
    reviewStatus?: SortOrder
    reviewedBy?: SortOrder
    reviewedAt?: SortOrder
    reviewNotes?: SortOrder
    patientNotified?: SortOrder
    notifiedAt?: SortOrder
    isInterested?: SortOrder
    interestExpressedAt?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMatchSumOrderByAggregateInput = {
    matchScore?: SortOrder
    distance?: SortOrder
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

  export type EnumEligibilityStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EligibilityStatus | EnumEligibilityStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EligibilityStatus[] | ListEnumEligibilityStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EligibilityStatus[] | ListEnumEligibilityStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEligibilityStatusWithAggregatesFilter<$PrismaModel> | $Enums.EligibilityStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEligibilityStatusFilter<$PrismaModel>
    _max?: NestedEnumEligibilityStatusFilter<$PrismaModel>
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

  export type EnumReviewStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReviewStatus | EnumReviewStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReviewStatus[] | ListEnumReviewStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReviewStatus[] | ListEnumReviewStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReviewStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReviewStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReviewStatusFilter<$PrismaModel>
    _max?: NestedEnumReviewStatusFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type EnumEnrollmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EnrollmentStatus | EnumEnrollmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEnrollmentStatusFilter<$PrismaModel> | $Enums.EnrollmentStatus
  }

  export type TrialSiteRelationFilter = {
    is?: TrialSiteWhereInput
    isNot?: TrialSiteWhereInput
  }

  export type ConsentRecordListRelationFilter = {
    every?: ConsentRecordWhereInput
    some?: ConsentRecordWhereInput
    none?: ConsentRecordWhereInput
  }

  export type EnrollmentStatusHistoryListRelationFilter = {
    every?: EnrollmentStatusHistoryWhereInput
    some?: EnrollmentStatusHistoryWhereInput
    none?: EnrollmentStatusHistoryWhereInput
  }

  export type TrialVisitListRelationFilter = {
    every?: TrialVisitWhereInput
    some?: TrialVisitWhereInput
    none?: TrialVisitWhereInput
  }

  export type ConsentRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EnrollmentStatusHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TrialVisitOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EnrollmentPatientIdTrialIdCompoundUniqueInput = {
    patientId: string
    trialId: string
  }

  export type EnrollmentCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    trialId?: SortOrder
    siteId?: SortOrder
    status?: SortOrder
    studySubjectId?: SortOrder
    screeningDate?: SortOrder
    enrollmentDate?: SortOrder
    randomizationDate?: SortOrder
    armAssignment?: SortOrder
    withdrawalDate?: SortOrder
    withdrawalReason?: SortOrder
    completionDate?: SortOrder
    primaryInvestigator?: SortOrder
    studyCoordinator?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnrollmentMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    trialId?: SortOrder
    siteId?: SortOrder
    status?: SortOrder
    studySubjectId?: SortOrder
    screeningDate?: SortOrder
    enrollmentDate?: SortOrder
    randomizationDate?: SortOrder
    armAssignment?: SortOrder
    withdrawalDate?: SortOrder
    withdrawalReason?: SortOrder
    completionDate?: SortOrder
    primaryInvestigator?: SortOrder
    studyCoordinator?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnrollmentMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    trialId?: SortOrder
    siteId?: SortOrder
    status?: SortOrder
    studySubjectId?: SortOrder
    screeningDate?: SortOrder
    enrollmentDate?: SortOrder
    randomizationDate?: SortOrder
    armAssignment?: SortOrder
    withdrawalDate?: SortOrder
    withdrawalReason?: SortOrder
    completionDate?: SortOrder
    primaryInvestigator?: SortOrder
    studyCoordinator?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumEnrollmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EnrollmentStatus | EnumEnrollmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEnrollmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.EnrollmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEnrollmentStatusFilter<$PrismaModel>
    _max?: NestedEnumEnrollmentStatusFilter<$PrismaModel>
  }

  export type EnumEnrollmentStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.EnrollmentStatus | EnumEnrollmentStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumEnrollmentStatusNullableFilter<$PrismaModel> | $Enums.EnrollmentStatus | null
  }

  export type EnrollmentRelationFilter = {
    is?: EnrollmentWhereInput
    isNot?: EnrollmentWhereInput
  }

  export type EnrollmentStatusHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    reason?: SortOrder
    changedBy?: SortOrder
    changedAt?: SortOrder
  }

  export type EnrollmentStatusHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    reason?: SortOrder
    changedBy?: SortOrder
    changedAt?: SortOrder
  }

  export type EnrollmentStatusHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    reason?: SortOrder
    changedBy?: SortOrder
    changedAt?: SortOrder
  }

  export type EnumEnrollmentStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EnrollmentStatus | EnumEnrollmentStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumEnrollmentStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.EnrollmentStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumEnrollmentStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumEnrollmentStatusNullableFilter<$PrismaModel>
  }

  export type EnumConsentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentType | EnumConsentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumConsentTypeFilter<$PrismaModel> | $Enums.ConsentType
  }

  export type ConsentRecordCountOrderByAggregateInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    consentType?: SortOrder
    consentFormId?: SortOrder
    consentFormVersion?: SortOrder
    signedAt?: SortOrder
    signedBy?: SortOrder
    witnessName?: SortOrder
    witnessSignedAt?: SortOrder
    coordinatorName?: SortOrder
    coordinatorId?: SortOrder
    documentUrl?: SortOrder
    isActive?: SortOrder
    revokedAt?: SortOrder
    revokedReason?: SortOrder
    expiresAt?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConsentRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    consentType?: SortOrder
    consentFormId?: SortOrder
    consentFormVersion?: SortOrder
    signedAt?: SortOrder
    signedBy?: SortOrder
    witnessName?: SortOrder
    witnessSignedAt?: SortOrder
    coordinatorName?: SortOrder
    coordinatorId?: SortOrder
    documentUrl?: SortOrder
    isActive?: SortOrder
    revokedAt?: SortOrder
    revokedReason?: SortOrder
    expiresAt?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConsentRecordMinOrderByAggregateInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    consentType?: SortOrder
    consentFormId?: SortOrder
    consentFormVersion?: SortOrder
    signedAt?: SortOrder
    signedBy?: SortOrder
    witnessName?: SortOrder
    witnessSignedAt?: SortOrder
    coordinatorName?: SortOrder
    coordinatorId?: SortOrder
    documentUrl?: SortOrder
    isActive?: SortOrder
    revokedAt?: SortOrder
    revokedReason?: SortOrder
    expiresAt?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumConsentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentType | EnumConsentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumConsentTypeWithAggregatesFilter<$PrismaModel> | $Enums.ConsentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConsentTypeFilter<$PrismaModel>
    _max?: NestedEnumConsentTypeFilter<$PrismaModel>
  }

  export type EnumVisitTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitType | EnumVisitTypeFieldRefInput<$PrismaModel>
    in?: $Enums.VisitType[] | ListEnumVisitTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitType[] | ListEnumVisitTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitTypeFilter<$PrismaModel> | $Enums.VisitType
  }

  export type EnumVisitStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitStatus | EnumVisitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VisitStatus[] | ListEnumVisitStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitStatus[] | ListEnumVisitStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitStatusFilter<$PrismaModel> | $Enums.VisitStatus
  }

  export type TrialVisitEnrollmentIdVisitNumberCompoundUniqueInput = {
    enrollmentId: string
    visitNumber: number
  }

  export type TrialVisitCountOrderByAggregateInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    visitNumber?: SortOrder
    visitName?: SortOrder
    visitType?: SortOrder
    scheduledDate?: SortOrder
    actualDate?: SortOrder
    status?: SortOrder
    completedBy?: SortOrder
    notes?: SortOrder
    protocolDeviations?: SortOrder
    missedReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrialVisitAvgOrderByAggregateInput = {
    visitNumber?: SortOrder
  }

  export type TrialVisitMaxOrderByAggregateInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    visitNumber?: SortOrder
    visitName?: SortOrder
    visitType?: SortOrder
    scheduledDate?: SortOrder
    actualDate?: SortOrder
    status?: SortOrder
    completedBy?: SortOrder
    notes?: SortOrder
    protocolDeviations?: SortOrder
    missedReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrialVisitMinOrderByAggregateInput = {
    id?: SortOrder
    enrollmentId?: SortOrder
    visitNumber?: SortOrder
    visitName?: SortOrder
    visitType?: SortOrder
    scheduledDate?: SortOrder
    actualDate?: SortOrder
    status?: SortOrder
    completedBy?: SortOrder
    notes?: SortOrder
    protocolDeviations?: SortOrder
    missedReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrialVisitSumOrderByAggregateInput = {
    visitNumber?: SortOrder
  }

  export type EnumVisitTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitType | EnumVisitTypeFieldRefInput<$PrismaModel>
    in?: $Enums.VisitType[] | ListEnumVisitTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitType[] | ListEnumVisitTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitTypeWithAggregatesFilter<$PrismaModel> | $Enums.VisitType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVisitTypeFilter<$PrismaModel>
    _max?: NestedEnumVisitTypeFilter<$PrismaModel>
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

  export type EnumInvestigatorRoleNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.InvestigatorRole[] | ListEnumInvestigatorRoleFieldRefInput<$PrismaModel> | null
    has?: $Enums.InvestigatorRole | EnumInvestigatorRoleFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.InvestigatorRole[] | ListEnumInvestigatorRoleFieldRefInput<$PrismaModel>
    hasSome?: $Enums.InvestigatorRole[] | ListEnumInvestigatorRoleFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type InvestigatorSiteAssignmentListRelationFilter = {
    every?: InvestigatorSiteAssignmentWhereInput
    some?: InvestigatorSiteAssignmentWhereInput
    none?: InvestigatorSiteAssignmentWhereInput
  }

  export type InvestigatorSiteAssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvestigatorCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    specialty?: SortOrder
    institution?: SortOrder
    npiNumber?: SortOrder
    licenseNumber?: SortOrder
    licenseState?: SortOrder
    cvUrl?: SortOrder
    isActive?: SortOrder
    roles?: SortOrder
    certifications?: SortOrder
    trainingRecords?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvestigatorMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    specialty?: SortOrder
    institution?: SortOrder
    npiNumber?: SortOrder
    licenseNumber?: SortOrder
    licenseState?: SortOrder
    cvUrl?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvestigatorMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    specialty?: SortOrder
    institution?: SortOrder
    npiNumber?: SortOrder
    licenseNumber?: SortOrder
    licenseState?: SortOrder
    cvUrl?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumInvestigatorRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.InvestigatorRole | EnumInvestigatorRoleFieldRefInput<$PrismaModel>
    in?: $Enums.InvestigatorRole[] | ListEnumInvestigatorRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvestigatorRole[] | ListEnumInvestigatorRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumInvestigatorRoleFilter<$PrismaModel> | $Enums.InvestigatorRole
  }

  export type InvestigatorRelationFilter = {
    is?: InvestigatorWhereInput
    isNot?: InvestigatorWhereInput
  }

  export type InvestigatorSiteAssignmentInvestigatorIdSiteIdTrialIdRoleCompoundUniqueInput = {
    investigatorId: string
    siteId: string
    trialId: string
    role: $Enums.InvestigatorRole
  }

  export type InvestigatorSiteAssignmentCountOrderByAggregateInput = {
    id?: SortOrder
    investigatorId?: SortOrder
    siteId?: SortOrder
    trialId?: SortOrder
    role?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvestigatorSiteAssignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    investigatorId?: SortOrder
    siteId?: SortOrder
    trialId?: SortOrder
    role?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvestigatorSiteAssignmentMinOrderByAggregateInput = {
    id?: SortOrder
    investigatorId?: SortOrder
    siteId?: SortOrder
    trialId?: SortOrder
    role?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumInvestigatorRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvestigatorRole | EnumInvestigatorRoleFieldRefInput<$PrismaModel>
    in?: $Enums.InvestigatorRole[] | ListEnumInvestigatorRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvestigatorRole[] | ListEnumInvestigatorRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumInvestigatorRoleWithAggregatesFilter<$PrismaModel> | $Enums.InvestigatorRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvestigatorRoleFilter<$PrismaModel>
    _max?: NestedEnumInvestigatorRoleFilter<$PrismaModel>
  }

  export type EnumRecipientTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RecipientType | EnumRecipientTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RecipientType[] | ListEnumRecipientTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RecipientType[] | ListEnumRecipientTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRecipientTypeFilter<$PrismaModel> | $Enums.RecipientType
  }

  export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type EnumNotificationPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationPriority | EnumNotificationPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationPriorityFilter<$PrismaModel> | $Enums.NotificationPriority
  }

  export type EnumDeliveryMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.DeliveryMethod | EnumDeliveryMethodFieldRefInput<$PrismaModel>
    in?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumDeliveryMethodFilter<$PrismaModel> | $Enums.DeliveryMethod
  }

  export type TrialNotificationCountOrderByAggregateInput = {
    id?: SortOrder
    recipientId?: SortOrder
    recipientType?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    trialId?: SortOrder
    enrollmentId?: SortOrder
    matchId?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrder
    sentAt?: SortOrder
    deliveryMethod?: SortOrder
    externalId?: SortOrder
    createdAt?: SortOrder
  }

  export type TrialNotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    recipientId?: SortOrder
    recipientType?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    trialId?: SortOrder
    enrollmentId?: SortOrder
    matchId?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrder
    sentAt?: SortOrder
    deliveryMethod?: SortOrder
    externalId?: SortOrder
    createdAt?: SortOrder
  }

  export type TrialNotificationMinOrderByAggregateInput = {
    id?: SortOrder
    recipientId?: SortOrder
    recipientType?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    trialId?: SortOrder
    enrollmentId?: SortOrder
    matchId?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrder
    sentAt?: SortOrder
    deliveryMethod?: SortOrder
    externalId?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumRecipientTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RecipientType | EnumRecipientTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RecipientType[] | ListEnumRecipientTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RecipientType[] | ListEnumRecipientTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRecipientTypeWithAggregatesFilter<$PrismaModel> | $Enums.RecipientType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRecipientTypeFilter<$PrismaModel>
    _max?: NestedEnumRecipientTypeFilter<$PrismaModel>
  }

  export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type EnumNotificationPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationPriority | EnumNotificationPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationPriorityWithAggregatesFilter<$PrismaModel> | $Enums.NotificationPriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationPriorityFilter<$PrismaModel>
    _max?: NestedEnumNotificationPriorityFilter<$PrismaModel>
  }

  export type EnumDeliveryMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeliveryMethod | EnumDeliveryMethodFieldRefInput<$PrismaModel>
    in?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumDeliveryMethodWithAggregatesFilter<$PrismaModel> | $Enums.DeliveryMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeliveryMethodFilter<$PrismaModel>
    _max?: NestedEnumDeliveryMethodFilter<$PrismaModel>
  }

  export type ClinicalTrialCreatecollaboratorsInput = {
    set: string[]
  }

  export type ClinicalTrialCreateconditionsInput = {
    set: string[]
  }

  export type ClinicalTrialCreateinterventionsInput = {
    set: InputJsonValue[]
  }

  export type ClinicalTrialCreatekeywordsInput = {
    set: string[]
  }

  export type ClinicalTrialCreatemeshTermsInput = {
    set: string[]
  }

  export type ClinicalTrialCreateprimaryOutcomesInput = {
    set: InputJsonValue[]
  }

  export type ClinicalTrialCreatesecondaryOutcomesInput = {
    set: InputJsonValue[]
  }

  export type ClinicalTrialCreatelocationsInput = {
    set: InputJsonValue[]
  }

  export type TrialSiteCreateNestedManyWithoutTrialInput = {
    create?: XOR<TrialSiteCreateWithoutTrialInput, TrialSiteUncheckedCreateWithoutTrialInput> | TrialSiteCreateWithoutTrialInput[] | TrialSiteUncheckedCreateWithoutTrialInput[]
    connectOrCreate?: TrialSiteCreateOrConnectWithoutTrialInput | TrialSiteCreateOrConnectWithoutTrialInput[]
    createMany?: TrialSiteCreateManyTrialInputEnvelope
    connect?: TrialSiteWhereUniqueInput | TrialSiteWhereUniqueInput[]
  }

  export type PatientMatchCreateNestedManyWithoutTrialInput = {
    create?: XOR<PatientMatchCreateWithoutTrialInput, PatientMatchUncheckedCreateWithoutTrialInput> | PatientMatchCreateWithoutTrialInput[] | PatientMatchUncheckedCreateWithoutTrialInput[]
    connectOrCreate?: PatientMatchCreateOrConnectWithoutTrialInput | PatientMatchCreateOrConnectWithoutTrialInput[]
    createMany?: PatientMatchCreateManyTrialInputEnvelope
    connect?: PatientMatchWhereUniqueInput | PatientMatchWhereUniqueInput[]
  }

  export type EnrollmentCreateNestedManyWithoutTrialInput = {
    create?: XOR<EnrollmentCreateWithoutTrialInput, EnrollmentUncheckedCreateWithoutTrialInput> | EnrollmentCreateWithoutTrialInput[] | EnrollmentUncheckedCreateWithoutTrialInput[]
    connectOrCreate?: EnrollmentCreateOrConnectWithoutTrialInput | EnrollmentCreateOrConnectWithoutTrialInput[]
    createMany?: EnrollmentCreateManyTrialInputEnvelope
    connect?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
  }

  export type TrialSiteUncheckedCreateNestedManyWithoutTrialInput = {
    create?: XOR<TrialSiteCreateWithoutTrialInput, TrialSiteUncheckedCreateWithoutTrialInput> | TrialSiteCreateWithoutTrialInput[] | TrialSiteUncheckedCreateWithoutTrialInput[]
    connectOrCreate?: TrialSiteCreateOrConnectWithoutTrialInput | TrialSiteCreateOrConnectWithoutTrialInput[]
    createMany?: TrialSiteCreateManyTrialInputEnvelope
    connect?: TrialSiteWhereUniqueInput | TrialSiteWhereUniqueInput[]
  }

  export type PatientMatchUncheckedCreateNestedManyWithoutTrialInput = {
    create?: XOR<PatientMatchCreateWithoutTrialInput, PatientMatchUncheckedCreateWithoutTrialInput> | PatientMatchCreateWithoutTrialInput[] | PatientMatchUncheckedCreateWithoutTrialInput[]
    connectOrCreate?: PatientMatchCreateOrConnectWithoutTrialInput | PatientMatchCreateOrConnectWithoutTrialInput[]
    createMany?: PatientMatchCreateManyTrialInputEnvelope
    connect?: PatientMatchWhereUniqueInput | PatientMatchWhereUniqueInput[]
  }

  export type EnrollmentUncheckedCreateNestedManyWithoutTrialInput = {
    create?: XOR<EnrollmentCreateWithoutTrialInput, EnrollmentUncheckedCreateWithoutTrialInput> | EnrollmentCreateWithoutTrialInput[] | EnrollmentUncheckedCreateWithoutTrialInput[]
    connectOrCreate?: EnrollmentCreateOrConnectWithoutTrialInput | EnrollmentCreateOrConnectWithoutTrialInput[]
    createMany?: EnrollmentCreateManyTrialInputEnvelope
    connect?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumTrialStatusFieldUpdateOperationsInput = {
    set?: $Enums.TrialStatus
  }

  export type NullableEnumTrialPhaseFieldUpdateOperationsInput = {
    set?: $Enums.TrialPhase | null
  }

  export type EnumStudyTypeFieldUpdateOperationsInput = {
    set?: $Enums.StudyType
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ClinicalTrialUpdatecollaboratorsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ClinicalTrialUpdateconditionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ClinicalTrialUpdateinterventionsInput = {
    set?: InputJsonValue[]
    push?: InputJsonValue | InputJsonValue[]
  }

  export type ClinicalTrialUpdatekeywordsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ClinicalTrialUpdatemeshTermsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ClinicalTrialUpdateprimaryOutcomesInput = {
    set?: InputJsonValue[]
    push?: InputJsonValue | InputJsonValue[]
  }

  export type ClinicalTrialUpdatesecondaryOutcomesInput = {
    set?: InputJsonValue[]
    push?: InputJsonValue | InputJsonValue[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ClinicalTrialUpdatelocationsInput = {
    set?: InputJsonValue[]
    push?: InputJsonValue | InputJsonValue[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TrialSiteUpdateManyWithoutTrialNestedInput = {
    create?: XOR<TrialSiteCreateWithoutTrialInput, TrialSiteUncheckedCreateWithoutTrialInput> | TrialSiteCreateWithoutTrialInput[] | TrialSiteUncheckedCreateWithoutTrialInput[]
    connectOrCreate?: TrialSiteCreateOrConnectWithoutTrialInput | TrialSiteCreateOrConnectWithoutTrialInput[]
    upsert?: TrialSiteUpsertWithWhereUniqueWithoutTrialInput | TrialSiteUpsertWithWhereUniqueWithoutTrialInput[]
    createMany?: TrialSiteCreateManyTrialInputEnvelope
    set?: TrialSiteWhereUniqueInput | TrialSiteWhereUniqueInput[]
    disconnect?: TrialSiteWhereUniqueInput | TrialSiteWhereUniqueInput[]
    delete?: TrialSiteWhereUniqueInput | TrialSiteWhereUniqueInput[]
    connect?: TrialSiteWhereUniqueInput | TrialSiteWhereUniqueInput[]
    update?: TrialSiteUpdateWithWhereUniqueWithoutTrialInput | TrialSiteUpdateWithWhereUniqueWithoutTrialInput[]
    updateMany?: TrialSiteUpdateManyWithWhereWithoutTrialInput | TrialSiteUpdateManyWithWhereWithoutTrialInput[]
    deleteMany?: TrialSiteScalarWhereInput | TrialSiteScalarWhereInput[]
  }

  export type PatientMatchUpdateManyWithoutTrialNestedInput = {
    create?: XOR<PatientMatchCreateWithoutTrialInput, PatientMatchUncheckedCreateWithoutTrialInput> | PatientMatchCreateWithoutTrialInput[] | PatientMatchUncheckedCreateWithoutTrialInput[]
    connectOrCreate?: PatientMatchCreateOrConnectWithoutTrialInput | PatientMatchCreateOrConnectWithoutTrialInput[]
    upsert?: PatientMatchUpsertWithWhereUniqueWithoutTrialInput | PatientMatchUpsertWithWhereUniqueWithoutTrialInput[]
    createMany?: PatientMatchCreateManyTrialInputEnvelope
    set?: PatientMatchWhereUniqueInput | PatientMatchWhereUniqueInput[]
    disconnect?: PatientMatchWhereUniqueInput | PatientMatchWhereUniqueInput[]
    delete?: PatientMatchWhereUniqueInput | PatientMatchWhereUniqueInput[]
    connect?: PatientMatchWhereUniqueInput | PatientMatchWhereUniqueInput[]
    update?: PatientMatchUpdateWithWhereUniqueWithoutTrialInput | PatientMatchUpdateWithWhereUniqueWithoutTrialInput[]
    updateMany?: PatientMatchUpdateManyWithWhereWithoutTrialInput | PatientMatchUpdateManyWithWhereWithoutTrialInput[]
    deleteMany?: PatientMatchScalarWhereInput | PatientMatchScalarWhereInput[]
  }

  export type EnrollmentUpdateManyWithoutTrialNestedInput = {
    create?: XOR<EnrollmentCreateWithoutTrialInput, EnrollmentUncheckedCreateWithoutTrialInput> | EnrollmentCreateWithoutTrialInput[] | EnrollmentUncheckedCreateWithoutTrialInput[]
    connectOrCreate?: EnrollmentCreateOrConnectWithoutTrialInput | EnrollmentCreateOrConnectWithoutTrialInput[]
    upsert?: EnrollmentUpsertWithWhereUniqueWithoutTrialInput | EnrollmentUpsertWithWhereUniqueWithoutTrialInput[]
    createMany?: EnrollmentCreateManyTrialInputEnvelope
    set?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    disconnect?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    delete?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    connect?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    update?: EnrollmentUpdateWithWhereUniqueWithoutTrialInput | EnrollmentUpdateWithWhereUniqueWithoutTrialInput[]
    updateMany?: EnrollmentUpdateManyWithWhereWithoutTrialInput | EnrollmentUpdateManyWithWhereWithoutTrialInput[]
    deleteMany?: EnrollmentScalarWhereInput | EnrollmentScalarWhereInput[]
  }

  export type TrialSiteUncheckedUpdateManyWithoutTrialNestedInput = {
    create?: XOR<TrialSiteCreateWithoutTrialInput, TrialSiteUncheckedCreateWithoutTrialInput> | TrialSiteCreateWithoutTrialInput[] | TrialSiteUncheckedCreateWithoutTrialInput[]
    connectOrCreate?: TrialSiteCreateOrConnectWithoutTrialInput | TrialSiteCreateOrConnectWithoutTrialInput[]
    upsert?: TrialSiteUpsertWithWhereUniqueWithoutTrialInput | TrialSiteUpsertWithWhereUniqueWithoutTrialInput[]
    createMany?: TrialSiteCreateManyTrialInputEnvelope
    set?: TrialSiteWhereUniqueInput | TrialSiteWhereUniqueInput[]
    disconnect?: TrialSiteWhereUniqueInput | TrialSiteWhereUniqueInput[]
    delete?: TrialSiteWhereUniqueInput | TrialSiteWhereUniqueInput[]
    connect?: TrialSiteWhereUniqueInput | TrialSiteWhereUniqueInput[]
    update?: TrialSiteUpdateWithWhereUniqueWithoutTrialInput | TrialSiteUpdateWithWhereUniqueWithoutTrialInput[]
    updateMany?: TrialSiteUpdateManyWithWhereWithoutTrialInput | TrialSiteUpdateManyWithWhereWithoutTrialInput[]
    deleteMany?: TrialSiteScalarWhereInput | TrialSiteScalarWhereInput[]
  }

  export type PatientMatchUncheckedUpdateManyWithoutTrialNestedInput = {
    create?: XOR<PatientMatchCreateWithoutTrialInput, PatientMatchUncheckedCreateWithoutTrialInput> | PatientMatchCreateWithoutTrialInput[] | PatientMatchUncheckedCreateWithoutTrialInput[]
    connectOrCreate?: PatientMatchCreateOrConnectWithoutTrialInput | PatientMatchCreateOrConnectWithoutTrialInput[]
    upsert?: PatientMatchUpsertWithWhereUniqueWithoutTrialInput | PatientMatchUpsertWithWhereUniqueWithoutTrialInput[]
    createMany?: PatientMatchCreateManyTrialInputEnvelope
    set?: PatientMatchWhereUniqueInput | PatientMatchWhereUniqueInput[]
    disconnect?: PatientMatchWhereUniqueInput | PatientMatchWhereUniqueInput[]
    delete?: PatientMatchWhereUniqueInput | PatientMatchWhereUniqueInput[]
    connect?: PatientMatchWhereUniqueInput | PatientMatchWhereUniqueInput[]
    update?: PatientMatchUpdateWithWhereUniqueWithoutTrialInput | PatientMatchUpdateWithWhereUniqueWithoutTrialInput[]
    updateMany?: PatientMatchUpdateManyWithWhereWithoutTrialInput | PatientMatchUpdateManyWithWhereWithoutTrialInput[]
    deleteMany?: PatientMatchScalarWhereInput | PatientMatchScalarWhereInput[]
  }

  export type EnrollmentUncheckedUpdateManyWithoutTrialNestedInput = {
    create?: XOR<EnrollmentCreateWithoutTrialInput, EnrollmentUncheckedCreateWithoutTrialInput> | EnrollmentCreateWithoutTrialInput[] | EnrollmentUncheckedCreateWithoutTrialInput[]
    connectOrCreate?: EnrollmentCreateOrConnectWithoutTrialInput | EnrollmentCreateOrConnectWithoutTrialInput[]
    upsert?: EnrollmentUpsertWithWhereUniqueWithoutTrialInput | EnrollmentUpsertWithWhereUniqueWithoutTrialInput[]
    createMany?: EnrollmentCreateManyTrialInputEnvelope
    set?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    disconnect?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    delete?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    connect?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    update?: EnrollmentUpdateWithWhereUniqueWithoutTrialInput | EnrollmentUpdateWithWhereUniqueWithoutTrialInput[]
    updateMany?: EnrollmentUpdateManyWithWhereWithoutTrialInput | EnrollmentUpdateManyWithWhereWithoutTrialInput[]
    deleteMany?: EnrollmentScalarWhereInput | EnrollmentScalarWhereInput[]
  }

  export type ClinicalTrialCreateNestedOneWithoutSitesInput = {
    create?: XOR<ClinicalTrialCreateWithoutSitesInput, ClinicalTrialUncheckedCreateWithoutSitesInput>
    connectOrCreate?: ClinicalTrialCreateOrConnectWithoutSitesInput
    connect?: ClinicalTrialWhereUniqueInput
  }

  export type EnrollmentCreateNestedManyWithoutSiteInput = {
    create?: XOR<EnrollmentCreateWithoutSiteInput, EnrollmentUncheckedCreateWithoutSiteInput> | EnrollmentCreateWithoutSiteInput[] | EnrollmentUncheckedCreateWithoutSiteInput[]
    connectOrCreate?: EnrollmentCreateOrConnectWithoutSiteInput | EnrollmentCreateOrConnectWithoutSiteInput[]
    createMany?: EnrollmentCreateManySiteInputEnvelope
    connect?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
  }

  export type EnrollmentUncheckedCreateNestedManyWithoutSiteInput = {
    create?: XOR<EnrollmentCreateWithoutSiteInput, EnrollmentUncheckedCreateWithoutSiteInput> | EnrollmentCreateWithoutSiteInput[] | EnrollmentUncheckedCreateWithoutSiteInput[]
    connectOrCreate?: EnrollmentCreateOrConnectWithoutSiteInput | EnrollmentCreateOrConnectWithoutSiteInput[]
    createMany?: EnrollmentCreateManySiteInputEnvelope
    connect?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
  }

  export type EnumSiteStatusFieldUpdateOperationsInput = {
    set?: $Enums.SiteStatus
  }

  export type NullableFloatFieldUpdateOperationsInput = {
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

  export type ClinicalTrialUpdateOneRequiredWithoutSitesNestedInput = {
    create?: XOR<ClinicalTrialCreateWithoutSitesInput, ClinicalTrialUncheckedCreateWithoutSitesInput>
    connectOrCreate?: ClinicalTrialCreateOrConnectWithoutSitesInput
    upsert?: ClinicalTrialUpsertWithoutSitesInput
    connect?: ClinicalTrialWhereUniqueInput
    update?: XOR<XOR<ClinicalTrialUpdateToOneWithWhereWithoutSitesInput, ClinicalTrialUpdateWithoutSitesInput>, ClinicalTrialUncheckedUpdateWithoutSitesInput>
  }

  export type EnrollmentUpdateManyWithoutSiteNestedInput = {
    create?: XOR<EnrollmentCreateWithoutSiteInput, EnrollmentUncheckedCreateWithoutSiteInput> | EnrollmentCreateWithoutSiteInput[] | EnrollmentUncheckedCreateWithoutSiteInput[]
    connectOrCreate?: EnrollmentCreateOrConnectWithoutSiteInput | EnrollmentCreateOrConnectWithoutSiteInput[]
    upsert?: EnrollmentUpsertWithWhereUniqueWithoutSiteInput | EnrollmentUpsertWithWhereUniqueWithoutSiteInput[]
    createMany?: EnrollmentCreateManySiteInputEnvelope
    set?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    disconnect?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    delete?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    connect?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    update?: EnrollmentUpdateWithWhereUniqueWithoutSiteInput | EnrollmentUpdateWithWhereUniqueWithoutSiteInput[]
    updateMany?: EnrollmentUpdateManyWithWhereWithoutSiteInput | EnrollmentUpdateManyWithWhereWithoutSiteInput[]
    deleteMany?: EnrollmentScalarWhereInput | EnrollmentScalarWhereInput[]
  }

  export type EnrollmentUncheckedUpdateManyWithoutSiteNestedInput = {
    create?: XOR<EnrollmentCreateWithoutSiteInput, EnrollmentUncheckedCreateWithoutSiteInput> | EnrollmentCreateWithoutSiteInput[] | EnrollmentUncheckedCreateWithoutSiteInput[]
    connectOrCreate?: EnrollmentCreateOrConnectWithoutSiteInput | EnrollmentCreateOrConnectWithoutSiteInput[]
    upsert?: EnrollmentUpsertWithWhereUniqueWithoutSiteInput | EnrollmentUpsertWithWhereUniqueWithoutSiteInput[]
    createMany?: EnrollmentCreateManySiteInputEnvelope
    set?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    disconnect?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    delete?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    connect?: EnrollmentWhereUniqueInput | EnrollmentWhereUniqueInput[]
    update?: EnrollmentUpdateWithWhereUniqueWithoutSiteInput | EnrollmentUpdateWithWhereUniqueWithoutSiteInput[]
    updateMany?: EnrollmentUpdateManyWithWhereWithoutSiteInput | EnrollmentUpdateManyWithWhereWithoutSiteInput[]
    deleteMany?: EnrollmentScalarWhereInput | EnrollmentScalarWhereInput[]
  }

  export type ClinicalTrialCreateNestedOneWithoutPatientMatchesInput = {
    create?: XOR<ClinicalTrialCreateWithoutPatientMatchesInput, ClinicalTrialUncheckedCreateWithoutPatientMatchesInput>
    connectOrCreate?: ClinicalTrialCreateOrConnectWithoutPatientMatchesInput
    connect?: ClinicalTrialWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumEligibilityStatusFieldUpdateOperationsInput = {
    set?: $Enums.EligibilityStatus
  }

  export type EnumReviewStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReviewStatus
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type ClinicalTrialUpdateOneRequiredWithoutPatientMatchesNestedInput = {
    create?: XOR<ClinicalTrialCreateWithoutPatientMatchesInput, ClinicalTrialUncheckedCreateWithoutPatientMatchesInput>
    connectOrCreate?: ClinicalTrialCreateOrConnectWithoutPatientMatchesInput
    upsert?: ClinicalTrialUpsertWithoutPatientMatchesInput
    connect?: ClinicalTrialWhereUniqueInput
    update?: XOR<XOR<ClinicalTrialUpdateToOneWithWhereWithoutPatientMatchesInput, ClinicalTrialUpdateWithoutPatientMatchesInput>, ClinicalTrialUncheckedUpdateWithoutPatientMatchesInput>
  }

  export type ClinicalTrialCreateNestedOneWithoutEnrollmentsInput = {
    create?: XOR<ClinicalTrialCreateWithoutEnrollmentsInput, ClinicalTrialUncheckedCreateWithoutEnrollmentsInput>
    connectOrCreate?: ClinicalTrialCreateOrConnectWithoutEnrollmentsInput
    connect?: ClinicalTrialWhereUniqueInput
  }

  export type TrialSiteCreateNestedOneWithoutEnrollmentsInput = {
    create?: XOR<TrialSiteCreateWithoutEnrollmentsInput, TrialSiteUncheckedCreateWithoutEnrollmentsInput>
    connectOrCreate?: TrialSiteCreateOrConnectWithoutEnrollmentsInput
    connect?: TrialSiteWhereUniqueInput
  }

  export type ConsentRecordCreateNestedManyWithoutEnrollmentInput = {
    create?: XOR<ConsentRecordCreateWithoutEnrollmentInput, ConsentRecordUncheckedCreateWithoutEnrollmentInput> | ConsentRecordCreateWithoutEnrollmentInput[] | ConsentRecordUncheckedCreateWithoutEnrollmentInput[]
    connectOrCreate?: ConsentRecordCreateOrConnectWithoutEnrollmentInput | ConsentRecordCreateOrConnectWithoutEnrollmentInput[]
    createMany?: ConsentRecordCreateManyEnrollmentInputEnvelope
    connect?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
  }

  export type EnrollmentStatusHistoryCreateNestedManyWithoutEnrollmentInput = {
    create?: XOR<EnrollmentStatusHistoryCreateWithoutEnrollmentInput, EnrollmentStatusHistoryUncheckedCreateWithoutEnrollmentInput> | EnrollmentStatusHistoryCreateWithoutEnrollmentInput[] | EnrollmentStatusHistoryUncheckedCreateWithoutEnrollmentInput[]
    connectOrCreate?: EnrollmentStatusHistoryCreateOrConnectWithoutEnrollmentInput | EnrollmentStatusHistoryCreateOrConnectWithoutEnrollmentInput[]
    createMany?: EnrollmentStatusHistoryCreateManyEnrollmentInputEnvelope
    connect?: EnrollmentStatusHistoryWhereUniqueInput | EnrollmentStatusHistoryWhereUniqueInput[]
  }

  export type TrialVisitCreateNestedManyWithoutEnrollmentInput = {
    create?: XOR<TrialVisitCreateWithoutEnrollmentInput, TrialVisitUncheckedCreateWithoutEnrollmentInput> | TrialVisitCreateWithoutEnrollmentInput[] | TrialVisitUncheckedCreateWithoutEnrollmentInput[]
    connectOrCreate?: TrialVisitCreateOrConnectWithoutEnrollmentInput | TrialVisitCreateOrConnectWithoutEnrollmentInput[]
    createMany?: TrialVisitCreateManyEnrollmentInputEnvelope
    connect?: TrialVisitWhereUniqueInput | TrialVisitWhereUniqueInput[]
  }

  export type ConsentRecordUncheckedCreateNestedManyWithoutEnrollmentInput = {
    create?: XOR<ConsentRecordCreateWithoutEnrollmentInput, ConsentRecordUncheckedCreateWithoutEnrollmentInput> | ConsentRecordCreateWithoutEnrollmentInput[] | ConsentRecordUncheckedCreateWithoutEnrollmentInput[]
    connectOrCreate?: ConsentRecordCreateOrConnectWithoutEnrollmentInput | ConsentRecordCreateOrConnectWithoutEnrollmentInput[]
    createMany?: ConsentRecordCreateManyEnrollmentInputEnvelope
    connect?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
  }

  export type EnrollmentStatusHistoryUncheckedCreateNestedManyWithoutEnrollmentInput = {
    create?: XOR<EnrollmentStatusHistoryCreateWithoutEnrollmentInput, EnrollmentStatusHistoryUncheckedCreateWithoutEnrollmentInput> | EnrollmentStatusHistoryCreateWithoutEnrollmentInput[] | EnrollmentStatusHistoryUncheckedCreateWithoutEnrollmentInput[]
    connectOrCreate?: EnrollmentStatusHistoryCreateOrConnectWithoutEnrollmentInput | EnrollmentStatusHistoryCreateOrConnectWithoutEnrollmentInput[]
    createMany?: EnrollmentStatusHistoryCreateManyEnrollmentInputEnvelope
    connect?: EnrollmentStatusHistoryWhereUniqueInput | EnrollmentStatusHistoryWhereUniqueInput[]
  }

  export type TrialVisitUncheckedCreateNestedManyWithoutEnrollmentInput = {
    create?: XOR<TrialVisitCreateWithoutEnrollmentInput, TrialVisitUncheckedCreateWithoutEnrollmentInput> | TrialVisitCreateWithoutEnrollmentInput[] | TrialVisitUncheckedCreateWithoutEnrollmentInput[]
    connectOrCreate?: TrialVisitCreateOrConnectWithoutEnrollmentInput | TrialVisitCreateOrConnectWithoutEnrollmentInput[]
    createMany?: TrialVisitCreateManyEnrollmentInputEnvelope
    connect?: TrialVisitWhereUniqueInput | TrialVisitWhereUniqueInput[]
  }

  export type EnumEnrollmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.EnrollmentStatus
  }

  export type ClinicalTrialUpdateOneRequiredWithoutEnrollmentsNestedInput = {
    create?: XOR<ClinicalTrialCreateWithoutEnrollmentsInput, ClinicalTrialUncheckedCreateWithoutEnrollmentsInput>
    connectOrCreate?: ClinicalTrialCreateOrConnectWithoutEnrollmentsInput
    upsert?: ClinicalTrialUpsertWithoutEnrollmentsInput
    connect?: ClinicalTrialWhereUniqueInput
    update?: XOR<XOR<ClinicalTrialUpdateToOneWithWhereWithoutEnrollmentsInput, ClinicalTrialUpdateWithoutEnrollmentsInput>, ClinicalTrialUncheckedUpdateWithoutEnrollmentsInput>
  }

  export type TrialSiteUpdateOneRequiredWithoutEnrollmentsNestedInput = {
    create?: XOR<TrialSiteCreateWithoutEnrollmentsInput, TrialSiteUncheckedCreateWithoutEnrollmentsInput>
    connectOrCreate?: TrialSiteCreateOrConnectWithoutEnrollmentsInput
    upsert?: TrialSiteUpsertWithoutEnrollmentsInput
    connect?: TrialSiteWhereUniqueInput
    update?: XOR<XOR<TrialSiteUpdateToOneWithWhereWithoutEnrollmentsInput, TrialSiteUpdateWithoutEnrollmentsInput>, TrialSiteUncheckedUpdateWithoutEnrollmentsInput>
  }

  export type ConsentRecordUpdateManyWithoutEnrollmentNestedInput = {
    create?: XOR<ConsentRecordCreateWithoutEnrollmentInput, ConsentRecordUncheckedCreateWithoutEnrollmentInput> | ConsentRecordCreateWithoutEnrollmentInput[] | ConsentRecordUncheckedCreateWithoutEnrollmentInput[]
    connectOrCreate?: ConsentRecordCreateOrConnectWithoutEnrollmentInput | ConsentRecordCreateOrConnectWithoutEnrollmentInput[]
    upsert?: ConsentRecordUpsertWithWhereUniqueWithoutEnrollmentInput | ConsentRecordUpsertWithWhereUniqueWithoutEnrollmentInput[]
    createMany?: ConsentRecordCreateManyEnrollmentInputEnvelope
    set?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    disconnect?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    delete?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    connect?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    update?: ConsentRecordUpdateWithWhereUniqueWithoutEnrollmentInput | ConsentRecordUpdateWithWhereUniqueWithoutEnrollmentInput[]
    updateMany?: ConsentRecordUpdateManyWithWhereWithoutEnrollmentInput | ConsentRecordUpdateManyWithWhereWithoutEnrollmentInput[]
    deleteMany?: ConsentRecordScalarWhereInput | ConsentRecordScalarWhereInput[]
  }

  export type EnrollmentStatusHistoryUpdateManyWithoutEnrollmentNestedInput = {
    create?: XOR<EnrollmentStatusHistoryCreateWithoutEnrollmentInput, EnrollmentStatusHistoryUncheckedCreateWithoutEnrollmentInput> | EnrollmentStatusHistoryCreateWithoutEnrollmentInput[] | EnrollmentStatusHistoryUncheckedCreateWithoutEnrollmentInput[]
    connectOrCreate?: EnrollmentStatusHistoryCreateOrConnectWithoutEnrollmentInput | EnrollmentStatusHistoryCreateOrConnectWithoutEnrollmentInput[]
    upsert?: EnrollmentStatusHistoryUpsertWithWhereUniqueWithoutEnrollmentInput | EnrollmentStatusHistoryUpsertWithWhereUniqueWithoutEnrollmentInput[]
    createMany?: EnrollmentStatusHistoryCreateManyEnrollmentInputEnvelope
    set?: EnrollmentStatusHistoryWhereUniqueInput | EnrollmentStatusHistoryWhereUniqueInput[]
    disconnect?: EnrollmentStatusHistoryWhereUniqueInput | EnrollmentStatusHistoryWhereUniqueInput[]
    delete?: EnrollmentStatusHistoryWhereUniqueInput | EnrollmentStatusHistoryWhereUniqueInput[]
    connect?: EnrollmentStatusHistoryWhereUniqueInput | EnrollmentStatusHistoryWhereUniqueInput[]
    update?: EnrollmentStatusHistoryUpdateWithWhereUniqueWithoutEnrollmentInput | EnrollmentStatusHistoryUpdateWithWhereUniqueWithoutEnrollmentInput[]
    updateMany?: EnrollmentStatusHistoryUpdateManyWithWhereWithoutEnrollmentInput | EnrollmentStatusHistoryUpdateManyWithWhereWithoutEnrollmentInput[]
    deleteMany?: EnrollmentStatusHistoryScalarWhereInput | EnrollmentStatusHistoryScalarWhereInput[]
  }

  export type TrialVisitUpdateManyWithoutEnrollmentNestedInput = {
    create?: XOR<TrialVisitCreateWithoutEnrollmentInput, TrialVisitUncheckedCreateWithoutEnrollmentInput> | TrialVisitCreateWithoutEnrollmentInput[] | TrialVisitUncheckedCreateWithoutEnrollmentInput[]
    connectOrCreate?: TrialVisitCreateOrConnectWithoutEnrollmentInput | TrialVisitCreateOrConnectWithoutEnrollmentInput[]
    upsert?: TrialVisitUpsertWithWhereUniqueWithoutEnrollmentInput | TrialVisitUpsertWithWhereUniqueWithoutEnrollmentInput[]
    createMany?: TrialVisitCreateManyEnrollmentInputEnvelope
    set?: TrialVisitWhereUniqueInput | TrialVisitWhereUniqueInput[]
    disconnect?: TrialVisitWhereUniqueInput | TrialVisitWhereUniqueInput[]
    delete?: TrialVisitWhereUniqueInput | TrialVisitWhereUniqueInput[]
    connect?: TrialVisitWhereUniqueInput | TrialVisitWhereUniqueInput[]
    update?: TrialVisitUpdateWithWhereUniqueWithoutEnrollmentInput | TrialVisitUpdateWithWhereUniqueWithoutEnrollmentInput[]
    updateMany?: TrialVisitUpdateManyWithWhereWithoutEnrollmentInput | TrialVisitUpdateManyWithWhereWithoutEnrollmentInput[]
    deleteMany?: TrialVisitScalarWhereInput | TrialVisitScalarWhereInput[]
  }

  export type ConsentRecordUncheckedUpdateManyWithoutEnrollmentNestedInput = {
    create?: XOR<ConsentRecordCreateWithoutEnrollmentInput, ConsentRecordUncheckedCreateWithoutEnrollmentInput> | ConsentRecordCreateWithoutEnrollmentInput[] | ConsentRecordUncheckedCreateWithoutEnrollmentInput[]
    connectOrCreate?: ConsentRecordCreateOrConnectWithoutEnrollmentInput | ConsentRecordCreateOrConnectWithoutEnrollmentInput[]
    upsert?: ConsentRecordUpsertWithWhereUniqueWithoutEnrollmentInput | ConsentRecordUpsertWithWhereUniqueWithoutEnrollmentInput[]
    createMany?: ConsentRecordCreateManyEnrollmentInputEnvelope
    set?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    disconnect?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    delete?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    connect?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    update?: ConsentRecordUpdateWithWhereUniqueWithoutEnrollmentInput | ConsentRecordUpdateWithWhereUniqueWithoutEnrollmentInput[]
    updateMany?: ConsentRecordUpdateManyWithWhereWithoutEnrollmentInput | ConsentRecordUpdateManyWithWhereWithoutEnrollmentInput[]
    deleteMany?: ConsentRecordScalarWhereInput | ConsentRecordScalarWhereInput[]
  }

  export type EnrollmentStatusHistoryUncheckedUpdateManyWithoutEnrollmentNestedInput = {
    create?: XOR<EnrollmentStatusHistoryCreateWithoutEnrollmentInput, EnrollmentStatusHistoryUncheckedCreateWithoutEnrollmentInput> | EnrollmentStatusHistoryCreateWithoutEnrollmentInput[] | EnrollmentStatusHistoryUncheckedCreateWithoutEnrollmentInput[]
    connectOrCreate?: EnrollmentStatusHistoryCreateOrConnectWithoutEnrollmentInput | EnrollmentStatusHistoryCreateOrConnectWithoutEnrollmentInput[]
    upsert?: EnrollmentStatusHistoryUpsertWithWhereUniqueWithoutEnrollmentInput | EnrollmentStatusHistoryUpsertWithWhereUniqueWithoutEnrollmentInput[]
    createMany?: EnrollmentStatusHistoryCreateManyEnrollmentInputEnvelope
    set?: EnrollmentStatusHistoryWhereUniqueInput | EnrollmentStatusHistoryWhereUniqueInput[]
    disconnect?: EnrollmentStatusHistoryWhereUniqueInput | EnrollmentStatusHistoryWhereUniqueInput[]
    delete?: EnrollmentStatusHistoryWhereUniqueInput | EnrollmentStatusHistoryWhereUniqueInput[]
    connect?: EnrollmentStatusHistoryWhereUniqueInput | EnrollmentStatusHistoryWhereUniqueInput[]
    update?: EnrollmentStatusHistoryUpdateWithWhereUniqueWithoutEnrollmentInput | EnrollmentStatusHistoryUpdateWithWhereUniqueWithoutEnrollmentInput[]
    updateMany?: EnrollmentStatusHistoryUpdateManyWithWhereWithoutEnrollmentInput | EnrollmentStatusHistoryUpdateManyWithWhereWithoutEnrollmentInput[]
    deleteMany?: EnrollmentStatusHistoryScalarWhereInput | EnrollmentStatusHistoryScalarWhereInput[]
  }

  export type TrialVisitUncheckedUpdateManyWithoutEnrollmentNestedInput = {
    create?: XOR<TrialVisitCreateWithoutEnrollmentInput, TrialVisitUncheckedCreateWithoutEnrollmentInput> | TrialVisitCreateWithoutEnrollmentInput[] | TrialVisitUncheckedCreateWithoutEnrollmentInput[]
    connectOrCreate?: TrialVisitCreateOrConnectWithoutEnrollmentInput | TrialVisitCreateOrConnectWithoutEnrollmentInput[]
    upsert?: TrialVisitUpsertWithWhereUniqueWithoutEnrollmentInput | TrialVisitUpsertWithWhereUniqueWithoutEnrollmentInput[]
    createMany?: TrialVisitCreateManyEnrollmentInputEnvelope
    set?: TrialVisitWhereUniqueInput | TrialVisitWhereUniqueInput[]
    disconnect?: TrialVisitWhereUniqueInput | TrialVisitWhereUniqueInput[]
    delete?: TrialVisitWhereUniqueInput | TrialVisitWhereUniqueInput[]
    connect?: TrialVisitWhereUniqueInput | TrialVisitWhereUniqueInput[]
    update?: TrialVisitUpdateWithWhereUniqueWithoutEnrollmentInput | TrialVisitUpdateWithWhereUniqueWithoutEnrollmentInput[]
    updateMany?: TrialVisitUpdateManyWithWhereWithoutEnrollmentInput | TrialVisitUpdateManyWithWhereWithoutEnrollmentInput[]
    deleteMany?: TrialVisitScalarWhereInput | TrialVisitScalarWhereInput[]
  }

  export type EnrollmentCreateNestedOneWithoutStatusHistoryInput = {
    create?: XOR<EnrollmentCreateWithoutStatusHistoryInput, EnrollmentUncheckedCreateWithoutStatusHistoryInput>
    connectOrCreate?: EnrollmentCreateOrConnectWithoutStatusHistoryInput
    connect?: EnrollmentWhereUniqueInput
  }

  export type NullableEnumEnrollmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.EnrollmentStatus | null
  }

  export type EnrollmentUpdateOneRequiredWithoutStatusHistoryNestedInput = {
    create?: XOR<EnrollmentCreateWithoutStatusHistoryInput, EnrollmentUncheckedCreateWithoutStatusHistoryInput>
    connectOrCreate?: EnrollmentCreateOrConnectWithoutStatusHistoryInput
    upsert?: EnrollmentUpsertWithoutStatusHistoryInput
    connect?: EnrollmentWhereUniqueInput
    update?: XOR<XOR<EnrollmentUpdateToOneWithWhereWithoutStatusHistoryInput, EnrollmentUpdateWithoutStatusHistoryInput>, EnrollmentUncheckedUpdateWithoutStatusHistoryInput>
  }

  export type EnrollmentCreateNestedOneWithoutConsentRecordsInput = {
    create?: XOR<EnrollmentCreateWithoutConsentRecordsInput, EnrollmentUncheckedCreateWithoutConsentRecordsInput>
    connectOrCreate?: EnrollmentCreateOrConnectWithoutConsentRecordsInput
    connect?: EnrollmentWhereUniqueInput
  }

  export type EnumConsentTypeFieldUpdateOperationsInput = {
    set?: $Enums.ConsentType
  }

  export type EnrollmentUpdateOneRequiredWithoutConsentRecordsNestedInput = {
    create?: XOR<EnrollmentCreateWithoutConsentRecordsInput, EnrollmentUncheckedCreateWithoutConsentRecordsInput>
    connectOrCreate?: EnrollmentCreateOrConnectWithoutConsentRecordsInput
    upsert?: EnrollmentUpsertWithoutConsentRecordsInput
    connect?: EnrollmentWhereUniqueInput
    update?: XOR<XOR<EnrollmentUpdateToOneWithWhereWithoutConsentRecordsInput, EnrollmentUpdateWithoutConsentRecordsInput>, EnrollmentUncheckedUpdateWithoutConsentRecordsInput>
  }

  export type EnrollmentCreateNestedOneWithoutVisitsInput = {
    create?: XOR<EnrollmentCreateWithoutVisitsInput, EnrollmentUncheckedCreateWithoutVisitsInput>
    connectOrCreate?: EnrollmentCreateOrConnectWithoutVisitsInput
    connect?: EnrollmentWhereUniqueInput
  }

  export type EnumVisitTypeFieldUpdateOperationsInput = {
    set?: $Enums.VisitType
  }

  export type EnumVisitStatusFieldUpdateOperationsInput = {
    set?: $Enums.VisitStatus
  }

  export type EnrollmentUpdateOneRequiredWithoutVisitsNestedInput = {
    create?: XOR<EnrollmentCreateWithoutVisitsInput, EnrollmentUncheckedCreateWithoutVisitsInput>
    connectOrCreate?: EnrollmentCreateOrConnectWithoutVisitsInput
    upsert?: EnrollmentUpsertWithoutVisitsInput
    connect?: EnrollmentWhereUniqueInput
    update?: XOR<XOR<EnrollmentUpdateToOneWithWhereWithoutVisitsInput, EnrollmentUpdateWithoutVisitsInput>, EnrollmentUncheckedUpdateWithoutVisitsInput>
  }

  export type InvestigatorCreaterolesInput = {
    set: $Enums.InvestigatorRole[]
  }

  export type InvestigatorCreatecertificationsInput = {
    set: InputJsonValue[]
  }

  export type InvestigatorCreatetrainingRecordsInput = {
    set: InputJsonValue[]
  }

  export type InvestigatorSiteAssignmentCreateNestedManyWithoutInvestigatorInput = {
    create?: XOR<InvestigatorSiteAssignmentCreateWithoutInvestigatorInput, InvestigatorSiteAssignmentUncheckedCreateWithoutInvestigatorInput> | InvestigatorSiteAssignmentCreateWithoutInvestigatorInput[] | InvestigatorSiteAssignmentUncheckedCreateWithoutInvestigatorInput[]
    connectOrCreate?: InvestigatorSiteAssignmentCreateOrConnectWithoutInvestigatorInput | InvestigatorSiteAssignmentCreateOrConnectWithoutInvestigatorInput[]
    createMany?: InvestigatorSiteAssignmentCreateManyInvestigatorInputEnvelope
    connect?: InvestigatorSiteAssignmentWhereUniqueInput | InvestigatorSiteAssignmentWhereUniqueInput[]
  }

  export type InvestigatorSiteAssignmentUncheckedCreateNestedManyWithoutInvestigatorInput = {
    create?: XOR<InvestigatorSiteAssignmentCreateWithoutInvestigatorInput, InvestigatorSiteAssignmentUncheckedCreateWithoutInvestigatorInput> | InvestigatorSiteAssignmentCreateWithoutInvestigatorInput[] | InvestigatorSiteAssignmentUncheckedCreateWithoutInvestigatorInput[]
    connectOrCreate?: InvestigatorSiteAssignmentCreateOrConnectWithoutInvestigatorInput | InvestigatorSiteAssignmentCreateOrConnectWithoutInvestigatorInput[]
    createMany?: InvestigatorSiteAssignmentCreateManyInvestigatorInputEnvelope
    connect?: InvestigatorSiteAssignmentWhereUniqueInput | InvestigatorSiteAssignmentWhereUniqueInput[]
  }

  export type InvestigatorUpdaterolesInput = {
    set?: $Enums.InvestigatorRole[]
    push?: $Enums.InvestigatorRole | $Enums.InvestigatorRole[]
  }

  export type InvestigatorUpdatecertificationsInput = {
    set?: InputJsonValue[]
    push?: InputJsonValue | InputJsonValue[]
  }

  export type InvestigatorUpdatetrainingRecordsInput = {
    set?: InputJsonValue[]
    push?: InputJsonValue | InputJsonValue[]
  }

  export type InvestigatorSiteAssignmentUpdateManyWithoutInvestigatorNestedInput = {
    create?: XOR<InvestigatorSiteAssignmentCreateWithoutInvestigatorInput, InvestigatorSiteAssignmentUncheckedCreateWithoutInvestigatorInput> | InvestigatorSiteAssignmentCreateWithoutInvestigatorInput[] | InvestigatorSiteAssignmentUncheckedCreateWithoutInvestigatorInput[]
    connectOrCreate?: InvestigatorSiteAssignmentCreateOrConnectWithoutInvestigatorInput | InvestigatorSiteAssignmentCreateOrConnectWithoutInvestigatorInput[]
    upsert?: InvestigatorSiteAssignmentUpsertWithWhereUniqueWithoutInvestigatorInput | InvestigatorSiteAssignmentUpsertWithWhereUniqueWithoutInvestigatorInput[]
    createMany?: InvestigatorSiteAssignmentCreateManyInvestigatorInputEnvelope
    set?: InvestigatorSiteAssignmentWhereUniqueInput | InvestigatorSiteAssignmentWhereUniqueInput[]
    disconnect?: InvestigatorSiteAssignmentWhereUniqueInput | InvestigatorSiteAssignmentWhereUniqueInput[]
    delete?: InvestigatorSiteAssignmentWhereUniqueInput | InvestigatorSiteAssignmentWhereUniqueInput[]
    connect?: InvestigatorSiteAssignmentWhereUniqueInput | InvestigatorSiteAssignmentWhereUniqueInput[]
    update?: InvestigatorSiteAssignmentUpdateWithWhereUniqueWithoutInvestigatorInput | InvestigatorSiteAssignmentUpdateWithWhereUniqueWithoutInvestigatorInput[]
    updateMany?: InvestigatorSiteAssignmentUpdateManyWithWhereWithoutInvestigatorInput | InvestigatorSiteAssignmentUpdateManyWithWhereWithoutInvestigatorInput[]
    deleteMany?: InvestigatorSiteAssignmentScalarWhereInput | InvestigatorSiteAssignmentScalarWhereInput[]
  }

  export type InvestigatorSiteAssignmentUncheckedUpdateManyWithoutInvestigatorNestedInput = {
    create?: XOR<InvestigatorSiteAssignmentCreateWithoutInvestigatorInput, InvestigatorSiteAssignmentUncheckedCreateWithoutInvestigatorInput> | InvestigatorSiteAssignmentCreateWithoutInvestigatorInput[] | InvestigatorSiteAssignmentUncheckedCreateWithoutInvestigatorInput[]
    connectOrCreate?: InvestigatorSiteAssignmentCreateOrConnectWithoutInvestigatorInput | InvestigatorSiteAssignmentCreateOrConnectWithoutInvestigatorInput[]
    upsert?: InvestigatorSiteAssignmentUpsertWithWhereUniqueWithoutInvestigatorInput | InvestigatorSiteAssignmentUpsertWithWhereUniqueWithoutInvestigatorInput[]
    createMany?: InvestigatorSiteAssignmentCreateManyInvestigatorInputEnvelope
    set?: InvestigatorSiteAssignmentWhereUniqueInput | InvestigatorSiteAssignmentWhereUniqueInput[]
    disconnect?: InvestigatorSiteAssignmentWhereUniqueInput | InvestigatorSiteAssignmentWhereUniqueInput[]
    delete?: InvestigatorSiteAssignmentWhereUniqueInput | InvestigatorSiteAssignmentWhereUniqueInput[]
    connect?: InvestigatorSiteAssignmentWhereUniqueInput | InvestigatorSiteAssignmentWhereUniqueInput[]
    update?: InvestigatorSiteAssignmentUpdateWithWhereUniqueWithoutInvestigatorInput | InvestigatorSiteAssignmentUpdateWithWhereUniqueWithoutInvestigatorInput[]
    updateMany?: InvestigatorSiteAssignmentUpdateManyWithWhereWithoutInvestigatorInput | InvestigatorSiteAssignmentUpdateManyWithWhereWithoutInvestigatorInput[]
    deleteMany?: InvestigatorSiteAssignmentScalarWhereInput | InvestigatorSiteAssignmentScalarWhereInput[]
  }

  export type InvestigatorCreateNestedOneWithoutSiteAssignmentsInput = {
    create?: XOR<InvestigatorCreateWithoutSiteAssignmentsInput, InvestigatorUncheckedCreateWithoutSiteAssignmentsInput>
    connectOrCreate?: InvestigatorCreateOrConnectWithoutSiteAssignmentsInput
    connect?: InvestigatorWhereUniqueInput
  }

  export type EnumInvestigatorRoleFieldUpdateOperationsInput = {
    set?: $Enums.InvestigatorRole
  }

  export type InvestigatorUpdateOneRequiredWithoutSiteAssignmentsNestedInput = {
    create?: XOR<InvestigatorCreateWithoutSiteAssignmentsInput, InvestigatorUncheckedCreateWithoutSiteAssignmentsInput>
    connectOrCreate?: InvestigatorCreateOrConnectWithoutSiteAssignmentsInput
    upsert?: InvestigatorUpsertWithoutSiteAssignmentsInput
    connect?: InvestigatorWhereUniqueInput
    update?: XOR<XOR<InvestigatorUpdateToOneWithWhereWithoutSiteAssignmentsInput, InvestigatorUpdateWithoutSiteAssignmentsInput>, InvestigatorUncheckedUpdateWithoutSiteAssignmentsInput>
  }

  export type EnumRecipientTypeFieldUpdateOperationsInput = {
    set?: $Enums.RecipientType
  }

  export type EnumNotificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.NotificationType
  }

  export type EnumNotificationPriorityFieldUpdateOperationsInput = {
    set?: $Enums.NotificationPriority
  }

  export type EnumDeliveryMethodFieldUpdateOperationsInput = {
    set?: $Enums.DeliveryMethod
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

  export type NestedEnumTrialStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TrialStatus | EnumTrialStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrialStatus[] | ListEnumTrialStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrialStatus[] | ListEnumTrialStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrialStatusFilter<$PrismaModel> | $Enums.TrialStatus
  }

  export type NestedEnumTrialPhaseNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TrialPhase | EnumTrialPhaseFieldRefInput<$PrismaModel> | null
    in?: $Enums.TrialPhase[] | ListEnumTrialPhaseFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TrialPhase[] | ListEnumTrialPhaseFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTrialPhaseNullableFilter<$PrismaModel> | $Enums.TrialPhase | null
  }

  export type NestedEnumStudyTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StudyType | EnumStudyTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StudyType[] | ListEnumStudyTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StudyType[] | ListEnumStudyTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStudyTypeFilter<$PrismaModel> | $Enums.StudyType
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedEnumTrialStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrialStatus | EnumTrialStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrialStatus[] | ListEnumTrialStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrialStatus[] | ListEnumTrialStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrialStatusWithAggregatesFilter<$PrismaModel> | $Enums.TrialStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrialStatusFilter<$PrismaModel>
    _max?: NestedEnumTrialStatusFilter<$PrismaModel>
  }

  export type NestedEnumTrialPhaseNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrialPhase | EnumTrialPhaseFieldRefInput<$PrismaModel> | null
    in?: $Enums.TrialPhase[] | ListEnumTrialPhaseFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TrialPhase[] | ListEnumTrialPhaseFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTrialPhaseNullableWithAggregatesFilter<$PrismaModel> | $Enums.TrialPhase | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTrialPhaseNullableFilter<$PrismaModel>
    _max?: NestedEnumTrialPhaseNullableFilter<$PrismaModel>
  }

  export type NestedEnumStudyTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StudyType | EnumStudyTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StudyType[] | ListEnumStudyTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StudyType[] | ListEnumStudyTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStudyTypeWithAggregatesFilter<$PrismaModel> | $Enums.StudyType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStudyTypeFilter<$PrismaModel>
    _max?: NestedEnumStudyTypeFilter<$PrismaModel>
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumSiteStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SiteStatus | EnumSiteStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SiteStatus[] | ListEnumSiteStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SiteStatus[] | ListEnumSiteStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSiteStatusFilter<$PrismaModel> | $Enums.SiteStatus
  }

  export type NestedEnumSiteStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SiteStatus | EnumSiteStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SiteStatus[] | ListEnumSiteStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SiteStatus[] | ListEnumSiteStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSiteStatusWithAggregatesFilter<$PrismaModel> | $Enums.SiteStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSiteStatusFilter<$PrismaModel>
    _max?: NestedEnumSiteStatusFilter<$PrismaModel>
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

  export type NestedEnumEligibilityStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EligibilityStatus | EnumEligibilityStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EligibilityStatus[] | ListEnumEligibilityStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EligibilityStatus[] | ListEnumEligibilityStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEligibilityStatusFilter<$PrismaModel> | $Enums.EligibilityStatus
  }

  export type NestedEnumReviewStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReviewStatus | EnumReviewStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReviewStatus[] | ListEnumReviewStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReviewStatus[] | ListEnumReviewStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReviewStatusFilter<$PrismaModel> | $Enums.ReviewStatus
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
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

  export type NestedEnumEligibilityStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EligibilityStatus | EnumEligibilityStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EligibilityStatus[] | ListEnumEligibilityStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EligibilityStatus[] | ListEnumEligibilityStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEligibilityStatusWithAggregatesFilter<$PrismaModel> | $Enums.EligibilityStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEligibilityStatusFilter<$PrismaModel>
    _max?: NestedEnumEligibilityStatusFilter<$PrismaModel>
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

  export type NestedEnumReviewStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReviewStatus | EnumReviewStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReviewStatus[] | ListEnumReviewStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReviewStatus[] | ListEnumReviewStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReviewStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReviewStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReviewStatusFilter<$PrismaModel>
    _max?: NestedEnumReviewStatusFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumEnrollmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EnrollmentStatus | EnumEnrollmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEnrollmentStatusFilter<$PrismaModel> | $Enums.EnrollmentStatus
  }

  export type NestedEnumEnrollmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EnrollmentStatus | EnumEnrollmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEnrollmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.EnrollmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEnrollmentStatusFilter<$PrismaModel>
    _max?: NestedEnumEnrollmentStatusFilter<$PrismaModel>
  }

  export type NestedEnumEnrollmentStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.EnrollmentStatus | EnumEnrollmentStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumEnrollmentStatusNullableFilter<$PrismaModel> | $Enums.EnrollmentStatus | null
  }

  export type NestedEnumEnrollmentStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EnrollmentStatus | EnumEnrollmentStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.EnrollmentStatus[] | ListEnumEnrollmentStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumEnrollmentStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.EnrollmentStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumEnrollmentStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumEnrollmentStatusNullableFilter<$PrismaModel>
  }

  export type NestedEnumConsentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentType | EnumConsentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumConsentTypeFilter<$PrismaModel> | $Enums.ConsentType
  }

  export type NestedEnumConsentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentType | EnumConsentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumConsentTypeWithAggregatesFilter<$PrismaModel> | $Enums.ConsentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConsentTypeFilter<$PrismaModel>
    _max?: NestedEnumConsentTypeFilter<$PrismaModel>
  }

  export type NestedEnumVisitTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitType | EnumVisitTypeFieldRefInput<$PrismaModel>
    in?: $Enums.VisitType[] | ListEnumVisitTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitType[] | ListEnumVisitTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitTypeFilter<$PrismaModel> | $Enums.VisitType
  }

  export type NestedEnumVisitStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitStatus | EnumVisitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VisitStatus[] | ListEnumVisitStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitStatus[] | ListEnumVisitStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitStatusFilter<$PrismaModel> | $Enums.VisitStatus
  }

  export type NestedEnumVisitTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitType | EnumVisitTypeFieldRefInput<$PrismaModel>
    in?: $Enums.VisitType[] | ListEnumVisitTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitType[] | ListEnumVisitTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitTypeWithAggregatesFilter<$PrismaModel> | $Enums.VisitType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVisitTypeFilter<$PrismaModel>
    _max?: NestedEnumVisitTypeFilter<$PrismaModel>
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

  export type NestedEnumInvestigatorRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.InvestigatorRole | EnumInvestigatorRoleFieldRefInput<$PrismaModel>
    in?: $Enums.InvestigatorRole[] | ListEnumInvestigatorRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvestigatorRole[] | ListEnumInvestigatorRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumInvestigatorRoleFilter<$PrismaModel> | $Enums.InvestigatorRole
  }

  export type NestedEnumInvestigatorRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvestigatorRole | EnumInvestigatorRoleFieldRefInput<$PrismaModel>
    in?: $Enums.InvestigatorRole[] | ListEnumInvestigatorRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvestigatorRole[] | ListEnumInvestigatorRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumInvestigatorRoleWithAggregatesFilter<$PrismaModel> | $Enums.InvestigatorRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvestigatorRoleFilter<$PrismaModel>
    _max?: NestedEnumInvestigatorRoleFilter<$PrismaModel>
  }

  export type NestedEnumRecipientTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RecipientType | EnumRecipientTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RecipientType[] | ListEnumRecipientTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RecipientType[] | ListEnumRecipientTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRecipientTypeFilter<$PrismaModel> | $Enums.RecipientType
  }

  export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type NestedEnumNotificationPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationPriority | EnumNotificationPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationPriorityFilter<$PrismaModel> | $Enums.NotificationPriority
  }

  export type NestedEnumDeliveryMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.DeliveryMethod | EnumDeliveryMethodFieldRefInput<$PrismaModel>
    in?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumDeliveryMethodFilter<$PrismaModel> | $Enums.DeliveryMethod
  }

  export type NestedEnumRecipientTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RecipientType | EnumRecipientTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RecipientType[] | ListEnumRecipientTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RecipientType[] | ListEnumRecipientTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRecipientTypeWithAggregatesFilter<$PrismaModel> | $Enums.RecipientType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRecipientTypeFilter<$PrismaModel>
    _max?: NestedEnumRecipientTypeFilter<$PrismaModel>
  }

  export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type NestedEnumNotificationPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationPriority | EnumNotificationPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationPriorityWithAggregatesFilter<$PrismaModel> | $Enums.NotificationPriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationPriorityFilter<$PrismaModel>
    _max?: NestedEnumNotificationPriorityFilter<$PrismaModel>
  }

  export type NestedEnumDeliveryMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeliveryMethod | EnumDeliveryMethodFieldRefInput<$PrismaModel>
    in?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumDeliveryMethodWithAggregatesFilter<$PrismaModel> | $Enums.DeliveryMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeliveryMethodFilter<$PrismaModel>
    _max?: NestedEnumDeliveryMethodFilter<$PrismaModel>
  }

  export type TrialSiteCreateWithoutTrialInput = {
    id?: string
    facilityName: string
    facilityId?: string | null
    status?: $Enums.SiteStatus
    city: string
    state?: string | null
    country: string
    zipCode?: string | null
    latitude?: number | null
    longitude?: number | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    principalInvestigator?: string | null
    recruitmentStatus?: string | null
    targetEnrollment?: number | null
    currentEnrollment?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    enrollments?: EnrollmentCreateNestedManyWithoutSiteInput
  }

  export type TrialSiteUncheckedCreateWithoutTrialInput = {
    id?: string
    facilityName: string
    facilityId?: string | null
    status?: $Enums.SiteStatus
    city: string
    state?: string | null
    country: string
    zipCode?: string | null
    latitude?: number | null
    longitude?: number | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    principalInvestigator?: string | null
    recruitmentStatus?: string | null
    targetEnrollment?: number | null
    currentEnrollment?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    enrollments?: EnrollmentUncheckedCreateNestedManyWithoutSiteInput
  }

  export type TrialSiteCreateOrConnectWithoutTrialInput = {
    where: TrialSiteWhereUniqueInput
    create: XOR<TrialSiteCreateWithoutTrialInput, TrialSiteUncheckedCreateWithoutTrialInput>
  }

  export type TrialSiteCreateManyTrialInputEnvelope = {
    data: TrialSiteCreateManyTrialInput | TrialSiteCreateManyTrialInput[]
    skipDuplicates?: boolean
  }

  export type PatientMatchCreateWithoutTrialInput = {
    id?: string
    patientId: string
    matchScore: number
    eligibilityStatus?: $Enums.EligibilityStatus
    matchedCriteria: JsonNullValueInput | InputJsonValue
    unmatchedCriteria: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: number | null
    nearestSiteId?: string | null
    reviewStatus?: $Enums.ReviewStatus
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNotes?: string | null
    patientNotified?: boolean
    notifiedAt?: Date | string | null
    isInterested?: boolean | null
    interestExpressedAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientMatchUncheckedCreateWithoutTrialInput = {
    id?: string
    patientId: string
    matchScore: number
    eligibilityStatus?: $Enums.EligibilityStatus
    matchedCriteria: JsonNullValueInput | InputJsonValue
    unmatchedCriteria: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: number | null
    nearestSiteId?: string | null
    reviewStatus?: $Enums.ReviewStatus
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNotes?: string | null
    patientNotified?: boolean
    notifiedAt?: Date | string | null
    isInterested?: boolean | null
    interestExpressedAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientMatchCreateOrConnectWithoutTrialInput = {
    where: PatientMatchWhereUniqueInput
    create: XOR<PatientMatchCreateWithoutTrialInput, PatientMatchUncheckedCreateWithoutTrialInput>
  }

  export type PatientMatchCreateManyTrialInputEnvelope = {
    data: PatientMatchCreateManyTrialInput | PatientMatchCreateManyTrialInput[]
    skipDuplicates?: boolean
  }

  export type EnrollmentCreateWithoutTrialInput = {
    id?: string
    patientId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    site: TrialSiteCreateNestedOneWithoutEnrollmentsInput
    consentRecords?: ConsentRecordCreateNestedManyWithoutEnrollmentInput
    statusHistory?: EnrollmentStatusHistoryCreateNestedManyWithoutEnrollmentInput
    visits?: TrialVisitCreateNestedManyWithoutEnrollmentInput
  }

  export type EnrollmentUncheckedCreateWithoutTrialInput = {
    id?: string
    patientId: string
    siteId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    consentRecords?: ConsentRecordUncheckedCreateNestedManyWithoutEnrollmentInput
    statusHistory?: EnrollmentStatusHistoryUncheckedCreateNestedManyWithoutEnrollmentInput
    visits?: TrialVisitUncheckedCreateNestedManyWithoutEnrollmentInput
  }

  export type EnrollmentCreateOrConnectWithoutTrialInput = {
    where: EnrollmentWhereUniqueInput
    create: XOR<EnrollmentCreateWithoutTrialInput, EnrollmentUncheckedCreateWithoutTrialInput>
  }

  export type EnrollmentCreateManyTrialInputEnvelope = {
    data: EnrollmentCreateManyTrialInput | EnrollmentCreateManyTrialInput[]
    skipDuplicates?: boolean
  }

  export type TrialSiteUpsertWithWhereUniqueWithoutTrialInput = {
    where: TrialSiteWhereUniqueInput
    update: XOR<TrialSiteUpdateWithoutTrialInput, TrialSiteUncheckedUpdateWithoutTrialInput>
    create: XOR<TrialSiteCreateWithoutTrialInput, TrialSiteUncheckedCreateWithoutTrialInput>
  }

  export type TrialSiteUpdateWithWhereUniqueWithoutTrialInput = {
    where: TrialSiteWhereUniqueInput
    data: XOR<TrialSiteUpdateWithoutTrialInput, TrialSiteUncheckedUpdateWithoutTrialInput>
  }

  export type TrialSiteUpdateManyWithWhereWithoutTrialInput = {
    where: TrialSiteScalarWhereInput
    data: XOR<TrialSiteUpdateManyMutationInput, TrialSiteUncheckedUpdateManyWithoutTrialInput>
  }

  export type TrialSiteScalarWhereInput = {
    AND?: TrialSiteScalarWhereInput | TrialSiteScalarWhereInput[]
    OR?: TrialSiteScalarWhereInput[]
    NOT?: TrialSiteScalarWhereInput | TrialSiteScalarWhereInput[]
    id?: StringFilter<"TrialSite"> | string
    trialId?: StringFilter<"TrialSite"> | string
    facilityName?: StringFilter<"TrialSite"> | string
    facilityId?: StringNullableFilter<"TrialSite"> | string | null
    status?: EnumSiteStatusFilter<"TrialSite"> | $Enums.SiteStatus
    city?: StringFilter<"TrialSite"> | string
    state?: StringNullableFilter<"TrialSite"> | string | null
    country?: StringFilter<"TrialSite"> | string
    zipCode?: StringNullableFilter<"TrialSite"> | string | null
    latitude?: FloatNullableFilter<"TrialSite"> | number | null
    longitude?: FloatNullableFilter<"TrialSite"> | number | null
    contactName?: StringNullableFilter<"TrialSite"> | string | null
    contactPhone?: StringNullableFilter<"TrialSite"> | string | null
    contactEmail?: StringNullableFilter<"TrialSite"> | string | null
    principalInvestigator?: StringNullableFilter<"TrialSite"> | string | null
    recruitmentStatus?: StringNullableFilter<"TrialSite"> | string | null
    targetEnrollment?: IntNullableFilter<"TrialSite"> | number | null
    currentEnrollment?: IntFilter<"TrialSite"> | number
    isActive?: BoolFilter<"TrialSite"> | boolean
    createdAt?: DateTimeFilter<"TrialSite"> | Date | string
    updatedAt?: DateTimeFilter<"TrialSite"> | Date | string
  }

  export type PatientMatchUpsertWithWhereUniqueWithoutTrialInput = {
    where: PatientMatchWhereUniqueInput
    update: XOR<PatientMatchUpdateWithoutTrialInput, PatientMatchUncheckedUpdateWithoutTrialInput>
    create: XOR<PatientMatchCreateWithoutTrialInput, PatientMatchUncheckedCreateWithoutTrialInput>
  }

  export type PatientMatchUpdateWithWhereUniqueWithoutTrialInput = {
    where: PatientMatchWhereUniqueInput
    data: XOR<PatientMatchUpdateWithoutTrialInput, PatientMatchUncheckedUpdateWithoutTrialInput>
  }

  export type PatientMatchUpdateManyWithWhereWithoutTrialInput = {
    where: PatientMatchScalarWhereInput
    data: XOR<PatientMatchUpdateManyMutationInput, PatientMatchUncheckedUpdateManyWithoutTrialInput>
  }

  export type PatientMatchScalarWhereInput = {
    AND?: PatientMatchScalarWhereInput | PatientMatchScalarWhereInput[]
    OR?: PatientMatchScalarWhereInput[]
    NOT?: PatientMatchScalarWhereInput | PatientMatchScalarWhereInput[]
    id?: StringFilter<"PatientMatch"> | string
    patientId?: StringFilter<"PatientMatch"> | string
    trialId?: StringFilter<"PatientMatch"> | string
    matchScore?: FloatFilter<"PatientMatch"> | number
    eligibilityStatus?: EnumEligibilityStatusFilter<"PatientMatch"> | $Enums.EligibilityStatus
    matchedCriteria?: JsonFilter<"PatientMatch">
    unmatchedCriteria?: JsonFilter<"PatientMatch">
    uncertainCriteria?: JsonNullableFilter<"PatientMatch">
    matchDetails?: JsonNullableFilter<"PatientMatch">
    distance?: FloatNullableFilter<"PatientMatch"> | number | null
    nearestSiteId?: StringNullableFilter<"PatientMatch"> | string | null
    reviewStatus?: EnumReviewStatusFilter<"PatientMatch"> | $Enums.ReviewStatus
    reviewedBy?: StringNullableFilter<"PatientMatch"> | string | null
    reviewedAt?: DateTimeNullableFilter<"PatientMatch"> | Date | string | null
    reviewNotes?: StringNullableFilter<"PatientMatch"> | string | null
    patientNotified?: BoolFilter<"PatientMatch"> | boolean
    notifiedAt?: DateTimeNullableFilter<"PatientMatch"> | Date | string | null
    isInterested?: BoolNullableFilter<"PatientMatch"> | boolean | null
    interestExpressedAt?: DateTimeNullableFilter<"PatientMatch"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"PatientMatch"> | Date | string | null
    createdAt?: DateTimeFilter<"PatientMatch"> | Date | string
    updatedAt?: DateTimeFilter<"PatientMatch"> | Date | string
  }

  export type EnrollmentUpsertWithWhereUniqueWithoutTrialInput = {
    where: EnrollmentWhereUniqueInput
    update: XOR<EnrollmentUpdateWithoutTrialInput, EnrollmentUncheckedUpdateWithoutTrialInput>
    create: XOR<EnrollmentCreateWithoutTrialInput, EnrollmentUncheckedCreateWithoutTrialInput>
  }

  export type EnrollmentUpdateWithWhereUniqueWithoutTrialInput = {
    where: EnrollmentWhereUniqueInput
    data: XOR<EnrollmentUpdateWithoutTrialInput, EnrollmentUncheckedUpdateWithoutTrialInput>
  }

  export type EnrollmentUpdateManyWithWhereWithoutTrialInput = {
    where: EnrollmentScalarWhereInput
    data: XOR<EnrollmentUpdateManyMutationInput, EnrollmentUncheckedUpdateManyWithoutTrialInput>
  }

  export type EnrollmentScalarWhereInput = {
    AND?: EnrollmentScalarWhereInput | EnrollmentScalarWhereInput[]
    OR?: EnrollmentScalarWhereInput[]
    NOT?: EnrollmentScalarWhereInput | EnrollmentScalarWhereInput[]
    id?: StringFilter<"Enrollment"> | string
    patientId?: StringFilter<"Enrollment"> | string
    trialId?: StringFilter<"Enrollment"> | string
    siteId?: StringFilter<"Enrollment"> | string
    status?: EnumEnrollmentStatusFilter<"Enrollment"> | $Enums.EnrollmentStatus
    studySubjectId?: StringNullableFilter<"Enrollment"> | string | null
    screeningDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    enrollmentDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    randomizationDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    armAssignment?: StringNullableFilter<"Enrollment"> | string | null
    withdrawalDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    withdrawalReason?: StringNullableFilter<"Enrollment"> | string | null
    completionDate?: DateTimeNullableFilter<"Enrollment"> | Date | string | null
    primaryInvestigator?: StringNullableFilter<"Enrollment"> | string | null
    studyCoordinator?: StringNullableFilter<"Enrollment"> | string | null
    notes?: StringNullableFilter<"Enrollment"> | string | null
    createdAt?: DateTimeFilter<"Enrollment"> | Date | string
    updatedAt?: DateTimeFilter<"Enrollment"> | Date | string
  }

  export type ClinicalTrialCreateWithoutSitesInput = {
    id?: string
    nctId: string
    title: string
    officialTitle?: string | null
    briefSummary?: string | null
    detailedDescription?: string | null
    status?: $Enums.TrialStatus
    phase?: $Enums.TrialPhase | null
    studyType?: $Enums.StudyType
    primaryPurpose?: string | null
    interventionModel?: string | null
    masking?: string | null
    allocation?: string | null
    enrollmentCount?: number | null
    enrollmentType?: string | null
    startDate?: Date | string | null
    completionDate?: Date | string | null
    primaryCompletionDate?: Date | string | null
    lastUpdatedDate?: Date | string | null
    sponsorName?: string | null
    sponsorType?: string | null
    leadSponsorClass?: string | null
    collaborators?: ClinicalTrialCreatecollaboratorsInput | string[]
    conditions?: ClinicalTrialCreateconditionsInput | string[]
    interventions?: ClinicalTrialCreateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialCreatekeywordsInput | string[]
    meshTerms?: ClinicalTrialCreatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialCreateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialCreatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: string | null
    healthyVolunteers?: boolean
    minimumAge?: number | null
    maximumAge?: number | null
    gender?: string | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialCreatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patientMatches?: PatientMatchCreateNestedManyWithoutTrialInput
    enrollments?: EnrollmentCreateNestedManyWithoutTrialInput
  }

  export type ClinicalTrialUncheckedCreateWithoutSitesInput = {
    id?: string
    nctId: string
    title: string
    officialTitle?: string | null
    briefSummary?: string | null
    detailedDescription?: string | null
    status?: $Enums.TrialStatus
    phase?: $Enums.TrialPhase | null
    studyType?: $Enums.StudyType
    primaryPurpose?: string | null
    interventionModel?: string | null
    masking?: string | null
    allocation?: string | null
    enrollmentCount?: number | null
    enrollmentType?: string | null
    startDate?: Date | string | null
    completionDate?: Date | string | null
    primaryCompletionDate?: Date | string | null
    lastUpdatedDate?: Date | string | null
    sponsorName?: string | null
    sponsorType?: string | null
    leadSponsorClass?: string | null
    collaborators?: ClinicalTrialCreatecollaboratorsInput | string[]
    conditions?: ClinicalTrialCreateconditionsInput | string[]
    interventions?: ClinicalTrialCreateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialCreatekeywordsInput | string[]
    meshTerms?: ClinicalTrialCreatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialCreateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialCreatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: string | null
    healthyVolunteers?: boolean
    minimumAge?: number | null
    maximumAge?: number | null
    gender?: string | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialCreatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patientMatches?: PatientMatchUncheckedCreateNestedManyWithoutTrialInput
    enrollments?: EnrollmentUncheckedCreateNestedManyWithoutTrialInput
  }

  export type ClinicalTrialCreateOrConnectWithoutSitesInput = {
    where: ClinicalTrialWhereUniqueInput
    create: XOR<ClinicalTrialCreateWithoutSitesInput, ClinicalTrialUncheckedCreateWithoutSitesInput>
  }

  export type EnrollmentCreateWithoutSiteInput = {
    id?: string
    patientId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    trial: ClinicalTrialCreateNestedOneWithoutEnrollmentsInput
    consentRecords?: ConsentRecordCreateNestedManyWithoutEnrollmentInput
    statusHistory?: EnrollmentStatusHistoryCreateNestedManyWithoutEnrollmentInput
    visits?: TrialVisitCreateNestedManyWithoutEnrollmentInput
  }

  export type EnrollmentUncheckedCreateWithoutSiteInput = {
    id?: string
    patientId: string
    trialId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    consentRecords?: ConsentRecordUncheckedCreateNestedManyWithoutEnrollmentInput
    statusHistory?: EnrollmentStatusHistoryUncheckedCreateNestedManyWithoutEnrollmentInput
    visits?: TrialVisitUncheckedCreateNestedManyWithoutEnrollmentInput
  }

  export type EnrollmentCreateOrConnectWithoutSiteInput = {
    where: EnrollmentWhereUniqueInput
    create: XOR<EnrollmentCreateWithoutSiteInput, EnrollmentUncheckedCreateWithoutSiteInput>
  }

  export type EnrollmentCreateManySiteInputEnvelope = {
    data: EnrollmentCreateManySiteInput | EnrollmentCreateManySiteInput[]
    skipDuplicates?: boolean
  }

  export type ClinicalTrialUpsertWithoutSitesInput = {
    update: XOR<ClinicalTrialUpdateWithoutSitesInput, ClinicalTrialUncheckedUpdateWithoutSitesInput>
    create: XOR<ClinicalTrialCreateWithoutSitesInput, ClinicalTrialUncheckedCreateWithoutSitesInput>
    where?: ClinicalTrialWhereInput
  }

  export type ClinicalTrialUpdateToOneWithWhereWithoutSitesInput = {
    where?: ClinicalTrialWhereInput
    data: XOR<ClinicalTrialUpdateWithoutSitesInput, ClinicalTrialUncheckedUpdateWithoutSitesInput>
  }

  export type ClinicalTrialUpdateWithoutSitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nctId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    officialTitle?: NullableStringFieldUpdateOperationsInput | string | null
    briefSummary?: NullableStringFieldUpdateOperationsInput | string | null
    detailedDescription?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrialStatusFieldUpdateOperationsInput | $Enums.TrialStatus
    phase?: NullableEnumTrialPhaseFieldUpdateOperationsInput | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeFieldUpdateOperationsInput | $Enums.StudyType
    primaryPurpose?: NullableStringFieldUpdateOperationsInput | string | null
    interventionModel?: NullableStringFieldUpdateOperationsInput | string | null
    masking?: NullableStringFieldUpdateOperationsInput | string | null
    allocation?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentCount?: NullableIntFieldUpdateOperationsInput | number | null
    enrollmentType?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sponsorName?: NullableStringFieldUpdateOperationsInput | string | null
    sponsorType?: NullableStringFieldUpdateOperationsInput | string | null
    leadSponsorClass?: NullableStringFieldUpdateOperationsInput | string | null
    collaborators?: ClinicalTrialUpdatecollaboratorsInput | string[]
    conditions?: ClinicalTrialUpdateconditionsInput | string[]
    interventions?: ClinicalTrialUpdateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialUpdatekeywordsInput | string[]
    meshTerms?: ClinicalTrialUpdatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialUpdateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialUpdatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: NullableStringFieldUpdateOperationsInput | string | null
    healthyVolunteers?: BoolFieldUpdateOperationsInput | boolean
    minimumAge?: NullableIntFieldUpdateOperationsInput | number | null
    maximumAge?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialUpdatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientMatches?: PatientMatchUpdateManyWithoutTrialNestedInput
    enrollments?: EnrollmentUpdateManyWithoutTrialNestedInput
  }

  export type ClinicalTrialUncheckedUpdateWithoutSitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nctId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    officialTitle?: NullableStringFieldUpdateOperationsInput | string | null
    briefSummary?: NullableStringFieldUpdateOperationsInput | string | null
    detailedDescription?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrialStatusFieldUpdateOperationsInput | $Enums.TrialStatus
    phase?: NullableEnumTrialPhaseFieldUpdateOperationsInput | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeFieldUpdateOperationsInput | $Enums.StudyType
    primaryPurpose?: NullableStringFieldUpdateOperationsInput | string | null
    interventionModel?: NullableStringFieldUpdateOperationsInput | string | null
    masking?: NullableStringFieldUpdateOperationsInput | string | null
    allocation?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentCount?: NullableIntFieldUpdateOperationsInput | number | null
    enrollmentType?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sponsorName?: NullableStringFieldUpdateOperationsInput | string | null
    sponsorType?: NullableStringFieldUpdateOperationsInput | string | null
    leadSponsorClass?: NullableStringFieldUpdateOperationsInput | string | null
    collaborators?: ClinicalTrialUpdatecollaboratorsInput | string[]
    conditions?: ClinicalTrialUpdateconditionsInput | string[]
    interventions?: ClinicalTrialUpdateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialUpdatekeywordsInput | string[]
    meshTerms?: ClinicalTrialUpdatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialUpdateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialUpdatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: NullableStringFieldUpdateOperationsInput | string | null
    healthyVolunteers?: BoolFieldUpdateOperationsInput | boolean
    minimumAge?: NullableIntFieldUpdateOperationsInput | number | null
    maximumAge?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialUpdatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientMatches?: PatientMatchUncheckedUpdateManyWithoutTrialNestedInput
    enrollments?: EnrollmentUncheckedUpdateManyWithoutTrialNestedInput
  }

  export type EnrollmentUpsertWithWhereUniqueWithoutSiteInput = {
    where: EnrollmentWhereUniqueInput
    update: XOR<EnrollmentUpdateWithoutSiteInput, EnrollmentUncheckedUpdateWithoutSiteInput>
    create: XOR<EnrollmentCreateWithoutSiteInput, EnrollmentUncheckedCreateWithoutSiteInput>
  }

  export type EnrollmentUpdateWithWhereUniqueWithoutSiteInput = {
    where: EnrollmentWhereUniqueInput
    data: XOR<EnrollmentUpdateWithoutSiteInput, EnrollmentUncheckedUpdateWithoutSiteInput>
  }

  export type EnrollmentUpdateManyWithWhereWithoutSiteInput = {
    where: EnrollmentScalarWhereInput
    data: XOR<EnrollmentUpdateManyMutationInput, EnrollmentUncheckedUpdateManyWithoutSiteInput>
  }

  export type ClinicalTrialCreateWithoutPatientMatchesInput = {
    id?: string
    nctId: string
    title: string
    officialTitle?: string | null
    briefSummary?: string | null
    detailedDescription?: string | null
    status?: $Enums.TrialStatus
    phase?: $Enums.TrialPhase | null
    studyType?: $Enums.StudyType
    primaryPurpose?: string | null
    interventionModel?: string | null
    masking?: string | null
    allocation?: string | null
    enrollmentCount?: number | null
    enrollmentType?: string | null
    startDate?: Date | string | null
    completionDate?: Date | string | null
    primaryCompletionDate?: Date | string | null
    lastUpdatedDate?: Date | string | null
    sponsorName?: string | null
    sponsorType?: string | null
    leadSponsorClass?: string | null
    collaborators?: ClinicalTrialCreatecollaboratorsInput | string[]
    conditions?: ClinicalTrialCreateconditionsInput | string[]
    interventions?: ClinicalTrialCreateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialCreatekeywordsInput | string[]
    meshTerms?: ClinicalTrialCreatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialCreateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialCreatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: string | null
    healthyVolunteers?: boolean
    minimumAge?: number | null
    maximumAge?: number | null
    gender?: string | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialCreatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sites?: TrialSiteCreateNestedManyWithoutTrialInput
    enrollments?: EnrollmentCreateNestedManyWithoutTrialInput
  }

  export type ClinicalTrialUncheckedCreateWithoutPatientMatchesInput = {
    id?: string
    nctId: string
    title: string
    officialTitle?: string | null
    briefSummary?: string | null
    detailedDescription?: string | null
    status?: $Enums.TrialStatus
    phase?: $Enums.TrialPhase | null
    studyType?: $Enums.StudyType
    primaryPurpose?: string | null
    interventionModel?: string | null
    masking?: string | null
    allocation?: string | null
    enrollmentCount?: number | null
    enrollmentType?: string | null
    startDate?: Date | string | null
    completionDate?: Date | string | null
    primaryCompletionDate?: Date | string | null
    lastUpdatedDate?: Date | string | null
    sponsorName?: string | null
    sponsorType?: string | null
    leadSponsorClass?: string | null
    collaborators?: ClinicalTrialCreatecollaboratorsInput | string[]
    conditions?: ClinicalTrialCreateconditionsInput | string[]
    interventions?: ClinicalTrialCreateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialCreatekeywordsInput | string[]
    meshTerms?: ClinicalTrialCreatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialCreateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialCreatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: string | null
    healthyVolunteers?: boolean
    minimumAge?: number | null
    maximumAge?: number | null
    gender?: string | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialCreatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sites?: TrialSiteUncheckedCreateNestedManyWithoutTrialInput
    enrollments?: EnrollmentUncheckedCreateNestedManyWithoutTrialInput
  }

  export type ClinicalTrialCreateOrConnectWithoutPatientMatchesInput = {
    where: ClinicalTrialWhereUniqueInput
    create: XOR<ClinicalTrialCreateWithoutPatientMatchesInput, ClinicalTrialUncheckedCreateWithoutPatientMatchesInput>
  }

  export type ClinicalTrialUpsertWithoutPatientMatchesInput = {
    update: XOR<ClinicalTrialUpdateWithoutPatientMatchesInput, ClinicalTrialUncheckedUpdateWithoutPatientMatchesInput>
    create: XOR<ClinicalTrialCreateWithoutPatientMatchesInput, ClinicalTrialUncheckedCreateWithoutPatientMatchesInput>
    where?: ClinicalTrialWhereInput
  }

  export type ClinicalTrialUpdateToOneWithWhereWithoutPatientMatchesInput = {
    where?: ClinicalTrialWhereInput
    data: XOR<ClinicalTrialUpdateWithoutPatientMatchesInput, ClinicalTrialUncheckedUpdateWithoutPatientMatchesInput>
  }

  export type ClinicalTrialUpdateWithoutPatientMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nctId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    officialTitle?: NullableStringFieldUpdateOperationsInput | string | null
    briefSummary?: NullableStringFieldUpdateOperationsInput | string | null
    detailedDescription?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrialStatusFieldUpdateOperationsInput | $Enums.TrialStatus
    phase?: NullableEnumTrialPhaseFieldUpdateOperationsInput | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeFieldUpdateOperationsInput | $Enums.StudyType
    primaryPurpose?: NullableStringFieldUpdateOperationsInput | string | null
    interventionModel?: NullableStringFieldUpdateOperationsInput | string | null
    masking?: NullableStringFieldUpdateOperationsInput | string | null
    allocation?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentCount?: NullableIntFieldUpdateOperationsInput | number | null
    enrollmentType?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sponsorName?: NullableStringFieldUpdateOperationsInput | string | null
    sponsorType?: NullableStringFieldUpdateOperationsInput | string | null
    leadSponsorClass?: NullableStringFieldUpdateOperationsInput | string | null
    collaborators?: ClinicalTrialUpdatecollaboratorsInput | string[]
    conditions?: ClinicalTrialUpdateconditionsInput | string[]
    interventions?: ClinicalTrialUpdateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialUpdatekeywordsInput | string[]
    meshTerms?: ClinicalTrialUpdatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialUpdateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialUpdatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: NullableStringFieldUpdateOperationsInput | string | null
    healthyVolunteers?: BoolFieldUpdateOperationsInput | boolean
    minimumAge?: NullableIntFieldUpdateOperationsInput | number | null
    maximumAge?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialUpdatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sites?: TrialSiteUpdateManyWithoutTrialNestedInput
    enrollments?: EnrollmentUpdateManyWithoutTrialNestedInput
  }

  export type ClinicalTrialUncheckedUpdateWithoutPatientMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nctId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    officialTitle?: NullableStringFieldUpdateOperationsInput | string | null
    briefSummary?: NullableStringFieldUpdateOperationsInput | string | null
    detailedDescription?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrialStatusFieldUpdateOperationsInput | $Enums.TrialStatus
    phase?: NullableEnumTrialPhaseFieldUpdateOperationsInput | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeFieldUpdateOperationsInput | $Enums.StudyType
    primaryPurpose?: NullableStringFieldUpdateOperationsInput | string | null
    interventionModel?: NullableStringFieldUpdateOperationsInput | string | null
    masking?: NullableStringFieldUpdateOperationsInput | string | null
    allocation?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentCount?: NullableIntFieldUpdateOperationsInput | number | null
    enrollmentType?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sponsorName?: NullableStringFieldUpdateOperationsInput | string | null
    sponsorType?: NullableStringFieldUpdateOperationsInput | string | null
    leadSponsorClass?: NullableStringFieldUpdateOperationsInput | string | null
    collaborators?: ClinicalTrialUpdatecollaboratorsInput | string[]
    conditions?: ClinicalTrialUpdateconditionsInput | string[]
    interventions?: ClinicalTrialUpdateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialUpdatekeywordsInput | string[]
    meshTerms?: ClinicalTrialUpdatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialUpdateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialUpdatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: NullableStringFieldUpdateOperationsInput | string | null
    healthyVolunteers?: BoolFieldUpdateOperationsInput | boolean
    minimumAge?: NullableIntFieldUpdateOperationsInput | number | null
    maximumAge?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialUpdatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sites?: TrialSiteUncheckedUpdateManyWithoutTrialNestedInput
    enrollments?: EnrollmentUncheckedUpdateManyWithoutTrialNestedInput
  }

  export type ClinicalTrialCreateWithoutEnrollmentsInput = {
    id?: string
    nctId: string
    title: string
    officialTitle?: string | null
    briefSummary?: string | null
    detailedDescription?: string | null
    status?: $Enums.TrialStatus
    phase?: $Enums.TrialPhase | null
    studyType?: $Enums.StudyType
    primaryPurpose?: string | null
    interventionModel?: string | null
    masking?: string | null
    allocation?: string | null
    enrollmentCount?: number | null
    enrollmentType?: string | null
    startDate?: Date | string | null
    completionDate?: Date | string | null
    primaryCompletionDate?: Date | string | null
    lastUpdatedDate?: Date | string | null
    sponsorName?: string | null
    sponsorType?: string | null
    leadSponsorClass?: string | null
    collaborators?: ClinicalTrialCreatecollaboratorsInput | string[]
    conditions?: ClinicalTrialCreateconditionsInput | string[]
    interventions?: ClinicalTrialCreateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialCreatekeywordsInput | string[]
    meshTerms?: ClinicalTrialCreatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialCreateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialCreatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: string | null
    healthyVolunteers?: boolean
    minimumAge?: number | null
    maximumAge?: number | null
    gender?: string | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialCreatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sites?: TrialSiteCreateNestedManyWithoutTrialInput
    patientMatches?: PatientMatchCreateNestedManyWithoutTrialInput
  }

  export type ClinicalTrialUncheckedCreateWithoutEnrollmentsInput = {
    id?: string
    nctId: string
    title: string
    officialTitle?: string | null
    briefSummary?: string | null
    detailedDescription?: string | null
    status?: $Enums.TrialStatus
    phase?: $Enums.TrialPhase | null
    studyType?: $Enums.StudyType
    primaryPurpose?: string | null
    interventionModel?: string | null
    masking?: string | null
    allocation?: string | null
    enrollmentCount?: number | null
    enrollmentType?: string | null
    startDate?: Date | string | null
    completionDate?: Date | string | null
    primaryCompletionDate?: Date | string | null
    lastUpdatedDate?: Date | string | null
    sponsorName?: string | null
    sponsorType?: string | null
    leadSponsorClass?: string | null
    collaborators?: ClinicalTrialCreatecollaboratorsInput | string[]
    conditions?: ClinicalTrialCreateconditionsInput | string[]
    interventions?: ClinicalTrialCreateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialCreatekeywordsInput | string[]
    meshTerms?: ClinicalTrialCreatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialCreateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialCreatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: string | null
    healthyVolunteers?: boolean
    minimumAge?: number | null
    maximumAge?: number | null
    gender?: string | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialCreatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sites?: TrialSiteUncheckedCreateNestedManyWithoutTrialInput
    patientMatches?: PatientMatchUncheckedCreateNestedManyWithoutTrialInput
  }

  export type ClinicalTrialCreateOrConnectWithoutEnrollmentsInput = {
    where: ClinicalTrialWhereUniqueInput
    create: XOR<ClinicalTrialCreateWithoutEnrollmentsInput, ClinicalTrialUncheckedCreateWithoutEnrollmentsInput>
  }

  export type TrialSiteCreateWithoutEnrollmentsInput = {
    id?: string
    facilityName: string
    facilityId?: string | null
    status?: $Enums.SiteStatus
    city: string
    state?: string | null
    country: string
    zipCode?: string | null
    latitude?: number | null
    longitude?: number | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    principalInvestigator?: string | null
    recruitmentStatus?: string | null
    targetEnrollment?: number | null
    currentEnrollment?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    trial: ClinicalTrialCreateNestedOneWithoutSitesInput
  }

  export type TrialSiteUncheckedCreateWithoutEnrollmentsInput = {
    id?: string
    trialId: string
    facilityName: string
    facilityId?: string | null
    status?: $Enums.SiteStatus
    city: string
    state?: string | null
    country: string
    zipCode?: string | null
    latitude?: number | null
    longitude?: number | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    principalInvestigator?: string | null
    recruitmentStatus?: string | null
    targetEnrollment?: number | null
    currentEnrollment?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrialSiteCreateOrConnectWithoutEnrollmentsInput = {
    where: TrialSiteWhereUniqueInput
    create: XOR<TrialSiteCreateWithoutEnrollmentsInput, TrialSiteUncheckedCreateWithoutEnrollmentsInput>
  }

  export type ConsentRecordCreateWithoutEnrollmentInput = {
    id?: string
    consentType: $Enums.ConsentType
    consentFormId?: string | null
    consentFormVersion?: string | null
    signedAt: Date | string
    signedBy: string
    witnessName?: string | null
    witnessSignedAt?: Date | string | null
    coordinatorName?: string | null
    coordinatorId?: string | null
    documentUrl?: string | null
    isActive?: boolean
    revokedAt?: Date | string | null
    revokedReason?: string | null
    expiresAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConsentRecordUncheckedCreateWithoutEnrollmentInput = {
    id?: string
    consentType: $Enums.ConsentType
    consentFormId?: string | null
    consentFormVersion?: string | null
    signedAt: Date | string
    signedBy: string
    witnessName?: string | null
    witnessSignedAt?: Date | string | null
    coordinatorName?: string | null
    coordinatorId?: string | null
    documentUrl?: string | null
    isActive?: boolean
    revokedAt?: Date | string | null
    revokedReason?: string | null
    expiresAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConsentRecordCreateOrConnectWithoutEnrollmentInput = {
    where: ConsentRecordWhereUniqueInput
    create: XOR<ConsentRecordCreateWithoutEnrollmentInput, ConsentRecordUncheckedCreateWithoutEnrollmentInput>
  }

  export type ConsentRecordCreateManyEnrollmentInputEnvelope = {
    data: ConsentRecordCreateManyEnrollmentInput | ConsentRecordCreateManyEnrollmentInput[]
    skipDuplicates?: boolean
  }

  export type EnrollmentStatusHistoryCreateWithoutEnrollmentInput = {
    id?: string
    fromStatus?: $Enums.EnrollmentStatus | null
    toStatus: $Enums.EnrollmentStatus
    reason?: string | null
    changedBy: string
    changedAt?: Date | string
  }

  export type EnrollmentStatusHistoryUncheckedCreateWithoutEnrollmentInput = {
    id?: string
    fromStatus?: $Enums.EnrollmentStatus | null
    toStatus: $Enums.EnrollmentStatus
    reason?: string | null
    changedBy: string
    changedAt?: Date | string
  }

  export type EnrollmentStatusHistoryCreateOrConnectWithoutEnrollmentInput = {
    where: EnrollmentStatusHistoryWhereUniqueInput
    create: XOR<EnrollmentStatusHistoryCreateWithoutEnrollmentInput, EnrollmentStatusHistoryUncheckedCreateWithoutEnrollmentInput>
  }

  export type EnrollmentStatusHistoryCreateManyEnrollmentInputEnvelope = {
    data: EnrollmentStatusHistoryCreateManyEnrollmentInput | EnrollmentStatusHistoryCreateManyEnrollmentInput[]
    skipDuplicates?: boolean
  }

  export type TrialVisitCreateWithoutEnrollmentInput = {
    id?: string
    visitNumber: number
    visitName: string
    visitType?: $Enums.VisitType
    scheduledDate?: Date | string | null
    actualDate?: Date | string | null
    status?: $Enums.VisitStatus
    completedBy?: string | null
    notes?: string | null
    protocolDeviations?: string | null
    missedReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrialVisitUncheckedCreateWithoutEnrollmentInput = {
    id?: string
    visitNumber: number
    visitName: string
    visitType?: $Enums.VisitType
    scheduledDate?: Date | string | null
    actualDate?: Date | string | null
    status?: $Enums.VisitStatus
    completedBy?: string | null
    notes?: string | null
    protocolDeviations?: string | null
    missedReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrialVisitCreateOrConnectWithoutEnrollmentInput = {
    where: TrialVisitWhereUniqueInput
    create: XOR<TrialVisitCreateWithoutEnrollmentInput, TrialVisitUncheckedCreateWithoutEnrollmentInput>
  }

  export type TrialVisitCreateManyEnrollmentInputEnvelope = {
    data: TrialVisitCreateManyEnrollmentInput | TrialVisitCreateManyEnrollmentInput[]
    skipDuplicates?: boolean
  }

  export type ClinicalTrialUpsertWithoutEnrollmentsInput = {
    update: XOR<ClinicalTrialUpdateWithoutEnrollmentsInput, ClinicalTrialUncheckedUpdateWithoutEnrollmentsInput>
    create: XOR<ClinicalTrialCreateWithoutEnrollmentsInput, ClinicalTrialUncheckedCreateWithoutEnrollmentsInput>
    where?: ClinicalTrialWhereInput
  }

  export type ClinicalTrialUpdateToOneWithWhereWithoutEnrollmentsInput = {
    where?: ClinicalTrialWhereInput
    data: XOR<ClinicalTrialUpdateWithoutEnrollmentsInput, ClinicalTrialUncheckedUpdateWithoutEnrollmentsInput>
  }

  export type ClinicalTrialUpdateWithoutEnrollmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nctId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    officialTitle?: NullableStringFieldUpdateOperationsInput | string | null
    briefSummary?: NullableStringFieldUpdateOperationsInput | string | null
    detailedDescription?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrialStatusFieldUpdateOperationsInput | $Enums.TrialStatus
    phase?: NullableEnumTrialPhaseFieldUpdateOperationsInput | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeFieldUpdateOperationsInput | $Enums.StudyType
    primaryPurpose?: NullableStringFieldUpdateOperationsInput | string | null
    interventionModel?: NullableStringFieldUpdateOperationsInput | string | null
    masking?: NullableStringFieldUpdateOperationsInput | string | null
    allocation?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentCount?: NullableIntFieldUpdateOperationsInput | number | null
    enrollmentType?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sponsorName?: NullableStringFieldUpdateOperationsInput | string | null
    sponsorType?: NullableStringFieldUpdateOperationsInput | string | null
    leadSponsorClass?: NullableStringFieldUpdateOperationsInput | string | null
    collaborators?: ClinicalTrialUpdatecollaboratorsInput | string[]
    conditions?: ClinicalTrialUpdateconditionsInput | string[]
    interventions?: ClinicalTrialUpdateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialUpdatekeywordsInput | string[]
    meshTerms?: ClinicalTrialUpdatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialUpdateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialUpdatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: NullableStringFieldUpdateOperationsInput | string | null
    healthyVolunteers?: BoolFieldUpdateOperationsInput | boolean
    minimumAge?: NullableIntFieldUpdateOperationsInput | number | null
    maximumAge?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialUpdatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sites?: TrialSiteUpdateManyWithoutTrialNestedInput
    patientMatches?: PatientMatchUpdateManyWithoutTrialNestedInput
  }

  export type ClinicalTrialUncheckedUpdateWithoutEnrollmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nctId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    officialTitle?: NullableStringFieldUpdateOperationsInput | string | null
    briefSummary?: NullableStringFieldUpdateOperationsInput | string | null
    detailedDescription?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrialStatusFieldUpdateOperationsInput | $Enums.TrialStatus
    phase?: NullableEnumTrialPhaseFieldUpdateOperationsInput | $Enums.TrialPhase | null
    studyType?: EnumStudyTypeFieldUpdateOperationsInput | $Enums.StudyType
    primaryPurpose?: NullableStringFieldUpdateOperationsInput | string | null
    interventionModel?: NullableStringFieldUpdateOperationsInput | string | null
    masking?: NullableStringFieldUpdateOperationsInput | string | null
    allocation?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentCount?: NullableIntFieldUpdateOperationsInput | number | null
    enrollmentType?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sponsorName?: NullableStringFieldUpdateOperationsInput | string | null
    sponsorType?: NullableStringFieldUpdateOperationsInput | string | null
    leadSponsorClass?: NullableStringFieldUpdateOperationsInput | string | null
    collaborators?: ClinicalTrialUpdatecollaboratorsInput | string[]
    conditions?: ClinicalTrialUpdateconditionsInput | string[]
    interventions?: ClinicalTrialUpdateinterventionsInput | InputJsonValue[]
    keywords?: ClinicalTrialUpdatekeywordsInput | string[]
    meshTerms?: ClinicalTrialUpdatemeshTermsInput | string[]
    primaryOutcomes?: ClinicalTrialUpdateprimaryOutcomesInput | InputJsonValue[]
    secondaryOutcomes?: ClinicalTrialUpdatesecondaryOutcomesInput | InputJsonValue[]
    eligibilityCriteria?: NullableJsonNullValueInput | InputJsonValue
    eligibilityText?: NullableStringFieldUpdateOperationsInput | string | null
    healthyVolunteers?: BoolFieldUpdateOperationsInput | boolean
    minimumAge?: NullableIntFieldUpdateOperationsInput | number | null
    maximumAge?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    overallOfficial?: NullableJsonNullValueInput | InputJsonValue
    locations?: ClinicalTrialUpdatelocationsInput | InputJsonValue[]
    fhirResearchStudy?: NullableJsonNullValueInput | InputJsonValue
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sites?: TrialSiteUncheckedUpdateManyWithoutTrialNestedInput
    patientMatches?: PatientMatchUncheckedUpdateManyWithoutTrialNestedInput
  }

  export type TrialSiteUpsertWithoutEnrollmentsInput = {
    update: XOR<TrialSiteUpdateWithoutEnrollmentsInput, TrialSiteUncheckedUpdateWithoutEnrollmentsInput>
    create: XOR<TrialSiteCreateWithoutEnrollmentsInput, TrialSiteUncheckedCreateWithoutEnrollmentsInput>
    where?: TrialSiteWhereInput
  }

  export type TrialSiteUpdateToOneWithWhereWithoutEnrollmentsInput = {
    where?: TrialSiteWhereInput
    data: XOR<TrialSiteUpdateWithoutEnrollmentsInput, TrialSiteUncheckedUpdateWithoutEnrollmentsInput>
  }

  export type TrialSiteUpdateWithoutEnrollmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    facilityName?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSiteStatusFieldUpdateOperationsInput | $Enums.SiteStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    principalInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    recruitmentStatus?: NullableStringFieldUpdateOperationsInput | string | null
    targetEnrollment?: NullableIntFieldUpdateOperationsInput | number | null
    currentEnrollment?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trial?: ClinicalTrialUpdateOneRequiredWithoutSitesNestedInput
  }

  export type TrialSiteUncheckedUpdateWithoutEnrollmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    facilityName?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSiteStatusFieldUpdateOperationsInput | $Enums.SiteStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    principalInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    recruitmentStatus?: NullableStringFieldUpdateOperationsInput | string | null
    targetEnrollment?: NullableIntFieldUpdateOperationsInput | number | null
    currentEnrollment?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordUpsertWithWhereUniqueWithoutEnrollmentInput = {
    where: ConsentRecordWhereUniqueInput
    update: XOR<ConsentRecordUpdateWithoutEnrollmentInput, ConsentRecordUncheckedUpdateWithoutEnrollmentInput>
    create: XOR<ConsentRecordCreateWithoutEnrollmentInput, ConsentRecordUncheckedCreateWithoutEnrollmentInput>
  }

  export type ConsentRecordUpdateWithWhereUniqueWithoutEnrollmentInput = {
    where: ConsentRecordWhereUniqueInput
    data: XOR<ConsentRecordUpdateWithoutEnrollmentInput, ConsentRecordUncheckedUpdateWithoutEnrollmentInput>
  }

  export type ConsentRecordUpdateManyWithWhereWithoutEnrollmentInput = {
    where: ConsentRecordScalarWhereInput
    data: XOR<ConsentRecordUpdateManyMutationInput, ConsentRecordUncheckedUpdateManyWithoutEnrollmentInput>
  }

  export type ConsentRecordScalarWhereInput = {
    AND?: ConsentRecordScalarWhereInput | ConsentRecordScalarWhereInput[]
    OR?: ConsentRecordScalarWhereInput[]
    NOT?: ConsentRecordScalarWhereInput | ConsentRecordScalarWhereInput[]
    id?: StringFilter<"ConsentRecord"> | string
    enrollmentId?: StringFilter<"ConsentRecord"> | string
    consentType?: EnumConsentTypeFilter<"ConsentRecord"> | $Enums.ConsentType
    consentFormId?: StringNullableFilter<"ConsentRecord"> | string | null
    consentFormVersion?: StringNullableFilter<"ConsentRecord"> | string | null
    signedAt?: DateTimeFilter<"ConsentRecord"> | Date | string
    signedBy?: StringFilter<"ConsentRecord"> | string
    witnessName?: StringNullableFilter<"ConsentRecord"> | string | null
    witnessSignedAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    coordinatorName?: StringNullableFilter<"ConsentRecord"> | string | null
    coordinatorId?: StringNullableFilter<"ConsentRecord"> | string | null
    documentUrl?: StringNullableFilter<"ConsentRecord"> | string | null
    isActive?: BoolFilter<"ConsentRecord"> | boolean
    revokedAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    revokedReason?: StringNullableFilter<"ConsentRecord"> | string | null
    expiresAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    notes?: StringNullableFilter<"ConsentRecord"> | string | null
    createdAt?: DateTimeFilter<"ConsentRecord"> | Date | string
    updatedAt?: DateTimeFilter<"ConsentRecord"> | Date | string
  }

  export type EnrollmentStatusHistoryUpsertWithWhereUniqueWithoutEnrollmentInput = {
    where: EnrollmentStatusHistoryWhereUniqueInput
    update: XOR<EnrollmentStatusHistoryUpdateWithoutEnrollmentInput, EnrollmentStatusHistoryUncheckedUpdateWithoutEnrollmentInput>
    create: XOR<EnrollmentStatusHistoryCreateWithoutEnrollmentInput, EnrollmentStatusHistoryUncheckedCreateWithoutEnrollmentInput>
  }

  export type EnrollmentStatusHistoryUpdateWithWhereUniqueWithoutEnrollmentInput = {
    where: EnrollmentStatusHistoryWhereUniqueInput
    data: XOR<EnrollmentStatusHistoryUpdateWithoutEnrollmentInput, EnrollmentStatusHistoryUncheckedUpdateWithoutEnrollmentInput>
  }

  export type EnrollmentStatusHistoryUpdateManyWithWhereWithoutEnrollmentInput = {
    where: EnrollmentStatusHistoryScalarWhereInput
    data: XOR<EnrollmentStatusHistoryUpdateManyMutationInput, EnrollmentStatusHistoryUncheckedUpdateManyWithoutEnrollmentInput>
  }

  export type EnrollmentStatusHistoryScalarWhereInput = {
    AND?: EnrollmentStatusHistoryScalarWhereInput | EnrollmentStatusHistoryScalarWhereInput[]
    OR?: EnrollmentStatusHistoryScalarWhereInput[]
    NOT?: EnrollmentStatusHistoryScalarWhereInput | EnrollmentStatusHistoryScalarWhereInput[]
    id?: StringFilter<"EnrollmentStatusHistory"> | string
    enrollmentId?: StringFilter<"EnrollmentStatusHistory"> | string
    fromStatus?: EnumEnrollmentStatusNullableFilter<"EnrollmentStatusHistory"> | $Enums.EnrollmentStatus | null
    toStatus?: EnumEnrollmentStatusFilter<"EnrollmentStatusHistory"> | $Enums.EnrollmentStatus
    reason?: StringNullableFilter<"EnrollmentStatusHistory"> | string | null
    changedBy?: StringFilter<"EnrollmentStatusHistory"> | string
    changedAt?: DateTimeFilter<"EnrollmentStatusHistory"> | Date | string
  }

  export type TrialVisitUpsertWithWhereUniqueWithoutEnrollmentInput = {
    where: TrialVisitWhereUniqueInput
    update: XOR<TrialVisitUpdateWithoutEnrollmentInput, TrialVisitUncheckedUpdateWithoutEnrollmentInput>
    create: XOR<TrialVisitCreateWithoutEnrollmentInput, TrialVisitUncheckedCreateWithoutEnrollmentInput>
  }

  export type TrialVisitUpdateWithWhereUniqueWithoutEnrollmentInput = {
    where: TrialVisitWhereUniqueInput
    data: XOR<TrialVisitUpdateWithoutEnrollmentInput, TrialVisitUncheckedUpdateWithoutEnrollmentInput>
  }

  export type TrialVisitUpdateManyWithWhereWithoutEnrollmentInput = {
    where: TrialVisitScalarWhereInput
    data: XOR<TrialVisitUpdateManyMutationInput, TrialVisitUncheckedUpdateManyWithoutEnrollmentInput>
  }

  export type TrialVisitScalarWhereInput = {
    AND?: TrialVisitScalarWhereInput | TrialVisitScalarWhereInput[]
    OR?: TrialVisitScalarWhereInput[]
    NOT?: TrialVisitScalarWhereInput | TrialVisitScalarWhereInput[]
    id?: StringFilter<"TrialVisit"> | string
    enrollmentId?: StringFilter<"TrialVisit"> | string
    visitNumber?: IntFilter<"TrialVisit"> | number
    visitName?: StringFilter<"TrialVisit"> | string
    visitType?: EnumVisitTypeFilter<"TrialVisit"> | $Enums.VisitType
    scheduledDate?: DateTimeNullableFilter<"TrialVisit"> | Date | string | null
    actualDate?: DateTimeNullableFilter<"TrialVisit"> | Date | string | null
    status?: EnumVisitStatusFilter<"TrialVisit"> | $Enums.VisitStatus
    completedBy?: StringNullableFilter<"TrialVisit"> | string | null
    notes?: StringNullableFilter<"TrialVisit"> | string | null
    protocolDeviations?: StringNullableFilter<"TrialVisit"> | string | null
    missedReason?: StringNullableFilter<"TrialVisit"> | string | null
    createdAt?: DateTimeFilter<"TrialVisit"> | Date | string
    updatedAt?: DateTimeFilter<"TrialVisit"> | Date | string
  }

  export type EnrollmentCreateWithoutStatusHistoryInput = {
    id?: string
    patientId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    trial: ClinicalTrialCreateNestedOneWithoutEnrollmentsInput
    site: TrialSiteCreateNestedOneWithoutEnrollmentsInput
    consentRecords?: ConsentRecordCreateNestedManyWithoutEnrollmentInput
    visits?: TrialVisitCreateNestedManyWithoutEnrollmentInput
  }

  export type EnrollmentUncheckedCreateWithoutStatusHistoryInput = {
    id?: string
    patientId: string
    trialId: string
    siteId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    consentRecords?: ConsentRecordUncheckedCreateNestedManyWithoutEnrollmentInput
    visits?: TrialVisitUncheckedCreateNestedManyWithoutEnrollmentInput
  }

  export type EnrollmentCreateOrConnectWithoutStatusHistoryInput = {
    where: EnrollmentWhereUniqueInput
    create: XOR<EnrollmentCreateWithoutStatusHistoryInput, EnrollmentUncheckedCreateWithoutStatusHistoryInput>
  }

  export type EnrollmentUpsertWithoutStatusHistoryInput = {
    update: XOR<EnrollmentUpdateWithoutStatusHistoryInput, EnrollmentUncheckedUpdateWithoutStatusHistoryInput>
    create: XOR<EnrollmentCreateWithoutStatusHistoryInput, EnrollmentUncheckedCreateWithoutStatusHistoryInput>
    where?: EnrollmentWhereInput
  }

  export type EnrollmentUpdateToOneWithWhereWithoutStatusHistoryInput = {
    where?: EnrollmentWhereInput
    data: XOR<EnrollmentUpdateWithoutStatusHistoryInput, EnrollmentUncheckedUpdateWithoutStatusHistoryInput>
  }

  export type EnrollmentUpdateWithoutStatusHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trial?: ClinicalTrialUpdateOneRequiredWithoutEnrollmentsNestedInput
    site?: TrialSiteUpdateOneRequiredWithoutEnrollmentsNestedInput
    consentRecords?: ConsentRecordUpdateManyWithoutEnrollmentNestedInput
    visits?: TrialVisitUpdateManyWithoutEnrollmentNestedInput
  }

  export type EnrollmentUncheckedUpdateWithoutStatusHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consentRecords?: ConsentRecordUncheckedUpdateManyWithoutEnrollmentNestedInput
    visits?: TrialVisitUncheckedUpdateManyWithoutEnrollmentNestedInput
  }

  export type EnrollmentCreateWithoutConsentRecordsInput = {
    id?: string
    patientId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    trial: ClinicalTrialCreateNestedOneWithoutEnrollmentsInput
    site: TrialSiteCreateNestedOneWithoutEnrollmentsInput
    statusHistory?: EnrollmentStatusHistoryCreateNestedManyWithoutEnrollmentInput
    visits?: TrialVisitCreateNestedManyWithoutEnrollmentInput
  }

  export type EnrollmentUncheckedCreateWithoutConsentRecordsInput = {
    id?: string
    patientId: string
    trialId: string
    siteId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    statusHistory?: EnrollmentStatusHistoryUncheckedCreateNestedManyWithoutEnrollmentInput
    visits?: TrialVisitUncheckedCreateNestedManyWithoutEnrollmentInput
  }

  export type EnrollmentCreateOrConnectWithoutConsentRecordsInput = {
    where: EnrollmentWhereUniqueInput
    create: XOR<EnrollmentCreateWithoutConsentRecordsInput, EnrollmentUncheckedCreateWithoutConsentRecordsInput>
  }

  export type EnrollmentUpsertWithoutConsentRecordsInput = {
    update: XOR<EnrollmentUpdateWithoutConsentRecordsInput, EnrollmentUncheckedUpdateWithoutConsentRecordsInput>
    create: XOR<EnrollmentCreateWithoutConsentRecordsInput, EnrollmentUncheckedCreateWithoutConsentRecordsInput>
    where?: EnrollmentWhereInput
  }

  export type EnrollmentUpdateToOneWithWhereWithoutConsentRecordsInput = {
    where?: EnrollmentWhereInput
    data: XOR<EnrollmentUpdateWithoutConsentRecordsInput, EnrollmentUncheckedUpdateWithoutConsentRecordsInput>
  }

  export type EnrollmentUpdateWithoutConsentRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trial?: ClinicalTrialUpdateOneRequiredWithoutEnrollmentsNestedInput
    site?: TrialSiteUpdateOneRequiredWithoutEnrollmentsNestedInput
    statusHistory?: EnrollmentStatusHistoryUpdateManyWithoutEnrollmentNestedInput
    visits?: TrialVisitUpdateManyWithoutEnrollmentNestedInput
  }

  export type EnrollmentUncheckedUpdateWithoutConsentRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    statusHistory?: EnrollmentStatusHistoryUncheckedUpdateManyWithoutEnrollmentNestedInput
    visits?: TrialVisitUncheckedUpdateManyWithoutEnrollmentNestedInput
  }

  export type EnrollmentCreateWithoutVisitsInput = {
    id?: string
    patientId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    trial: ClinicalTrialCreateNestedOneWithoutEnrollmentsInput
    site: TrialSiteCreateNestedOneWithoutEnrollmentsInput
    consentRecords?: ConsentRecordCreateNestedManyWithoutEnrollmentInput
    statusHistory?: EnrollmentStatusHistoryCreateNestedManyWithoutEnrollmentInput
  }

  export type EnrollmentUncheckedCreateWithoutVisitsInput = {
    id?: string
    patientId: string
    trialId: string
    siteId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    consentRecords?: ConsentRecordUncheckedCreateNestedManyWithoutEnrollmentInput
    statusHistory?: EnrollmentStatusHistoryUncheckedCreateNestedManyWithoutEnrollmentInput
  }

  export type EnrollmentCreateOrConnectWithoutVisitsInput = {
    where: EnrollmentWhereUniqueInput
    create: XOR<EnrollmentCreateWithoutVisitsInput, EnrollmentUncheckedCreateWithoutVisitsInput>
  }

  export type EnrollmentUpsertWithoutVisitsInput = {
    update: XOR<EnrollmentUpdateWithoutVisitsInput, EnrollmentUncheckedUpdateWithoutVisitsInput>
    create: XOR<EnrollmentCreateWithoutVisitsInput, EnrollmentUncheckedCreateWithoutVisitsInput>
    where?: EnrollmentWhereInput
  }

  export type EnrollmentUpdateToOneWithWhereWithoutVisitsInput = {
    where?: EnrollmentWhereInput
    data: XOR<EnrollmentUpdateWithoutVisitsInput, EnrollmentUncheckedUpdateWithoutVisitsInput>
  }

  export type EnrollmentUpdateWithoutVisitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trial?: ClinicalTrialUpdateOneRequiredWithoutEnrollmentsNestedInput
    site?: TrialSiteUpdateOneRequiredWithoutEnrollmentsNestedInput
    consentRecords?: ConsentRecordUpdateManyWithoutEnrollmentNestedInput
    statusHistory?: EnrollmentStatusHistoryUpdateManyWithoutEnrollmentNestedInput
  }

  export type EnrollmentUncheckedUpdateWithoutVisitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consentRecords?: ConsentRecordUncheckedUpdateManyWithoutEnrollmentNestedInput
    statusHistory?: EnrollmentStatusHistoryUncheckedUpdateManyWithoutEnrollmentNestedInput
  }

  export type InvestigatorSiteAssignmentCreateWithoutInvestigatorInput = {
    id?: string
    siteId: string
    trialId: string
    role: $Enums.InvestigatorRole
    startDate?: Date | string
    endDate?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestigatorSiteAssignmentUncheckedCreateWithoutInvestigatorInput = {
    id?: string
    siteId: string
    trialId: string
    role: $Enums.InvestigatorRole
    startDate?: Date | string
    endDate?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestigatorSiteAssignmentCreateOrConnectWithoutInvestigatorInput = {
    where: InvestigatorSiteAssignmentWhereUniqueInput
    create: XOR<InvestigatorSiteAssignmentCreateWithoutInvestigatorInput, InvestigatorSiteAssignmentUncheckedCreateWithoutInvestigatorInput>
  }

  export type InvestigatorSiteAssignmentCreateManyInvestigatorInputEnvelope = {
    data: InvestigatorSiteAssignmentCreateManyInvestigatorInput | InvestigatorSiteAssignmentCreateManyInvestigatorInput[]
    skipDuplicates?: boolean
  }

  export type InvestigatorSiteAssignmentUpsertWithWhereUniqueWithoutInvestigatorInput = {
    where: InvestigatorSiteAssignmentWhereUniqueInput
    update: XOR<InvestigatorSiteAssignmentUpdateWithoutInvestigatorInput, InvestigatorSiteAssignmentUncheckedUpdateWithoutInvestigatorInput>
    create: XOR<InvestigatorSiteAssignmentCreateWithoutInvestigatorInput, InvestigatorSiteAssignmentUncheckedCreateWithoutInvestigatorInput>
  }

  export type InvestigatorSiteAssignmentUpdateWithWhereUniqueWithoutInvestigatorInput = {
    where: InvestigatorSiteAssignmentWhereUniqueInput
    data: XOR<InvestigatorSiteAssignmentUpdateWithoutInvestigatorInput, InvestigatorSiteAssignmentUncheckedUpdateWithoutInvestigatorInput>
  }

  export type InvestigatorSiteAssignmentUpdateManyWithWhereWithoutInvestigatorInput = {
    where: InvestigatorSiteAssignmentScalarWhereInput
    data: XOR<InvestigatorSiteAssignmentUpdateManyMutationInput, InvestigatorSiteAssignmentUncheckedUpdateManyWithoutInvestigatorInput>
  }

  export type InvestigatorSiteAssignmentScalarWhereInput = {
    AND?: InvestigatorSiteAssignmentScalarWhereInput | InvestigatorSiteAssignmentScalarWhereInput[]
    OR?: InvestigatorSiteAssignmentScalarWhereInput[]
    NOT?: InvestigatorSiteAssignmentScalarWhereInput | InvestigatorSiteAssignmentScalarWhereInput[]
    id?: StringFilter<"InvestigatorSiteAssignment"> | string
    investigatorId?: StringFilter<"InvestigatorSiteAssignment"> | string
    siteId?: StringFilter<"InvestigatorSiteAssignment"> | string
    trialId?: StringFilter<"InvestigatorSiteAssignment"> | string
    role?: EnumInvestigatorRoleFilter<"InvestigatorSiteAssignment"> | $Enums.InvestigatorRole
    startDate?: DateTimeFilter<"InvestigatorSiteAssignment"> | Date | string
    endDate?: DateTimeNullableFilter<"InvestigatorSiteAssignment"> | Date | string | null
    isActive?: BoolFilter<"InvestigatorSiteAssignment"> | boolean
    createdAt?: DateTimeFilter<"InvestigatorSiteAssignment"> | Date | string
    updatedAt?: DateTimeFilter<"InvestigatorSiteAssignment"> | Date | string
  }

  export type InvestigatorCreateWithoutSiteAssignmentsInput = {
    id?: string
    userId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    specialty?: string | null
    institution?: string | null
    npiNumber?: string | null
    licenseNumber?: string | null
    licenseState?: string | null
    cvUrl?: string | null
    isActive?: boolean
    roles?: InvestigatorCreaterolesInput | $Enums.InvestigatorRole[]
    certifications?: InvestigatorCreatecertificationsInput | InputJsonValue[]
    trainingRecords?: InvestigatorCreatetrainingRecordsInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestigatorUncheckedCreateWithoutSiteAssignmentsInput = {
    id?: string
    userId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    specialty?: string | null
    institution?: string | null
    npiNumber?: string | null
    licenseNumber?: string | null
    licenseState?: string | null
    cvUrl?: string | null
    isActive?: boolean
    roles?: InvestigatorCreaterolesInput | $Enums.InvestigatorRole[]
    certifications?: InvestigatorCreatecertificationsInput | InputJsonValue[]
    trainingRecords?: InvestigatorCreatetrainingRecordsInput | InputJsonValue[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestigatorCreateOrConnectWithoutSiteAssignmentsInput = {
    where: InvestigatorWhereUniqueInput
    create: XOR<InvestigatorCreateWithoutSiteAssignmentsInput, InvestigatorUncheckedCreateWithoutSiteAssignmentsInput>
  }

  export type InvestigatorUpsertWithoutSiteAssignmentsInput = {
    update: XOR<InvestigatorUpdateWithoutSiteAssignmentsInput, InvestigatorUncheckedUpdateWithoutSiteAssignmentsInput>
    create: XOR<InvestigatorCreateWithoutSiteAssignmentsInput, InvestigatorUncheckedCreateWithoutSiteAssignmentsInput>
    where?: InvestigatorWhereInput
  }

  export type InvestigatorUpdateToOneWithWhereWithoutSiteAssignmentsInput = {
    where?: InvestigatorWhereInput
    data: XOR<InvestigatorUpdateWithoutSiteAssignmentsInput, InvestigatorUncheckedUpdateWithoutSiteAssignmentsInput>
  }

  export type InvestigatorUpdateWithoutSiteAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: NullableStringFieldUpdateOperationsInput | string | null
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    npiNumber?: NullableStringFieldUpdateOperationsInput | string | null
    licenseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    licenseState?: NullableStringFieldUpdateOperationsInput | string | null
    cvUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    roles?: InvestigatorUpdaterolesInput | $Enums.InvestigatorRole[]
    certifications?: InvestigatorUpdatecertificationsInput | InputJsonValue[]
    trainingRecords?: InvestigatorUpdatetrainingRecordsInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigatorUncheckedUpdateWithoutSiteAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: NullableStringFieldUpdateOperationsInput | string | null
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    npiNumber?: NullableStringFieldUpdateOperationsInput | string | null
    licenseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    licenseState?: NullableStringFieldUpdateOperationsInput | string | null
    cvUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    roles?: InvestigatorUpdaterolesInput | $Enums.InvestigatorRole[]
    certifications?: InvestigatorUpdatecertificationsInput | InputJsonValue[]
    trainingRecords?: InvestigatorUpdatetrainingRecordsInput | InputJsonValue[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialSiteCreateManyTrialInput = {
    id?: string
    facilityName: string
    facilityId?: string | null
    status?: $Enums.SiteStatus
    city: string
    state?: string | null
    country: string
    zipCode?: string | null
    latitude?: number | null
    longitude?: number | null
    contactName?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    principalInvestigator?: string | null
    recruitmentStatus?: string | null
    targetEnrollment?: number | null
    currentEnrollment?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientMatchCreateManyTrialInput = {
    id?: string
    patientId: string
    matchScore: number
    eligibilityStatus?: $Enums.EligibilityStatus
    matchedCriteria: JsonNullValueInput | InputJsonValue
    unmatchedCriteria: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: number | null
    nearestSiteId?: string | null
    reviewStatus?: $Enums.ReviewStatus
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNotes?: string | null
    patientNotified?: boolean
    notifiedAt?: Date | string | null
    isInterested?: boolean | null
    interestExpressedAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EnrollmentCreateManyTrialInput = {
    id?: string
    patientId: string
    siteId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrialSiteUpdateWithoutTrialInput = {
    id?: StringFieldUpdateOperationsInput | string
    facilityName?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSiteStatusFieldUpdateOperationsInput | $Enums.SiteStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    principalInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    recruitmentStatus?: NullableStringFieldUpdateOperationsInput | string | null
    targetEnrollment?: NullableIntFieldUpdateOperationsInput | number | null
    currentEnrollment?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: EnrollmentUpdateManyWithoutSiteNestedInput
  }

  export type TrialSiteUncheckedUpdateWithoutTrialInput = {
    id?: StringFieldUpdateOperationsInput | string
    facilityName?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSiteStatusFieldUpdateOperationsInput | $Enums.SiteStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    principalInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    recruitmentStatus?: NullableStringFieldUpdateOperationsInput | string | null
    targetEnrollment?: NullableIntFieldUpdateOperationsInput | number | null
    currentEnrollment?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: EnrollmentUncheckedUpdateManyWithoutSiteNestedInput
  }

  export type TrialSiteUncheckedUpdateManyWithoutTrialInput = {
    id?: StringFieldUpdateOperationsInput | string
    facilityName?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSiteStatusFieldUpdateOperationsInput | $Enums.SiteStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    principalInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    recruitmentStatus?: NullableStringFieldUpdateOperationsInput | string | null
    targetEnrollment?: NullableIntFieldUpdateOperationsInput | number | null
    currentEnrollment?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientMatchUpdateWithoutTrialInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    matchScore?: FloatFieldUpdateOperationsInput | number
    eligibilityStatus?: EnumEligibilityStatusFieldUpdateOperationsInput | $Enums.EligibilityStatus
    matchedCriteria?: JsonNullValueInput | InputJsonValue
    unmatchedCriteria?: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: NullableFloatFieldUpdateOperationsInput | number | null
    nearestSiteId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    patientNotified?: BoolFieldUpdateOperationsInput | boolean
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isInterested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    interestExpressedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientMatchUncheckedUpdateWithoutTrialInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    matchScore?: FloatFieldUpdateOperationsInput | number
    eligibilityStatus?: EnumEligibilityStatusFieldUpdateOperationsInput | $Enums.EligibilityStatus
    matchedCriteria?: JsonNullValueInput | InputJsonValue
    unmatchedCriteria?: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: NullableFloatFieldUpdateOperationsInput | number | null
    nearestSiteId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    patientNotified?: BoolFieldUpdateOperationsInput | boolean
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isInterested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    interestExpressedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientMatchUncheckedUpdateManyWithoutTrialInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    matchScore?: FloatFieldUpdateOperationsInput | number
    eligibilityStatus?: EnumEligibilityStatusFieldUpdateOperationsInput | $Enums.EligibilityStatus
    matchedCriteria?: JsonNullValueInput | InputJsonValue
    unmatchedCriteria?: JsonNullValueInput | InputJsonValue
    uncertainCriteria?: NullableJsonNullValueInput | InputJsonValue
    matchDetails?: NullableJsonNullValueInput | InputJsonValue
    distance?: NullableFloatFieldUpdateOperationsInput | number | null
    nearestSiteId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    patientNotified?: BoolFieldUpdateOperationsInput | boolean
    notifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isInterested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    interestExpressedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnrollmentUpdateWithoutTrialInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    site?: TrialSiteUpdateOneRequiredWithoutEnrollmentsNestedInput
    consentRecords?: ConsentRecordUpdateManyWithoutEnrollmentNestedInput
    statusHistory?: EnrollmentStatusHistoryUpdateManyWithoutEnrollmentNestedInput
    visits?: TrialVisitUpdateManyWithoutEnrollmentNestedInput
  }

  export type EnrollmentUncheckedUpdateWithoutTrialInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consentRecords?: ConsentRecordUncheckedUpdateManyWithoutEnrollmentNestedInput
    statusHistory?: EnrollmentStatusHistoryUncheckedUpdateManyWithoutEnrollmentNestedInput
    visits?: TrialVisitUncheckedUpdateManyWithoutEnrollmentNestedInput
  }

  export type EnrollmentUncheckedUpdateManyWithoutTrialInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnrollmentCreateManySiteInput = {
    id?: string
    patientId: string
    trialId: string
    status?: $Enums.EnrollmentStatus
    studySubjectId?: string | null
    screeningDate?: Date | string | null
    enrollmentDate?: Date | string | null
    randomizationDate?: Date | string | null
    armAssignment?: string | null
    withdrawalDate?: Date | string | null
    withdrawalReason?: string | null
    completionDate?: Date | string | null
    primaryInvestigator?: string | null
    studyCoordinator?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EnrollmentUpdateWithoutSiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trial?: ClinicalTrialUpdateOneRequiredWithoutEnrollmentsNestedInput
    consentRecords?: ConsentRecordUpdateManyWithoutEnrollmentNestedInput
    statusHistory?: EnrollmentStatusHistoryUpdateManyWithoutEnrollmentNestedInput
    visits?: TrialVisitUpdateManyWithoutEnrollmentNestedInput
  }

  export type EnrollmentUncheckedUpdateWithoutSiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consentRecords?: ConsentRecordUncheckedUpdateManyWithoutEnrollmentNestedInput
    statusHistory?: EnrollmentStatusHistoryUncheckedUpdateManyWithoutEnrollmentNestedInput
    visits?: TrialVisitUncheckedUpdateManyWithoutEnrollmentNestedInput
  }

  export type EnrollmentUncheckedUpdateManyWithoutSiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    status?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    studySubjectId?: NullableStringFieldUpdateOperationsInput | string | null
    screeningDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    randomizationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    armAssignment?: NullableStringFieldUpdateOperationsInput | string | null
    withdrawalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalReason?: NullableStringFieldUpdateOperationsInput | string | null
    completionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryInvestigator?: NullableStringFieldUpdateOperationsInput | string | null
    studyCoordinator?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordCreateManyEnrollmentInput = {
    id?: string
    consentType: $Enums.ConsentType
    consentFormId?: string | null
    consentFormVersion?: string | null
    signedAt: Date | string
    signedBy: string
    witnessName?: string | null
    witnessSignedAt?: Date | string | null
    coordinatorName?: string | null
    coordinatorId?: string | null
    documentUrl?: string | null
    isActive?: boolean
    revokedAt?: Date | string | null
    revokedReason?: string | null
    expiresAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EnrollmentStatusHistoryCreateManyEnrollmentInput = {
    id?: string
    fromStatus?: $Enums.EnrollmentStatus | null
    toStatus: $Enums.EnrollmentStatus
    reason?: string | null
    changedBy: string
    changedAt?: Date | string
  }

  export type TrialVisitCreateManyEnrollmentInput = {
    id?: string
    visitNumber: number
    visitName: string
    visitType?: $Enums.VisitType
    scheduledDate?: Date | string | null
    actualDate?: Date | string | null
    status?: $Enums.VisitStatus
    completedBy?: string | null
    notes?: string | null
    protocolDeviations?: string | null
    missedReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConsentRecordUpdateWithoutEnrollmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentType?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType
    consentFormId?: NullableStringFieldUpdateOperationsInput | string | null
    consentFormVersion?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signedBy?: StringFieldUpdateOperationsInput | string
    witnessName?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coordinatorName?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatorId?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedReason?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordUncheckedUpdateWithoutEnrollmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentType?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType
    consentFormId?: NullableStringFieldUpdateOperationsInput | string | null
    consentFormVersion?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signedBy?: StringFieldUpdateOperationsInput | string
    witnessName?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coordinatorName?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatorId?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedReason?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordUncheckedUpdateManyWithoutEnrollmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentType?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType
    consentFormId?: NullableStringFieldUpdateOperationsInput | string | null
    consentFormVersion?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signedBy?: StringFieldUpdateOperationsInput | string
    witnessName?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coordinatorName?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatorId?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedReason?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnrollmentStatusHistoryUpdateWithoutEnrollmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus | null
    toStatus?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnrollmentStatusHistoryUncheckedUpdateWithoutEnrollmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus | null
    toStatus?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnrollmentStatusHistoryUncheckedUpdateManyWithoutEnrollmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus | null
    toStatus?: EnumEnrollmentStatusFieldUpdateOperationsInput | $Enums.EnrollmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialVisitUpdateWithoutEnrollmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitNumber?: IntFieldUpdateOperationsInput | number
    visitName?: StringFieldUpdateOperationsInput | string
    visitType?: EnumVisitTypeFieldUpdateOperationsInput | $Enums.VisitType
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    protocolDeviations?: NullableStringFieldUpdateOperationsInput | string | null
    missedReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialVisitUncheckedUpdateWithoutEnrollmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitNumber?: IntFieldUpdateOperationsInput | number
    visitName?: StringFieldUpdateOperationsInput | string
    visitType?: EnumVisitTypeFieldUpdateOperationsInput | $Enums.VisitType
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    protocolDeviations?: NullableStringFieldUpdateOperationsInput | string | null
    missedReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrialVisitUncheckedUpdateManyWithoutEnrollmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitNumber?: IntFieldUpdateOperationsInput | number
    visitName?: StringFieldUpdateOperationsInput | string
    visitType?: EnumVisitTypeFieldUpdateOperationsInput | $Enums.VisitType
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    protocolDeviations?: NullableStringFieldUpdateOperationsInput | string | null
    missedReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigatorSiteAssignmentCreateManyInvestigatorInput = {
    id?: string
    siteId: string
    trialId: string
    role: $Enums.InvestigatorRole
    startDate?: Date | string
    endDate?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestigatorSiteAssignmentUpdateWithoutInvestigatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    role?: EnumInvestigatorRoleFieldUpdateOperationsInput | $Enums.InvestigatorRole
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigatorSiteAssignmentUncheckedUpdateWithoutInvestigatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    role?: EnumInvestigatorRoleFieldUpdateOperationsInput | $Enums.InvestigatorRole
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigatorSiteAssignmentUncheckedUpdateManyWithoutInvestigatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    trialId?: StringFieldUpdateOperationsInput | string
    role?: EnumInvestigatorRoleFieldUpdateOperationsInput | $Enums.InvestigatorRole
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ClinicalTrialCountOutputTypeDefaultArgs instead
     */
    export type ClinicalTrialCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClinicalTrialCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrialSiteCountOutputTypeDefaultArgs instead
     */
    export type TrialSiteCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrialSiteCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EnrollmentCountOutputTypeDefaultArgs instead
     */
    export type EnrollmentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EnrollmentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvestigatorCountOutputTypeDefaultArgs instead
     */
    export type InvestigatorCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvestigatorCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClinicalTrialDefaultArgs instead
     */
    export type ClinicalTrialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClinicalTrialDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrialSiteDefaultArgs instead
     */
    export type TrialSiteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrialSiteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientMatchDefaultArgs instead
     */
    export type PatientMatchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientMatchDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EnrollmentDefaultArgs instead
     */
    export type EnrollmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EnrollmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EnrollmentStatusHistoryDefaultArgs instead
     */
    export type EnrollmentStatusHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EnrollmentStatusHistoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConsentRecordDefaultArgs instead
     */
    export type ConsentRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConsentRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrialVisitDefaultArgs instead
     */
    export type TrialVisitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrialVisitDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvestigatorDefaultArgs instead
     */
    export type InvestigatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvestigatorDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvestigatorSiteAssignmentDefaultArgs instead
     */
    export type InvestigatorSiteAssignmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvestigatorSiteAssignmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrialNotificationDefaultArgs instead
     */
    export type TrialNotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrialNotificationDefaultArgs<ExtArgs>

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