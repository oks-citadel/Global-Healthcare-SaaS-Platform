
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
 * Model TherapySession
 * 
 */
export type TherapySession = $Result.DefaultSelection<Prisma.$TherapySessionPayload>
/**
 * Model MentalHealthAssessment
 * 
 */
export type MentalHealthAssessment = $Result.DefaultSelection<Prisma.$MentalHealthAssessmentPayload>
/**
 * Model CrisisIntervention
 * 
 */
export type CrisisIntervention = $Result.DefaultSelection<Prisma.$CrisisInterventionPayload>
/**
 * Model TreatmentPlan
 * 
 */
export type TreatmentPlan = $Result.DefaultSelection<Prisma.$TreatmentPlanPayload>
/**
 * Model MoodLog
 * 
 */
export type MoodLog = $Result.DefaultSelection<Prisma.$MoodLogPayload>
/**
 * Model SupportGroup
 * 
 */
export type SupportGroup = $Result.DefaultSelection<Prisma.$SupportGroupPayload>
/**
 * Model SupportGroupMember
 * 
 */
export type SupportGroupMember = $Result.DefaultSelection<Prisma.$SupportGroupMemberPayload>
/**
 * Model ConsentRecord
 * 
 */
export type ConsentRecord = $Result.DefaultSelection<Prisma.$ConsentRecordPayload>
/**
 * Model GroupSession
 * 
 */
export type GroupSession = $Result.DefaultSelection<Prisma.$GroupSessionPayload>
/**
 * Model GroupSessionAttendee
 * 
 */
export type GroupSessionAttendee = $Result.DefaultSelection<Prisma.$GroupSessionAttendeePayload>
/**
 * Model PsychMedication
 * 
 */
export type PsychMedication = $Result.DefaultSelection<Prisma.$PsychMedicationPayload>
/**
 * Model ProgressNote
 * 
 */
export type ProgressNote = $Result.DefaultSelection<Prisma.$ProgressNotePayload>
/**
 * Model TreatmentGoal
 * 
 */
export type TreatmentGoal = $Result.DefaultSelection<Prisma.$TreatmentGoalPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const SessionType: {
  individual: 'individual',
  group: 'group',
  couples: 'couples',
  family: 'family'
};

export type SessionType = (typeof SessionType)[keyof typeof SessionType]


export const SessionStatus: {
  scheduled: 'scheduled',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'no_show'
};

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus]


export const AssessmentType: {
  PHQ9: 'PHQ9',
  GAD7: 'GAD7',
  PCL5: 'PCL5',
  AUDIT: 'AUDIT',
  DAST: 'DAST',
  MDQ: 'MDQ',
  YBOCS: 'YBOCS',
  PSS: 'PSS',
  general_intake: 'general_intake'
};

export type AssessmentType = (typeof AssessmentType)[keyof typeof AssessmentType]


export const SeverityLevel: {
  none: 'none',
  minimal: 'minimal',
  mild: 'mild',
  moderate: 'moderate',
  moderately_severe: 'moderately_severe',
  severe: 'severe'
};

export type SeverityLevel = (typeof SeverityLevel)[keyof typeof SeverityLevel]


export const CrisisType: {
  suicidal_ideation: 'suicidal_ideation',
  self_harm: 'self_harm',
  panic_attack: 'panic_attack',
  psychotic_episode: 'psychotic_episode',
  substance_overdose: 'substance_overdose',
  domestic_violence: 'domestic_violence',
  trauma: 'trauma',
  other: 'other'
};

export type CrisisType = (typeof CrisisType)[keyof typeof CrisisType]


export const CrisisSeverity: {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical'
};

export type CrisisSeverity = (typeof CrisisSeverity)[keyof typeof CrisisSeverity]


export const CrisisStatus: {
  active: 'active',
  monitoring: 'monitoring',
  resolved: 'resolved',
  escalated: 'escalated'
};

export type CrisisStatus = (typeof CrisisStatus)[keyof typeof CrisisStatus]


export const ConsentType: {
  treatment: 'treatment',
  medication: 'medication',
  information_sharing: 'information_sharing',
  information_release: 'information_release',
  telehealth: 'telehealth',
  research: 'research',
  emergency_contact: 'emergency_contact',
  cfr_part2: 'cfr_part2'
};

export type ConsentType = (typeof ConsentType)[keyof typeof ConsentType]


export const ConsentStatus: {
  pending: 'pending',
  active: 'active',
  revoked: 'revoked',
  expired: 'expired'
};

export type ConsentStatus = (typeof ConsentStatus)[keyof typeof ConsentStatus]


export const GroupSessionType: {
  support: 'support',
  psychoeducation: 'psychoeducation',
  skills_training: 'skills_training',
  process: 'process'
};

export type GroupSessionType = (typeof GroupSessionType)[keyof typeof GroupSessionType]


export const GroupSessionStatus: {
  scheduled: 'scheduled',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'no_show'
};

export type GroupSessionStatus = (typeof GroupSessionStatus)[keyof typeof GroupSessionStatus]


export const MedicationClass: {
  antidepressant: 'antidepressant',
  antianxiety: 'antianxiety',
  anxiolytic: 'anxiolytic',
  antipsychotic: 'antipsychotic',
  mood_stabilizer: 'mood_stabilizer',
  stimulant: 'stimulant',
  sedative: 'sedative',
  sedative_hypnotic: 'sedative_hypnotic',
  other: 'other'
};

export type MedicationClass = (typeof MedicationClass)[keyof typeof MedicationClass]


export const MedicationStatus: {
  active: 'active',
  completed: 'completed',
  discontinued: 'discontinued',
  on_hold: 'on_hold',
  tapered: 'tapered'
};

export type MedicationStatus = (typeof MedicationStatus)[keyof typeof MedicationStatus]


export const NoteType: {
  initial_assessment: 'initial_assessment',
  progress: 'progress',
  discharge: 'discharge',
  crisis: 'crisis',
  consultation: 'consultation',
  group: 'group',
  SOAP: 'SOAP',
  DAP: 'DAP',
  BIRP: 'BIRP',
  GIRP: 'GIRP'
};

export type NoteType = (typeof NoteType)[keyof typeof NoteType]


export const TreatmentGoalStatus: {
  not_started: 'not_started',
  in_progress: 'in_progress',
  achieved: 'achieved',
  modified: 'modified',
  discontinued: 'discontinued'
};

export type TreatmentGoalStatus = (typeof TreatmentGoalStatus)[keyof typeof TreatmentGoalStatus]

}

export type SessionType = $Enums.SessionType

export const SessionType: typeof $Enums.SessionType

export type SessionStatus = $Enums.SessionStatus

export const SessionStatus: typeof $Enums.SessionStatus

export type AssessmentType = $Enums.AssessmentType

export const AssessmentType: typeof $Enums.AssessmentType

export type SeverityLevel = $Enums.SeverityLevel

export const SeverityLevel: typeof $Enums.SeverityLevel

export type CrisisType = $Enums.CrisisType

export const CrisisType: typeof $Enums.CrisisType

export type CrisisSeverity = $Enums.CrisisSeverity

export const CrisisSeverity: typeof $Enums.CrisisSeverity

export type CrisisStatus = $Enums.CrisisStatus

export const CrisisStatus: typeof $Enums.CrisisStatus

export type ConsentType = $Enums.ConsentType

export const ConsentType: typeof $Enums.ConsentType

export type ConsentStatus = $Enums.ConsentStatus

export const ConsentStatus: typeof $Enums.ConsentStatus

export type GroupSessionType = $Enums.GroupSessionType

export const GroupSessionType: typeof $Enums.GroupSessionType

export type GroupSessionStatus = $Enums.GroupSessionStatus

export const GroupSessionStatus: typeof $Enums.GroupSessionStatus

export type MedicationClass = $Enums.MedicationClass

export const MedicationClass: typeof $Enums.MedicationClass

export type MedicationStatus = $Enums.MedicationStatus

export const MedicationStatus: typeof $Enums.MedicationStatus

export type NoteType = $Enums.NoteType

export const NoteType: typeof $Enums.NoteType

export type TreatmentGoalStatus = $Enums.TreatmentGoalStatus

export const TreatmentGoalStatus: typeof $Enums.TreatmentGoalStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more TherapySessions
 * const therapySessions = await prisma.therapySession.findMany()
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
   * // Fetch zero or more TherapySessions
   * const therapySessions = await prisma.therapySession.findMany()
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
   * `prisma.therapySession`: Exposes CRUD operations for the **TherapySession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TherapySessions
    * const therapySessions = await prisma.therapySession.findMany()
    * ```
    */
  get therapySession(): Prisma.TherapySessionDelegate<ExtArgs>;

  /**
   * `prisma.mentalHealthAssessment`: Exposes CRUD operations for the **MentalHealthAssessment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MentalHealthAssessments
    * const mentalHealthAssessments = await prisma.mentalHealthAssessment.findMany()
    * ```
    */
  get mentalHealthAssessment(): Prisma.MentalHealthAssessmentDelegate<ExtArgs>;

  /**
   * `prisma.crisisIntervention`: Exposes CRUD operations for the **CrisisIntervention** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CrisisInterventions
    * const crisisInterventions = await prisma.crisisIntervention.findMany()
    * ```
    */
  get crisisIntervention(): Prisma.CrisisInterventionDelegate<ExtArgs>;

  /**
   * `prisma.treatmentPlan`: Exposes CRUD operations for the **TreatmentPlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TreatmentPlans
    * const treatmentPlans = await prisma.treatmentPlan.findMany()
    * ```
    */
  get treatmentPlan(): Prisma.TreatmentPlanDelegate<ExtArgs>;

  /**
   * `prisma.moodLog`: Exposes CRUD operations for the **MoodLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MoodLogs
    * const moodLogs = await prisma.moodLog.findMany()
    * ```
    */
  get moodLog(): Prisma.MoodLogDelegate<ExtArgs>;

  /**
   * `prisma.supportGroup`: Exposes CRUD operations for the **SupportGroup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SupportGroups
    * const supportGroups = await prisma.supportGroup.findMany()
    * ```
    */
  get supportGroup(): Prisma.SupportGroupDelegate<ExtArgs>;

  /**
   * `prisma.supportGroupMember`: Exposes CRUD operations for the **SupportGroupMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SupportGroupMembers
    * const supportGroupMembers = await prisma.supportGroupMember.findMany()
    * ```
    */
  get supportGroupMember(): Prisma.SupportGroupMemberDelegate<ExtArgs>;

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
   * `prisma.groupSession`: Exposes CRUD operations for the **GroupSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GroupSessions
    * const groupSessions = await prisma.groupSession.findMany()
    * ```
    */
  get groupSession(): Prisma.GroupSessionDelegate<ExtArgs>;

  /**
   * `prisma.groupSessionAttendee`: Exposes CRUD operations for the **GroupSessionAttendee** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GroupSessionAttendees
    * const groupSessionAttendees = await prisma.groupSessionAttendee.findMany()
    * ```
    */
  get groupSessionAttendee(): Prisma.GroupSessionAttendeeDelegate<ExtArgs>;

  /**
   * `prisma.psychMedication`: Exposes CRUD operations for the **PsychMedication** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PsychMedications
    * const psychMedications = await prisma.psychMedication.findMany()
    * ```
    */
  get psychMedication(): Prisma.PsychMedicationDelegate<ExtArgs>;

  /**
   * `prisma.progressNote`: Exposes CRUD operations for the **ProgressNote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProgressNotes
    * const progressNotes = await prisma.progressNote.findMany()
    * ```
    */
  get progressNote(): Prisma.ProgressNoteDelegate<ExtArgs>;

  /**
   * `prisma.treatmentGoal`: Exposes CRUD operations for the **TreatmentGoal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TreatmentGoals
    * const treatmentGoals = await prisma.treatmentGoal.findMany()
    * ```
    */
  get treatmentGoal(): Prisma.TreatmentGoalDelegate<ExtArgs>;
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
    TherapySession: 'TherapySession',
    MentalHealthAssessment: 'MentalHealthAssessment',
    CrisisIntervention: 'CrisisIntervention',
    TreatmentPlan: 'TreatmentPlan',
    MoodLog: 'MoodLog',
    SupportGroup: 'SupportGroup',
    SupportGroupMember: 'SupportGroupMember',
    ConsentRecord: 'ConsentRecord',
    GroupSession: 'GroupSession',
    GroupSessionAttendee: 'GroupSessionAttendee',
    PsychMedication: 'PsychMedication',
    ProgressNote: 'ProgressNote',
    TreatmentGoal: 'TreatmentGoal'
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
      modelProps: "therapySession" | "mentalHealthAssessment" | "crisisIntervention" | "treatmentPlan" | "moodLog" | "supportGroup" | "supportGroupMember" | "consentRecord" | "groupSession" | "groupSessionAttendee" | "psychMedication" | "progressNote" | "treatmentGoal"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      TherapySession: {
        payload: Prisma.$TherapySessionPayload<ExtArgs>
        fields: Prisma.TherapySessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TherapySessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TherapySessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TherapySessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TherapySessionPayload>
          }
          findFirst: {
            args: Prisma.TherapySessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TherapySessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TherapySessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TherapySessionPayload>
          }
          findMany: {
            args: Prisma.TherapySessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TherapySessionPayload>[]
          }
          create: {
            args: Prisma.TherapySessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TherapySessionPayload>
          }
          createMany: {
            args: Prisma.TherapySessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TherapySessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TherapySessionPayload>[]
          }
          delete: {
            args: Prisma.TherapySessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TherapySessionPayload>
          }
          update: {
            args: Prisma.TherapySessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TherapySessionPayload>
          }
          deleteMany: {
            args: Prisma.TherapySessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TherapySessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TherapySessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TherapySessionPayload>
          }
          aggregate: {
            args: Prisma.TherapySessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTherapySession>
          }
          groupBy: {
            args: Prisma.TherapySessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TherapySessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TherapySessionCountArgs<ExtArgs>
            result: $Utils.Optional<TherapySessionCountAggregateOutputType> | number
          }
        }
      }
      MentalHealthAssessment: {
        payload: Prisma.$MentalHealthAssessmentPayload<ExtArgs>
        fields: Prisma.MentalHealthAssessmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MentalHealthAssessmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentalHealthAssessmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MentalHealthAssessmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentalHealthAssessmentPayload>
          }
          findFirst: {
            args: Prisma.MentalHealthAssessmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentalHealthAssessmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MentalHealthAssessmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentalHealthAssessmentPayload>
          }
          findMany: {
            args: Prisma.MentalHealthAssessmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentalHealthAssessmentPayload>[]
          }
          create: {
            args: Prisma.MentalHealthAssessmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentalHealthAssessmentPayload>
          }
          createMany: {
            args: Prisma.MentalHealthAssessmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MentalHealthAssessmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentalHealthAssessmentPayload>[]
          }
          delete: {
            args: Prisma.MentalHealthAssessmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentalHealthAssessmentPayload>
          }
          update: {
            args: Prisma.MentalHealthAssessmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentalHealthAssessmentPayload>
          }
          deleteMany: {
            args: Prisma.MentalHealthAssessmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MentalHealthAssessmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MentalHealthAssessmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentalHealthAssessmentPayload>
          }
          aggregate: {
            args: Prisma.MentalHealthAssessmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMentalHealthAssessment>
          }
          groupBy: {
            args: Prisma.MentalHealthAssessmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<MentalHealthAssessmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.MentalHealthAssessmentCountArgs<ExtArgs>
            result: $Utils.Optional<MentalHealthAssessmentCountAggregateOutputType> | number
          }
        }
      }
      CrisisIntervention: {
        payload: Prisma.$CrisisInterventionPayload<ExtArgs>
        fields: Prisma.CrisisInterventionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CrisisInterventionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisInterventionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CrisisInterventionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisInterventionPayload>
          }
          findFirst: {
            args: Prisma.CrisisInterventionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisInterventionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CrisisInterventionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisInterventionPayload>
          }
          findMany: {
            args: Prisma.CrisisInterventionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisInterventionPayload>[]
          }
          create: {
            args: Prisma.CrisisInterventionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisInterventionPayload>
          }
          createMany: {
            args: Prisma.CrisisInterventionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CrisisInterventionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisInterventionPayload>[]
          }
          delete: {
            args: Prisma.CrisisInterventionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisInterventionPayload>
          }
          update: {
            args: Prisma.CrisisInterventionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisInterventionPayload>
          }
          deleteMany: {
            args: Prisma.CrisisInterventionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CrisisInterventionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CrisisInterventionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisInterventionPayload>
          }
          aggregate: {
            args: Prisma.CrisisInterventionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCrisisIntervention>
          }
          groupBy: {
            args: Prisma.CrisisInterventionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CrisisInterventionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CrisisInterventionCountArgs<ExtArgs>
            result: $Utils.Optional<CrisisInterventionCountAggregateOutputType> | number
          }
        }
      }
      TreatmentPlan: {
        payload: Prisma.$TreatmentPlanPayload<ExtArgs>
        fields: Prisma.TreatmentPlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TreatmentPlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TreatmentPlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPlanPayload>
          }
          findFirst: {
            args: Prisma.TreatmentPlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TreatmentPlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPlanPayload>
          }
          findMany: {
            args: Prisma.TreatmentPlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPlanPayload>[]
          }
          create: {
            args: Prisma.TreatmentPlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPlanPayload>
          }
          createMany: {
            args: Prisma.TreatmentPlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TreatmentPlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPlanPayload>[]
          }
          delete: {
            args: Prisma.TreatmentPlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPlanPayload>
          }
          update: {
            args: Prisma.TreatmentPlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPlanPayload>
          }
          deleteMany: {
            args: Prisma.TreatmentPlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TreatmentPlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TreatmentPlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPlanPayload>
          }
          aggregate: {
            args: Prisma.TreatmentPlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTreatmentPlan>
          }
          groupBy: {
            args: Prisma.TreatmentPlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<TreatmentPlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.TreatmentPlanCountArgs<ExtArgs>
            result: $Utils.Optional<TreatmentPlanCountAggregateOutputType> | number
          }
        }
      }
      MoodLog: {
        payload: Prisma.$MoodLogPayload<ExtArgs>
        fields: Prisma.MoodLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MoodLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MoodLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodLogPayload>
          }
          findFirst: {
            args: Prisma.MoodLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MoodLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodLogPayload>
          }
          findMany: {
            args: Prisma.MoodLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodLogPayload>[]
          }
          create: {
            args: Prisma.MoodLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodLogPayload>
          }
          createMany: {
            args: Prisma.MoodLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MoodLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodLogPayload>[]
          }
          delete: {
            args: Prisma.MoodLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodLogPayload>
          }
          update: {
            args: Prisma.MoodLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodLogPayload>
          }
          deleteMany: {
            args: Prisma.MoodLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MoodLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MoodLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodLogPayload>
          }
          aggregate: {
            args: Prisma.MoodLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMoodLog>
          }
          groupBy: {
            args: Prisma.MoodLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<MoodLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.MoodLogCountArgs<ExtArgs>
            result: $Utils.Optional<MoodLogCountAggregateOutputType> | number
          }
        }
      }
      SupportGroup: {
        payload: Prisma.$SupportGroupPayload<ExtArgs>
        fields: Prisma.SupportGroupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupportGroupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupportGroupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupPayload>
          }
          findFirst: {
            args: Prisma.SupportGroupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupportGroupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupPayload>
          }
          findMany: {
            args: Prisma.SupportGroupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupPayload>[]
          }
          create: {
            args: Prisma.SupportGroupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupPayload>
          }
          createMany: {
            args: Prisma.SupportGroupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SupportGroupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupPayload>[]
          }
          delete: {
            args: Prisma.SupportGroupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupPayload>
          }
          update: {
            args: Prisma.SupportGroupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupPayload>
          }
          deleteMany: {
            args: Prisma.SupportGroupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupportGroupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SupportGroupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupPayload>
          }
          aggregate: {
            args: Prisma.SupportGroupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupportGroup>
          }
          groupBy: {
            args: Prisma.SupportGroupGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupportGroupGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupportGroupCountArgs<ExtArgs>
            result: $Utils.Optional<SupportGroupCountAggregateOutputType> | number
          }
        }
      }
      SupportGroupMember: {
        payload: Prisma.$SupportGroupMemberPayload<ExtArgs>
        fields: Prisma.SupportGroupMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupportGroupMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupportGroupMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupMemberPayload>
          }
          findFirst: {
            args: Prisma.SupportGroupMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupportGroupMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupMemberPayload>
          }
          findMany: {
            args: Prisma.SupportGroupMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupMemberPayload>[]
          }
          create: {
            args: Prisma.SupportGroupMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupMemberPayload>
          }
          createMany: {
            args: Prisma.SupportGroupMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SupportGroupMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupMemberPayload>[]
          }
          delete: {
            args: Prisma.SupportGroupMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupMemberPayload>
          }
          update: {
            args: Prisma.SupportGroupMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupMemberPayload>
          }
          deleteMany: {
            args: Prisma.SupportGroupMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupportGroupMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SupportGroupMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportGroupMemberPayload>
          }
          aggregate: {
            args: Prisma.SupportGroupMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupportGroupMember>
          }
          groupBy: {
            args: Prisma.SupportGroupMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupportGroupMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupportGroupMemberCountArgs<ExtArgs>
            result: $Utils.Optional<SupportGroupMemberCountAggregateOutputType> | number
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
      GroupSession: {
        payload: Prisma.$GroupSessionPayload<ExtArgs>
        fields: Prisma.GroupSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroupSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroupSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionPayload>
          }
          findFirst: {
            args: Prisma.GroupSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroupSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionPayload>
          }
          findMany: {
            args: Prisma.GroupSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionPayload>[]
          }
          create: {
            args: Prisma.GroupSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionPayload>
          }
          createMany: {
            args: Prisma.GroupSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroupSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionPayload>[]
          }
          delete: {
            args: Prisma.GroupSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionPayload>
          }
          update: {
            args: Prisma.GroupSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionPayload>
          }
          deleteMany: {
            args: Prisma.GroupSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroupSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GroupSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionPayload>
          }
          aggregate: {
            args: Prisma.GroupSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroupSession>
          }
          groupBy: {
            args: Prisma.GroupSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroupSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroupSessionCountArgs<ExtArgs>
            result: $Utils.Optional<GroupSessionCountAggregateOutputType> | number
          }
        }
      }
      GroupSessionAttendee: {
        payload: Prisma.$GroupSessionAttendeePayload<ExtArgs>
        fields: Prisma.GroupSessionAttendeeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroupSessionAttendeeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionAttendeePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroupSessionAttendeeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionAttendeePayload>
          }
          findFirst: {
            args: Prisma.GroupSessionAttendeeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionAttendeePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroupSessionAttendeeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionAttendeePayload>
          }
          findMany: {
            args: Prisma.GroupSessionAttendeeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionAttendeePayload>[]
          }
          create: {
            args: Prisma.GroupSessionAttendeeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionAttendeePayload>
          }
          createMany: {
            args: Prisma.GroupSessionAttendeeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroupSessionAttendeeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionAttendeePayload>[]
          }
          delete: {
            args: Prisma.GroupSessionAttendeeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionAttendeePayload>
          }
          update: {
            args: Prisma.GroupSessionAttendeeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionAttendeePayload>
          }
          deleteMany: {
            args: Prisma.GroupSessionAttendeeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroupSessionAttendeeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GroupSessionAttendeeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionAttendeePayload>
          }
          aggregate: {
            args: Prisma.GroupSessionAttendeeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroupSessionAttendee>
          }
          groupBy: {
            args: Prisma.GroupSessionAttendeeGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroupSessionAttendeeGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroupSessionAttendeeCountArgs<ExtArgs>
            result: $Utils.Optional<GroupSessionAttendeeCountAggregateOutputType> | number
          }
        }
      }
      PsychMedication: {
        payload: Prisma.$PsychMedicationPayload<ExtArgs>
        fields: Prisma.PsychMedicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PsychMedicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PsychMedicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PsychMedicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PsychMedicationPayload>
          }
          findFirst: {
            args: Prisma.PsychMedicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PsychMedicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PsychMedicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PsychMedicationPayload>
          }
          findMany: {
            args: Prisma.PsychMedicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PsychMedicationPayload>[]
          }
          create: {
            args: Prisma.PsychMedicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PsychMedicationPayload>
          }
          createMany: {
            args: Prisma.PsychMedicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PsychMedicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PsychMedicationPayload>[]
          }
          delete: {
            args: Prisma.PsychMedicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PsychMedicationPayload>
          }
          update: {
            args: Prisma.PsychMedicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PsychMedicationPayload>
          }
          deleteMany: {
            args: Prisma.PsychMedicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PsychMedicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PsychMedicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PsychMedicationPayload>
          }
          aggregate: {
            args: Prisma.PsychMedicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePsychMedication>
          }
          groupBy: {
            args: Prisma.PsychMedicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PsychMedicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.PsychMedicationCountArgs<ExtArgs>
            result: $Utils.Optional<PsychMedicationCountAggregateOutputType> | number
          }
        }
      }
      ProgressNote: {
        payload: Prisma.$ProgressNotePayload<ExtArgs>
        fields: Prisma.ProgressNoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgressNoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressNotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgressNoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressNotePayload>
          }
          findFirst: {
            args: Prisma.ProgressNoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressNotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgressNoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressNotePayload>
          }
          findMany: {
            args: Prisma.ProgressNoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressNotePayload>[]
          }
          create: {
            args: Prisma.ProgressNoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressNotePayload>
          }
          createMany: {
            args: Prisma.ProgressNoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProgressNoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressNotePayload>[]
          }
          delete: {
            args: Prisma.ProgressNoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressNotePayload>
          }
          update: {
            args: Prisma.ProgressNoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressNotePayload>
          }
          deleteMany: {
            args: Prisma.ProgressNoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgressNoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProgressNoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressNotePayload>
          }
          aggregate: {
            args: Prisma.ProgressNoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProgressNote>
          }
          groupBy: {
            args: Prisma.ProgressNoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgressNoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProgressNoteCountArgs<ExtArgs>
            result: $Utils.Optional<ProgressNoteCountAggregateOutputType> | number
          }
        }
      }
      TreatmentGoal: {
        payload: Prisma.$TreatmentGoalPayload<ExtArgs>
        fields: Prisma.TreatmentGoalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TreatmentGoalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentGoalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TreatmentGoalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentGoalPayload>
          }
          findFirst: {
            args: Prisma.TreatmentGoalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentGoalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TreatmentGoalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentGoalPayload>
          }
          findMany: {
            args: Prisma.TreatmentGoalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentGoalPayload>[]
          }
          create: {
            args: Prisma.TreatmentGoalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentGoalPayload>
          }
          createMany: {
            args: Prisma.TreatmentGoalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TreatmentGoalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentGoalPayload>[]
          }
          delete: {
            args: Prisma.TreatmentGoalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentGoalPayload>
          }
          update: {
            args: Prisma.TreatmentGoalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentGoalPayload>
          }
          deleteMany: {
            args: Prisma.TreatmentGoalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TreatmentGoalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TreatmentGoalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentGoalPayload>
          }
          aggregate: {
            args: Prisma.TreatmentGoalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTreatmentGoal>
          }
          groupBy: {
            args: Prisma.TreatmentGoalGroupByArgs<ExtArgs>
            result: $Utils.Optional<TreatmentGoalGroupByOutputType>[]
          }
          count: {
            args: Prisma.TreatmentGoalCountArgs<ExtArgs>
            result: $Utils.Optional<TreatmentGoalCountAggregateOutputType> | number
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
   * Count Type SupportGroupCountOutputType
   */

  export type SupportGroupCountOutputType = {
    members: number
  }

  export type SupportGroupCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | SupportGroupCountOutputTypeCountMembersArgs
  }

  // Custom InputTypes
  /**
   * SupportGroupCountOutputType without action
   */
  export type SupportGroupCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupCountOutputType
     */
    select?: SupportGroupCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SupportGroupCountOutputType without action
   */
  export type SupportGroupCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupportGroupMemberWhereInput
  }


  /**
   * Count Type GroupSessionCountOutputType
   */

  export type GroupSessionCountOutputType = {
    attendees: number
  }

  export type GroupSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attendees?: boolean | GroupSessionCountOutputTypeCountAttendeesArgs
  }

  // Custom InputTypes
  /**
   * GroupSessionCountOutputType without action
   */
  export type GroupSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionCountOutputType
     */
    select?: GroupSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GroupSessionCountOutputType without action
   */
  export type GroupSessionCountOutputTypeCountAttendeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroupSessionAttendeeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model TherapySession
   */

  export type AggregateTherapySession = {
    _count: TherapySessionCountAggregateOutputType | null
    _avg: TherapySessionAvgAggregateOutputType | null
    _sum: TherapySessionSumAggregateOutputType | null
    _min: TherapySessionMinAggregateOutputType | null
    _max: TherapySessionMaxAggregateOutputType | null
  }

  export type TherapySessionAvgAggregateOutputType = {
    duration: number | null
  }

  export type TherapySessionSumAggregateOutputType = {
    duration: number | null
  }

  export type TherapySessionMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    therapistId: string | null
    sessionType: $Enums.SessionType | null
    status: $Enums.SessionStatus | null
    scheduledAt: Date | null
    duration: number | null
    modality: string | null
    notes: string | null
    homework: string | null
    nextSessionDate: Date | null
    actualStartTime: Date | null
    actualEndTime: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TherapySessionMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    therapistId: string | null
    sessionType: $Enums.SessionType | null
    status: $Enums.SessionStatus | null
    scheduledAt: Date | null
    duration: number | null
    modality: string | null
    notes: string | null
    homework: string | null
    nextSessionDate: Date | null
    actualStartTime: Date | null
    actualEndTime: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TherapySessionCountAggregateOutputType = {
    id: number
    patientId: number
    therapistId: number
    sessionType: number
    status: number
    scheduledAt: number
    duration: number
    modality: number
    notes: number
    homework: number
    nextSessionDate: number
    actualStartTime: number
    actualEndTime: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TherapySessionAvgAggregateInputType = {
    duration?: true
  }

  export type TherapySessionSumAggregateInputType = {
    duration?: true
  }

  export type TherapySessionMinAggregateInputType = {
    id?: true
    patientId?: true
    therapistId?: true
    sessionType?: true
    status?: true
    scheduledAt?: true
    duration?: true
    modality?: true
    notes?: true
    homework?: true
    nextSessionDate?: true
    actualStartTime?: true
    actualEndTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TherapySessionMaxAggregateInputType = {
    id?: true
    patientId?: true
    therapistId?: true
    sessionType?: true
    status?: true
    scheduledAt?: true
    duration?: true
    modality?: true
    notes?: true
    homework?: true
    nextSessionDate?: true
    actualStartTime?: true
    actualEndTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TherapySessionCountAggregateInputType = {
    id?: true
    patientId?: true
    therapistId?: true
    sessionType?: true
    status?: true
    scheduledAt?: true
    duration?: true
    modality?: true
    notes?: true
    homework?: true
    nextSessionDate?: true
    actualStartTime?: true
    actualEndTime?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TherapySessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TherapySession to aggregate.
     */
    where?: TherapySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TherapySessions to fetch.
     */
    orderBy?: TherapySessionOrderByWithRelationInput | TherapySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TherapySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TherapySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TherapySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TherapySessions
    **/
    _count?: true | TherapySessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TherapySessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TherapySessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TherapySessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TherapySessionMaxAggregateInputType
  }

  export type GetTherapySessionAggregateType<T extends TherapySessionAggregateArgs> = {
        [P in keyof T & keyof AggregateTherapySession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTherapySession[P]>
      : GetScalarType<T[P], AggregateTherapySession[P]>
  }




  export type TherapySessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TherapySessionWhereInput
    orderBy?: TherapySessionOrderByWithAggregationInput | TherapySessionOrderByWithAggregationInput[]
    by: TherapySessionScalarFieldEnum[] | TherapySessionScalarFieldEnum
    having?: TherapySessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TherapySessionCountAggregateInputType | true
    _avg?: TherapySessionAvgAggregateInputType
    _sum?: TherapySessionSumAggregateInputType
    _min?: TherapySessionMinAggregateInputType
    _max?: TherapySessionMaxAggregateInputType
  }

  export type TherapySessionGroupByOutputType = {
    id: string
    patientId: string
    therapistId: string
    sessionType: $Enums.SessionType
    status: $Enums.SessionStatus
    scheduledAt: Date
    duration: number
    modality: string | null
    notes: string | null
    homework: string | null
    nextSessionDate: Date | null
    actualStartTime: Date | null
    actualEndTime: Date | null
    createdAt: Date
    updatedAt: Date
    _count: TherapySessionCountAggregateOutputType | null
    _avg: TherapySessionAvgAggregateOutputType | null
    _sum: TherapySessionSumAggregateOutputType | null
    _min: TherapySessionMinAggregateOutputType | null
    _max: TherapySessionMaxAggregateOutputType | null
  }

  type GetTherapySessionGroupByPayload<T extends TherapySessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TherapySessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TherapySessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TherapySessionGroupByOutputType[P]>
            : GetScalarType<T[P], TherapySessionGroupByOutputType[P]>
        }
      >
    >


  export type TherapySessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    therapistId?: boolean
    sessionType?: boolean
    status?: boolean
    scheduledAt?: boolean
    duration?: boolean
    modality?: boolean
    notes?: boolean
    homework?: boolean
    nextSessionDate?: boolean
    actualStartTime?: boolean
    actualEndTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["therapySession"]>

  export type TherapySessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    therapistId?: boolean
    sessionType?: boolean
    status?: boolean
    scheduledAt?: boolean
    duration?: boolean
    modality?: boolean
    notes?: boolean
    homework?: boolean
    nextSessionDate?: boolean
    actualStartTime?: boolean
    actualEndTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["therapySession"]>

  export type TherapySessionSelectScalar = {
    id?: boolean
    patientId?: boolean
    therapistId?: boolean
    sessionType?: boolean
    status?: boolean
    scheduledAt?: boolean
    duration?: boolean
    modality?: boolean
    notes?: boolean
    homework?: boolean
    nextSessionDate?: boolean
    actualStartTime?: boolean
    actualEndTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $TherapySessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TherapySession"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      therapistId: string
      sessionType: $Enums.SessionType
      status: $Enums.SessionStatus
      scheduledAt: Date
      duration: number
      modality: string | null
      notes: string | null
      homework: string | null
      nextSessionDate: Date | null
      actualStartTime: Date | null
      actualEndTime: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["therapySession"]>
    composites: {}
  }

  type TherapySessionGetPayload<S extends boolean | null | undefined | TherapySessionDefaultArgs> = $Result.GetResult<Prisma.$TherapySessionPayload, S>

  type TherapySessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TherapySessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TherapySessionCountAggregateInputType | true
    }

  export interface TherapySessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TherapySession'], meta: { name: 'TherapySession' } }
    /**
     * Find zero or one TherapySession that matches the filter.
     * @param {TherapySessionFindUniqueArgs} args - Arguments to find a TherapySession
     * @example
     * // Get one TherapySession
     * const therapySession = await prisma.therapySession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TherapySessionFindUniqueArgs>(args: SelectSubset<T, TherapySessionFindUniqueArgs<ExtArgs>>): Prisma__TherapySessionClient<$Result.GetResult<Prisma.$TherapySessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TherapySession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TherapySessionFindUniqueOrThrowArgs} args - Arguments to find a TherapySession
     * @example
     * // Get one TherapySession
     * const therapySession = await prisma.therapySession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TherapySessionFindUniqueOrThrowArgs>(args: SelectSubset<T, TherapySessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TherapySessionClient<$Result.GetResult<Prisma.$TherapySessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TherapySession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TherapySessionFindFirstArgs} args - Arguments to find a TherapySession
     * @example
     * // Get one TherapySession
     * const therapySession = await prisma.therapySession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TherapySessionFindFirstArgs>(args?: SelectSubset<T, TherapySessionFindFirstArgs<ExtArgs>>): Prisma__TherapySessionClient<$Result.GetResult<Prisma.$TherapySessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TherapySession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TherapySessionFindFirstOrThrowArgs} args - Arguments to find a TherapySession
     * @example
     * // Get one TherapySession
     * const therapySession = await prisma.therapySession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TherapySessionFindFirstOrThrowArgs>(args?: SelectSubset<T, TherapySessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TherapySessionClient<$Result.GetResult<Prisma.$TherapySessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TherapySessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TherapySessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TherapySessions
     * const therapySessions = await prisma.therapySession.findMany()
     * 
     * // Get first 10 TherapySessions
     * const therapySessions = await prisma.therapySession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const therapySessionWithIdOnly = await prisma.therapySession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TherapySessionFindManyArgs>(args?: SelectSubset<T, TherapySessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TherapySessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TherapySession.
     * @param {TherapySessionCreateArgs} args - Arguments to create a TherapySession.
     * @example
     * // Create one TherapySession
     * const TherapySession = await prisma.therapySession.create({
     *   data: {
     *     // ... data to create a TherapySession
     *   }
     * })
     * 
     */
    create<T extends TherapySessionCreateArgs>(args: SelectSubset<T, TherapySessionCreateArgs<ExtArgs>>): Prisma__TherapySessionClient<$Result.GetResult<Prisma.$TherapySessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TherapySessions.
     * @param {TherapySessionCreateManyArgs} args - Arguments to create many TherapySessions.
     * @example
     * // Create many TherapySessions
     * const therapySession = await prisma.therapySession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TherapySessionCreateManyArgs>(args?: SelectSubset<T, TherapySessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TherapySessions and returns the data saved in the database.
     * @param {TherapySessionCreateManyAndReturnArgs} args - Arguments to create many TherapySessions.
     * @example
     * // Create many TherapySessions
     * const therapySession = await prisma.therapySession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TherapySessions and only return the `id`
     * const therapySessionWithIdOnly = await prisma.therapySession.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TherapySessionCreateManyAndReturnArgs>(args?: SelectSubset<T, TherapySessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TherapySessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TherapySession.
     * @param {TherapySessionDeleteArgs} args - Arguments to delete one TherapySession.
     * @example
     * // Delete one TherapySession
     * const TherapySession = await prisma.therapySession.delete({
     *   where: {
     *     // ... filter to delete one TherapySession
     *   }
     * })
     * 
     */
    delete<T extends TherapySessionDeleteArgs>(args: SelectSubset<T, TherapySessionDeleteArgs<ExtArgs>>): Prisma__TherapySessionClient<$Result.GetResult<Prisma.$TherapySessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TherapySession.
     * @param {TherapySessionUpdateArgs} args - Arguments to update one TherapySession.
     * @example
     * // Update one TherapySession
     * const therapySession = await prisma.therapySession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TherapySessionUpdateArgs>(args: SelectSubset<T, TherapySessionUpdateArgs<ExtArgs>>): Prisma__TherapySessionClient<$Result.GetResult<Prisma.$TherapySessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TherapySessions.
     * @param {TherapySessionDeleteManyArgs} args - Arguments to filter TherapySessions to delete.
     * @example
     * // Delete a few TherapySessions
     * const { count } = await prisma.therapySession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TherapySessionDeleteManyArgs>(args?: SelectSubset<T, TherapySessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TherapySessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TherapySessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TherapySessions
     * const therapySession = await prisma.therapySession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TherapySessionUpdateManyArgs>(args: SelectSubset<T, TherapySessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TherapySession.
     * @param {TherapySessionUpsertArgs} args - Arguments to update or create a TherapySession.
     * @example
     * // Update or create a TherapySession
     * const therapySession = await prisma.therapySession.upsert({
     *   create: {
     *     // ... data to create a TherapySession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TherapySession we want to update
     *   }
     * })
     */
    upsert<T extends TherapySessionUpsertArgs>(args: SelectSubset<T, TherapySessionUpsertArgs<ExtArgs>>): Prisma__TherapySessionClient<$Result.GetResult<Prisma.$TherapySessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TherapySessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TherapySessionCountArgs} args - Arguments to filter TherapySessions to count.
     * @example
     * // Count the number of TherapySessions
     * const count = await prisma.therapySession.count({
     *   where: {
     *     // ... the filter for the TherapySessions we want to count
     *   }
     * })
    **/
    count<T extends TherapySessionCountArgs>(
      args?: Subset<T, TherapySessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TherapySessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TherapySession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TherapySessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TherapySessionAggregateArgs>(args: Subset<T, TherapySessionAggregateArgs>): Prisma.PrismaPromise<GetTherapySessionAggregateType<T>>

    /**
     * Group by TherapySession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TherapySessionGroupByArgs} args - Group by arguments.
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
      T extends TherapySessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TherapySessionGroupByArgs['orderBy'] }
        : { orderBy?: TherapySessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TherapySessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTherapySessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TherapySession model
   */
  readonly fields: TherapySessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TherapySession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TherapySessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the TherapySession model
   */ 
  interface TherapySessionFieldRefs {
    readonly id: FieldRef<"TherapySession", 'String'>
    readonly patientId: FieldRef<"TherapySession", 'String'>
    readonly therapistId: FieldRef<"TherapySession", 'String'>
    readonly sessionType: FieldRef<"TherapySession", 'SessionType'>
    readonly status: FieldRef<"TherapySession", 'SessionStatus'>
    readonly scheduledAt: FieldRef<"TherapySession", 'DateTime'>
    readonly duration: FieldRef<"TherapySession", 'Int'>
    readonly modality: FieldRef<"TherapySession", 'String'>
    readonly notes: FieldRef<"TherapySession", 'String'>
    readonly homework: FieldRef<"TherapySession", 'String'>
    readonly nextSessionDate: FieldRef<"TherapySession", 'DateTime'>
    readonly actualStartTime: FieldRef<"TherapySession", 'DateTime'>
    readonly actualEndTime: FieldRef<"TherapySession", 'DateTime'>
    readonly createdAt: FieldRef<"TherapySession", 'DateTime'>
    readonly updatedAt: FieldRef<"TherapySession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TherapySession findUnique
   */
  export type TherapySessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TherapySession
     */
    select?: TherapySessionSelect<ExtArgs> | null
    /**
     * Filter, which TherapySession to fetch.
     */
    where: TherapySessionWhereUniqueInput
  }

  /**
   * TherapySession findUniqueOrThrow
   */
  export type TherapySessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TherapySession
     */
    select?: TherapySessionSelect<ExtArgs> | null
    /**
     * Filter, which TherapySession to fetch.
     */
    where: TherapySessionWhereUniqueInput
  }

  /**
   * TherapySession findFirst
   */
  export type TherapySessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TherapySession
     */
    select?: TherapySessionSelect<ExtArgs> | null
    /**
     * Filter, which TherapySession to fetch.
     */
    where?: TherapySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TherapySessions to fetch.
     */
    orderBy?: TherapySessionOrderByWithRelationInput | TherapySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TherapySessions.
     */
    cursor?: TherapySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TherapySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TherapySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TherapySessions.
     */
    distinct?: TherapySessionScalarFieldEnum | TherapySessionScalarFieldEnum[]
  }

  /**
   * TherapySession findFirstOrThrow
   */
  export type TherapySessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TherapySession
     */
    select?: TherapySessionSelect<ExtArgs> | null
    /**
     * Filter, which TherapySession to fetch.
     */
    where?: TherapySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TherapySessions to fetch.
     */
    orderBy?: TherapySessionOrderByWithRelationInput | TherapySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TherapySessions.
     */
    cursor?: TherapySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TherapySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TherapySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TherapySessions.
     */
    distinct?: TherapySessionScalarFieldEnum | TherapySessionScalarFieldEnum[]
  }

  /**
   * TherapySession findMany
   */
  export type TherapySessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TherapySession
     */
    select?: TherapySessionSelect<ExtArgs> | null
    /**
     * Filter, which TherapySessions to fetch.
     */
    where?: TherapySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TherapySessions to fetch.
     */
    orderBy?: TherapySessionOrderByWithRelationInput | TherapySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TherapySessions.
     */
    cursor?: TherapySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TherapySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TherapySessions.
     */
    skip?: number
    distinct?: TherapySessionScalarFieldEnum | TherapySessionScalarFieldEnum[]
  }

  /**
   * TherapySession create
   */
  export type TherapySessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TherapySession
     */
    select?: TherapySessionSelect<ExtArgs> | null
    /**
     * The data needed to create a TherapySession.
     */
    data: XOR<TherapySessionCreateInput, TherapySessionUncheckedCreateInput>
  }

  /**
   * TherapySession createMany
   */
  export type TherapySessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TherapySessions.
     */
    data: TherapySessionCreateManyInput | TherapySessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TherapySession createManyAndReturn
   */
  export type TherapySessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TherapySession
     */
    select?: TherapySessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TherapySessions.
     */
    data: TherapySessionCreateManyInput | TherapySessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TherapySession update
   */
  export type TherapySessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TherapySession
     */
    select?: TherapySessionSelect<ExtArgs> | null
    /**
     * The data needed to update a TherapySession.
     */
    data: XOR<TherapySessionUpdateInput, TherapySessionUncheckedUpdateInput>
    /**
     * Choose, which TherapySession to update.
     */
    where: TherapySessionWhereUniqueInput
  }

  /**
   * TherapySession updateMany
   */
  export type TherapySessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TherapySessions.
     */
    data: XOR<TherapySessionUpdateManyMutationInput, TherapySessionUncheckedUpdateManyInput>
    /**
     * Filter which TherapySessions to update
     */
    where?: TherapySessionWhereInput
  }

  /**
   * TherapySession upsert
   */
  export type TherapySessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TherapySession
     */
    select?: TherapySessionSelect<ExtArgs> | null
    /**
     * The filter to search for the TherapySession to update in case it exists.
     */
    where: TherapySessionWhereUniqueInput
    /**
     * In case the TherapySession found by the `where` argument doesn't exist, create a new TherapySession with this data.
     */
    create: XOR<TherapySessionCreateInput, TherapySessionUncheckedCreateInput>
    /**
     * In case the TherapySession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TherapySessionUpdateInput, TherapySessionUncheckedUpdateInput>
  }

  /**
   * TherapySession delete
   */
  export type TherapySessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TherapySession
     */
    select?: TherapySessionSelect<ExtArgs> | null
    /**
     * Filter which TherapySession to delete.
     */
    where: TherapySessionWhereUniqueInput
  }

  /**
   * TherapySession deleteMany
   */
  export type TherapySessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TherapySessions to delete
     */
    where?: TherapySessionWhereInput
  }

  /**
   * TherapySession without action
   */
  export type TherapySessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TherapySession
     */
    select?: TherapySessionSelect<ExtArgs> | null
  }


  /**
   * Model MentalHealthAssessment
   */

  export type AggregateMentalHealthAssessment = {
    _count: MentalHealthAssessmentCountAggregateOutputType | null
    _avg: MentalHealthAssessmentAvgAggregateOutputType | null
    _sum: MentalHealthAssessmentSumAggregateOutputType | null
    _min: MentalHealthAssessmentMinAggregateOutputType | null
    _max: MentalHealthAssessmentMaxAggregateOutputType | null
  }

  export type MentalHealthAssessmentAvgAggregateOutputType = {
    score: number | null
  }

  export type MentalHealthAssessmentSumAggregateOutputType = {
    score: number | null
  }

  export type MentalHealthAssessmentMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    assessedBy: string | null
    assessmentType: $Enums.AssessmentType | null
    score: number | null
    severity: $Enums.SeverityLevel | null
    notes: string | null
    followUpRequired: boolean | null
    followUpDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MentalHealthAssessmentMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    assessedBy: string | null
    assessmentType: $Enums.AssessmentType | null
    score: number | null
    severity: $Enums.SeverityLevel | null
    notes: string | null
    followUpRequired: boolean | null
    followUpDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MentalHealthAssessmentCountAggregateOutputType = {
    id: number
    patientId: number
    assessedBy: number
    assessmentType: number
    score: number
    severity: number
    results: number
    notes: number
    followUpRequired: number
    followUpDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MentalHealthAssessmentAvgAggregateInputType = {
    score?: true
  }

  export type MentalHealthAssessmentSumAggregateInputType = {
    score?: true
  }

  export type MentalHealthAssessmentMinAggregateInputType = {
    id?: true
    patientId?: true
    assessedBy?: true
    assessmentType?: true
    score?: true
    severity?: true
    notes?: true
    followUpRequired?: true
    followUpDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MentalHealthAssessmentMaxAggregateInputType = {
    id?: true
    patientId?: true
    assessedBy?: true
    assessmentType?: true
    score?: true
    severity?: true
    notes?: true
    followUpRequired?: true
    followUpDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MentalHealthAssessmentCountAggregateInputType = {
    id?: true
    patientId?: true
    assessedBy?: true
    assessmentType?: true
    score?: true
    severity?: true
    results?: true
    notes?: true
    followUpRequired?: true
    followUpDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MentalHealthAssessmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MentalHealthAssessment to aggregate.
     */
    where?: MentalHealthAssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MentalHealthAssessments to fetch.
     */
    orderBy?: MentalHealthAssessmentOrderByWithRelationInput | MentalHealthAssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MentalHealthAssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MentalHealthAssessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MentalHealthAssessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MentalHealthAssessments
    **/
    _count?: true | MentalHealthAssessmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MentalHealthAssessmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MentalHealthAssessmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MentalHealthAssessmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MentalHealthAssessmentMaxAggregateInputType
  }

  export type GetMentalHealthAssessmentAggregateType<T extends MentalHealthAssessmentAggregateArgs> = {
        [P in keyof T & keyof AggregateMentalHealthAssessment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMentalHealthAssessment[P]>
      : GetScalarType<T[P], AggregateMentalHealthAssessment[P]>
  }




  export type MentalHealthAssessmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MentalHealthAssessmentWhereInput
    orderBy?: MentalHealthAssessmentOrderByWithAggregationInput | MentalHealthAssessmentOrderByWithAggregationInput[]
    by: MentalHealthAssessmentScalarFieldEnum[] | MentalHealthAssessmentScalarFieldEnum
    having?: MentalHealthAssessmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MentalHealthAssessmentCountAggregateInputType | true
    _avg?: MentalHealthAssessmentAvgAggregateInputType
    _sum?: MentalHealthAssessmentSumAggregateInputType
    _min?: MentalHealthAssessmentMinAggregateInputType
    _max?: MentalHealthAssessmentMaxAggregateInputType
  }

  export type MentalHealthAssessmentGroupByOutputType = {
    id: string
    patientId: string
    assessedBy: string
    assessmentType: $Enums.AssessmentType
    score: number | null
    severity: $Enums.SeverityLevel | null
    results: JsonValue
    notes: string | null
    followUpRequired: boolean
    followUpDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: MentalHealthAssessmentCountAggregateOutputType | null
    _avg: MentalHealthAssessmentAvgAggregateOutputType | null
    _sum: MentalHealthAssessmentSumAggregateOutputType | null
    _min: MentalHealthAssessmentMinAggregateOutputType | null
    _max: MentalHealthAssessmentMaxAggregateOutputType | null
  }

  type GetMentalHealthAssessmentGroupByPayload<T extends MentalHealthAssessmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MentalHealthAssessmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MentalHealthAssessmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MentalHealthAssessmentGroupByOutputType[P]>
            : GetScalarType<T[P], MentalHealthAssessmentGroupByOutputType[P]>
        }
      >
    >


  export type MentalHealthAssessmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    assessedBy?: boolean
    assessmentType?: boolean
    score?: boolean
    severity?: boolean
    results?: boolean
    notes?: boolean
    followUpRequired?: boolean
    followUpDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mentalHealthAssessment"]>

  export type MentalHealthAssessmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    assessedBy?: boolean
    assessmentType?: boolean
    score?: boolean
    severity?: boolean
    results?: boolean
    notes?: boolean
    followUpRequired?: boolean
    followUpDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mentalHealthAssessment"]>

  export type MentalHealthAssessmentSelectScalar = {
    id?: boolean
    patientId?: boolean
    assessedBy?: boolean
    assessmentType?: boolean
    score?: boolean
    severity?: boolean
    results?: boolean
    notes?: boolean
    followUpRequired?: boolean
    followUpDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $MentalHealthAssessmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MentalHealthAssessment"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      assessedBy: string
      assessmentType: $Enums.AssessmentType
      score: number | null
      severity: $Enums.SeverityLevel | null
      results: Prisma.JsonValue
      notes: string | null
      followUpRequired: boolean
      followUpDate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["mentalHealthAssessment"]>
    composites: {}
  }

  type MentalHealthAssessmentGetPayload<S extends boolean | null | undefined | MentalHealthAssessmentDefaultArgs> = $Result.GetResult<Prisma.$MentalHealthAssessmentPayload, S>

  type MentalHealthAssessmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MentalHealthAssessmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MentalHealthAssessmentCountAggregateInputType | true
    }

  export interface MentalHealthAssessmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MentalHealthAssessment'], meta: { name: 'MentalHealthAssessment' } }
    /**
     * Find zero or one MentalHealthAssessment that matches the filter.
     * @param {MentalHealthAssessmentFindUniqueArgs} args - Arguments to find a MentalHealthAssessment
     * @example
     * // Get one MentalHealthAssessment
     * const mentalHealthAssessment = await prisma.mentalHealthAssessment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MentalHealthAssessmentFindUniqueArgs>(args: SelectSubset<T, MentalHealthAssessmentFindUniqueArgs<ExtArgs>>): Prisma__MentalHealthAssessmentClient<$Result.GetResult<Prisma.$MentalHealthAssessmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MentalHealthAssessment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MentalHealthAssessmentFindUniqueOrThrowArgs} args - Arguments to find a MentalHealthAssessment
     * @example
     * // Get one MentalHealthAssessment
     * const mentalHealthAssessment = await prisma.mentalHealthAssessment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MentalHealthAssessmentFindUniqueOrThrowArgs>(args: SelectSubset<T, MentalHealthAssessmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MentalHealthAssessmentClient<$Result.GetResult<Prisma.$MentalHealthAssessmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MentalHealthAssessment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentalHealthAssessmentFindFirstArgs} args - Arguments to find a MentalHealthAssessment
     * @example
     * // Get one MentalHealthAssessment
     * const mentalHealthAssessment = await prisma.mentalHealthAssessment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MentalHealthAssessmentFindFirstArgs>(args?: SelectSubset<T, MentalHealthAssessmentFindFirstArgs<ExtArgs>>): Prisma__MentalHealthAssessmentClient<$Result.GetResult<Prisma.$MentalHealthAssessmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MentalHealthAssessment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentalHealthAssessmentFindFirstOrThrowArgs} args - Arguments to find a MentalHealthAssessment
     * @example
     * // Get one MentalHealthAssessment
     * const mentalHealthAssessment = await prisma.mentalHealthAssessment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MentalHealthAssessmentFindFirstOrThrowArgs>(args?: SelectSubset<T, MentalHealthAssessmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__MentalHealthAssessmentClient<$Result.GetResult<Prisma.$MentalHealthAssessmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MentalHealthAssessments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentalHealthAssessmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MentalHealthAssessments
     * const mentalHealthAssessments = await prisma.mentalHealthAssessment.findMany()
     * 
     * // Get first 10 MentalHealthAssessments
     * const mentalHealthAssessments = await prisma.mentalHealthAssessment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mentalHealthAssessmentWithIdOnly = await prisma.mentalHealthAssessment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MentalHealthAssessmentFindManyArgs>(args?: SelectSubset<T, MentalHealthAssessmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MentalHealthAssessmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MentalHealthAssessment.
     * @param {MentalHealthAssessmentCreateArgs} args - Arguments to create a MentalHealthAssessment.
     * @example
     * // Create one MentalHealthAssessment
     * const MentalHealthAssessment = await prisma.mentalHealthAssessment.create({
     *   data: {
     *     // ... data to create a MentalHealthAssessment
     *   }
     * })
     * 
     */
    create<T extends MentalHealthAssessmentCreateArgs>(args: SelectSubset<T, MentalHealthAssessmentCreateArgs<ExtArgs>>): Prisma__MentalHealthAssessmentClient<$Result.GetResult<Prisma.$MentalHealthAssessmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MentalHealthAssessments.
     * @param {MentalHealthAssessmentCreateManyArgs} args - Arguments to create many MentalHealthAssessments.
     * @example
     * // Create many MentalHealthAssessments
     * const mentalHealthAssessment = await prisma.mentalHealthAssessment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MentalHealthAssessmentCreateManyArgs>(args?: SelectSubset<T, MentalHealthAssessmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MentalHealthAssessments and returns the data saved in the database.
     * @param {MentalHealthAssessmentCreateManyAndReturnArgs} args - Arguments to create many MentalHealthAssessments.
     * @example
     * // Create many MentalHealthAssessments
     * const mentalHealthAssessment = await prisma.mentalHealthAssessment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MentalHealthAssessments and only return the `id`
     * const mentalHealthAssessmentWithIdOnly = await prisma.mentalHealthAssessment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MentalHealthAssessmentCreateManyAndReturnArgs>(args?: SelectSubset<T, MentalHealthAssessmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MentalHealthAssessmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MentalHealthAssessment.
     * @param {MentalHealthAssessmentDeleteArgs} args - Arguments to delete one MentalHealthAssessment.
     * @example
     * // Delete one MentalHealthAssessment
     * const MentalHealthAssessment = await prisma.mentalHealthAssessment.delete({
     *   where: {
     *     // ... filter to delete one MentalHealthAssessment
     *   }
     * })
     * 
     */
    delete<T extends MentalHealthAssessmentDeleteArgs>(args: SelectSubset<T, MentalHealthAssessmentDeleteArgs<ExtArgs>>): Prisma__MentalHealthAssessmentClient<$Result.GetResult<Prisma.$MentalHealthAssessmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MentalHealthAssessment.
     * @param {MentalHealthAssessmentUpdateArgs} args - Arguments to update one MentalHealthAssessment.
     * @example
     * // Update one MentalHealthAssessment
     * const mentalHealthAssessment = await prisma.mentalHealthAssessment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MentalHealthAssessmentUpdateArgs>(args: SelectSubset<T, MentalHealthAssessmentUpdateArgs<ExtArgs>>): Prisma__MentalHealthAssessmentClient<$Result.GetResult<Prisma.$MentalHealthAssessmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MentalHealthAssessments.
     * @param {MentalHealthAssessmentDeleteManyArgs} args - Arguments to filter MentalHealthAssessments to delete.
     * @example
     * // Delete a few MentalHealthAssessments
     * const { count } = await prisma.mentalHealthAssessment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MentalHealthAssessmentDeleteManyArgs>(args?: SelectSubset<T, MentalHealthAssessmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MentalHealthAssessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentalHealthAssessmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MentalHealthAssessments
     * const mentalHealthAssessment = await prisma.mentalHealthAssessment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MentalHealthAssessmentUpdateManyArgs>(args: SelectSubset<T, MentalHealthAssessmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MentalHealthAssessment.
     * @param {MentalHealthAssessmentUpsertArgs} args - Arguments to update or create a MentalHealthAssessment.
     * @example
     * // Update or create a MentalHealthAssessment
     * const mentalHealthAssessment = await prisma.mentalHealthAssessment.upsert({
     *   create: {
     *     // ... data to create a MentalHealthAssessment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MentalHealthAssessment we want to update
     *   }
     * })
     */
    upsert<T extends MentalHealthAssessmentUpsertArgs>(args: SelectSubset<T, MentalHealthAssessmentUpsertArgs<ExtArgs>>): Prisma__MentalHealthAssessmentClient<$Result.GetResult<Prisma.$MentalHealthAssessmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MentalHealthAssessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentalHealthAssessmentCountArgs} args - Arguments to filter MentalHealthAssessments to count.
     * @example
     * // Count the number of MentalHealthAssessments
     * const count = await prisma.mentalHealthAssessment.count({
     *   where: {
     *     // ... the filter for the MentalHealthAssessments we want to count
     *   }
     * })
    **/
    count<T extends MentalHealthAssessmentCountArgs>(
      args?: Subset<T, MentalHealthAssessmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MentalHealthAssessmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MentalHealthAssessment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentalHealthAssessmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MentalHealthAssessmentAggregateArgs>(args: Subset<T, MentalHealthAssessmentAggregateArgs>): Prisma.PrismaPromise<GetMentalHealthAssessmentAggregateType<T>>

    /**
     * Group by MentalHealthAssessment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentalHealthAssessmentGroupByArgs} args - Group by arguments.
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
      T extends MentalHealthAssessmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MentalHealthAssessmentGroupByArgs['orderBy'] }
        : { orderBy?: MentalHealthAssessmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MentalHealthAssessmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMentalHealthAssessmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MentalHealthAssessment model
   */
  readonly fields: MentalHealthAssessmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MentalHealthAssessment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MentalHealthAssessmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the MentalHealthAssessment model
   */ 
  interface MentalHealthAssessmentFieldRefs {
    readonly id: FieldRef<"MentalHealthAssessment", 'String'>
    readonly patientId: FieldRef<"MentalHealthAssessment", 'String'>
    readonly assessedBy: FieldRef<"MentalHealthAssessment", 'String'>
    readonly assessmentType: FieldRef<"MentalHealthAssessment", 'AssessmentType'>
    readonly score: FieldRef<"MentalHealthAssessment", 'Int'>
    readonly severity: FieldRef<"MentalHealthAssessment", 'SeverityLevel'>
    readonly results: FieldRef<"MentalHealthAssessment", 'Json'>
    readonly notes: FieldRef<"MentalHealthAssessment", 'String'>
    readonly followUpRequired: FieldRef<"MentalHealthAssessment", 'Boolean'>
    readonly followUpDate: FieldRef<"MentalHealthAssessment", 'DateTime'>
    readonly createdAt: FieldRef<"MentalHealthAssessment", 'DateTime'>
    readonly updatedAt: FieldRef<"MentalHealthAssessment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MentalHealthAssessment findUnique
   */
  export type MentalHealthAssessmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentalHealthAssessment
     */
    select?: MentalHealthAssessmentSelect<ExtArgs> | null
    /**
     * Filter, which MentalHealthAssessment to fetch.
     */
    where: MentalHealthAssessmentWhereUniqueInput
  }

  /**
   * MentalHealthAssessment findUniqueOrThrow
   */
  export type MentalHealthAssessmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentalHealthAssessment
     */
    select?: MentalHealthAssessmentSelect<ExtArgs> | null
    /**
     * Filter, which MentalHealthAssessment to fetch.
     */
    where: MentalHealthAssessmentWhereUniqueInput
  }

  /**
   * MentalHealthAssessment findFirst
   */
  export type MentalHealthAssessmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentalHealthAssessment
     */
    select?: MentalHealthAssessmentSelect<ExtArgs> | null
    /**
     * Filter, which MentalHealthAssessment to fetch.
     */
    where?: MentalHealthAssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MentalHealthAssessments to fetch.
     */
    orderBy?: MentalHealthAssessmentOrderByWithRelationInput | MentalHealthAssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MentalHealthAssessments.
     */
    cursor?: MentalHealthAssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MentalHealthAssessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MentalHealthAssessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MentalHealthAssessments.
     */
    distinct?: MentalHealthAssessmentScalarFieldEnum | MentalHealthAssessmentScalarFieldEnum[]
  }

  /**
   * MentalHealthAssessment findFirstOrThrow
   */
  export type MentalHealthAssessmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentalHealthAssessment
     */
    select?: MentalHealthAssessmentSelect<ExtArgs> | null
    /**
     * Filter, which MentalHealthAssessment to fetch.
     */
    where?: MentalHealthAssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MentalHealthAssessments to fetch.
     */
    orderBy?: MentalHealthAssessmentOrderByWithRelationInput | MentalHealthAssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MentalHealthAssessments.
     */
    cursor?: MentalHealthAssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MentalHealthAssessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MentalHealthAssessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MentalHealthAssessments.
     */
    distinct?: MentalHealthAssessmentScalarFieldEnum | MentalHealthAssessmentScalarFieldEnum[]
  }

  /**
   * MentalHealthAssessment findMany
   */
  export type MentalHealthAssessmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentalHealthAssessment
     */
    select?: MentalHealthAssessmentSelect<ExtArgs> | null
    /**
     * Filter, which MentalHealthAssessments to fetch.
     */
    where?: MentalHealthAssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MentalHealthAssessments to fetch.
     */
    orderBy?: MentalHealthAssessmentOrderByWithRelationInput | MentalHealthAssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MentalHealthAssessments.
     */
    cursor?: MentalHealthAssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MentalHealthAssessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MentalHealthAssessments.
     */
    skip?: number
    distinct?: MentalHealthAssessmentScalarFieldEnum | MentalHealthAssessmentScalarFieldEnum[]
  }

  /**
   * MentalHealthAssessment create
   */
  export type MentalHealthAssessmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentalHealthAssessment
     */
    select?: MentalHealthAssessmentSelect<ExtArgs> | null
    /**
     * The data needed to create a MentalHealthAssessment.
     */
    data: XOR<MentalHealthAssessmentCreateInput, MentalHealthAssessmentUncheckedCreateInput>
  }

  /**
   * MentalHealthAssessment createMany
   */
  export type MentalHealthAssessmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MentalHealthAssessments.
     */
    data: MentalHealthAssessmentCreateManyInput | MentalHealthAssessmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MentalHealthAssessment createManyAndReturn
   */
  export type MentalHealthAssessmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentalHealthAssessment
     */
    select?: MentalHealthAssessmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MentalHealthAssessments.
     */
    data: MentalHealthAssessmentCreateManyInput | MentalHealthAssessmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MentalHealthAssessment update
   */
  export type MentalHealthAssessmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentalHealthAssessment
     */
    select?: MentalHealthAssessmentSelect<ExtArgs> | null
    /**
     * The data needed to update a MentalHealthAssessment.
     */
    data: XOR<MentalHealthAssessmentUpdateInput, MentalHealthAssessmentUncheckedUpdateInput>
    /**
     * Choose, which MentalHealthAssessment to update.
     */
    where: MentalHealthAssessmentWhereUniqueInput
  }

  /**
   * MentalHealthAssessment updateMany
   */
  export type MentalHealthAssessmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MentalHealthAssessments.
     */
    data: XOR<MentalHealthAssessmentUpdateManyMutationInput, MentalHealthAssessmentUncheckedUpdateManyInput>
    /**
     * Filter which MentalHealthAssessments to update
     */
    where?: MentalHealthAssessmentWhereInput
  }

  /**
   * MentalHealthAssessment upsert
   */
  export type MentalHealthAssessmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentalHealthAssessment
     */
    select?: MentalHealthAssessmentSelect<ExtArgs> | null
    /**
     * The filter to search for the MentalHealthAssessment to update in case it exists.
     */
    where: MentalHealthAssessmentWhereUniqueInput
    /**
     * In case the MentalHealthAssessment found by the `where` argument doesn't exist, create a new MentalHealthAssessment with this data.
     */
    create: XOR<MentalHealthAssessmentCreateInput, MentalHealthAssessmentUncheckedCreateInput>
    /**
     * In case the MentalHealthAssessment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MentalHealthAssessmentUpdateInput, MentalHealthAssessmentUncheckedUpdateInput>
  }

  /**
   * MentalHealthAssessment delete
   */
  export type MentalHealthAssessmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentalHealthAssessment
     */
    select?: MentalHealthAssessmentSelect<ExtArgs> | null
    /**
     * Filter which MentalHealthAssessment to delete.
     */
    where: MentalHealthAssessmentWhereUniqueInput
  }

  /**
   * MentalHealthAssessment deleteMany
   */
  export type MentalHealthAssessmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MentalHealthAssessments to delete
     */
    where?: MentalHealthAssessmentWhereInput
  }

  /**
   * MentalHealthAssessment without action
   */
  export type MentalHealthAssessmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentalHealthAssessment
     */
    select?: MentalHealthAssessmentSelect<ExtArgs> | null
  }


  /**
   * Model CrisisIntervention
   */

  export type AggregateCrisisIntervention = {
    _count: CrisisInterventionCountAggregateOutputType | null
    _min: CrisisInterventionMinAggregateOutputType | null
    _max: CrisisInterventionMaxAggregateOutputType | null
  }

  export type CrisisInterventionMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    responderId: string | null
    crisisType: $Enums.CrisisType | null
    severity: $Enums.CrisisSeverity | null
    status: $Enums.CrisisStatus | null
    description: string | null
    outcome: string | null
    referredTo: string | null
    contactedAt: Date | null
    resolvedAt: Date | null
    followUpNeeded: boolean | null
    followUpDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CrisisInterventionMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    responderId: string | null
    crisisType: $Enums.CrisisType | null
    severity: $Enums.CrisisSeverity | null
    status: $Enums.CrisisStatus | null
    description: string | null
    outcome: string | null
    referredTo: string | null
    contactedAt: Date | null
    resolvedAt: Date | null
    followUpNeeded: boolean | null
    followUpDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CrisisInterventionCountAggregateOutputType = {
    id: number
    patientId: number
    responderId: number
    crisisType: number
    severity: number
    status: number
    description: number
    interventions: number
    outcome: number
    referredTo: number
    contactedAt: number
    resolvedAt: number
    followUpNeeded: number
    followUpDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CrisisInterventionMinAggregateInputType = {
    id?: true
    patientId?: true
    responderId?: true
    crisisType?: true
    severity?: true
    status?: true
    description?: true
    outcome?: true
    referredTo?: true
    contactedAt?: true
    resolvedAt?: true
    followUpNeeded?: true
    followUpDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CrisisInterventionMaxAggregateInputType = {
    id?: true
    patientId?: true
    responderId?: true
    crisisType?: true
    severity?: true
    status?: true
    description?: true
    outcome?: true
    referredTo?: true
    contactedAt?: true
    resolvedAt?: true
    followUpNeeded?: true
    followUpDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CrisisInterventionCountAggregateInputType = {
    id?: true
    patientId?: true
    responderId?: true
    crisisType?: true
    severity?: true
    status?: true
    description?: true
    interventions?: true
    outcome?: true
    referredTo?: true
    contactedAt?: true
    resolvedAt?: true
    followUpNeeded?: true
    followUpDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CrisisInterventionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrisisIntervention to aggregate.
     */
    where?: CrisisInterventionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrisisInterventions to fetch.
     */
    orderBy?: CrisisInterventionOrderByWithRelationInput | CrisisInterventionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CrisisInterventionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrisisInterventions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrisisInterventions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CrisisInterventions
    **/
    _count?: true | CrisisInterventionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CrisisInterventionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CrisisInterventionMaxAggregateInputType
  }

  export type GetCrisisInterventionAggregateType<T extends CrisisInterventionAggregateArgs> = {
        [P in keyof T & keyof AggregateCrisisIntervention]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCrisisIntervention[P]>
      : GetScalarType<T[P], AggregateCrisisIntervention[P]>
  }




  export type CrisisInterventionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CrisisInterventionWhereInput
    orderBy?: CrisisInterventionOrderByWithAggregationInput | CrisisInterventionOrderByWithAggregationInput[]
    by: CrisisInterventionScalarFieldEnum[] | CrisisInterventionScalarFieldEnum
    having?: CrisisInterventionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CrisisInterventionCountAggregateInputType | true
    _min?: CrisisInterventionMinAggregateInputType
    _max?: CrisisInterventionMaxAggregateInputType
  }

  export type CrisisInterventionGroupByOutputType = {
    id: string
    patientId: string
    responderId: string | null
    crisisType: $Enums.CrisisType
    severity: $Enums.CrisisSeverity
    status: $Enums.CrisisStatus
    description: string
    interventions: string[]
    outcome: string | null
    referredTo: string | null
    contactedAt: Date
    resolvedAt: Date | null
    followUpNeeded: boolean
    followUpDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: CrisisInterventionCountAggregateOutputType | null
    _min: CrisisInterventionMinAggregateOutputType | null
    _max: CrisisInterventionMaxAggregateOutputType | null
  }

  type GetCrisisInterventionGroupByPayload<T extends CrisisInterventionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CrisisInterventionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CrisisInterventionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CrisisInterventionGroupByOutputType[P]>
            : GetScalarType<T[P], CrisisInterventionGroupByOutputType[P]>
        }
      >
    >


  export type CrisisInterventionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    responderId?: boolean
    crisisType?: boolean
    severity?: boolean
    status?: boolean
    description?: boolean
    interventions?: boolean
    outcome?: boolean
    referredTo?: boolean
    contactedAt?: boolean
    resolvedAt?: boolean
    followUpNeeded?: boolean
    followUpDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["crisisIntervention"]>

  export type CrisisInterventionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    responderId?: boolean
    crisisType?: boolean
    severity?: boolean
    status?: boolean
    description?: boolean
    interventions?: boolean
    outcome?: boolean
    referredTo?: boolean
    contactedAt?: boolean
    resolvedAt?: boolean
    followUpNeeded?: boolean
    followUpDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["crisisIntervention"]>

  export type CrisisInterventionSelectScalar = {
    id?: boolean
    patientId?: boolean
    responderId?: boolean
    crisisType?: boolean
    severity?: boolean
    status?: boolean
    description?: boolean
    interventions?: boolean
    outcome?: boolean
    referredTo?: boolean
    contactedAt?: boolean
    resolvedAt?: boolean
    followUpNeeded?: boolean
    followUpDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $CrisisInterventionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CrisisIntervention"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      responderId: string | null
      crisisType: $Enums.CrisisType
      severity: $Enums.CrisisSeverity
      status: $Enums.CrisisStatus
      description: string
      interventions: string[]
      outcome: string | null
      referredTo: string | null
      contactedAt: Date
      resolvedAt: Date | null
      followUpNeeded: boolean
      followUpDate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["crisisIntervention"]>
    composites: {}
  }

  type CrisisInterventionGetPayload<S extends boolean | null | undefined | CrisisInterventionDefaultArgs> = $Result.GetResult<Prisma.$CrisisInterventionPayload, S>

  type CrisisInterventionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CrisisInterventionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CrisisInterventionCountAggregateInputType | true
    }

  export interface CrisisInterventionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CrisisIntervention'], meta: { name: 'CrisisIntervention' } }
    /**
     * Find zero or one CrisisIntervention that matches the filter.
     * @param {CrisisInterventionFindUniqueArgs} args - Arguments to find a CrisisIntervention
     * @example
     * // Get one CrisisIntervention
     * const crisisIntervention = await prisma.crisisIntervention.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CrisisInterventionFindUniqueArgs>(args: SelectSubset<T, CrisisInterventionFindUniqueArgs<ExtArgs>>): Prisma__CrisisInterventionClient<$Result.GetResult<Prisma.$CrisisInterventionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CrisisIntervention that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CrisisInterventionFindUniqueOrThrowArgs} args - Arguments to find a CrisisIntervention
     * @example
     * // Get one CrisisIntervention
     * const crisisIntervention = await prisma.crisisIntervention.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CrisisInterventionFindUniqueOrThrowArgs>(args: SelectSubset<T, CrisisInterventionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CrisisInterventionClient<$Result.GetResult<Prisma.$CrisisInterventionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CrisisIntervention that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisInterventionFindFirstArgs} args - Arguments to find a CrisisIntervention
     * @example
     * // Get one CrisisIntervention
     * const crisisIntervention = await prisma.crisisIntervention.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CrisisInterventionFindFirstArgs>(args?: SelectSubset<T, CrisisInterventionFindFirstArgs<ExtArgs>>): Prisma__CrisisInterventionClient<$Result.GetResult<Prisma.$CrisisInterventionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CrisisIntervention that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisInterventionFindFirstOrThrowArgs} args - Arguments to find a CrisisIntervention
     * @example
     * // Get one CrisisIntervention
     * const crisisIntervention = await prisma.crisisIntervention.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CrisisInterventionFindFirstOrThrowArgs>(args?: SelectSubset<T, CrisisInterventionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CrisisInterventionClient<$Result.GetResult<Prisma.$CrisisInterventionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CrisisInterventions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisInterventionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CrisisInterventions
     * const crisisInterventions = await prisma.crisisIntervention.findMany()
     * 
     * // Get first 10 CrisisInterventions
     * const crisisInterventions = await prisma.crisisIntervention.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const crisisInterventionWithIdOnly = await prisma.crisisIntervention.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CrisisInterventionFindManyArgs>(args?: SelectSubset<T, CrisisInterventionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrisisInterventionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CrisisIntervention.
     * @param {CrisisInterventionCreateArgs} args - Arguments to create a CrisisIntervention.
     * @example
     * // Create one CrisisIntervention
     * const CrisisIntervention = await prisma.crisisIntervention.create({
     *   data: {
     *     // ... data to create a CrisisIntervention
     *   }
     * })
     * 
     */
    create<T extends CrisisInterventionCreateArgs>(args: SelectSubset<T, CrisisInterventionCreateArgs<ExtArgs>>): Prisma__CrisisInterventionClient<$Result.GetResult<Prisma.$CrisisInterventionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CrisisInterventions.
     * @param {CrisisInterventionCreateManyArgs} args - Arguments to create many CrisisInterventions.
     * @example
     * // Create many CrisisInterventions
     * const crisisIntervention = await prisma.crisisIntervention.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CrisisInterventionCreateManyArgs>(args?: SelectSubset<T, CrisisInterventionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CrisisInterventions and returns the data saved in the database.
     * @param {CrisisInterventionCreateManyAndReturnArgs} args - Arguments to create many CrisisInterventions.
     * @example
     * // Create many CrisisInterventions
     * const crisisIntervention = await prisma.crisisIntervention.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CrisisInterventions and only return the `id`
     * const crisisInterventionWithIdOnly = await prisma.crisisIntervention.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CrisisInterventionCreateManyAndReturnArgs>(args?: SelectSubset<T, CrisisInterventionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrisisInterventionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CrisisIntervention.
     * @param {CrisisInterventionDeleteArgs} args - Arguments to delete one CrisisIntervention.
     * @example
     * // Delete one CrisisIntervention
     * const CrisisIntervention = await prisma.crisisIntervention.delete({
     *   where: {
     *     // ... filter to delete one CrisisIntervention
     *   }
     * })
     * 
     */
    delete<T extends CrisisInterventionDeleteArgs>(args: SelectSubset<T, CrisisInterventionDeleteArgs<ExtArgs>>): Prisma__CrisisInterventionClient<$Result.GetResult<Prisma.$CrisisInterventionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CrisisIntervention.
     * @param {CrisisInterventionUpdateArgs} args - Arguments to update one CrisisIntervention.
     * @example
     * // Update one CrisisIntervention
     * const crisisIntervention = await prisma.crisisIntervention.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CrisisInterventionUpdateArgs>(args: SelectSubset<T, CrisisInterventionUpdateArgs<ExtArgs>>): Prisma__CrisisInterventionClient<$Result.GetResult<Prisma.$CrisisInterventionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CrisisInterventions.
     * @param {CrisisInterventionDeleteManyArgs} args - Arguments to filter CrisisInterventions to delete.
     * @example
     * // Delete a few CrisisInterventions
     * const { count } = await prisma.crisisIntervention.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CrisisInterventionDeleteManyArgs>(args?: SelectSubset<T, CrisisInterventionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CrisisInterventions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisInterventionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CrisisInterventions
     * const crisisIntervention = await prisma.crisisIntervention.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CrisisInterventionUpdateManyArgs>(args: SelectSubset<T, CrisisInterventionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CrisisIntervention.
     * @param {CrisisInterventionUpsertArgs} args - Arguments to update or create a CrisisIntervention.
     * @example
     * // Update or create a CrisisIntervention
     * const crisisIntervention = await prisma.crisisIntervention.upsert({
     *   create: {
     *     // ... data to create a CrisisIntervention
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CrisisIntervention we want to update
     *   }
     * })
     */
    upsert<T extends CrisisInterventionUpsertArgs>(args: SelectSubset<T, CrisisInterventionUpsertArgs<ExtArgs>>): Prisma__CrisisInterventionClient<$Result.GetResult<Prisma.$CrisisInterventionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CrisisInterventions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisInterventionCountArgs} args - Arguments to filter CrisisInterventions to count.
     * @example
     * // Count the number of CrisisInterventions
     * const count = await prisma.crisisIntervention.count({
     *   where: {
     *     // ... the filter for the CrisisInterventions we want to count
     *   }
     * })
    **/
    count<T extends CrisisInterventionCountArgs>(
      args?: Subset<T, CrisisInterventionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CrisisInterventionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CrisisIntervention.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisInterventionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CrisisInterventionAggregateArgs>(args: Subset<T, CrisisInterventionAggregateArgs>): Prisma.PrismaPromise<GetCrisisInterventionAggregateType<T>>

    /**
     * Group by CrisisIntervention.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisInterventionGroupByArgs} args - Group by arguments.
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
      T extends CrisisInterventionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CrisisInterventionGroupByArgs['orderBy'] }
        : { orderBy?: CrisisInterventionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CrisisInterventionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCrisisInterventionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CrisisIntervention model
   */
  readonly fields: CrisisInterventionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CrisisIntervention.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CrisisInterventionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CrisisIntervention model
   */ 
  interface CrisisInterventionFieldRefs {
    readonly id: FieldRef<"CrisisIntervention", 'String'>
    readonly patientId: FieldRef<"CrisisIntervention", 'String'>
    readonly responderId: FieldRef<"CrisisIntervention", 'String'>
    readonly crisisType: FieldRef<"CrisisIntervention", 'CrisisType'>
    readonly severity: FieldRef<"CrisisIntervention", 'CrisisSeverity'>
    readonly status: FieldRef<"CrisisIntervention", 'CrisisStatus'>
    readonly description: FieldRef<"CrisisIntervention", 'String'>
    readonly interventions: FieldRef<"CrisisIntervention", 'String[]'>
    readonly outcome: FieldRef<"CrisisIntervention", 'String'>
    readonly referredTo: FieldRef<"CrisisIntervention", 'String'>
    readonly contactedAt: FieldRef<"CrisisIntervention", 'DateTime'>
    readonly resolvedAt: FieldRef<"CrisisIntervention", 'DateTime'>
    readonly followUpNeeded: FieldRef<"CrisisIntervention", 'Boolean'>
    readonly followUpDate: FieldRef<"CrisisIntervention", 'DateTime'>
    readonly createdAt: FieldRef<"CrisisIntervention", 'DateTime'>
    readonly updatedAt: FieldRef<"CrisisIntervention", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CrisisIntervention findUnique
   */
  export type CrisisInterventionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisIntervention
     */
    select?: CrisisInterventionSelect<ExtArgs> | null
    /**
     * Filter, which CrisisIntervention to fetch.
     */
    where: CrisisInterventionWhereUniqueInput
  }

  /**
   * CrisisIntervention findUniqueOrThrow
   */
  export type CrisisInterventionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisIntervention
     */
    select?: CrisisInterventionSelect<ExtArgs> | null
    /**
     * Filter, which CrisisIntervention to fetch.
     */
    where: CrisisInterventionWhereUniqueInput
  }

  /**
   * CrisisIntervention findFirst
   */
  export type CrisisInterventionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisIntervention
     */
    select?: CrisisInterventionSelect<ExtArgs> | null
    /**
     * Filter, which CrisisIntervention to fetch.
     */
    where?: CrisisInterventionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrisisInterventions to fetch.
     */
    orderBy?: CrisisInterventionOrderByWithRelationInput | CrisisInterventionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrisisInterventions.
     */
    cursor?: CrisisInterventionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrisisInterventions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrisisInterventions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrisisInterventions.
     */
    distinct?: CrisisInterventionScalarFieldEnum | CrisisInterventionScalarFieldEnum[]
  }

  /**
   * CrisisIntervention findFirstOrThrow
   */
  export type CrisisInterventionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisIntervention
     */
    select?: CrisisInterventionSelect<ExtArgs> | null
    /**
     * Filter, which CrisisIntervention to fetch.
     */
    where?: CrisisInterventionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrisisInterventions to fetch.
     */
    orderBy?: CrisisInterventionOrderByWithRelationInput | CrisisInterventionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrisisInterventions.
     */
    cursor?: CrisisInterventionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrisisInterventions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrisisInterventions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrisisInterventions.
     */
    distinct?: CrisisInterventionScalarFieldEnum | CrisisInterventionScalarFieldEnum[]
  }

  /**
   * CrisisIntervention findMany
   */
  export type CrisisInterventionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisIntervention
     */
    select?: CrisisInterventionSelect<ExtArgs> | null
    /**
     * Filter, which CrisisInterventions to fetch.
     */
    where?: CrisisInterventionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrisisInterventions to fetch.
     */
    orderBy?: CrisisInterventionOrderByWithRelationInput | CrisisInterventionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CrisisInterventions.
     */
    cursor?: CrisisInterventionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrisisInterventions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrisisInterventions.
     */
    skip?: number
    distinct?: CrisisInterventionScalarFieldEnum | CrisisInterventionScalarFieldEnum[]
  }

  /**
   * CrisisIntervention create
   */
  export type CrisisInterventionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisIntervention
     */
    select?: CrisisInterventionSelect<ExtArgs> | null
    /**
     * The data needed to create a CrisisIntervention.
     */
    data: XOR<CrisisInterventionCreateInput, CrisisInterventionUncheckedCreateInput>
  }

  /**
   * CrisisIntervention createMany
   */
  export type CrisisInterventionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CrisisInterventions.
     */
    data: CrisisInterventionCreateManyInput | CrisisInterventionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CrisisIntervention createManyAndReturn
   */
  export type CrisisInterventionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisIntervention
     */
    select?: CrisisInterventionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CrisisInterventions.
     */
    data: CrisisInterventionCreateManyInput | CrisisInterventionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CrisisIntervention update
   */
  export type CrisisInterventionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisIntervention
     */
    select?: CrisisInterventionSelect<ExtArgs> | null
    /**
     * The data needed to update a CrisisIntervention.
     */
    data: XOR<CrisisInterventionUpdateInput, CrisisInterventionUncheckedUpdateInput>
    /**
     * Choose, which CrisisIntervention to update.
     */
    where: CrisisInterventionWhereUniqueInput
  }

  /**
   * CrisisIntervention updateMany
   */
  export type CrisisInterventionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CrisisInterventions.
     */
    data: XOR<CrisisInterventionUpdateManyMutationInput, CrisisInterventionUncheckedUpdateManyInput>
    /**
     * Filter which CrisisInterventions to update
     */
    where?: CrisisInterventionWhereInput
  }

  /**
   * CrisisIntervention upsert
   */
  export type CrisisInterventionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisIntervention
     */
    select?: CrisisInterventionSelect<ExtArgs> | null
    /**
     * The filter to search for the CrisisIntervention to update in case it exists.
     */
    where: CrisisInterventionWhereUniqueInput
    /**
     * In case the CrisisIntervention found by the `where` argument doesn't exist, create a new CrisisIntervention with this data.
     */
    create: XOR<CrisisInterventionCreateInput, CrisisInterventionUncheckedCreateInput>
    /**
     * In case the CrisisIntervention was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CrisisInterventionUpdateInput, CrisisInterventionUncheckedUpdateInput>
  }

  /**
   * CrisisIntervention delete
   */
  export type CrisisInterventionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisIntervention
     */
    select?: CrisisInterventionSelect<ExtArgs> | null
    /**
     * Filter which CrisisIntervention to delete.
     */
    where: CrisisInterventionWhereUniqueInput
  }

  /**
   * CrisisIntervention deleteMany
   */
  export type CrisisInterventionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrisisInterventions to delete
     */
    where?: CrisisInterventionWhereInput
  }

  /**
   * CrisisIntervention without action
   */
  export type CrisisInterventionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisIntervention
     */
    select?: CrisisInterventionSelect<ExtArgs> | null
  }


  /**
   * Model TreatmentPlan
   */

  export type AggregateTreatmentPlan = {
    _count: TreatmentPlanCountAggregateOutputType | null
    _min: TreatmentPlanMinAggregateOutputType | null
    _max: TreatmentPlanMaxAggregateOutputType | null
  }

  export type TreatmentPlanMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    frequency: string | null
    startDate: Date | null
    reviewDate: Date | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TreatmentPlanMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    frequency: string | null
    startDate: Date | null
    reviewDate: Date | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TreatmentPlanCountAggregateOutputType = {
    id: number
    patientId: number
    providerId: number
    diagnosis: number
    goals: number
    interventions: number
    medications: number
    frequency: number
    startDate: number
    reviewDate: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TreatmentPlanMinAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    frequency?: true
    startDate?: true
    reviewDate?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TreatmentPlanMaxAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    frequency?: true
    startDate?: true
    reviewDate?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TreatmentPlanCountAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    diagnosis?: true
    goals?: true
    interventions?: true
    medications?: true
    frequency?: true
    startDate?: true
    reviewDate?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TreatmentPlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TreatmentPlan to aggregate.
     */
    where?: TreatmentPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TreatmentPlans to fetch.
     */
    orderBy?: TreatmentPlanOrderByWithRelationInput | TreatmentPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TreatmentPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TreatmentPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TreatmentPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TreatmentPlans
    **/
    _count?: true | TreatmentPlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TreatmentPlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TreatmentPlanMaxAggregateInputType
  }

  export type GetTreatmentPlanAggregateType<T extends TreatmentPlanAggregateArgs> = {
        [P in keyof T & keyof AggregateTreatmentPlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTreatmentPlan[P]>
      : GetScalarType<T[P], AggregateTreatmentPlan[P]>
  }




  export type TreatmentPlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TreatmentPlanWhereInput
    orderBy?: TreatmentPlanOrderByWithAggregationInput | TreatmentPlanOrderByWithAggregationInput[]
    by: TreatmentPlanScalarFieldEnum[] | TreatmentPlanScalarFieldEnum
    having?: TreatmentPlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TreatmentPlanCountAggregateInputType | true
    _min?: TreatmentPlanMinAggregateInputType
    _max?: TreatmentPlanMaxAggregateInputType
  }

  export type TreatmentPlanGroupByOutputType = {
    id: string
    patientId: string
    providerId: string
    diagnosis: string[]
    goals: JsonValue
    interventions: JsonValue
    medications: JsonValue | null
    frequency: string | null
    startDate: Date
    reviewDate: Date
    status: string
    createdAt: Date
    updatedAt: Date
    _count: TreatmentPlanCountAggregateOutputType | null
    _min: TreatmentPlanMinAggregateOutputType | null
    _max: TreatmentPlanMaxAggregateOutputType | null
  }

  type GetTreatmentPlanGroupByPayload<T extends TreatmentPlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TreatmentPlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TreatmentPlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TreatmentPlanGroupByOutputType[P]>
            : GetScalarType<T[P], TreatmentPlanGroupByOutputType[P]>
        }
      >
    >


  export type TreatmentPlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    diagnosis?: boolean
    goals?: boolean
    interventions?: boolean
    medications?: boolean
    frequency?: boolean
    startDate?: boolean
    reviewDate?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["treatmentPlan"]>

  export type TreatmentPlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    diagnosis?: boolean
    goals?: boolean
    interventions?: boolean
    medications?: boolean
    frequency?: boolean
    startDate?: boolean
    reviewDate?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["treatmentPlan"]>

  export type TreatmentPlanSelectScalar = {
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    diagnosis?: boolean
    goals?: boolean
    interventions?: boolean
    medications?: boolean
    frequency?: boolean
    startDate?: boolean
    reviewDate?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $TreatmentPlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TreatmentPlan"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      providerId: string
      diagnosis: string[]
      goals: Prisma.JsonValue
      interventions: Prisma.JsonValue
      medications: Prisma.JsonValue | null
      frequency: string | null
      startDate: Date
      reviewDate: Date
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["treatmentPlan"]>
    composites: {}
  }

  type TreatmentPlanGetPayload<S extends boolean | null | undefined | TreatmentPlanDefaultArgs> = $Result.GetResult<Prisma.$TreatmentPlanPayload, S>

  type TreatmentPlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TreatmentPlanFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TreatmentPlanCountAggregateInputType | true
    }

  export interface TreatmentPlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TreatmentPlan'], meta: { name: 'TreatmentPlan' } }
    /**
     * Find zero or one TreatmentPlan that matches the filter.
     * @param {TreatmentPlanFindUniqueArgs} args - Arguments to find a TreatmentPlan
     * @example
     * // Get one TreatmentPlan
     * const treatmentPlan = await prisma.treatmentPlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TreatmentPlanFindUniqueArgs>(args: SelectSubset<T, TreatmentPlanFindUniqueArgs<ExtArgs>>): Prisma__TreatmentPlanClient<$Result.GetResult<Prisma.$TreatmentPlanPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TreatmentPlan that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TreatmentPlanFindUniqueOrThrowArgs} args - Arguments to find a TreatmentPlan
     * @example
     * // Get one TreatmentPlan
     * const treatmentPlan = await prisma.treatmentPlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TreatmentPlanFindUniqueOrThrowArgs>(args: SelectSubset<T, TreatmentPlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TreatmentPlanClient<$Result.GetResult<Prisma.$TreatmentPlanPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TreatmentPlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentPlanFindFirstArgs} args - Arguments to find a TreatmentPlan
     * @example
     * // Get one TreatmentPlan
     * const treatmentPlan = await prisma.treatmentPlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TreatmentPlanFindFirstArgs>(args?: SelectSubset<T, TreatmentPlanFindFirstArgs<ExtArgs>>): Prisma__TreatmentPlanClient<$Result.GetResult<Prisma.$TreatmentPlanPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TreatmentPlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentPlanFindFirstOrThrowArgs} args - Arguments to find a TreatmentPlan
     * @example
     * // Get one TreatmentPlan
     * const treatmentPlan = await prisma.treatmentPlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TreatmentPlanFindFirstOrThrowArgs>(args?: SelectSubset<T, TreatmentPlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__TreatmentPlanClient<$Result.GetResult<Prisma.$TreatmentPlanPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TreatmentPlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentPlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TreatmentPlans
     * const treatmentPlans = await prisma.treatmentPlan.findMany()
     * 
     * // Get first 10 TreatmentPlans
     * const treatmentPlans = await prisma.treatmentPlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const treatmentPlanWithIdOnly = await prisma.treatmentPlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TreatmentPlanFindManyArgs>(args?: SelectSubset<T, TreatmentPlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TreatmentPlanPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TreatmentPlan.
     * @param {TreatmentPlanCreateArgs} args - Arguments to create a TreatmentPlan.
     * @example
     * // Create one TreatmentPlan
     * const TreatmentPlan = await prisma.treatmentPlan.create({
     *   data: {
     *     // ... data to create a TreatmentPlan
     *   }
     * })
     * 
     */
    create<T extends TreatmentPlanCreateArgs>(args: SelectSubset<T, TreatmentPlanCreateArgs<ExtArgs>>): Prisma__TreatmentPlanClient<$Result.GetResult<Prisma.$TreatmentPlanPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TreatmentPlans.
     * @param {TreatmentPlanCreateManyArgs} args - Arguments to create many TreatmentPlans.
     * @example
     * // Create many TreatmentPlans
     * const treatmentPlan = await prisma.treatmentPlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TreatmentPlanCreateManyArgs>(args?: SelectSubset<T, TreatmentPlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TreatmentPlans and returns the data saved in the database.
     * @param {TreatmentPlanCreateManyAndReturnArgs} args - Arguments to create many TreatmentPlans.
     * @example
     * // Create many TreatmentPlans
     * const treatmentPlan = await prisma.treatmentPlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TreatmentPlans and only return the `id`
     * const treatmentPlanWithIdOnly = await prisma.treatmentPlan.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TreatmentPlanCreateManyAndReturnArgs>(args?: SelectSubset<T, TreatmentPlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TreatmentPlanPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TreatmentPlan.
     * @param {TreatmentPlanDeleteArgs} args - Arguments to delete one TreatmentPlan.
     * @example
     * // Delete one TreatmentPlan
     * const TreatmentPlan = await prisma.treatmentPlan.delete({
     *   where: {
     *     // ... filter to delete one TreatmentPlan
     *   }
     * })
     * 
     */
    delete<T extends TreatmentPlanDeleteArgs>(args: SelectSubset<T, TreatmentPlanDeleteArgs<ExtArgs>>): Prisma__TreatmentPlanClient<$Result.GetResult<Prisma.$TreatmentPlanPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TreatmentPlan.
     * @param {TreatmentPlanUpdateArgs} args - Arguments to update one TreatmentPlan.
     * @example
     * // Update one TreatmentPlan
     * const treatmentPlan = await prisma.treatmentPlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TreatmentPlanUpdateArgs>(args: SelectSubset<T, TreatmentPlanUpdateArgs<ExtArgs>>): Prisma__TreatmentPlanClient<$Result.GetResult<Prisma.$TreatmentPlanPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TreatmentPlans.
     * @param {TreatmentPlanDeleteManyArgs} args - Arguments to filter TreatmentPlans to delete.
     * @example
     * // Delete a few TreatmentPlans
     * const { count } = await prisma.treatmentPlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TreatmentPlanDeleteManyArgs>(args?: SelectSubset<T, TreatmentPlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TreatmentPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentPlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TreatmentPlans
     * const treatmentPlan = await prisma.treatmentPlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TreatmentPlanUpdateManyArgs>(args: SelectSubset<T, TreatmentPlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TreatmentPlan.
     * @param {TreatmentPlanUpsertArgs} args - Arguments to update or create a TreatmentPlan.
     * @example
     * // Update or create a TreatmentPlan
     * const treatmentPlan = await prisma.treatmentPlan.upsert({
     *   create: {
     *     // ... data to create a TreatmentPlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TreatmentPlan we want to update
     *   }
     * })
     */
    upsert<T extends TreatmentPlanUpsertArgs>(args: SelectSubset<T, TreatmentPlanUpsertArgs<ExtArgs>>): Prisma__TreatmentPlanClient<$Result.GetResult<Prisma.$TreatmentPlanPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TreatmentPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentPlanCountArgs} args - Arguments to filter TreatmentPlans to count.
     * @example
     * // Count the number of TreatmentPlans
     * const count = await prisma.treatmentPlan.count({
     *   where: {
     *     // ... the filter for the TreatmentPlans we want to count
     *   }
     * })
    **/
    count<T extends TreatmentPlanCountArgs>(
      args?: Subset<T, TreatmentPlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TreatmentPlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TreatmentPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentPlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TreatmentPlanAggregateArgs>(args: Subset<T, TreatmentPlanAggregateArgs>): Prisma.PrismaPromise<GetTreatmentPlanAggregateType<T>>

    /**
     * Group by TreatmentPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentPlanGroupByArgs} args - Group by arguments.
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
      T extends TreatmentPlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TreatmentPlanGroupByArgs['orderBy'] }
        : { orderBy?: TreatmentPlanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TreatmentPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTreatmentPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TreatmentPlan model
   */
  readonly fields: TreatmentPlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TreatmentPlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TreatmentPlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the TreatmentPlan model
   */ 
  interface TreatmentPlanFieldRefs {
    readonly id: FieldRef<"TreatmentPlan", 'String'>
    readonly patientId: FieldRef<"TreatmentPlan", 'String'>
    readonly providerId: FieldRef<"TreatmentPlan", 'String'>
    readonly diagnosis: FieldRef<"TreatmentPlan", 'String[]'>
    readonly goals: FieldRef<"TreatmentPlan", 'Json'>
    readonly interventions: FieldRef<"TreatmentPlan", 'Json'>
    readonly medications: FieldRef<"TreatmentPlan", 'Json'>
    readonly frequency: FieldRef<"TreatmentPlan", 'String'>
    readonly startDate: FieldRef<"TreatmentPlan", 'DateTime'>
    readonly reviewDate: FieldRef<"TreatmentPlan", 'DateTime'>
    readonly status: FieldRef<"TreatmentPlan", 'String'>
    readonly createdAt: FieldRef<"TreatmentPlan", 'DateTime'>
    readonly updatedAt: FieldRef<"TreatmentPlan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TreatmentPlan findUnique
   */
  export type TreatmentPlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentPlan
     */
    select?: TreatmentPlanSelect<ExtArgs> | null
    /**
     * Filter, which TreatmentPlan to fetch.
     */
    where: TreatmentPlanWhereUniqueInput
  }

  /**
   * TreatmentPlan findUniqueOrThrow
   */
  export type TreatmentPlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentPlan
     */
    select?: TreatmentPlanSelect<ExtArgs> | null
    /**
     * Filter, which TreatmentPlan to fetch.
     */
    where: TreatmentPlanWhereUniqueInput
  }

  /**
   * TreatmentPlan findFirst
   */
  export type TreatmentPlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentPlan
     */
    select?: TreatmentPlanSelect<ExtArgs> | null
    /**
     * Filter, which TreatmentPlan to fetch.
     */
    where?: TreatmentPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TreatmentPlans to fetch.
     */
    orderBy?: TreatmentPlanOrderByWithRelationInput | TreatmentPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TreatmentPlans.
     */
    cursor?: TreatmentPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TreatmentPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TreatmentPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TreatmentPlans.
     */
    distinct?: TreatmentPlanScalarFieldEnum | TreatmentPlanScalarFieldEnum[]
  }

  /**
   * TreatmentPlan findFirstOrThrow
   */
  export type TreatmentPlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentPlan
     */
    select?: TreatmentPlanSelect<ExtArgs> | null
    /**
     * Filter, which TreatmentPlan to fetch.
     */
    where?: TreatmentPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TreatmentPlans to fetch.
     */
    orderBy?: TreatmentPlanOrderByWithRelationInput | TreatmentPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TreatmentPlans.
     */
    cursor?: TreatmentPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TreatmentPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TreatmentPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TreatmentPlans.
     */
    distinct?: TreatmentPlanScalarFieldEnum | TreatmentPlanScalarFieldEnum[]
  }

  /**
   * TreatmentPlan findMany
   */
  export type TreatmentPlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentPlan
     */
    select?: TreatmentPlanSelect<ExtArgs> | null
    /**
     * Filter, which TreatmentPlans to fetch.
     */
    where?: TreatmentPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TreatmentPlans to fetch.
     */
    orderBy?: TreatmentPlanOrderByWithRelationInput | TreatmentPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TreatmentPlans.
     */
    cursor?: TreatmentPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TreatmentPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TreatmentPlans.
     */
    skip?: number
    distinct?: TreatmentPlanScalarFieldEnum | TreatmentPlanScalarFieldEnum[]
  }

  /**
   * TreatmentPlan create
   */
  export type TreatmentPlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentPlan
     */
    select?: TreatmentPlanSelect<ExtArgs> | null
    /**
     * The data needed to create a TreatmentPlan.
     */
    data: XOR<TreatmentPlanCreateInput, TreatmentPlanUncheckedCreateInput>
  }

  /**
   * TreatmentPlan createMany
   */
  export type TreatmentPlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TreatmentPlans.
     */
    data: TreatmentPlanCreateManyInput | TreatmentPlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TreatmentPlan createManyAndReturn
   */
  export type TreatmentPlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentPlan
     */
    select?: TreatmentPlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TreatmentPlans.
     */
    data: TreatmentPlanCreateManyInput | TreatmentPlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TreatmentPlan update
   */
  export type TreatmentPlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentPlan
     */
    select?: TreatmentPlanSelect<ExtArgs> | null
    /**
     * The data needed to update a TreatmentPlan.
     */
    data: XOR<TreatmentPlanUpdateInput, TreatmentPlanUncheckedUpdateInput>
    /**
     * Choose, which TreatmentPlan to update.
     */
    where: TreatmentPlanWhereUniqueInput
  }

  /**
   * TreatmentPlan updateMany
   */
  export type TreatmentPlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TreatmentPlans.
     */
    data: XOR<TreatmentPlanUpdateManyMutationInput, TreatmentPlanUncheckedUpdateManyInput>
    /**
     * Filter which TreatmentPlans to update
     */
    where?: TreatmentPlanWhereInput
  }

  /**
   * TreatmentPlan upsert
   */
  export type TreatmentPlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentPlan
     */
    select?: TreatmentPlanSelect<ExtArgs> | null
    /**
     * The filter to search for the TreatmentPlan to update in case it exists.
     */
    where: TreatmentPlanWhereUniqueInput
    /**
     * In case the TreatmentPlan found by the `where` argument doesn't exist, create a new TreatmentPlan with this data.
     */
    create: XOR<TreatmentPlanCreateInput, TreatmentPlanUncheckedCreateInput>
    /**
     * In case the TreatmentPlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TreatmentPlanUpdateInput, TreatmentPlanUncheckedUpdateInput>
  }

  /**
   * TreatmentPlan delete
   */
  export type TreatmentPlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentPlan
     */
    select?: TreatmentPlanSelect<ExtArgs> | null
    /**
     * Filter which TreatmentPlan to delete.
     */
    where: TreatmentPlanWhereUniqueInput
  }

  /**
   * TreatmentPlan deleteMany
   */
  export type TreatmentPlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TreatmentPlans to delete
     */
    where?: TreatmentPlanWhereInput
  }

  /**
   * TreatmentPlan without action
   */
  export type TreatmentPlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentPlan
     */
    select?: TreatmentPlanSelect<ExtArgs> | null
  }


  /**
   * Model MoodLog
   */

  export type AggregateMoodLog = {
    _count: MoodLogCountAggregateOutputType | null
    _avg: MoodLogAvgAggregateOutputType | null
    _sum: MoodLogSumAggregateOutputType | null
    _min: MoodLogMinAggregateOutputType | null
    _max: MoodLogMaxAggregateOutputType | null
  }

  export type MoodLogAvgAggregateOutputType = {
    moodRating: number | null
  }

  export type MoodLogSumAggregateOutputType = {
    moodRating: number | null
  }

  export type MoodLogMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    moodRating: number | null
    notes: string | null
    logDate: Date | null
    createdAt: Date | null
  }

  export type MoodLogMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    moodRating: number | null
    notes: string | null
    logDate: Date | null
    createdAt: Date | null
  }

  export type MoodLogCountAggregateOutputType = {
    id: number
    patientId: number
    moodRating: number
    notes: number
    triggers: number
    activities: number
    logDate: number
    createdAt: number
    _all: number
  }


  export type MoodLogAvgAggregateInputType = {
    moodRating?: true
  }

  export type MoodLogSumAggregateInputType = {
    moodRating?: true
  }

  export type MoodLogMinAggregateInputType = {
    id?: true
    patientId?: true
    moodRating?: true
    notes?: true
    logDate?: true
    createdAt?: true
  }

  export type MoodLogMaxAggregateInputType = {
    id?: true
    patientId?: true
    moodRating?: true
    notes?: true
    logDate?: true
    createdAt?: true
  }

  export type MoodLogCountAggregateInputType = {
    id?: true
    patientId?: true
    moodRating?: true
    notes?: true
    triggers?: true
    activities?: true
    logDate?: true
    createdAt?: true
    _all?: true
  }

  export type MoodLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MoodLog to aggregate.
     */
    where?: MoodLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodLogs to fetch.
     */
    orderBy?: MoodLogOrderByWithRelationInput | MoodLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MoodLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MoodLogs
    **/
    _count?: true | MoodLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MoodLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MoodLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MoodLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MoodLogMaxAggregateInputType
  }

  export type GetMoodLogAggregateType<T extends MoodLogAggregateArgs> = {
        [P in keyof T & keyof AggregateMoodLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMoodLog[P]>
      : GetScalarType<T[P], AggregateMoodLog[P]>
  }




  export type MoodLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MoodLogWhereInput
    orderBy?: MoodLogOrderByWithAggregationInput | MoodLogOrderByWithAggregationInput[]
    by: MoodLogScalarFieldEnum[] | MoodLogScalarFieldEnum
    having?: MoodLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MoodLogCountAggregateInputType | true
    _avg?: MoodLogAvgAggregateInputType
    _sum?: MoodLogSumAggregateInputType
    _min?: MoodLogMinAggregateInputType
    _max?: MoodLogMaxAggregateInputType
  }

  export type MoodLogGroupByOutputType = {
    id: string
    patientId: string
    moodRating: number
    notes: string | null
    triggers: string[]
    activities: string[]
    logDate: Date
    createdAt: Date
    _count: MoodLogCountAggregateOutputType | null
    _avg: MoodLogAvgAggregateOutputType | null
    _sum: MoodLogSumAggregateOutputType | null
    _min: MoodLogMinAggregateOutputType | null
    _max: MoodLogMaxAggregateOutputType | null
  }

  type GetMoodLogGroupByPayload<T extends MoodLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MoodLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MoodLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MoodLogGroupByOutputType[P]>
            : GetScalarType<T[P], MoodLogGroupByOutputType[P]>
        }
      >
    >


  export type MoodLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    moodRating?: boolean
    notes?: boolean
    triggers?: boolean
    activities?: boolean
    logDate?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["moodLog"]>

  export type MoodLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    moodRating?: boolean
    notes?: boolean
    triggers?: boolean
    activities?: boolean
    logDate?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["moodLog"]>

  export type MoodLogSelectScalar = {
    id?: boolean
    patientId?: boolean
    moodRating?: boolean
    notes?: boolean
    triggers?: boolean
    activities?: boolean
    logDate?: boolean
    createdAt?: boolean
  }


  export type $MoodLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MoodLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      moodRating: number
      notes: string | null
      triggers: string[]
      activities: string[]
      logDate: Date
      createdAt: Date
    }, ExtArgs["result"]["moodLog"]>
    composites: {}
  }

  type MoodLogGetPayload<S extends boolean | null | undefined | MoodLogDefaultArgs> = $Result.GetResult<Prisma.$MoodLogPayload, S>

  type MoodLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MoodLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MoodLogCountAggregateInputType | true
    }

  export interface MoodLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MoodLog'], meta: { name: 'MoodLog' } }
    /**
     * Find zero or one MoodLog that matches the filter.
     * @param {MoodLogFindUniqueArgs} args - Arguments to find a MoodLog
     * @example
     * // Get one MoodLog
     * const moodLog = await prisma.moodLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MoodLogFindUniqueArgs>(args: SelectSubset<T, MoodLogFindUniqueArgs<ExtArgs>>): Prisma__MoodLogClient<$Result.GetResult<Prisma.$MoodLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MoodLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MoodLogFindUniqueOrThrowArgs} args - Arguments to find a MoodLog
     * @example
     * // Get one MoodLog
     * const moodLog = await prisma.moodLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MoodLogFindUniqueOrThrowArgs>(args: SelectSubset<T, MoodLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MoodLogClient<$Result.GetResult<Prisma.$MoodLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MoodLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodLogFindFirstArgs} args - Arguments to find a MoodLog
     * @example
     * // Get one MoodLog
     * const moodLog = await prisma.moodLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MoodLogFindFirstArgs>(args?: SelectSubset<T, MoodLogFindFirstArgs<ExtArgs>>): Prisma__MoodLogClient<$Result.GetResult<Prisma.$MoodLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MoodLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodLogFindFirstOrThrowArgs} args - Arguments to find a MoodLog
     * @example
     * // Get one MoodLog
     * const moodLog = await prisma.moodLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MoodLogFindFirstOrThrowArgs>(args?: SelectSubset<T, MoodLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__MoodLogClient<$Result.GetResult<Prisma.$MoodLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MoodLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MoodLogs
     * const moodLogs = await prisma.moodLog.findMany()
     * 
     * // Get first 10 MoodLogs
     * const moodLogs = await prisma.moodLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const moodLogWithIdOnly = await prisma.moodLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MoodLogFindManyArgs>(args?: SelectSubset<T, MoodLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MoodLog.
     * @param {MoodLogCreateArgs} args - Arguments to create a MoodLog.
     * @example
     * // Create one MoodLog
     * const MoodLog = await prisma.moodLog.create({
     *   data: {
     *     // ... data to create a MoodLog
     *   }
     * })
     * 
     */
    create<T extends MoodLogCreateArgs>(args: SelectSubset<T, MoodLogCreateArgs<ExtArgs>>): Prisma__MoodLogClient<$Result.GetResult<Prisma.$MoodLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MoodLogs.
     * @param {MoodLogCreateManyArgs} args - Arguments to create many MoodLogs.
     * @example
     * // Create many MoodLogs
     * const moodLog = await prisma.moodLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MoodLogCreateManyArgs>(args?: SelectSubset<T, MoodLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MoodLogs and returns the data saved in the database.
     * @param {MoodLogCreateManyAndReturnArgs} args - Arguments to create many MoodLogs.
     * @example
     * // Create many MoodLogs
     * const moodLog = await prisma.moodLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MoodLogs and only return the `id`
     * const moodLogWithIdOnly = await prisma.moodLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MoodLogCreateManyAndReturnArgs>(args?: SelectSubset<T, MoodLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MoodLog.
     * @param {MoodLogDeleteArgs} args - Arguments to delete one MoodLog.
     * @example
     * // Delete one MoodLog
     * const MoodLog = await prisma.moodLog.delete({
     *   where: {
     *     // ... filter to delete one MoodLog
     *   }
     * })
     * 
     */
    delete<T extends MoodLogDeleteArgs>(args: SelectSubset<T, MoodLogDeleteArgs<ExtArgs>>): Prisma__MoodLogClient<$Result.GetResult<Prisma.$MoodLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MoodLog.
     * @param {MoodLogUpdateArgs} args - Arguments to update one MoodLog.
     * @example
     * // Update one MoodLog
     * const moodLog = await prisma.moodLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MoodLogUpdateArgs>(args: SelectSubset<T, MoodLogUpdateArgs<ExtArgs>>): Prisma__MoodLogClient<$Result.GetResult<Prisma.$MoodLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MoodLogs.
     * @param {MoodLogDeleteManyArgs} args - Arguments to filter MoodLogs to delete.
     * @example
     * // Delete a few MoodLogs
     * const { count } = await prisma.moodLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MoodLogDeleteManyArgs>(args?: SelectSubset<T, MoodLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MoodLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MoodLogs
     * const moodLog = await prisma.moodLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MoodLogUpdateManyArgs>(args: SelectSubset<T, MoodLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MoodLog.
     * @param {MoodLogUpsertArgs} args - Arguments to update or create a MoodLog.
     * @example
     * // Update or create a MoodLog
     * const moodLog = await prisma.moodLog.upsert({
     *   create: {
     *     // ... data to create a MoodLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MoodLog we want to update
     *   }
     * })
     */
    upsert<T extends MoodLogUpsertArgs>(args: SelectSubset<T, MoodLogUpsertArgs<ExtArgs>>): Prisma__MoodLogClient<$Result.GetResult<Prisma.$MoodLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MoodLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodLogCountArgs} args - Arguments to filter MoodLogs to count.
     * @example
     * // Count the number of MoodLogs
     * const count = await prisma.moodLog.count({
     *   where: {
     *     // ... the filter for the MoodLogs we want to count
     *   }
     * })
    **/
    count<T extends MoodLogCountArgs>(
      args?: Subset<T, MoodLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MoodLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MoodLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MoodLogAggregateArgs>(args: Subset<T, MoodLogAggregateArgs>): Prisma.PrismaPromise<GetMoodLogAggregateType<T>>

    /**
     * Group by MoodLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodLogGroupByArgs} args - Group by arguments.
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
      T extends MoodLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MoodLogGroupByArgs['orderBy'] }
        : { orderBy?: MoodLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MoodLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMoodLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MoodLog model
   */
  readonly fields: MoodLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MoodLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MoodLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the MoodLog model
   */ 
  interface MoodLogFieldRefs {
    readonly id: FieldRef<"MoodLog", 'String'>
    readonly patientId: FieldRef<"MoodLog", 'String'>
    readonly moodRating: FieldRef<"MoodLog", 'Int'>
    readonly notes: FieldRef<"MoodLog", 'String'>
    readonly triggers: FieldRef<"MoodLog", 'String[]'>
    readonly activities: FieldRef<"MoodLog", 'String[]'>
    readonly logDate: FieldRef<"MoodLog", 'DateTime'>
    readonly createdAt: FieldRef<"MoodLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MoodLog findUnique
   */
  export type MoodLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodLog
     */
    select?: MoodLogSelect<ExtArgs> | null
    /**
     * Filter, which MoodLog to fetch.
     */
    where: MoodLogWhereUniqueInput
  }

  /**
   * MoodLog findUniqueOrThrow
   */
  export type MoodLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodLog
     */
    select?: MoodLogSelect<ExtArgs> | null
    /**
     * Filter, which MoodLog to fetch.
     */
    where: MoodLogWhereUniqueInput
  }

  /**
   * MoodLog findFirst
   */
  export type MoodLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodLog
     */
    select?: MoodLogSelect<ExtArgs> | null
    /**
     * Filter, which MoodLog to fetch.
     */
    where?: MoodLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodLogs to fetch.
     */
    orderBy?: MoodLogOrderByWithRelationInput | MoodLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MoodLogs.
     */
    cursor?: MoodLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MoodLogs.
     */
    distinct?: MoodLogScalarFieldEnum | MoodLogScalarFieldEnum[]
  }

  /**
   * MoodLog findFirstOrThrow
   */
  export type MoodLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodLog
     */
    select?: MoodLogSelect<ExtArgs> | null
    /**
     * Filter, which MoodLog to fetch.
     */
    where?: MoodLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodLogs to fetch.
     */
    orderBy?: MoodLogOrderByWithRelationInput | MoodLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MoodLogs.
     */
    cursor?: MoodLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MoodLogs.
     */
    distinct?: MoodLogScalarFieldEnum | MoodLogScalarFieldEnum[]
  }

  /**
   * MoodLog findMany
   */
  export type MoodLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodLog
     */
    select?: MoodLogSelect<ExtArgs> | null
    /**
     * Filter, which MoodLogs to fetch.
     */
    where?: MoodLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodLogs to fetch.
     */
    orderBy?: MoodLogOrderByWithRelationInput | MoodLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MoodLogs.
     */
    cursor?: MoodLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodLogs.
     */
    skip?: number
    distinct?: MoodLogScalarFieldEnum | MoodLogScalarFieldEnum[]
  }

  /**
   * MoodLog create
   */
  export type MoodLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodLog
     */
    select?: MoodLogSelect<ExtArgs> | null
    /**
     * The data needed to create a MoodLog.
     */
    data: XOR<MoodLogCreateInput, MoodLogUncheckedCreateInput>
  }

  /**
   * MoodLog createMany
   */
  export type MoodLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MoodLogs.
     */
    data: MoodLogCreateManyInput | MoodLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MoodLog createManyAndReturn
   */
  export type MoodLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodLog
     */
    select?: MoodLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MoodLogs.
     */
    data: MoodLogCreateManyInput | MoodLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MoodLog update
   */
  export type MoodLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodLog
     */
    select?: MoodLogSelect<ExtArgs> | null
    /**
     * The data needed to update a MoodLog.
     */
    data: XOR<MoodLogUpdateInput, MoodLogUncheckedUpdateInput>
    /**
     * Choose, which MoodLog to update.
     */
    where: MoodLogWhereUniqueInput
  }

  /**
   * MoodLog updateMany
   */
  export type MoodLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MoodLogs.
     */
    data: XOR<MoodLogUpdateManyMutationInput, MoodLogUncheckedUpdateManyInput>
    /**
     * Filter which MoodLogs to update
     */
    where?: MoodLogWhereInput
  }

  /**
   * MoodLog upsert
   */
  export type MoodLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodLog
     */
    select?: MoodLogSelect<ExtArgs> | null
    /**
     * The filter to search for the MoodLog to update in case it exists.
     */
    where: MoodLogWhereUniqueInput
    /**
     * In case the MoodLog found by the `where` argument doesn't exist, create a new MoodLog with this data.
     */
    create: XOR<MoodLogCreateInput, MoodLogUncheckedCreateInput>
    /**
     * In case the MoodLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MoodLogUpdateInput, MoodLogUncheckedUpdateInput>
  }

  /**
   * MoodLog delete
   */
  export type MoodLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodLog
     */
    select?: MoodLogSelect<ExtArgs> | null
    /**
     * Filter which MoodLog to delete.
     */
    where: MoodLogWhereUniqueInput
  }

  /**
   * MoodLog deleteMany
   */
  export type MoodLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MoodLogs to delete
     */
    where?: MoodLogWhereInput
  }

  /**
   * MoodLog without action
   */
  export type MoodLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodLog
     */
    select?: MoodLogSelect<ExtArgs> | null
  }


  /**
   * Model SupportGroup
   */

  export type AggregateSupportGroup = {
    _count: SupportGroupCountAggregateOutputType | null
    _avg: SupportGroupAvgAggregateOutputType | null
    _sum: SupportGroupSumAggregateOutputType | null
    _min: SupportGroupMinAggregateOutputType | null
    _max: SupportGroupMaxAggregateOutputType | null
  }

  export type SupportGroupAvgAggregateOutputType = {
    maxMembers: number | null
  }

  export type SupportGroupSumAggregateOutputType = {
    maxMembers: number | null
  }

  export type SupportGroupMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    type: string | null
    facilitatorId: string | null
    maxMembers: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupportGroupMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    type: string | null
    facilitatorId: string | null
    maxMembers: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupportGroupCountAggregateOutputType = {
    id: number
    name: number
    description: number
    type: number
    facilitatorId: number
    schedule: number
    maxMembers: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SupportGroupAvgAggregateInputType = {
    maxMembers?: true
  }

  export type SupportGroupSumAggregateInputType = {
    maxMembers?: true
  }

  export type SupportGroupMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    facilitatorId?: true
    maxMembers?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupportGroupMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    facilitatorId?: true
    maxMembers?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupportGroupCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    facilitatorId?: true
    schedule?: true
    maxMembers?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SupportGroupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupportGroup to aggregate.
     */
    where?: SupportGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupportGroups to fetch.
     */
    orderBy?: SupportGroupOrderByWithRelationInput | SupportGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupportGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupportGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupportGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SupportGroups
    **/
    _count?: true | SupportGroupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SupportGroupAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SupportGroupSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupportGroupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupportGroupMaxAggregateInputType
  }

  export type GetSupportGroupAggregateType<T extends SupportGroupAggregateArgs> = {
        [P in keyof T & keyof AggregateSupportGroup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupportGroup[P]>
      : GetScalarType<T[P], AggregateSupportGroup[P]>
  }




  export type SupportGroupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupportGroupWhereInput
    orderBy?: SupportGroupOrderByWithAggregationInput | SupportGroupOrderByWithAggregationInput[]
    by: SupportGroupScalarFieldEnum[] | SupportGroupScalarFieldEnum
    having?: SupportGroupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupportGroupCountAggregateInputType | true
    _avg?: SupportGroupAvgAggregateInputType
    _sum?: SupportGroupSumAggregateInputType
    _min?: SupportGroupMinAggregateInputType
    _max?: SupportGroupMaxAggregateInputType
  }

  export type SupportGroupGroupByOutputType = {
    id: string
    name: string
    description: string
    type: string
    facilitatorId: string
    schedule: JsonValue
    maxMembers: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: SupportGroupCountAggregateOutputType | null
    _avg: SupportGroupAvgAggregateOutputType | null
    _sum: SupportGroupSumAggregateOutputType | null
    _min: SupportGroupMinAggregateOutputType | null
    _max: SupportGroupMaxAggregateOutputType | null
  }

  type GetSupportGroupGroupByPayload<T extends SupportGroupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupportGroupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupportGroupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupportGroupGroupByOutputType[P]>
            : GetScalarType<T[P], SupportGroupGroupByOutputType[P]>
        }
      >
    >


  export type SupportGroupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    facilitatorId?: boolean
    schedule?: boolean
    maxMembers?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    members?: boolean | SupportGroup$membersArgs<ExtArgs>
    _count?: boolean | SupportGroupCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supportGroup"]>

  export type SupportGroupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    facilitatorId?: boolean
    schedule?: boolean
    maxMembers?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supportGroup"]>

  export type SupportGroupSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    facilitatorId?: boolean
    schedule?: boolean
    maxMembers?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SupportGroupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | SupportGroup$membersArgs<ExtArgs>
    _count?: boolean | SupportGroupCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SupportGroupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SupportGroupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SupportGroup"
    objects: {
      members: Prisma.$SupportGroupMemberPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      type: string
      facilitatorId: string
      schedule: Prisma.JsonValue
      maxMembers: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["supportGroup"]>
    composites: {}
  }

  type SupportGroupGetPayload<S extends boolean | null | undefined | SupportGroupDefaultArgs> = $Result.GetResult<Prisma.$SupportGroupPayload, S>

  type SupportGroupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SupportGroupFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SupportGroupCountAggregateInputType | true
    }

  export interface SupportGroupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SupportGroup'], meta: { name: 'SupportGroup' } }
    /**
     * Find zero or one SupportGroup that matches the filter.
     * @param {SupportGroupFindUniqueArgs} args - Arguments to find a SupportGroup
     * @example
     * // Get one SupportGroup
     * const supportGroup = await prisma.supportGroup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupportGroupFindUniqueArgs>(args: SelectSubset<T, SupportGroupFindUniqueArgs<ExtArgs>>): Prisma__SupportGroupClient<$Result.GetResult<Prisma.$SupportGroupPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SupportGroup that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SupportGroupFindUniqueOrThrowArgs} args - Arguments to find a SupportGroup
     * @example
     * // Get one SupportGroup
     * const supportGroup = await prisma.supportGroup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupportGroupFindUniqueOrThrowArgs>(args: SelectSubset<T, SupportGroupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupportGroupClient<$Result.GetResult<Prisma.$SupportGroupPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SupportGroup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupFindFirstArgs} args - Arguments to find a SupportGroup
     * @example
     * // Get one SupportGroup
     * const supportGroup = await prisma.supportGroup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupportGroupFindFirstArgs>(args?: SelectSubset<T, SupportGroupFindFirstArgs<ExtArgs>>): Prisma__SupportGroupClient<$Result.GetResult<Prisma.$SupportGroupPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SupportGroup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupFindFirstOrThrowArgs} args - Arguments to find a SupportGroup
     * @example
     * // Get one SupportGroup
     * const supportGroup = await prisma.supportGroup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupportGroupFindFirstOrThrowArgs>(args?: SelectSubset<T, SupportGroupFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupportGroupClient<$Result.GetResult<Prisma.$SupportGroupPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SupportGroups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SupportGroups
     * const supportGroups = await prisma.supportGroup.findMany()
     * 
     * // Get first 10 SupportGroups
     * const supportGroups = await prisma.supportGroup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const supportGroupWithIdOnly = await prisma.supportGroup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SupportGroupFindManyArgs>(args?: SelectSubset<T, SupportGroupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupportGroupPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SupportGroup.
     * @param {SupportGroupCreateArgs} args - Arguments to create a SupportGroup.
     * @example
     * // Create one SupportGroup
     * const SupportGroup = await prisma.supportGroup.create({
     *   data: {
     *     // ... data to create a SupportGroup
     *   }
     * })
     * 
     */
    create<T extends SupportGroupCreateArgs>(args: SelectSubset<T, SupportGroupCreateArgs<ExtArgs>>): Prisma__SupportGroupClient<$Result.GetResult<Prisma.$SupportGroupPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SupportGroups.
     * @param {SupportGroupCreateManyArgs} args - Arguments to create many SupportGroups.
     * @example
     * // Create many SupportGroups
     * const supportGroup = await prisma.supportGroup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupportGroupCreateManyArgs>(args?: SelectSubset<T, SupportGroupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SupportGroups and returns the data saved in the database.
     * @param {SupportGroupCreateManyAndReturnArgs} args - Arguments to create many SupportGroups.
     * @example
     * // Create many SupportGroups
     * const supportGroup = await prisma.supportGroup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SupportGroups and only return the `id`
     * const supportGroupWithIdOnly = await prisma.supportGroup.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SupportGroupCreateManyAndReturnArgs>(args?: SelectSubset<T, SupportGroupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupportGroupPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SupportGroup.
     * @param {SupportGroupDeleteArgs} args - Arguments to delete one SupportGroup.
     * @example
     * // Delete one SupportGroup
     * const SupportGroup = await prisma.supportGroup.delete({
     *   where: {
     *     // ... filter to delete one SupportGroup
     *   }
     * })
     * 
     */
    delete<T extends SupportGroupDeleteArgs>(args: SelectSubset<T, SupportGroupDeleteArgs<ExtArgs>>): Prisma__SupportGroupClient<$Result.GetResult<Prisma.$SupportGroupPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SupportGroup.
     * @param {SupportGroupUpdateArgs} args - Arguments to update one SupportGroup.
     * @example
     * // Update one SupportGroup
     * const supportGroup = await prisma.supportGroup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupportGroupUpdateArgs>(args: SelectSubset<T, SupportGroupUpdateArgs<ExtArgs>>): Prisma__SupportGroupClient<$Result.GetResult<Prisma.$SupportGroupPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SupportGroups.
     * @param {SupportGroupDeleteManyArgs} args - Arguments to filter SupportGroups to delete.
     * @example
     * // Delete a few SupportGroups
     * const { count } = await prisma.supportGroup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupportGroupDeleteManyArgs>(args?: SelectSubset<T, SupportGroupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupportGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SupportGroups
     * const supportGroup = await prisma.supportGroup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupportGroupUpdateManyArgs>(args: SelectSubset<T, SupportGroupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SupportGroup.
     * @param {SupportGroupUpsertArgs} args - Arguments to update or create a SupportGroup.
     * @example
     * // Update or create a SupportGroup
     * const supportGroup = await prisma.supportGroup.upsert({
     *   create: {
     *     // ... data to create a SupportGroup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SupportGroup we want to update
     *   }
     * })
     */
    upsert<T extends SupportGroupUpsertArgs>(args: SelectSubset<T, SupportGroupUpsertArgs<ExtArgs>>): Prisma__SupportGroupClient<$Result.GetResult<Prisma.$SupportGroupPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SupportGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupCountArgs} args - Arguments to filter SupportGroups to count.
     * @example
     * // Count the number of SupportGroups
     * const count = await prisma.supportGroup.count({
     *   where: {
     *     // ... the filter for the SupportGroups we want to count
     *   }
     * })
    **/
    count<T extends SupportGroupCountArgs>(
      args?: Subset<T, SupportGroupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupportGroupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SupportGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SupportGroupAggregateArgs>(args: Subset<T, SupportGroupAggregateArgs>): Prisma.PrismaPromise<GetSupportGroupAggregateType<T>>

    /**
     * Group by SupportGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupGroupByArgs} args - Group by arguments.
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
      T extends SupportGroupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupportGroupGroupByArgs['orderBy'] }
        : { orderBy?: SupportGroupGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SupportGroupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupportGroupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SupportGroup model
   */
  readonly fields: SupportGroupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SupportGroup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupportGroupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends SupportGroup$membersArgs<ExtArgs> = {}>(args?: Subset<T, SupportGroup$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupportGroupMemberPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the SupportGroup model
   */ 
  interface SupportGroupFieldRefs {
    readonly id: FieldRef<"SupportGroup", 'String'>
    readonly name: FieldRef<"SupportGroup", 'String'>
    readonly description: FieldRef<"SupportGroup", 'String'>
    readonly type: FieldRef<"SupportGroup", 'String'>
    readonly facilitatorId: FieldRef<"SupportGroup", 'String'>
    readonly schedule: FieldRef<"SupportGroup", 'Json'>
    readonly maxMembers: FieldRef<"SupportGroup", 'Int'>
    readonly isActive: FieldRef<"SupportGroup", 'Boolean'>
    readonly createdAt: FieldRef<"SupportGroup", 'DateTime'>
    readonly updatedAt: FieldRef<"SupportGroup", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SupportGroup findUnique
   */
  export type SupportGroupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroup
     */
    select?: SupportGroupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupInclude<ExtArgs> | null
    /**
     * Filter, which SupportGroup to fetch.
     */
    where: SupportGroupWhereUniqueInput
  }

  /**
   * SupportGroup findUniqueOrThrow
   */
  export type SupportGroupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroup
     */
    select?: SupportGroupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupInclude<ExtArgs> | null
    /**
     * Filter, which SupportGroup to fetch.
     */
    where: SupportGroupWhereUniqueInput
  }

  /**
   * SupportGroup findFirst
   */
  export type SupportGroupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroup
     */
    select?: SupportGroupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupInclude<ExtArgs> | null
    /**
     * Filter, which SupportGroup to fetch.
     */
    where?: SupportGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupportGroups to fetch.
     */
    orderBy?: SupportGroupOrderByWithRelationInput | SupportGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupportGroups.
     */
    cursor?: SupportGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupportGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupportGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupportGroups.
     */
    distinct?: SupportGroupScalarFieldEnum | SupportGroupScalarFieldEnum[]
  }

  /**
   * SupportGroup findFirstOrThrow
   */
  export type SupportGroupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroup
     */
    select?: SupportGroupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupInclude<ExtArgs> | null
    /**
     * Filter, which SupportGroup to fetch.
     */
    where?: SupportGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupportGroups to fetch.
     */
    orderBy?: SupportGroupOrderByWithRelationInput | SupportGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupportGroups.
     */
    cursor?: SupportGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupportGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupportGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupportGroups.
     */
    distinct?: SupportGroupScalarFieldEnum | SupportGroupScalarFieldEnum[]
  }

  /**
   * SupportGroup findMany
   */
  export type SupportGroupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroup
     */
    select?: SupportGroupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupInclude<ExtArgs> | null
    /**
     * Filter, which SupportGroups to fetch.
     */
    where?: SupportGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupportGroups to fetch.
     */
    orderBy?: SupportGroupOrderByWithRelationInput | SupportGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SupportGroups.
     */
    cursor?: SupportGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupportGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupportGroups.
     */
    skip?: number
    distinct?: SupportGroupScalarFieldEnum | SupportGroupScalarFieldEnum[]
  }

  /**
   * SupportGroup create
   */
  export type SupportGroupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroup
     */
    select?: SupportGroupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupInclude<ExtArgs> | null
    /**
     * The data needed to create a SupportGroup.
     */
    data: XOR<SupportGroupCreateInput, SupportGroupUncheckedCreateInput>
  }

  /**
   * SupportGroup createMany
   */
  export type SupportGroupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SupportGroups.
     */
    data: SupportGroupCreateManyInput | SupportGroupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SupportGroup createManyAndReturn
   */
  export type SupportGroupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroup
     */
    select?: SupportGroupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SupportGroups.
     */
    data: SupportGroupCreateManyInput | SupportGroupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SupportGroup update
   */
  export type SupportGroupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroup
     */
    select?: SupportGroupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupInclude<ExtArgs> | null
    /**
     * The data needed to update a SupportGroup.
     */
    data: XOR<SupportGroupUpdateInput, SupportGroupUncheckedUpdateInput>
    /**
     * Choose, which SupportGroup to update.
     */
    where: SupportGroupWhereUniqueInput
  }

  /**
   * SupportGroup updateMany
   */
  export type SupportGroupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SupportGroups.
     */
    data: XOR<SupportGroupUpdateManyMutationInput, SupportGroupUncheckedUpdateManyInput>
    /**
     * Filter which SupportGroups to update
     */
    where?: SupportGroupWhereInput
  }

  /**
   * SupportGroup upsert
   */
  export type SupportGroupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroup
     */
    select?: SupportGroupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupInclude<ExtArgs> | null
    /**
     * The filter to search for the SupportGroup to update in case it exists.
     */
    where: SupportGroupWhereUniqueInput
    /**
     * In case the SupportGroup found by the `where` argument doesn't exist, create a new SupportGroup with this data.
     */
    create: XOR<SupportGroupCreateInput, SupportGroupUncheckedCreateInput>
    /**
     * In case the SupportGroup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupportGroupUpdateInput, SupportGroupUncheckedUpdateInput>
  }

  /**
   * SupportGroup delete
   */
  export type SupportGroupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroup
     */
    select?: SupportGroupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupInclude<ExtArgs> | null
    /**
     * Filter which SupportGroup to delete.
     */
    where: SupportGroupWhereUniqueInput
  }

  /**
   * SupportGroup deleteMany
   */
  export type SupportGroupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupportGroups to delete
     */
    where?: SupportGroupWhereInput
  }

  /**
   * SupportGroup.members
   */
  export type SupportGroup$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupMember
     */
    select?: SupportGroupMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupMemberInclude<ExtArgs> | null
    where?: SupportGroupMemberWhereInput
    orderBy?: SupportGroupMemberOrderByWithRelationInput | SupportGroupMemberOrderByWithRelationInput[]
    cursor?: SupportGroupMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SupportGroupMemberScalarFieldEnum | SupportGroupMemberScalarFieldEnum[]
  }

  /**
   * SupportGroup without action
   */
  export type SupportGroupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroup
     */
    select?: SupportGroupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupInclude<ExtArgs> | null
  }


  /**
   * Model SupportGroupMember
   */

  export type AggregateSupportGroupMember = {
    _count: SupportGroupMemberCountAggregateOutputType | null
    _min: SupportGroupMemberMinAggregateOutputType | null
    _max: SupportGroupMemberMaxAggregateOutputType | null
  }

  export type SupportGroupMemberMinAggregateOutputType = {
    id: string | null
    groupId: string | null
    patientId: string | null
    joinedAt: Date | null
    status: string | null
  }

  export type SupportGroupMemberMaxAggregateOutputType = {
    id: string | null
    groupId: string | null
    patientId: string | null
    joinedAt: Date | null
    status: string | null
  }

  export type SupportGroupMemberCountAggregateOutputType = {
    id: number
    groupId: number
    patientId: number
    joinedAt: number
    status: number
    _all: number
  }


  export type SupportGroupMemberMinAggregateInputType = {
    id?: true
    groupId?: true
    patientId?: true
    joinedAt?: true
    status?: true
  }

  export type SupportGroupMemberMaxAggregateInputType = {
    id?: true
    groupId?: true
    patientId?: true
    joinedAt?: true
    status?: true
  }

  export type SupportGroupMemberCountAggregateInputType = {
    id?: true
    groupId?: true
    patientId?: true
    joinedAt?: true
    status?: true
    _all?: true
  }

  export type SupportGroupMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupportGroupMember to aggregate.
     */
    where?: SupportGroupMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupportGroupMembers to fetch.
     */
    orderBy?: SupportGroupMemberOrderByWithRelationInput | SupportGroupMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupportGroupMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupportGroupMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupportGroupMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SupportGroupMembers
    **/
    _count?: true | SupportGroupMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupportGroupMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupportGroupMemberMaxAggregateInputType
  }

  export type GetSupportGroupMemberAggregateType<T extends SupportGroupMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateSupportGroupMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupportGroupMember[P]>
      : GetScalarType<T[P], AggregateSupportGroupMember[P]>
  }




  export type SupportGroupMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupportGroupMemberWhereInput
    orderBy?: SupportGroupMemberOrderByWithAggregationInput | SupportGroupMemberOrderByWithAggregationInput[]
    by: SupportGroupMemberScalarFieldEnum[] | SupportGroupMemberScalarFieldEnum
    having?: SupportGroupMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupportGroupMemberCountAggregateInputType | true
    _min?: SupportGroupMemberMinAggregateInputType
    _max?: SupportGroupMemberMaxAggregateInputType
  }

  export type SupportGroupMemberGroupByOutputType = {
    id: string
    groupId: string
    patientId: string
    joinedAt: Date
    status: string
    _count: SupportGroupMemberCountAggregateOutputType | null
    _min: SupportGroupMemberMinAggregateOutputType | null
    _max: SupportGroupMemberMaxAggregateOutputType | null
  }

  type GetSupportGroupMemberGroupByPayload<T extends SupportGroupMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupportGroupMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupportGroupMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupportGroupMemberGroupByOutputType[P]>
            : GetScalarType<T[P], SupportGroupMemberGroupByOutputType[P]>
        }
      >
    >


  export type SupportGroupMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    patientId?: boolean
    joinedAt?: boolean
    status?: boolean
    group?: boolean | SupportGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supportGroupMember"]>

  export type SupportGroupMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    patientId?: boolean
    joinedAt?: boolean
    status?: boolean
    group?: boolean | SupportGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supportGroupMember"]>

  export type SupportGroupMemberSelectScalar = {
    id?: boolean
    groupId?: boolean
    patientId?: boolean
    joinedAt?: boolean
    status?: boolean
  }

  export type SupportGroupMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | SupportGroupDefaultArgs<ExtArgs>
  }
  export type SupportGroupMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | SupportGroupDefaultArgs<ExtArgs>
  }

  export type $SupportGroupMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SupportGroupMember"
    objects: {
      group: Prisma.$SupportGroupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      groupId: string
      patientId: string
      joinedAt: Date
      status: string
    }, ExtArgs["result"]["supportGroupMember"]>
    composites: {}
  }

  type SupportGroupMemberGetPayload<S extends boolean | null | undefined | SupportGroupMemberDefaultArgs> = $Result.GetResult<Prisma.$SupportGroupMemberPayload, S>

  type SupportGroupMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SupportGroupMemberFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SupportGroupMemberCountAggregateInputType | true
    }

  export interface SupportGroupMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SupportGroupMember'], meta: { name: 'SupportGroupMember' } }
    /**
     * Find zero or one SupportGroupMember that matches the filter.
     * @param {SupportGroupMemberFindUniqueArgs} args - Arguments to find a SupportGroupMember
     * @example
     * // Get one SupportGroupMember
     * const supportGroupMember = await prisma.supportGroupMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupportGroupMemberFindUniqueArgs>(args: SelectSubset<T, SupportGroupMemberFindUniqueArgs<ExtArgs>>): Prisma__SupportGroupMemberClient<$Result.GetResult<Prisma.$SupportGroupMemberPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SupportGroupMember that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SupportGroupMemberFindUniqueOrThrowArgs} args - Arguments to find a SupportGroupMember
     * @example
     * // Get one SupportGroupMember
     * const supportGroupMember = await prisma.supportGroupMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupportGroupMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, SupportGroupMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupportGroupMemberClient<$Result.GetResult<Prisma.$SupportGroupMemberPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SupportGroupMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupMemberFindFirstArgs} args - Arguments to find a SupportGroupMember
     * @example
     * // Get one SupportGroupMember
     * const supportGroupMember = await prisma.supportGroupMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupportGroupMemberFindFirstArgs>(args?: SelectSubset<T, SupportGroupMemberFindFirstArgs<ExtArgs>>): Prisma__SupportGroupMemberClient<$Result.GetResult<Prisma.$SupportGroupMemberPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SupportGroupMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupMemberFindFirstOrThrowArgs} args - Arguments to find a SupportGroupMember
     * @example
     * // Get one SupportGroupMember
     * const supportGroupMember = await prisma.supportGroupMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupportGroupMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, SupportGroupMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupportGroupMemberClient<$Result.GetResult<Prisma.$SupportGroupMemberPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SupportGroupMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SupportGroupMembers
     * const supportGroupMembers = await prisma.supportGroupMember.findMany()
     * 
     * // Get first 10 SupportGroupMembers
     * const supportGroupMembers = await prisma.supportGroupMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const supportGroupMemberWithIdOnly = await prisma.supportGroupMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SupportGroupMemberFindManyArgs>(args?: SelectSubset<T, SupportGroupMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupportGroupMemberPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SupportGroupMember.
     * @param {SupportGroupMemberCreateArgs} args - Arguments to create a SupportGroupMember.
     * @example
     * // Create one SupportGroupMember
     * const SupportGroupMember = await prisma.supportGroupMember.create({
     *   data: {
     *     // ... data to create a SupportGroupMember
     *   }
     * })
     * 
     */
    create<T extends SupportGroupMemberCreateArgs>(args: SelectSubset<T, SupportGroupMemberCreateArgs<ExtArgs>>): Prisma__SupportGroupMemberClient<$Result.GetResult<Prisma.$SupportGroupMemberPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SupportGroupMembers.
     * @param {SupportGroupMemberCreateManyArgs} args - Arguments to create many SupportGroupMembers.
     * @example
     * // Create many SupportGroupMembers
     * const supportGroupMember = await prisma.supportGroupMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupportGroupMemberCreateManyArgs>(args?: SelectSubset<T, SupportGroupMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SupportGroupMembers and returns the data saved in the database.
     * @param {SupportGroupMemberCreateManyAndReturnArgs} args - Arguments to create many SupportGroupMembers.
     * @example
     * // Create many SupportGroupMembers
     * const supportGroupMember = await prisma.supportGroupMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SupportGroupMembers and only return the `id`
     * const supportGroupMemberWithIdOnly = await prisma.supportGroupMember.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SupportGroupMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, SupportGroupMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupportGroupMemberPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SupportGroupMember.
     * @param {SupportGroupMemberDeleteArgs} args - Arguments to delete one SupportGroupMember.
     * @example
     * // Delete one SupportGroupMember
     * const SupportGroupMember = await prisma.supportGroupMember.delete({
     *   where: {
     *     // ... filter to delete one SupportGroupMember
     *   }
     * })
     * 
     */
    delete<T extends SupportGroupMemberDeleteArgs>(args: SelectSubset<T, SupportGroupMemberDeleteArgs<ExtArgs>>): Prisma__SupportGroupMemberClient<$Result.GetResult<Prisma.$SupportGroupMemberPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SupportGroupMember.
     * @param {SupportGroupMemberUpdateArgs} args - Arguments to update one SupportGroupMember.
     * @example
     * // Update one SupportGroupMember
     * const supportGroupMember = await prisma.supportGroupMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupportGroupMemberUpdateArgs>(args: SelectSubset<T, SupportGroupMemberUpdateArgs<ExtArgs>>): Prisma__SupportGroupMemberClient<$Result.GetResult<Prisma.$SupportGroupMemberPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SupportGroupMembers.
     * @param {SupportGroupMemberDeleteManyArgs} args - Arguments to filter SupportGroupMembers to delete.
     * @example
     * // Delete a few SupportGroupMembers
     * const { count } = await prisma.supportGroupMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupportGroupMemberDeleteManyArgs>(args?: SelectSubset<T, SupportGroupMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupportGroupMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SupportGroupMembers
     * const supportGroupMember = await prisma.supportGroupMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupportGroupMemberUpdateManyArgs>(args: SelectSubset<T, SupportGroupMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SupportGroupMember.
     * @param {SupportGroupMemberUpsertArgs} args - Arguments to update or create a SupportGroupMember.
     * @example
     * // Update or create a SupportGroupMember
     * const supportGroupMember = await prisma.supportGroupMember.upsert({
     *   create: {
     *     // ... data to create a SupportGroupMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SupportGroupMember we want to update
     *   }
     * })
     */
    upsert<T extends SupportGroupMemberUpsertArgs>(args: SelectSubset<T, SupportGroupMemberUpsertArgs<ExtArgs>>): Prisma__SupportGroupMemberClient<$Result.GetResult<Prisma.$SupportGroupMemberPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SupportGroupMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupMemberCountArgs} args - Arguments to filter SupportGroupMembers to count.
     * @example
     * // Count the number of SupportGroupMembers
     * const count = await prisma.supportGroupMember.count({
     *   where: {
     *     // ... the filter for the SupportGroupMembers we want to count
     *   }
     * })
    **/
    count<T extends SupportGroupMemberCountArgs>(
      args?: Subset<T, SupportGroupMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupportGroupMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SupportGroupMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SupportGroupMemberAggregateArgs>(args: Subset<T, SupportGroupMemberAggregateArgs>): Prisma.PrismaPromise<GetSupportGroupMemberAggregateType<T>>

    /**
     * Group by SupportGroupMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportGroupMemberGroupByArgs} args - Group by arguments.
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
      T extends SupportGroupMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupportGroupMemberGroupByArgs['orderBy'] }
        : { orderBy?: SupportGroupMemberGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SupportGroupMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupportGroupMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SupportGroupMember model
   */
  readonly fields: SupportGroupMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SupportGroupMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupportGroupMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    group<T extends SupportGroupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SupportGroupDefaultArgs<ExtArgs>>): Prisma__SupportGroupClient<$Result.GetResult<Prisma.$SupportGroupPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the SupportGroupMember model
   */ 
  interface SupportGroupMemberFieldRefs {
    readonly id: FieldRef<"SupportGroupMember", 'String'>
    readonly groupId: FieldRef<"SupportGroupMember", 'String'>
    readonly patientId: FieldRef<"SupportGroupMember", 'String'>
    readonly joinedAt: FieldRef<"SupportGroupMember", 'DateTime'>
    readonly status: FieldRef<"SupportGroupMember", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SupportGroupMember findUnique
   */
  export type SupportGroupMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupMember
     */
    select?: SupportGroupMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupMemberInclude<ExtArgs> | null
    /**
     * Filter, which SupportGroupMember to fetch.
     */
    where: SupportGroupMemberWhereUniqueInput
  }

  /**
   * SupportGroupMember findUniqueOrThrow
   */
  export type SupportGroupMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupMember
     */
    select?: SupportGroupMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupMemberInclude<ExtArgs> | null
    /**
     * Filter, which SupportGroupMember to fetch.
     */
    where: SupportGroupMemberWhereUniqueInput
  }

  /**
   * SupportGroupMember findFirst
   */
  export type SupportGroupMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupMember
     */
    select?: SupportGroupMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupMemberInclude<ExtArgs> | null
    /**
     * Filter, which SupportGroupMember to fetch.
     */
    where?: SupportGroupMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupportGroupMembers to fetch.
     */
    orderBy?: SupportGroupMemberOrderByWithRelationInput | SupportGroupMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupportGroupMembers.
     */
    cursor?: SupportGroupMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupportGroupMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupportGroupMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupportGroupMembers.
     */
    distinct?: SupportGroupMemberScalarFieldEnum | SupportGroupMemberScalarFieldEnum[]
  }

  /**
   * SupportGroupMember findFirstOrThrow
   */
  export type SupportGroupMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupMember
     */
    select?: SupportGroupMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupMemberInclude<ExtArgs> | null
    /**
     * Filter, which SupportGroupMember to fetch.
     */
    where?: SupportGroupMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupportGroupMembers to fetch.
     */
    orderBy?: SupportGroupMemberOrderByWithRelationInput | SupportGroupMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupportGroupMembers.
     */
    cursor?: SupportGroupMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupportGroupMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupportGroupMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupportGroupMembers.
     */
    distinct?: SupportGroupMemberScalarFieldEnum | SupportGroupMemberScalarFieldEnum[]
  }

  /**
   * SupportGroupMember findMany
   */
  export type SupportGroupMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupMember
     */
    select?: SupportGroupMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupMemberInclude<ExtArgs> | null
    /**
     * Filter, which SupportGroupMembers to fetch.
     */
    where?: SupportGroupMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupportGroupMembers to fetch.
     */
    orderBy?: SupportGroupMemberOrderByWithRelationInput | SupportGroupMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SupportGroupMembers.
     */
    cursor?: SupportGroupMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupportGroupMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupportGroupMembers.
     */
    skip?: number
    distinct?: SupportGroupMemberScalarFieldEnum | SupportGroupMemberScalarFieldEnum[]
  }

  /**
   * SupportGroupMember create
   */
  export type SupportGroupMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupMember
     */
    select?: SupportGroupMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a SupportGroupMember.
     */
    data: XOR<SupportGroupMemberCreateInput, SupportGroupMemberUncheckedCreateInput>
  }

  /**
   * SupportGroupMember createMany
   */
  export type SupportGroupMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SupportGroupMembers.
     */
    data: SupportGroupMemberCreateManyInput | SupportGroupMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SupportGroupMember createManyAndReturn
   */
  export type SupportGroupMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupMember
     */
    select?: SupportGroupMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SupportGroupMembers.
     */
    data: SupportGroupMemberCreateManyInput | SupportGroupMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SupportGroupMember update
   */
  export type SupportGroupMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupMember
     */
    select?: SupportGroupMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a SupportGroupMember.
     */
    data: XOR<SupportGroupMemberUpdateInput, SupportGroupMemberUncheckedUpdateInput>
    /**
     * Choose, which SupportGroupMember to update.
     */
    where: SupportGroupMemberWhereUniqueInput
  }

  /**
   * SupportGroupMember updateMany
   */
  export type SupportGroupMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SupportGroupMembers.
     */
    data: XOR<SupportGroupMemberUpdateManyMutationInput, SupportGroupMemberUncheckedUpdateManyInput>
    /**
     * Filter which SupportGroupMembers to update
     */
    where?: SupportGroupMemberWhereInput
  }

  /**
   * SupportGroupMember upsert
   */
  export type SupportGroupMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupMember
     */
    select?: SupportGroupMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the SupportGroupMember to update in case it exists.
     */
    where: SupportGroupMemberWhereUniqueInput
    /**
     * In case the SupportGroupMember found by the `where` argument doesn't exist, create a new SupportGroupMember with this data.
     */
    create: XOR<SupportGroupMemberCreateInput, SupportGroupMemberUncheckedCreateInput>
    /**
     * In case the SupportGroupMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupportGroupMemberUpdateInput, SupportGroupMemberUncheckedUpdateInput>
  }

  /**
   * SupportGroupMember delete
   */
  export type SupportGroupMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupMember
     */
    select?: SupportGroupMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupMemberInclude<ExtArgs> | null
    /**
     * Filter which SupportGroupMember to delete.
     */
    where: SupportGroupMemberWhereUniqueInput
  }

  /**
   * SupportGroupMember deleteMany
   */
  export type SupportGroupMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupportGroupMembers to delete
     */
    where?: SupportGroupMemberWhereInput
  }

  /**
   * SupportGroupMember without action
   */
  export type SupportGroupMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportGroupMember
     */
    select?: SupportGroupMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportGroupMemberInclude<ExtArgs> | null
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
    patientId: string | null
    providerId: string | null
    consentType: $Enums.ConsentType | null
    status: $Enums.ConsentStatus | null
    signedAt: Date | null
    expiresAt: Date | null
    notes: string | null
    grantedTo: string | null
    grantedAt: Date | null
    revokedAt: Date | null
    purpose: string | null
    substanceUseDisclosure: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConsentRecordMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    consentType: $Enums.ConsentType | null
    status: $Enums.ConsentStatus | null
    signedAt: Date | null
    expiresAt: Date | null
    notes: string | null
    grantedTo: string | null
    grantedAt: Date | null
    revokedAt: Date | null
    purpose: string | null
    substanceUseDisclosure: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConsentRecordCountAggregateOutputType = {
    id: number
    patientId: number
    providerId: number
    consentType: number
    status: number
    signedAt: number
    expiresAt: number
    scope: number
    notes: number
    grantedTo: number
    grantedAt: number
    revokedAt: number
    purpose: number
    disclosureScope: number
    substanceUseDisclosure: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConsentRecordMinAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    consentType?: true
    status?: true
    signedAt?: true
    expiresAt?: true
    notes?: true
    grantedTo?: true
    grantedAt?: true
    revokedAt?: true
    purpose?: true
    substanceUseDisclosure?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConsentRecordMaxAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    consentType?: true
    status?: true
    signedAt?: true
    expiresAt?: true
    notes?: true
    grantedTo?: true
    grantedAt?: true
    revokedAt?: true
    purpose?: true
    substanceUseDisclosure?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConsentRecordCountAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    consentType?: true
    status?: true
    signedAt?: true
    expiresAt?: true
    scope?: true
    notes?: true
    grantedTo?: true
    grantedAt?: true
    revokedAt?: true
    purpose?: true
    disclosureScope?: true
    substanceUseDisclosure?: true
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
    patientId: string
    providerId: string
    consentType: $Enums.ConsentType
    status: $Enums.ConsentStatus
    signedAt: Date | null
    expiresAt: Date | null
    scope: string[]
    notes: string | null
    grantedTo: string | null
    grantedAt: Date | null
    revokedAt: Date | null
    purpose: string | null
    disclosureScope: string[]
    substanceUseDisclosure: boolean
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
    patientId?: boolean
    providerId?: boolean
    consentType?: boolean
    status?: boolean
    signedAt?: boolean
    expiresAt?: boolean
    scope?: boolean
    notes?: boolean
    grantedTo?: boolean
    grantedAt?: boolean
    revokedAt?: boolean
    purpose?: boolean
    disclosureScope?: boolean
    substanceUseDisclosure?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["consentRecord"]>

  export type ConsentRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    consentType?: boolean
    status?: boolean
    signedAt?: boolean
    expiresAt?: boolean
    scope?: boolean
    notes?: boolean
    grantedTo?: boolean
    grantedAt?: boolean
    revokedAt?: boolean
    purpose?: boolean
    disclosureScope?: boolean
    substanceUseDisclosure?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["consentRecord"]>

  export type ConsentRecordSelectScalar = {
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    consentType?: boolean
    status?: boolean
    signedAt?: boolean
    expiresAt?: boolean
    scope?: boolean
    notes?: boolean
    grantedTo?: boolean
    grantedAt?: boolean
    revokedAt?: boolean
    purpose?: boolean
    disclosureScope?: boolean
    substanceUseDisclosure?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $ConsentRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConsentRecord"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      providerId: string
      consentType: $Enums.ConsentType
      status: $Enums.ConsentStatus
      signedAt: Date | null
      expiresAt: Date | null
      scope: string[]
      notes: string | null
      grantedTo: string | null
      grantedAt: Date | null
      revokedAt: Date | null
      purpose: string | null
      disclosureScope: string[]
      substanceUseDisclosure: boolean
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
    readonly patientId: FieldRef<"ConsentRecord", 'String'>
    readonly providerId: FieldRef<"ConsentRecord", 'String'>
    readonly consentType: FieldRef<"ConsentRecord", 'ConsentType'>
    readonly status: FieldRef<"ConsentRecord", 'ConsentStatus'>
    readonly signedAt: FieldRef<"ConsentRecord", 'DateTime'>
    readonly expiresAt: FieldRef<"ConsentRecord", 'DateTime'>
    readonly scope: FieldRef<"ConsentRecord", 'String[]'>
    readonly notes: FieldRef<"ConsentRecord", 'String'>
    readonly grantedTo: FieldRef<"ConsentRecord", 'String'>
    readonly grantedAt: FieldRef<"ConsentRecord", 'DateTime'>
    readonly revokedAt: FieldRef<"ConsentRecord", 'DateTime'>
    readonly purpose: FieldRef<"ConsentRecord", 'String'>
    readonly disclosureScope: FieldRef<"ConsentRecord", 'String[]'>
    readonly substanceUseDisclosure: FieldRef<"ConsentRecord", 'Boolean'>
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
  }


  /**
   * Model GroupSession
   */

  export type AggregateGroupSession = {
    _count: GroupSessionCountAggregateOutputType | null
    _avg: GroupSessionAvgAggregateOutputType | null
    _sum: GroupSessionSumAggregateOutputType | null
    _min: GroupSessionMinAggregateOutputType | null
    _max: GroupSessionMaxAggregateOutputType | null
  }

  export type GroupSessionAvgAggregateOutputType = {
    duration: number | null
    maxParticipants: number | null
  }

  export type GroupSessionSumAggregateOutputType = {
    duration: number | null
    maxParticipants: number | null
  }

  export type GroupSessionMinAggregateOutputType = {
    id: string | null
    name: string | null
    medicationName: string | null
    description: string | null
    facilitatorId: string | null
    sessionType: $Enums.GroupSessionType | null
    status: $Enums.GroupSessionStatus | null
    scheduledAt: Date | null
    sessionDate: Date | null
    duration: number | null
    modality: string | null
    maxParticipants: number | null
    topic: string | null
    notes: string | null
    homework: string | null
    nextSessionDate: Date | null
    actualStartTime: Date | null
    actualEndTime: Date | null
    groupId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GroupSessionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    medicationName: string | null
    description: string | null
    facilitatorId: string | null
    sessionType: $Enums.GroupSessionType | null
    status: $Enums.GroupSessionStatus | null
    scheduledAt: Date | null
    sessionDate: Date | null
    duration: number | null
    modality: string | null
    maxParticipants: number | null
    topic: string | null
    notes: string | null
    homework: string | null
    nextSessionDate: Date | null
    actualStartTime: Date | null
    actualEndTime: Date | null
    groupId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GroupSessionCountAggregateOutputType = {
    id: number
    name: number
    medicationName: number
    description: number
    facilitatorId: number
    sessionType: number
    status: number
    scheduledAt: number
    sessionDate: number
    duration: number
    modality: number
    maxParticipants: number
    topic: number
    notes: number
    homework: number
    nextSessionDate: number
    actualStartTime: number
    actualEndTime: number
    objectives: number
    materials: number
    groupId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GroupSessionAvgAggregateInputType = {
    duration?: true
    maxParticipants?: true
  }

  export type GroupSessionSumAggregateInputType = {
    duration?: true
    maxParticipants?: true
  }

  export type GroupSessionMinAggregateInputType = {
    id?: true
    name?: true
    medicationName?: true
    description?: true
    facilitatorId?: true
    sessionType?: true
    status?: true
    scheduledAt?: true
    sessionDate?: true
    duration?: true
    modality?: true
    maxParticipants?: true
    topic?: true
    notes?: true
    homework?: true
    nextSessionDate?: true
    actualStartTime?: true
    actualEndTime?: true
    groupId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GroupSessionMaxAggregateInputType = {
    id?: true
    name?: true
    medicationName?: true
    description?: true
    facilitatorId?: true
    sessionType?: true
    status?: true
    scheduledAt?: true
    sessionDate?: true
    duration?: true
    modality?: true
    maxParticipants?: true
    topic?: true
    notes?: true
    homework?: true
    nextSessionDate?: true
    actualStartTime?: true
    actualEndTime?: true
    groupId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GroupSessionCountAggregateInputType = {
    id?: true
    name?: true
    medicationName?: true
    description?: true
    facilitatorId?: true
    sessionType?: true
    status?: true
    scheduledAt?: true
    sessionDate?: true
    duration?: true
    modality?: true
    maxParticipants?: true
    topic?: true
    notes?: true
    homework?: true
    nextSessionDate?: true
    actualStartTime?: true
    actualEndTime?: true
    objectives?: true
    materials?: true
    groupId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GroupSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupSession to aggregate.
     */
    where?: GroupSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupSessions to fetch.
     */
    orderBy?: GroupSessionOrderByWithRelationInput | GroupSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroupSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GroupSessions
    **/
    _count?: true | GroupSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GroupSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GroupSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroupSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroupSessionMaxAggregateInputType
  }

  export type GetGroupSessionAggregateType<T extends GroupSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateGroupSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroupSession[P]>
      : GetScalarType<T[P], AggregateGroupSession[P]>
  }




  export type GroupSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroupSessionWhereInput
    orderBy?: GroupSessionOrderByWithAggregationInput | GroupSessionOrderByWithAggregationInput[]
    by: GroupSessionScalarFieldEnum[] | GroupSessionScalarFieldEnum
    having?: GroupSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroupSessionCountAggregateInputType | true
    _avg?: GroupSessionAvgAggregateInputType
    _sum?: GroupSessionSumAggregateInputType
    _min?: GroupSessionMinAggregateInputType
    _max?: GroupSessionMaxAggregateInputType
  }

  export type GroupSessionGroupByOutputType = {
    id: string
    name: string
    medicationName: string | null
    description: string | null
    facilitatorId: string
    sessionType: $Enums.GroupSessionType
    status: $Enums.GroupSessionStatus
    scheduledAt: Date
    sessionDate: Date | null
    duration: number
    modality: string | null
    maxParticipants: number
    topic: string | null
    notes: string | null
    homework: string | null
    nextSessionDate: Date | null
    actualStartTime: Date | null
    actualEndTime: Date | null
    objectives: string[]
    materials: JsonValue | null
    groupId: string | null
    createdAt: Date
    updatedAt: Date
    _count: GroupSessionCountAggregateOutputType | null
    _avg: GroupSessionAvgAggregateOutputType | null
    _sum: GroupSessionSumAggregateOutputType | null
    _min: GroupSessionMinAggregateOutputType | null
    _max: GroupSessionMaxAggregateOutputType | null
  }

  type GetGroupSessionGroupByPayload<T extends GroupSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroupSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroupSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroupSessionGroupByOutputType[P]>
            : GetScalarType<T[P], GroupSessionGroupByOutputType[P]>
        }
      >
    >


  export type GroupSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    medicationName?: boolean
    description?: boolean
    facilitatorId?: boolean
    sessionType?: boolean
    status?: boolean
    scheduledAt?: boolean
    sessionDate?: boolean
    duration?: boolean
    modality?: boolean
    maxParticipants?: boolean
    topic?: boolean
    notes?: boolean
    homework?: boolean
    nextSessionDate?: boolean
    actualStartTime?: boolean
    actualEndTime?: boolean
    objectives?: boolean
    materials?: boolean
    groupId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    attendees?: boolean | GroupSession$attendeesArgs<ExtArgs>
    _count?: boolean | GroupSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupSession"]>

  export type GroupSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    medicationName?: boolean
    description?: boolean
    facilitatorId?: boolean
    sessionType?: boolean
    status?: boolean
    scheduledAt?: boolean
    sessionDate?: boolean
    duration?: boolean
    modality?: boolean
    maxParticipants?: boolean
    topic?: boolean
    notes?: boolean
    homework?: boolean
    nextSessionDate?: boolean
    actualStartTime?: boolean
    actualEndTime?: boolean
    objectives?: boolean
    materials?: boolean
    groupId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["groupSession"]>

  export type GroupSessionSelectScalar = {
    id?: boolean
    name?: boolean
    medicationName?: boolean
    description?: boolean
    facilitatorId?: boolean
    sessionType?: boolean
    status?: boolean
    scheduledAt?: boolean
    sessionDate?: boolean
    duration?: boolean
    modality?: boolean
    maxParticipants?: boolean
    topic?: boolean
    notes?: boolean
    homework?: boolean
    nextSessionDate?: boolean
    actualStartTime?: boolean
    actualEndTime?: boolean
    objectives?: boolean
    materials?: boolean
    groupId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GroupSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attendees?: boolean | GroupSession$attendeesArgs<ExtArgs>
    _count?: boolean | GroupSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GroupSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GroupSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GroupSession"
    objects: {
      attendees: Prisma.$GroupSessionAttendeePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      medicationName: string | null
      description: string | null
      facilitatorId: string
      sessionType: $Enums.GroupSessionType
      status: $Enums.GroupSessionStatus
      scheduledAt: Date
      sessionDate: Date | null
      duration: number
      modality: string | null
      maxParticipants: number
      topic: string | null
      notes: string | null
      homework: string | null
      nextSessionDate: Date | null
      actualStartTime: Date | null
      actualEndTime: Date | null
      objectives: string[]
      materials: Prisma.JsonValue | null
      groupId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["groupSession"]>
    composites: {}
  }

  type GroupSessionGetPayload<S extends boolean | null | undefined | GroupSessionDefaultArgs> = $Result.GetResult<Prisma.$GroupSessionPayload, S>

  type GroupSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GroupSessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GroupSessionCountAggregateInputType | true
    }

  export interface GroupSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GroupSession'], meta: { name: 'GroupSession' } }
    /**
     * Find zero or one GroupSession that matches the filter.
     * @param {GroupSessionFindUniqueArgs} args - Arguments to find a GroupSession
     * @example
     * // Get one GroupSession
     * const groupSession = await prisma.groupSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroupSessionFindUniqueArgs>(args: SelectSubset<T, GroupSessionFindUniqueArgs<ExtArgs>>): Prisma__GroupSessionClient<$Result.GetResult<Prisma.$GroupSessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GroupSession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GroupSessionFindUniqueOrThrowArgs} args - Arguments to find a GroupSession
     * @example
     * // Get one GroupSession
     * const groupSession = await prisma.groupSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroupSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, GroupSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroupSessionClient<$Result.GetResult<Prisma.$GroupSessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GroupSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionFindFirstArgs} args - Arguments to find a GroupSession
     * @example
     * // Get one GroupSession
     * const groupSession = await prisma.groupSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroupSessionFindFirstArgs>(args?: SelectSubset<T, GroupSessionFindFirstArgs<ExtArgs>>): Prisma__GroupSessionClient<$Result.GetResult<Prisma.$GroupSessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GroupSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionFindFirstOrThrowArgs} args - Arguments to find a GroupSession
     * @example
     * // Get one GroupSession
     * const groupSession = await prisma.groupSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroupSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, GroupSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroupSessionClient<$Result.GetResult<Prisma.$GroupSessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GroupSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GroupSessions
     * const groupSessions = await prisma.groupSession.findMany()
     * 
     * // Get first 10 GroupSessions
     * const groupSessions = await prisma.groupSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groupSessionWithIdOnly = await prisma.groupSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroupSessionFindManyArgs>(args?: SelectSubset<T, GroupSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupSessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GroupSession.
     * @param {GroupSessionCreateArgs} args - Arguments to create a GroupSession.
     * @example
     * // Create one GroupSession
     * const GroupSession = await prisma.groupSession.create({
     *   data: {
     *     // ... data to create a GroupSession
     *   }
     * })
     * 
     */
    create<T extends GroupSessionCreateArgs>(args: SelectSubset<T, GroupSessionCreateArgs<ExtArgs>>): Prisma__GroupSessionClient<$Result.GetResult<Prisma.$GroupSessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GroupSessions.
     * @param {GroupSessionCreateManyArgs} args - Arguments to create many GroupSessions.
     * @example
     * // Create many GroupSessions
     * const groupSession = await prisma.groupSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroupSessionCreateManyArgs>(args?: SelectSubset<T, GroupSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GroupSessions and returns the data saved in the database.
     * @param {GroupSessionCreateManyAndReturnArgs} args - Arguments to create many GroupSessions.
     * @example
     * // Create many GroupSessions
     * const groupSession = await prisma.groupSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GroupSessions and only return the `id`
     * const groupSessionWithIdOnly = await prisma.groupSession.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroupSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, GroupSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupSessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GroupSession.
     * @param {GroupSessionDeleteArgs} args - Arguments to delete one GroupSession.
     * @example
     * // Delete one GroupSession
     * const GroupSession = await prisma.groupSession.delete({
     *   where: {
     *     // ... filter to delete one GroupSession
     *   }
     * })
     * 
     */
    delete<T extends GroupSessionDeleteArgs>(args: SelectSubset<T, GroupSessionDeleteArgs<ExtArgs>>): Prisma__GroupSessionClient<$Result.GetResult<Prisma.$GroupSessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GroupSession.
     * @param {GroupSessionUpdateArgs} args - Arguments to update one GroupSession.
     * @example
     * // Update one GroupSession
     * const groupSession = await prisma.groupSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroupSessionUpdateArgs>(args: SelectSubset<T, GroupSessionUpdateArgs<ExtArgs>>): Prisma__GroupSessionClient<$Result.GetResult<Prisma.$GroupSessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GroupSessions.
     * @param {GroupSessionDeleteManyArgs} args - Arguments to filter GroupSessions to delete.
     * @example
     * // Delete a few GroupSessions
     * const { count } = await prisma.groupSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroupSessionDeleteManyArgs>(args?: SelectSubset<T, GroupSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroupSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GroupSessions
     * const groupSession = await prisma.groupSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroupSessionUpdateManyArgs>(args: SelectSubset<T, GroupSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GroupSession.
     * @param {GroupSessionUpsertArgs} args - Arguments to update or create a GroupSession.
     * @example
     * // Update or create a GroupSession
     * const groupSession = await prisma.groupSession.upsert({
     *   create: {
     *     // ... data to create a GroupSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GroupSession we want to update
     *   }
     * })
     */
    upsert<T extends GroupSessionUpsertArgs>(args: SelectSubset<T, GroupSessionUpsertArgs<ExtArgs>>): Prisma__GroupSessionClient<$Result.GetResult<Prisma.$GroupSessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GroupSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionCountArgs} args - Arguments to filter GroupSessions to count.
     * @example
     * // Count the number of GroupSessions
     * const count = await prisma.groupSession.count({
     *   where: {
     *     // ... the filter for the GroupSessions we want to count
     *   }
     * })
    **/
    count<T extends GroupSessionCountArgs>(
      args?: Subset<T, GroupSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroupSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GroupSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GroupSessionAggregateArgs>(args: Subset<T, GroupSessionAggregateArgs>): Prisma.PrismaPromise<GetGroupSessionAggregateType<T>>

    /**
     * Group by GroupSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionGroupByArgs} args - Group by arguments.
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
      T extends GroupSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroupSessionGroupByArgs['orderBy'] }
        : { orderBy?: GroupSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GroupSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroupSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GroupSession model
   */
  readonly fields: GroupSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GroupSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroupSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    attendees<T extends GroupSession$attendeesArgs<ExtArgs> = {}>(args?: Subset<T, GroupSession$attendeesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupSessionAttendeePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the GroupSession model
   */ 
  interface GroupSessionFieldRefs {
    readonly id: FieldRef<"GroupSession", 'String'>
    readonly name: FieldRef<"GroupSession", 'String'>
    readonly medicationName: FieldRef<"GroupSession", 'String'>
    readonly description: FieldRef<"GroupSession", 'String'>
    readonly facilitatorId: FieldRef<"GroupSession", 'String'>
    readonly sessionType: FieldRef<"GroupSession", 'GroupSessionType'>
    readonly status: FieldRef<"GroupSession", 'GroupSessionStatus'>
    readonly scheduledAt: FieldRef<"GroupSession", 'DateTime'>
    readonly sessionDate: FieldRef<"GroupSession", 'DateTime'>
    readonly duration: FieldRef<"GroupSession", 'Int'>
    readonly modality: FieldRef<"GroupSession", 'String'>
    readonly maxParticipants: FieldRef<"GroupSession", 'Int'>
    readonly topic: FieldRef<"GroupSession", 'String'>
    readonly notes: FieldRef<"GroupSession", 'String'>
    readonly homework: FieldRef<"GroupSession", 'String'>
    readonly nextSessionDate: FieldRef<"GroupSession", 'DateTime'>
    readonly actualStartTime: FieldRef<"GroupSession", 'DateTime'>
    readonly actualEndTime: FieldRef<"GroupSession", 'DateTime'>
    readonly objectives: FieldRef<"GroupSession", 'String[]'>
    readonly materials: FieldRef<"GroupSession", 'Json'>
    readonly groupId: FieldRef<"GroupSession", 'String'>
    readonly createdAt: FieldRef<"GroupSession", 'DateTime'>
    readonly updatedAt: FieldRef<"GroupSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GroupSession findUnique
   */
  export type GroupSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSession
     */
    select?: GroupSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionInclude<ExtArgs> | null
    /**
     * Filter, which GroupSession to fetch.
     */
    where: GroupSessionWhereUniqueInput
  }

  /**
   * GroupSession findUniqueOrThrow
   */
  export type GroupSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSession
     */
    select?: GroupSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionInclude<ExtArgs> | null
    /**
     * Filter, which GroupSession to fetch.
     */
    where: GroupSessionWhereUniqueInput
  }

  /**
   * GroupSession findFirst
   */
  export type GroupSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSession
     */
    select?: GroupSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionInclude<ExtArgs> | null
    /**
     * Filter, which GroupSession to fetch.
     */
    where?: GroupSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupSessions to fetch.
     */
    orderBy?: GroupSessionOrderByWithRelationInput | GroupSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupSessions.
     */
    cursor?: GroupSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupSessions.
     */
    distinct?: GroupSessionScalarFieldEnum | GroupSessionScalarFieldEnum[]
  }

  /**
   * GroupSession findFirstOrThrow
   */
  export type GroupSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSession
     */
    select?: GroupSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionInclude<ExtArgs> | null
    /**
     * Filter, which GroupSession to fetch.
     */
    where?: GroupSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupSessions to fetch.
     */
    orderBy?: GroupSessionOrderByWithRelationInput | GroupSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupSessions.
     */
    cursor?: GroupSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupSessions.
     */
    distinct?: GroupSessionScalarFieldEnum | GroupSessionScalarFieldEnum[]
  }

  /**
   * GroupSession findMany
   */
  export type GroupSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSession
     */
    select?: GroupSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionInclude<ExtArgs> | null
    /**
     * Filter, which GroupSessions to fetch.
     */
    where?: GroupSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupSessions to fetch.
     */
    orderBy?: GroupSessionOrderByWithRelationInput | GroupSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GroupSessions.
     */
    cursor?: GroupSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupSessions.
     */
    skip?: number
    distinct?: GroupSessionScalarFieldEnum | GroupSessionScalarFieldEnum[]
  }

  /**
   * GroupSession create
   */
  export type GroupSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSession
     */
    select?: GroupSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a GroupSession.
     */
    data: XOR<GroupSessionCreateInput, GroupSessionUncheckedCreateInput>
  }

  /**
   * GroupSession createMany
   */
  export type GroupSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GroupSessions.
     */
    data: GroupSessionCreateManyInput | GroupSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroupSession createManyAndReturn
   */
  export type GroupSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSession
     */
    select?: GroupSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GroupSessions.
     */
    data: GroupSessionCreateManyInput | GroupSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroupSession update
   */
  export type GroupSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSession
     */
    select?: GroupSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a GroupSession.
     */
    data: XOR<GroupSessionUpdateInput, GroupSessionUncheckedUpdateInput>
    /**
     * Choose, which GroupSession to update.
     */
    where: GroupSessionWhereUniqueInput
  }

  /**
   * GroupSession updateMany
   */
  export type GroupSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GroupSessions.
     */
    data: XOR<GroupSessionUpdateManyMutationInput, GroupSessionUncheckedUpdateManyInput>
    /**
     * Filter which GroupSessions to update
     */
    where?: GroupSessionWhereInput
  }

  /**
   * GroupSession upsert
   */
  export type GroupSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSession
     */
    select?: GroupSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the GroupSession to update in case it exists.
     */
    where: GroupSessionWhereUniqueInput
    /**
     * In case the GroupSession found by the `where` argument doesn't exist, create a new GroupSession with this data.
     */
    create: XOR<GroupSessionCreateInput, GroupSessionUncheckedCreateInput>
    /**
     * In case the GroupSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroupSessionUpdateInput, GroupSessionUncheckedUpdateInput>
  }

  /**
   * GroupSession delete
   */
  export type GroupSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSession
     */
    select?: GroupSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionInclude<ExtArgs> | null
    /**
     * Filter which GroupSession to delete.
     */
    where: GroupSessionWhereUniqueInput
  }

  /**
   * GroupSession deleteMany
   */
  export type GroupSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupSessions to delete
     */
    where?: GroupSessionWhereInput
  }

  /**
   * GroupSession.attendees
   */
  export type GroupSession$attendeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionAttendee
     */
    select?: GroupSessionAttendeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionAttendeeInclude<ExtArgs> | null
    where?: GroupSessionAttendeeWhereInput
    orderBy?: GroupSessionAttendeeOrderByWithRelationInput | GroupSessionAttendeeOrderByWithRelationInput[]
    cursor?: GroupSessionAttendeeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GroupSessionAttendeeScalarFieldEnum | GroupSessionAttendeeScalarFieldEnum[]
  }

  /**
   * GroupSession without action
   */
  export type GroupSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSession
     */
    select?: GroupSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionInclude<ExtArgs> | null
  }


  /**
   * Model GroupSessionAttendee
   */

  export type AggregateGroupSessionAttendee = {
    _count: GroupSessionAttendeeCountAggregateOutputType | null
    _min: GroupSessionAttendeeMinAggregateOutputType | null
    _max: GroupSessionAttendeeMaxAggregateOutputType | null
  }

  export type GroupSessionAttendeeMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    patientId: string | null
    attended: boolean | null
    notes: string | null
    participation: string | null
    createdAt: Date | null
  }

  export type GroupSessionAttendeeMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    patientId: string | null
    attended: boolean | null
    notes: string | null
    participation: string | null
    createdAt: Date | null
  }

  export type GroupSessionAttendeeCountAggregateOutputType = {
    id: number
    sessionId: number
    patientId: number
    attended: number
    notes: number
    participation: number
    createdAt: number
    _all: number
  }


  export type GroupSessionAttendeeMinAggregateInputType = {
    id?: true
    sessionId?: true
    patientId?: true
    attended?: true
    notes?: true
    participation?: true
    createdAt?: true
  }

  export type GroupSessionAttendeeMaxAggregateInputType = {
    id?: true
    sessionId?: true
    patientId?: true
    attended?: true
    notes?: true
    participation?: true
    createdAt?: true
  }

  export type GroupSessionAttendeeCountAggregateInputType = {
    id?: true
    sessionId?: true
    patientId?: true
    attended?: true
    notes?: true
    participation?: true
    createdAt?: true
    _all?: true
  }

  export type GroupSessionAttendeeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupSessionAttendee to aggregate.
     */
    where?: GroupSessionAttendeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupSessionAttendees to fetch.
     */
    orderBy?: GroupSessionAttendeeOrderByWithRelationInput | GroupSessionAttendeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroupSessionAttendeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupSessionAttendees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupSessionAttendees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GroupSessionAttendees
    **/
    _count?: true | GroupSessionAttendeeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroupSessionAttendeeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroupSessionAttendeeMaxAggregateInputType
  }

  export type GetGroupSessionAttendeeAggregateType<T extends GroupSessionAttendeeAggregateArgs> = {
        [P in keyof T & keyof AggregateGroupSessionAttendee]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroupSessionAttendee[P]>
      : GetScalarType<T[P], AggregateGroupSessionAttendee[P]>
  }




  export type GroupSessionAttendeeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroupSessionAttendeeWhereInput
    orderBy?: GroupSessionAttendeeOrderByWithAggregationInput | GroupSessionAttendeeOrderByWithAggregationInput[]
    by: GroupSessionAttendeeScalarFieldEnum[] | GroupSessionAttendeeScalarFieldEnum
    having?: GroupSessionAttendeeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroupSessionAttendeeCountAggregateInputType | true
    _min?: GroupSessionAttendeeMinAggregateInputType
    _max?: GroupSessionAttendeeMaxAggregateInputType
  }

  export type GroupSessionAttendeeGroupByOutputType = {
    id: string
    sessionId: string
    patientId: string
    attended: boolean
    notes: string | null
    participation: string | null
    createdAt: Date
    _count: GroupSessionAttendeeCountAggregateOutputType | null
    _min: GroupSessionAttendeeMinAggregateOutputType | null
    _max: GroupSessionAttendeeMaxAggregateOutputType | null
  }

  type GetGroupSessionAttendeeGroupByPayload<T extends GroupSessionAttendeeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroupSessionAttendeeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroupSessionAttendeeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroupSessionAttendeeGroupByOutputType[P]>
            : GetScalarType<T[P], GroupSessionAttendeeGroupByOutputType[P]>
        }
      >
    >


  export type GroupSessionAttendeeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    patientId?: boolean
    attended?: boolean
    notes?: boolean
    participation?: boolean
    createdAt?: boolean
    session?: boolean | GroupSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupSessionAttendee"]>

  export type GroupSessionAttendeeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    patientId?: boolean
    attended?: boolean
    notes?: boolean
    participation?: boolean
    createdAt?: boolean
    session?: boolean | GroupSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupSessionAttendee"]>

  export type GroupSessionAttendeeSelectScalar = {
    id?: boolean
    sessionId?: boolean
    patientId?: boolean
    attended?: boolean
    notes?: boolean
    participation?: boolean
    createdAt?: boolean
  }

  export type GroupSessionAttendeeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | GroupSessionDefaultArgs<ExtArgs>
  }
  export type GroupSessionAttendeeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | GroupSessionDefaultArgs<ExtArgs>
  }

  export type $GroupSessionAttendeePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GroupSessionAttendee"
    objects: {
      session: Prisma.$GroupSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      patientId: string
      attended: boolean
      notes: string | null
      participation: string | null
      createdAt: Date
    }, ExtArgs["result"]["groupSessionAttendee"]>
    composites: {}
  }

  type GroupSessionAttendeeGetPayload<S extends boolean | null | undefined | GroupSessionAttendeeDefaultArgs> = $Result.GetResult<Prisma.$GroupSessionAttendeePayload, S>

  type GroupSessionAttendeeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GroupSessionAttendeeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GroupSessionAttendeeCountAggregateInputType | true
    }

  export interface GroupSessionAttendeeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GroupSessionAttendee'], meta: { name: 'GroupSessionAttendee' } }
    /**
     * Find zero or one GroupSessionAttendee that matches the filter.
     * @param {GroupSessionAttendeeFindUniqueArgs} args - Arguments to find a GroupSessionAttendee
     * @example
     * // Get one GroupSessionAttendee
     * const groupSessionAttendee = await prisma.groupSessionAttendee.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroupSessionAttendeeFindUniqueArgs>(args: SelectSubset<T, GroupSessionAttendeeFindUniqueArgs<ExtArgs>>): Prisma__GroupSessionAttendeeClient<$Result.GetResult<Prisma.$GroupSessionAttendeePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GroupSessionAttendee that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GroupSessionAttendeeFindUniqueOrThrowArgs} args - Arguments to find a GroupSessionAttendee
     * @example
     * // Get one GroupSessionAttendee
     * const groupSessionAttendee = await prisma.groupSessionAttendee.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroupSessionAttendeeFindUniqueOrThrowArgs>(args: SelectSubset<T, GroupSessionAttendeeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroupSessionAttendeeClient<$Result.GetResult<Prisma.$GroupSessionAttendeePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GroupSessionAttendee that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionAttendeeFindFirstArgs} args - Arguments to find a GroupSessionAttendee
     * @example
     * // Get one GroupSessionAttendee
     * const groupSessionAttendee = await prisma.groupSessionAttendee.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroupSessionAttendeeFindFirstArgs>(args?: SelectSubset<T, GroupSessionAttendeeFindFirstArgs<ExtArgs>>): Prisma__GroupSessionAttendeeClient<$Result.GetResult<Prisma.$GroupSessionAttendeePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GroupSessionAttendee that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionAttendeeFindFirstOrThrowArgs} args - Arguments to find a GroupSessionAttendee
     * @example
     * // Get one GroupSessionAttendee
     * const groupSessionAttendee = await prisma.groupSessionAttendee.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroupSessionAttendeeFindFirstOrThrowArgs>(args?: SelectSubset<T, GroupSessionAttendeeFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroupSessionAttendeeClient<$Result.GetResult<Prisma.$GroupSessionAttendeePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GroupSessionAttendees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionAttendeeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GroupSessionAttendees
     * const groupSessionAttendees = await prisma.groupSessionAttendee.findMany()
     * 
     * // Get first 10 GroupSessionAttendees
     * const groupSessionAttendees = await prisma.groupSessionAttendee.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groupSessionAttendeeWithIdOnly = await prisma.groupSessionAttendee.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroupSessionAttendeeFindManyArgs>(args?: SelectSubset<T, GroupSessionAttendeeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupSessionAttendeePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GroupSessionAttendee.
     * @param {GroupSessionAttendeeCreateArgs} args - Arguments to create a GroupSessionAttendee.
     * @example
     * // Create one GroupSessionAttendee
     * const GroupSessionAttendee = await prisma.groupSessionAttendee.create({
     *   data: {
     *     // ... data to create a GroupSessionAttendee
     *   }
     * })
     * 
     */
    create<T extends GroupSessionAttendeeCreateArgs>(args: SelectSubset<T, GroupSessionAttendeeCreateArgs<ExtArgs>>): Prisma__GroupSessionAttendeeClient<$Result.GetResult<Prisma.$GroupSessionAttendeePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GroupSessionAttendees.
     * @param {GroupSessionAttendeeCreateManyArgs} args - Arguments to create many GroupSessionAttendees.
     * @example
     * // Create many GroupSessionAttendees
     * const groupSessionAttendee = await prisma.groupSessionAttendee.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroupSessionAttendeeCreateManyArgs>(args?: SelectSubset<T, GroupSessionAttendeeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GroupSessionAttendees and returns the data saved in the database.
     * @param {GroupSessionAttendeeCreateManyAndReturnArgs} args - Arguments to create many GroupSessionAttendees.
     * @example
     * // Create many GroupSessionAttendees
     * const groupSessionAttendee = await prisma.groupSessionAttendee.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GroupSessionAttendees and only return the `id`
     * const groupSessionAttendeeWithIdOnly = await prisma.groupSessionAttendee.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroupSessionAttendeeCreateManyAndReturnArgs>(args?: SelectSubset<T, GroupSessionAttendeeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupSessionAttendeePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GroupSessionAttendee.
     * @param {GroupSessionAttendeeDeleteArgs} args - Arguments to delete one GroupSessionAttendee.
     * @example
     * // Delete one GroupSessionAttendee
     * const GroupSessionAttendee = await prisma.groupSessionAttendee.delete({
     *   where: {
     *     // ... filter to delete one GroupSessionAttendee
     *   }
     * })
     * 
     */
    delete<T extends GroupSessionAttendeeDeleteArgs>(args: SelectSubset<T, GroupSessionAttendeeDeleteArgs<ExtArgs>>): Prisma__GroupSessionAttendeeClient<$Result.GetResult<Prisma.$GroupSessionAttendeePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GroupSessionAttendee.
     * @param {GroupSessionAttendeeUpdateArgs} args - Arguments to update one GroupSessionAttendee.
     * @example
     * // Update one GroupSessionAttendee
     * const groupSessionAttendee = await prisma.groupSessionAttendee.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroupSessionAttendeeUpdateArgs>(args: SelectSubset<T, GroupSessionAttendeeUpdateArgs<ExtArgs>>): Prisma__GroupSessionAttendeeClient<$Result.GetResult<Prisma.$GroupSessionAttendeePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GroupSessionAttendees.
     * @param {GroupSessionAttendeeDeleteManyArgs} args - Arguments to filter GroupSessionAttendees to delete.
     * @example
     * // Delete a few GroupSessionAttendees
     * const { count } = await prisma.groupSessionAttendee.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroupSessionAttendeeDeleteManyArgs>(args?: SelectSubset<T, GroupSessionAttendeeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroupSessionAttendees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionAttendeeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GroupSessionAttendees
     * const groupSessionAttendee = await prisma.groupSessionAttendee.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroupSessionAttendeeUpdateManyArgs>(args: SelectSubset<T, GroupSessionAttendeeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GroupSessionAttendee.
     * @param {GroupSessionAttendeeUpsertArgs} args - Arguments to update or create a GroupSessionAttendee.
     * @example
     * // Update or create a GroupSessionAttendee
     * const groupSessionAttendee = await prisma.groupSessionAttendee.upsert({
     *   create: {
     *     // ... data to create a GroupSessionAttendee
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GroupSessionAttendee we want to update
     *   }
     * })
     */
    upsert<T extends GroupSessionAttendeeUpsertArgs>(args: SelectSubset<T, GroupSessionAttendeeUpsertArgs<ExtArgs>>): Prisma__GroupSessionAttendeeClient<$Result.GetResult<Prisma.$GroupSessionAttendeePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GroupSessionAttendees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionAttendeeCountArgs} args - Arguments to filter GroupSessionAttendees to count.
     * @example
     * // Count the number of GroupSessionAttendees
     * const count = await prisma.groupSessionAttendee.count({
     *   where: {
     *     // ... the filter for the GroupSessionAttendees we want to count
     *   }
     * })
    **/
    count<T extends GroupSessionAttendeeCountArgs>(
      args?: Subset<T, GroupSessionAttendeeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroupSessionAttendeeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GroupSessionAttendee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionAttendeeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GroupSessionAttendeeAggregateArgs>(args: Subset<T, GroupSessionAttendeeAggregateArgs>): Prisma.PrismaPromise<GetGroupSessionAttendeeAggregateType<T>>

    /**
     * Group by GroupSessionAttendee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionAttendeeGroupByArgs} args - Group by arguments.
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
      T extends GroupSessionAttendeeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroupSessionAttendeeGroupByArgs['orderBy'] }
        : { orderBy?: GroupSessionAttendeeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GroupSessionAttendeeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroupSessionAttendeeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GroupSessionAttendee model
   */
  readonly fields: GroupSessionAttendeeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GroupSessionAttendee.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroupSessionAttendeeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends GroupSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GroupSessionDefaultArgs<ExtArgs>>): Prisma__GroupSessionClient<$Result.GetResult<Prisma.$GroupSessionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the GroupSessionAttendee model
   */ 
  interface GroupSessionAttendeeFieldRefs {
    readonly id: FieldRef<"GroupSessionAttendee", 'String'>
    readonly sessionId: FieldRef<"GroupSessionAttendee", 'String'>
    readonly patientId: FieldRef<"GroupSessionAttendee", 'String'>
    readonly attended: FieldRef<"GroupSessionAttendee", 'Boolean'>
    readonly notes: FieldRef<"GroupSessionAttendee", 'String'>
    readonly participation: FieldRef<"GroupSessionAttendee", 'String'>
    readonly createdAt: FieldRef<"GroupSessionAttendee", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GroupSessionAttendee findUnique
   */
  export type GroupSessionAttendeeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionAttendee
     */
    select?: GroupSessionAttendeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionAttendeeInclude<ExtArgs> | null
    /**
     * Filter, which GroupSessionAttendee to fetch.
     */
    where: GroupSessionAttendeeWhereUniqueInput
  }

  /**
   * GroupSessionAttendee findUniqueOrThrow
   */
  export type GroupSessionAttendeeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionAttendee
     */
    select?: GroupSessionAttendeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionAttendeeInclude<ExtArgs> | null
    /**
     * Filter, which GroupSessionAttendee to fetch.
     */
    where: GroupSessionAttendeeWhereUniqueInput
  }

  /**
   * GroupSessionAttendee findFirst
   */
  export type GroupSessionAttendeeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionAttendee
     */
    select?: GroupSessionAttendeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionAttendeeInclude<ExtArgs> | null
    /**
     * Filter, which GroupSessionAttendee to fetch.
     */
    where?: GroupSessionAttendeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupSessionAttendees to fetch.
     */
    orderBy?: GroupSessionAttendeeOrderByWithRelationInput | GroupSessionAttendeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupSessionAttendees.
     */
    cursor?: GroupSessionAttendeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupSessionAttendees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupSessionAttendees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupSessionAttendees.
     */
    distinct?: GroupSessionAttendeeScalarFieldEnum | GroupSessionAttendeeScalarFieldEnum[]
  }

  /**
   * GroupSessionAttendee findFirstOrThrow
   */
  export type GroupSessionAttendeeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionAttendee
     */
    select?: GroupSessionAttendeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionAttendeeInclude<ExtArgs> | null
    /**
     * Filter, which GroupSessionAttendee to fetch.
     */
    where?: GroupSessionAttendeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupSessionAttendees to fetch.
     */
    orderBy?: GroupSessionAttendeeOrderByWithRelationInput | GroupSessionAttendeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupSessionAttendees.
     */
    cursor?: GroupSessionAttendeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupSessionAttendees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupSessionAttendees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupSessionAttendees.
     */
    distinct?: GroupSessionAttendeeScalarFieldEnum | GroupSessionAttendeeScalarFieldEnum[]
  }

  /**
   * GroupSessionAttendee findMany
   */
  export type GroupSessionAttendeeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionAttendee
     */
    select?: GroupSessionAttendeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionAttendeeInclude<ExtArgs> | null
    /**
     * Filter, which GroupSessionAttendees to fetch.
     */
    where?: GroupSessionAttendeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupSessionAttendees to fetch.
     */
    orderBy?: GroupSessionAttendeeOrderByWithRelationInput | GroupSessionAttendeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GroupSessionAttendees.
     */
    cursor?: GroupSessionAttendeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupSessionAttendees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupSessionAttendees.
     */
    skip?: number
    distinct?: GroupSessionAttendeeScalarFieldEnum | GroupSessionAttendeeScalarFieldEnum[]
  }

  /**
   * GroupSessionAttendee create
   */
  export type GroupSessionAttendeeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionAttendee
     */
    select?: GroupSessionAttendeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionAttendeeInclude<ExtArgs> | null
    /**
     * The data needed to create a GroupSessionAttendee.
     */
    data: XOR<GroupSessionAttendeeCreateInput, GroupSessionAttendeeUncheckedCreateInput>
  }

  /**
   * GroupSessionAttendee createMany
   */
  export type GroupSessionAttendeeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GroupSessionAttendees.
     */
    data: GroupSessionAttendeeCreateManyInput | GroupSessionAttendeeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroupSessionAttendee createManyAndReturn
   */
  export type GroupSessionAttendeeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionAttendee
     */
    select?: GroupSessionAttendeeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GroupSessionAttendees.
     */
    data: GroupSessionAttendeeCreateManyInput | GroupSessionAttendeeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionAttendeeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GroupSessionAttendee update
   */
  export type GroupSessionAttendeeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionAttendee
     */
    select?: GroupSessionAttendeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionAttendeeInclude<ExtArgs> | null
    /**
     * The data needed to update a GroupSessionAttendee.
     */
    data: XOR<GroupSessionAttendeeUpdateInput, GroupSessionAttendeeUncheckedUpdateInput>
    /**
     * Choose, which GroupSessionAttendee to update.
     */
    where: GroupSessionAttendeeWhereUniqueInput
  }

  /**
   * GroupSessionAttendee updateMany
   */
  export type GroupSessionAttendeeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GroupSessionAttendees.
     */
    data: XOR<GroupSessionAttendeeUpdateManyMutationInput, GroupSessionAttendeeUncheckedUpdateManyInput>
    /**
     * Filter which GroupSessionAttendees to update
     */
    where?: GroupSessionAttendeeWhereInput
  }

  /**
   * GroupSessionAttendee upsert
   */
  export type GroupSessionAttendeeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionAttendee
     */
    select?: GroupSessionAttendeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionAttendeeInclude<ExtArgs> | null
    /**
     * The filter to search for the GroupSessionAttendee to update in case it exists.
     */
    where: GroupSessionAttendeeWhereUniqueInput
    /**
     * In case the GroupSessionAttendee found by the `where` argument doesn't exist, create a new GroupSessionAttendee with this data.
     */
    create: XOR<GroupSessionAttendeeCreateInput, GroupSessionAttendeeUncheckedCreateInput>
    /**
     * In case the GroupSessionAttendee was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroupSessionAttendeeUpdateInput, GroupSessionAttendeeUncheckedUpdateInput>
  }

  /**
   * GroupSessionAttendee delete
   */
  export type GroupSessionAttendeeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionAttendee
     */
    select?: GroupSessionAttendeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionAttendeeInclude<ExtArgs> | null
    /**
     * Filter which GroupSessionAttendee to delete.
     */
    where: GroupSessionAttendeeWhereUniqueInput
  }

  /**
   * GroupSessionAttendee deleteMany
   */
  export type GroupSessionAttendeeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupSessionAttendees to delete
     */
    where?: GroupSessionAttendeeWhereInput
  }

  /**
   * GroupSessionAttendee without action
   */
  export type GroupSessionAttendeeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionAttendee
     */
    select?: GroupSessionAttendeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionAttendeeInclude<ExtArgs> | null
  }


  /**
   * Model PsychMedication
   */

  export type AggregatePsychMedication = {
    _count: PsychMedicationCountAggregateOutputType | null
    _min: PsychMedicationMinAggregateOutputType | null
    _max: PsychMedicationMaxAggregateOutputType | null
  }

  export type PsychMedicationMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    prescriberId: string | null
    name: string | null
    medicationName: string | null
    dosage: string | null
    frequency: string | null
    medicationClass: $Enums.MedicationClass | null
    status: $Enums.MedicationStatus | null
    startDate: Date | null
    endDate: Date | null
    reason: string | null
    notes: string | null
    homework: string | null
    nextSessionDate: Date | null
    actualStartTime: Date | null
    actualEndTime: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PsychMedicationMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    prescriberId: string | null
    name: string | null
    medicationName: string | null
    dosage: string | null
    frequency: string | null
    medicationClass: $Enums.MedicationClass | null
    status: $Enums.MedicationStatus | null
    startDate: Date | null
    endDate: Date | null
    reason: string | null
    notes: string | null
    homework: string | null
    nextSessionDate: Date | null
    actualStartTime: Date | null
    actualEndTime: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PsychMedicationCountAggregateOutputType = {
    id: number
    patientId: number
    prescriberId: number
    name: number
    medicationName: number
    dosage: number
    frequency: number
    medicationClass: number
    status: number
    startDate: number
    endDate: number
    reason: number
    sideEffects: number
    interactions: number
    notes: number
    homework: number
    nextSessionDate: number
    actualStartTime: number
    actualEndTime: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PsychMedicationMinAggregateInputType = {
    id?: true
    patientId?: true
    prescriberId?: true
    name?: true
    medicationName?: true
    dosage?: true
    frequency?: true
    medicationClass?: true
    status?: true
    startDate?: true
    endDate?: true
    reason?: true
    notes?: true
    homework?: true
    nextSessionDate?: true
    actualStartTime?: true
    actualEndTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PsychMedicationMaxAggregateInputType = {
    id?: true
    patientId?: true
    prescriberId?: true
    name?: true
    medicationName?: true
    dosage?: true
    frequency?: true
    medicationClass?: true
    status?: true
    startDate?: true
    endDate?: true
    reason?: true
    notes?: true
    homework?: true
    nextSessionDate?: true
    actualStartTime?: true
    actualEndTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PsychMedicationCountAggregateInputType = {
    id?: true
    patientId?: true
    prescriberId?: true
    name?: true
    medicationName?: true
    dosage?: true
    frequency?: true
    medicationClass?: true
    status?: true
    startDate?: true
    endDate?: true
    reason?: true
    sideEffects?: true
    interactions?: true
    notes?: true
    homework?: true
    nextSessionDate?: true
    actualStartTime?: true
    actualEndTime?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PsychMedicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PsychMedication to aggregate.
     */
    where?: PsychMedicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PsychMedications to fetch.
     */
    orderBy?: PsychMedicationOrderByWithRelationInput | PsychMedicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PsychMedicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PsychMedications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PsychMedications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PsychMedications
    **/
    _count?: true | PsychMedicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PsychMedicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PsychMedicationMaxAggregateInputType
  }

  export type GetPsychMedicationAggregateType<T extends PsychMedicationAggregateArgs> = {
        [P in keyof T & keyof AggregatePsychMedication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePsychMedication[P]>
      : GetScalarType<T[P], AggregatePsychMedication[P]>
  }




  export type PsychMedicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PsychMedicationWhereInput
    orderBy?: PsychMedicationOrderByWithAggregationInput | PsychMedicationOrderByWithAggregationInput[]
    by: PsychMedicationScalarFieldEnum[] | PsychMedicationScalarFieldEnum
    having?: PsychMedicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PsychMedicationCountAggregateInputType | true
    _min?: PsychMedicationMinAggregateInputType
    _max?: PsychMedicationMaxAggregateInputType
  }

  export type PsychMedicationGroupByOutputType = {
    id: string
    patientId: string
    prescriberId: string
    name: string
    medicationName: string | null
    dosage: string
    frequency: string
    medicationClass: $Enums.MedicationClass
    status: $Enums.MedicationStatus
    startDate: Date
    endDate: Date | null
    reason: string | null
    sideEffects: string[]
    interactions: string[]
    notes: string | null
    homework: string | null
    nextSessionDate: Date | null
    actualStartTime: Date | null
    actualEndTime: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PsychMedicationCountAggregateOutputType | null
    _min: PsychMedicationMinAggregateOutputType | null
    _max: PsychMedicationMaxAggregateOutputType | null
  }

  type GetPsychMedicationGroupByPayload<T extends PsychMedicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PsychMedicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PsychMedicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PsychMedicationGroupByOutputType[P]>
            : GetScalarType<T[P], PsychMedicationGroupByOutputType[P]>
        }
      >
    >


  export type PsychMedicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    prescriberId?: boolean
    name?: boolean
    medicationName?: boolean
    dosage?: boolean
    frequency?: boolean
    medicationClass?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    reason?: boolean
    sideEffects?: boolean
    interactions?: boolean
    notes?: boolean
    homework?: boolean
    nextSessionDate?: boolean
    actualStartTime?: boolean
    actualEndTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["psychMedication"]>

  export type PsychMedicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    prescriberId?: boolean
    name?: boolean
    medicationName?: boolean
    dosage?: boolean
    frequency?: boolean
    medicationClass?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    reason?: boolean
    sideEffects?: boolean
    interactions?: boolean
    notes?: boolean
    homework?: boolean
    nextSessionDate?: boolean
    actualStartTime?: boolean
    actualEndTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["psychMedication"]>

  export type PsychMedicationSelectScalar = {
    id?: boolean
    patientId?: boolean
    prescriberId?: boolean
    name?: boolean
    medicationName?: boolean
    dosage?: boolean
    frequency?: boolean
    medicationClass?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    reason?: boolean
    sideEffects?: boolean
    interactions?: boolean
    notes?: boolean
    homework?: boolean
    nextSessionDate?: boolean
    actualStartTime?: boolean
    actualEndTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $PsychMedicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PsychMedication"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      prescriberId: string
      name: string
      medicationName: string | null
      dosage: string
      frequency: string
      medicationClass: $Enums.MedicationClass
      status: $Enums.MedicationStatus
      startDate: Date
      endDate: Date | null
      reason: string | null
      sideEffects: string[]
      interactions: string[]
      notes: string | null
      homework: string | null
      nextSessionDate: Date | null
      actualStartTime: Date | null
      actualEndTime: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["psychMedication"]>
    composites: {}
  }

  type PsychMedicationGetPayload<S extends boolean | null | undefined | PsychMedicationDefaultArgs> = $Result.GetResult<Prisma.$PsychMedicationPayload, S>

  type PsychMedicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PsychMedicationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PsychMedicationCountAggregateInputType | true
    }

  export interface PsychMedicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PsychMedication'], meta: { name: 'PsychMedication' } }
    /**
     * Find zero or one PsychMedication that matches the filter.
     * @param {PsychMedicationFindUniqueArgs} args - Arguments to find a PsychMedication
     * @example
     * // Get one PsychMedication
     * const psychMedication = await prisma.psychMedication.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PsychMedicationFindUniqueArgs>(args: SelectSubset<T, PsychMedicationFindUniqueArgs<ExtArgs>>): Prisma__PsychMedicationClient<$Result.GetResult<Prisma.$PsychMedicationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PsychMedication that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PsychMedicationFindUniqueOrThrowArgs} args - Arguments to find a PsychMedication
     * @example
     * // Get one PsychMedication
     * const psychMedication = await prisma.psychMedication.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PsychMedicationFindUniqueOrThrowArgs>(args: SelectSubset<T, PsychMedicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PsychMedicationClient<$Result.GetResult<Prisma.$PsychMedicationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PsychMedication that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PsychMedicationFindFirstArgs} args - Arguments to find a PsychMedication
     * @example
     * // Get one PsychMedication
     * const psychMedication = await prisma.psychMedication.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PsychMedicationFindFirstArgs>(args?: SelectSubset<T, PsychMedicationFindFirstArgs<ExtArgs>>): Prisma__PsychMedicationClient<$Result.GetResult<Prisma.$PsychMedicationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PsychMedication that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PsychMedicationFindFirstOrThrowArgs} args - Arguments to find a PsychMedication
     * @example
     * // Get one PsychMedication
     * const psychMedication = await prisma.psychMedication.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PsychMedicationFindFirstOrThrowArgs>(args?: SelectSubset<T, PsychMedicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PsychMedicationClient<$Result.GetResult<Prisma.$PsychMedicationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PsychMedications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PsychMedicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PsychMedications
     * const psychMedications = await prisma.psychMedication.findMany()
     * 
     * // Get first 10 PsychMedications
     * const psychMedications = await prisma.psychMedication.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const psychMedicationWithIdOnly = await prisma.psychMedication.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PsychMedicationFindManyArgs>(args?: SelectSubset<T, PsychMedicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PsychMedicationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PsychMedication.
     * @param {PsychMedicationCreateArgs} args - Arguments to create a PsychMedication.
     * @example
     * // Create one PsychMedication
     * const PsychMedication = await prisma.psychMedication.create({
     *   data: {
     *     // ... data to create a PsychMedication
     *   }
     * })
     * 
     */
    create<T extends PsychMedicationCreateArgs>(args: SelectSubset<T, PsychMedicationCreateArgs<ExtArgs>>): Prisma__PsychMedicationClient<$Result.GetResult<Prisma.$PsychMedicationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PsychMedications.
     * @param {PsychMedicationCreateManyArgs} args - Arguments to create many PsychMedications.
     * @example
     * // Create many PsychMedications
     * const psychMedication = await prisma.psychMedication.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PsychMedicationCreateManyArgs>(args?: SelectSubset<T, PsychMedicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PsychMedications and returns the data saved in the database.
     * @param {PsychMedicationCreateManyAndReturnArgs} args - Arguments to create many PsychMedications.
     * @example
     * // Create many PsychMedications
     * const psychMedication = await prisma.psychMedication.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PsychMedications and only return the `id`
     * const psychMedicationWithIdOnly = await prisma.psychMedication.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PsychMedicationCreateManyAndReturnArgs>(args?: SelectSubset<T, PsychMedicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PsychMedicationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PsychMedication.
     * @param {PsychMedicationDeleteArgs} args - Arguments to delete one PsychMedication.
     * @example
     * // Delete one PsychMedication
     * const PsychMedication = await prisma.psychMedication.delete({
     *   where: {
     *     // ... filter to delete one PsychMedication
     *   }
     * })
     * 
     */
    delete<T extends PsychMedicationDeleteArgs>(args: SelectSubset<T, PsychMedicationDeleteArgs<ExtArgs>>): Prisma__PsychMedicationClient<$Result.GetResult<Prisma.$PsychMedicationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PsychMedication.
     * @param {PsychMedicationUpdateArgs} args - Arguments to update one PsychMedication.
     * @example
     * // Update one PsychMedication
     * const psychMedication = await prisma.psychMedication.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PsychMedicationUpdateArgs>(args: SelectSubset<T, PsychMedicationUpdateArgs<ExtArgs>>): Prisma__PsychMedicationClient<$Result.GetResult<Prisma.$PsychMedicationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PsychMedications.
     * @param {PsychMedicationDeleteManyArgs} args - Arguments to filter PsychMedications to delete.
     * @example
     * // Delete a few PsychMedications
     * const { count } = await prisma.psychMedication.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PsychMedicationDeleteManyArgs>(args?: SelectSubset<T, PsychMedicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PsychMedications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PsychMedicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PsychMedications
     * const psychMedication = await prisma.psychMedication.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PsychMedicationUpdateManyArgs>(args: SelectSubset<T, PsychMedicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PsychMedication.
     * @param {PsychMedicationUpsertArgs} args - Arguments to update or create a PsychMedication.
     * @example
     * // Update or create a PsychMedication
     * const psychMedication = await prisma.psychMedication.upsert({
     *   create: {
     *     // ... data to create a PsychMedication
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PsychMedication we want to update
     *   }
     * })
     */
    upsert<T extends PsychMedicationUpsertArgs>(args: SelectSubset<T, PsychMedicationUpsertArgs<ExtArgs>>): Prisma__PsychMedicationClient<$Result.GetResult<Prisma.$PsychMedicationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PsychMedications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PsychMedicationCountArgs} args - Arguments to filter PsychMedications to count.
     * @example
     * // Count the number of PsychMedications
     * const count = await prisma.psychMedication.count({
     *   where: {
     *     // ... the filter for the PsychMedications we want to count
     *   }
     * })
    **/
    count<T extends PsychMedicationCountArgs>(
      args?: Subset<T, PsychMedicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PsychMedicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PsychMedication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PsychMedicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PsychMedicationAggregateArgs>(args: Subset<T, PsychMedicationAggregateArgs>): Prisma.PrismaPromise<GetPsychMedicationAggregateType<T>>

    /**
     * Group by PsychMedication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PsychMedicationGroupByArgs} args - Group by arguments.
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
      T extends PsychMedicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PsychMedicationGroupByArgs['orderBy'] }
        : { orderBy?: PsychMedicationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PsychMedicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPsychMedicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PsychMedication model
   */
  readonly fields: PsychMedicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PsychMedication.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PsychMedicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the PsychMedication model
   */ 
  interface PsychMedicationFieldRefs {
    readonly id: FieldRef<"PsychMedication", 'String'>
    readonly patientId: FieldRef<"PsychMedication", 'String'>
    readonly prescriberId: FieldRef<"PsychMedication", 'String'>
    readonly name: FieldRef<"PsychMedication", 'String'>
    readonly medicationName: FieldRef<"PsychMedication", 'String'>
    readonly dosage: FieldRef<"PsychMedication", 'String'>
    readonly frequency: FieldRef<"PsychMedication", 'String'>
    readonly medicationClass: FieldRef<"PsychMedication", 'MedicationClass'>
    readonly status: FieldRef<"PsychMedication", 'MedicationStatus'>
    readonly startDate: FieldRef<"PsychMedication", 'DateTime'>
    readonly endDate: FieldRef<"PsychMedication", 'DateTime'>
    readonly reason: FieldRef<"PsychMedication", 'String'>
    readonly sideEffects: FieldRef<"PsychMedication", 'String[]'>
    readonly interactions: FieldRef<"PsychMedication", 'String[]'>
    readonly notes: FieldRef<"PsychMedication", 'String'>
    readonly homework: FieldRef<"PsychMedication", 'String'>
    readonly nextSessionDate: FieldRef<"PsychMedication", 'DateTime'>
    readonly actualStartTime: FieldRef<"PsychMedication", 'DateTime'>
    readonly actualEndTime: FieldRef<"PsychMedication", 'DateTime'>
    readonly createdAt: FieldRef<"PsychMedication", 'DateTime'>
    readonly updatedAt: FieldRef<"PsychMedication", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PsychMedication findUnique
   */
  export type PsychMedicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PsychMedication
     */
    select?: PsychMedicationSelect<ExtArgs> | null
    /**
     * Filter, which PsychMedication to fetch.
     */
    where: PsychMedicationWhereUniqueInput
  }

  /**
   * PsychMedication findUniqueOrThrow
   */
  export type PsychMedicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PsychMedication
     */
    select?: PsychMedicationSelect<ExtArgs> | null
    /**
     * Filter, which PsychMedication to fetch.
     */
    where: PsychMedicationWhereUniqueInput
  }

  /**
   * PsychMedication findFirst
   */
  export type PsychMedicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PsychMedication
     */
    select?: PsychMedicationSelect<ExtArgs> | null
    /**
     * Filter, which PsychMedication to fetch.
     */
    where?: PsychMedicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PsychMedications to fetch.
     */
    orderBy?: PsychMedicationOrderByWithRelationInput | PsychMedicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PsychMedications.
     */
    cursor?: PsychMedicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PsychMedications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PsychMedications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PsychMedications.
     */
    distinct?: PsychMedicationScalarFieldEnum | PsychMedicationScalarFieldEnum[]
  }

  /**
   * PsychMedication findFirstOrThrow
   */
  export type PsychMedicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PsychMedication
     */
    select?: PsychMedicationSelect<ExtArgs> | null
    /**
     * Filter, which PsychMedication to fetch.
     */
    where?: PsychMedicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PsychMedications to fetch.
     */
    orderBy?: PsychMedicationOrderByWithRelationInput | PsychMedicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PsychMedications.
     */
    cursor?: PsychMedicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PsychMedications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PsychMedications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PsychMedications.
     */
    distinct?: PsychMedicationScalarFieldEnum | PsychMedicationScalarFieldEnum[]
  }

  /**
   * PsychMedication findMany
   */
  export type PsychMedicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PsychMedication
     */
    select?: PsychMedicationSelect<ExtArgs> | null
    /**
     * Filter, which PsychMedications to fetch.
     */
    where?: PsychMedicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PsychMedications to fetch.
     */
    orderBy?: PsychMedicationOrderByWithRelationInput | PsychMedicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PsychMedications.
     */
    cursor?: PsychMedicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PsychMedications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PsychMedications.
     */
    skip?: number
    distinct?: PsychMedicationScalarFieldEnum | PsychMedicationScalarFieldEnum[]
  }

  /**
   * PsychMedication create
   */
  export type PsychMedicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PsychMedication
     */
    select?: PsychMedicationSelect<ExtArgs> | null
    /**
     * The data needed to create a PsychMedication.
     */
    data: XOR<PsychMedicationCreateInput, PsychMedicationUncheckedCreateInput>
  }

  /**
   * PsychMedication createMany
   */
  export type PsychMedicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PsychMedications.
     */
    data: PsychMedicationCreateManyInput | PsychMedicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PsychMedication createManyAndReturn
   */
  export type PsychMedicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PsychMedication
     */
    select?: PsychMedicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PsychMedications.
     */
    data: PsychMedicationCreateManyInput | PsychMedicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PsychMedication update
   */
  export type PsychMedicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PsychMedication
     */
    select?: PsychMedicationSelect<ExtArgs> | null
    /**
     * The data needed to update a PsychMedication.
     */
    data: XOR<PsychMedicationUpdateInput, PsychMedicationUncheckedUpdateInput>
    /**
     * Choose, which PsychMedication to update.
     */
    where: PsychMedicationWhereUniqueInput
  }

  /**
   * PsychMedication updateMany
   */
  export type PsychMedicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PsychMedications.
     */
    data: XOR<PsychMedicationUpdateManyMutationInput, PsychMedicationUncheckedUpdateManyInput>
    /**
     * Filter which PsychMedications to update
     */
    where?: PsychMedicationWhereInput
  }

  /**
   * PsychMedication upsert
   */
  export type PsychMedicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PsychMedication
     */
    select?: PsychMedicationSelect<ExtArgs> | null
    /**
     * The filter to search for the PsychMedication to update in case it exists.
     */
    where: PsychMedicationWhereUniqueInput
    /**
     * In case the PsychMedication found by the `where` argument doesn't exist, create a new PsychMedication with this data.
     */
    create: XOR<PsychMedicationCreateInput, PsychMedicationUncheckedCreateInput>
    /**
     * In case the PsychMedication was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PsychMedicationUpdateInput, PsychMedicationUncheckedUpdateInput>
  }

  /**
   * PsychMedication delete
   */
  export type PsychMedicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PsychMedication
     */
    select?: PsychMedicationSelect<ExtArgs> | null
    /**
     * Filter which PsychMedication to delete.
     */
    where: PsychMedicationWhereUniqueInput
  }

  /**
   * PsychMedication deleteMany
   */
  export type PsychMedicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PsychMedications to delete
     */
    where?: PsychMedicationWhereInput
  }

  /**
   * PsychMedication without action
   */
  export type PsychMedicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PsychMedication
     */
    select?: PsychMedicationSelect<ExtArgs> | null
  }


  /**
   * Model ProgressNote
   */

  export type AggregateProgressNote = {
    _count: ProgressNoteCountAggregateOutputType | null
    _min: ProgressNoteMinAggregateOutputType | null
    _max: ProgressNoteMaxAggregateOutputType | null
  }

  export type ProgressNoteMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    sessionId: string | null
    noteType: $Enums.NoteType | null
    content: string | null
    plan: string | null
    isSigned: boolean | null
    signedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgressNoteMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    sessionId: string | null
    noteType: $Enums.NoteType | null
    content: string | null
    plan: string | null
    isSigned: boolean | null
    signedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgressNoteCountAggregateOutputType = {
    id: number
    patientId: number
    providerId: number
    sessionId: number
    noteType: number
    content: number
    diagnosis: number
    interventions: number
    plan: number
    isSigned: number
    signedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProgressNoteMinAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    sessionId?: true
    noteType?: true
    content?: true
    plan?: true
    isSigned?: true
    signedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgressNoteMaxAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    sessionId?: true
    noteType?: true
    content?: true
    plan?: true
    isSigned?: true
    signedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgressNoteCountAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    sessionId?: true
    noteType?: true
    content?: true
    diagnosis?: true
    interventions?: true
    plan?: true
    isSigned?: true
    signedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProgressNoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProgressNote to aggregate.
     */
    where?: ProgressNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgressNotes to fetch.
     */
    orderBy?: ProgressNoteOrderByWithRelationInput | ProgressNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgressNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgressNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgressNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProgressNotes
    **/
    _count?: true | ProgressNoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgressNoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgressNoteMaxAggregateInputType
  }

  export type GetProgressNoteAggregateType<T extends ProgressNoteAggregateArgs> = {
        [P in keyof T & keyof AggregateProgressNote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProgressNote[P]>
      : GetScalarType<T[P], AggregateProgressNote[P]>
  }




  export type ProgressNoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgressNoteWhereInput
    orderBy?: ProgressNoteOrderByWithAggregationInput | ProgressNoteOrderByWithAggregationInput[]
    by: ProgressNoteScalarFieldEnum[] | ProgressNoteScalarFieldEnum
    having?: ProgressNoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgressNoteCountAggregateInputType | true
    _min?: ProgressNoteMinAggregateInputType
    _max?: ProgressNoteMaxAggregateInputType
  }

  export type ProgressNoteGroupByOutputType = {
    id: string
    patientId: string
    providerId: string
    sessionId: string | null
    noteType: $Enums.NoteType
    content: string
    diagnosis: string[]
    interventions: string[]
    plan: string | null
    isSigned: boolean
    signedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ProgressNoteCountAggregateOutputType | null
    _min: ProgressNoteMinAggregateOutputType | null
    _max: ProgressNoteMaxAggregateOutputType | null
  }

  type GetProgressNoteGroupByPayload<T extends ProgressNoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgressNoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgressNoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgressNoteGroupByOutputType[P]>
            : GetScalarType<T[P], ProgressNoteGroupByOutputType[P]>
        }
      >
    >


  export type ProgressNoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    sessionId?: boolean
    noteType?: boolean
    content?: boolean
    diagnosis?: boolean
    interventions?: boolean
    plan?: boolean
    isSigned?: boolean
    signedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["progressNote"]>

  export type ProgressNoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    sessionId?: boolean
    noteType?: boolean
    content?: boolean
    diagnosis?: boolean
    interventions?: boolean
    plan?: boolean
    isSigned?: boolean
    signedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["progressNote"]>

  export type ProgressNoteSelectScalar = {
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    sessionId?: boolean
    noteType?: boolean
    content?: boolean
    diagnosis?: boolean
    interventions?: boolean
    plan?: boolean
    isSigned?: boolean
    signedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $ProgressNotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProgressNote"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      providerId: string
      sessionId: string | null
      noteType: $Enums.NoteType
      content: string
      diagnosis: string[]
      interventions: string[]
      plan: string | null
      isSigned: boolean
      signedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["progressNote"]>
    composites: {}
  }

  type ProgressNoteGetPayload<S extends boolean | null | undefined | ProgressNoteDefaultArgs> = $Result.GetResult<Prisma.$ProgressNotePayload, S>

  type ProgressNoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProgressNoteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProgressNoteCountAggregateInputType | true
    }

  export interface ProgressNoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProgressNote'], meta: { name: 'ProgressNote' } }
    /**
     * Find zero or one ProgressNote that matches the filter.
     * @param {ProgressNoteFindUniqueArgs} args - Arguments to find a ProgressNote
     * @example
     * // Get one ProgressNote
     * const progressNote = await prisma.progressNote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgressNoteFindUniqueArgs>(args: SelectSubset<T, ProgressNoteFindUniqueArgs<ExtArgs>>): Prisma__ProgressNoteClient<$Result.GetResult<Prisma.$ProgressNotePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProgressNote that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProgressNoteFindUniqueOrThrowArgs} args - Arguments to find a ProgressNote
     * @example
     * // Get one ProgressNote
     * const progressNote = await prisma.progressNote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgressNoteFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgressNoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgressNoteClient<$Result.GetResult<Prisma.$ProgressNotePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProgressNote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressNoteFindFirstArgs} args - Arguments to find a ProgressNote
     * @example
     * // Get one ProgressNote
     * const progressNote = await prisma.progressNote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgressNoteFindFirstArgs>(args?: SelectSubset<T, ProgressNoteFindFirstArgs<ExtArgs>>): Prisma__ProgressNoteClient<$Result.GetResult<Prisma.$ProgressNotePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProgressNote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressNoteFindFirstOrThrowArgs} args - Arguments to find a ProgressNote
     * @example
     * // Get one ProgressNote
     * const progressNote = await prisma.progressNote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgressNoteFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgressNoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgressNoteClient<$Result.GetResult<Prisma.$ProgressNotePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProgressNotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressNoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProgressNotes
     * const progressNotes = await prisma.progressNote.findMany()
     * 
     * // Get first 10 ProgressNotes
     * const progressNotes = await prisma.progressNote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const progressNoteWithIdOnly = await prisma.progressNote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProgressNoteFindManyArgs>(args?: SelectSubset<T, ProgressNoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressNotePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProgressNote.
     * @param {ProgressNoteCreateArgs} args - Arguments to create a ProgressNote.
     * @example
     * // Create one ProgressNote
     * const ProgressNote = await prisma.progressNote.create({
     *   data: {
     *     // ... data to create a ProgressNote
     *   }
     * })
     * 
     */
    create<T extends ProgressNoteCreateArgs>(args: SelectSubset<T, ProgressNoteCreateArgs<ExtArgs>>): Prisma__ProgressNoteClient<$Result.GetResult<Prisma.$ProgressNotePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProgressNotes.
     * @param {ProgressNoteCreateManyArgs} args - Arguments to create many ProgressNotes.
     * @example
     * // Create many ProgressNotes
     * const progressNote = await prisma.progressNote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgressNoteCreateManyArgs>(args?: SelectSubset<T, ProgressNoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProgressNotes and returns the data saved in the database.
     * @param {ProgressNoteCreateManyAndReturnArgs} args - Arguments to create many ProgressNotes.
     * @example
     * // Create many ProgressNotes
     * const progressNote = await prisma.progressNote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProgressNotes and only return the `id`
     * const progressNoteWithIdOnly = await prisma.progressNote.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProgressNoteCreateManyAndReturnArgs>(args?: SelectSubset<T, ProgressNoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressNotePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProgressNote.
     * @param {ProgressNoteDeleteArgs} args - Arguments to delete one ProgressNote.
     * @example
     * // Delete one ProgressNote
     * const ProgressNote = await prisma.progressNote.delete({
     *   where: {
     *     // ... filter to delete one ProgressNote
     *   }
     * })
     * 
     */
    delete<T extends ProgressNoteDeleteArgs>(args: SelectSubset<T, ProgressNoteDeleteArgs<ExtArgs>>): Prisma__ProgressNoteClient<$Result.GetResult<Prisma.$ProgressNotePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProgressNote.
     * @param {ProgressNoteUpdateArgs} args - Arguments to update one ProgressNote.
     * @example
     * // Update one ProgressNote
     * const progressNote = await prisma.progressNote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgressNoteUpdateArgs>(args: SelectSubset<T, ProgressNoteUpdateArgs<ExtArgs>>): Prisma__ProgressNoteClient<$Result.GetResult<Prisma.$ProgressNotePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProgressNotes.
     * @param {ProgressNoteDeleteManyArgs} args - Arguments to filter ProgressNotes to delete.
     * @example
     * // Delete a few ProgressNotes
     * const { count } = await prisma.progressNote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgressNoteDeleteManyArgs>(args?: SelectSubset<T, ProgressNoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProgressNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressNoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProgressNotes
     * const progressNote = await prisma.progressNote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgressNoteUpdateManyArgs>(args: SelectSubset<T, ProgressNoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProgressNote.
     * @param {ProgressNoteUpsertArgs} args - Arguments to update or create a ProgressNote.
     * @example
     * // Update or create a ProgressNote
     * const progressNote = await prisma.progressNote.upsert({
     *   create: {
     *     // ... data to create a ProgressNote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProgressNote we want to update
     *   }
     * })
     */
    upsert<T extends ProgressNoteUpsertArgs>(args: SelectSubset<T, ProgressNoteUpsertArgs<ExtArgs>>): Prisma__ProgressNoteClient<$Result.GetResult<Prisma.$ProgressNotePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProgressNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressNoteCountArgs} args - Arguments to filter ProgressNotes to count.
     * @example
     * // Count the number of ProgressNotes
     * const count = await prisma.progressNote.count({
     *   where: {
     *     // ... the filter for the ProgressNotes we want to count
     *   }
     * })
    **/
    count<T extends ProgressNoteCountArgs>(
      args?: Subset<T, ProgressNoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgressNoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProgressNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressNoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProgressNoteAggregateArgs>(args: Subset<T, ProgressNoteAggregateArgs>): Prisma.PrismaPromise<GetProgressNoteAggregateType<T>>

    /**
     * Group by ProgressNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressNoteGroupByArgs} args - Group by arguments.
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
      T extends ProgressNoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgressNoteGroupByArgs['orderBy'] }
        : { orderBy?: ProgressNoteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProgressNoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgressNoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProgressNote model
   */
  readonly fields: ProgressNoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProgressNote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgressNoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ProgressNote model
   */ 
  interface ProgressNoteFieldRefs {
    readonly id: FieldRef<"ProgressNote", 'String'>
    readonly patientId: FieldRef<"ProgressNote", 'String'>
    readonly providerId: FieldRef<"ProgressNote", 'String'>
    readonly sessionId: FieldRef<"ProgressNote", 'String'>
    readonly noteType: FieldRef<"ProgressNote", 'NoteType'>
    readonly content: FieldRef<"ProgressNote", 'String'>
    readonly diagnosis: FieldRef<"ProgressNote", 'String[]'>
    readonly interventions: FieldRef<"ProgressNote", 'String[]'>
    readonly plan: FieldRef<"ProgressNote", 'String'>
    readonly isSigned: FieldRef<"ProgressNote", 'Boolean'>
    readonly signedAt: FieldRef<"ProgressNote", 'DateTime'>
    readonly createdAt: FieldRef<"ProgressNote", 'DateTime'>
    readonly updatedAt: FieldRef<"ProgressNote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProgressNote findUnique
   */
  export type ProgressNoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgressNote
     */
    select?: ProgressNoteSelect<ExtArgs> | null
    /**
     * Filter, which ProgressNote to fetch.
     */
    where: ProgressNoteWhereUniqueInput
  }

  /**
   * ProgressNote findUniqueOrThrow
   */
  export type ProgressNoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgressNote
     */
    select?: ProgressNoteSelect<ExtArgs> | null
    /**
     * Filter, which ProgressNote to fetch.
     */
    where: ProgressNoteWhereUniqueInput
  }

  /**
   * ProgressNote findFirst
   */
  export type ProgressNoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgressNote
     */
    select?: ProgressNoteSelect<ExtArgs> | null
    /**
     * Filter, which ProgressNote to fetch.
     */
    where?: ProgressNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgressNotes to fetch.
     */
    orderBy?: ProgressNoteOrderByWithRelationInput | ProgressNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProgressNotes.
     */
    cursor?: ProgressNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgressNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgressNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProgressNotes.
     */
    distinct?: ProgressNoteScalarFieldEnum | ProgressNoteScalarFieldEnum[]
  }

  /**
   * ProgressNote findFirstOrThrow
   */
  export type ProgressNoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgressNote
     */
    select?: ProgressNoteSelect<ExtArgs> | null
    /**
     * Filter, which ProgressNote to fetch.
     */
    where?: ProgressNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgressNotes to fetch.
     */
    orderBy?: ProgressNoteOrderByWithRelationInput | ProgressNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProgressNotes.
     */
    cursor?: ProgressNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgressNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgressNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProgressNotes.
     */
    distinct?: ProgressNoteScalarFieldEnum | ProgressNoteScalarFieldEnum[]
  }

  /**
   * ProgressNote findMany
   */
  export type ProgressNoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgressNote
     */
    select?: ProgressNoteSelect<ExtArgs> | null
    /**
     * Filter, which ProgressNotes to fetch.
     */
    where?: ProgressNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgressNotes to fetch.
     */
    orderBy?: ProgressNoteOrderByWithRelationInput | ProgressNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProgressNotes.
     */
    cursor?: ProgressNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgressNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgressNotes.
     */
    skip?: number
    distinct?: ProgressNoteScalarFieldEnum | ProgressNoteScalarFieldEnum[]
  }

  /**
   * ProgressNote create
   */
  export type ProgressNoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgressNote
     */
    select?: ProgressNoteSelect<ExtArgs> | null
    /**
     * The data needed to create a ProgressNote.
     */
    data: XOR<ProgressNoteCreateInput, ProgressNoteUncheckedCreateInput>
  }

  /**
   * ProgressNote createMany
   */
  export type ProgressNoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProgressNotes.
     */
    data: ProgressNoteCreateManyInput | ProgressNoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProgressNote createManyAndReturn
   */
  export type ProgressNoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgressNote
     */
    select?: ProgressNoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProgressNotes.
     */
    data: ProgressNoteCreateManyInput | ProgressNoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProgressNote update
   */
  export type ProgressNoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgressNote
     */
    select?: ProgressNoteSelect<ExtArgs> | null
    /**
     * The data needed to update a ProgressNote.
     */
    data: XOR<ProgressNoteUpdateInput, ProgressNoteUncheckedUpdateInput>
    /**
     * Choose, which ProgressNote to update.
     */
    where: ProgressNoteWhereUniqueInput
  }

  /**
   * ProgressNote updateMany
   */
  export type ProgressNoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProgressNotes.
     */
    data: XOR<ProgressNoteUpdateManyMutationInput, ProgressNoteUncheckedUpdateManyInput>
    /**
     * Filter which ProgressNotes to update
     */
    where?: ProgressNoteWhereInput
  }

  /**
   * ProgressNote upsert
   */
  export type ProgressNoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgressNote
     */
    select?: ProgressNoteSelect<ExtArgs> | null
    /**
     * The filter to search for the ProgressNote to update in case it exists.
     */
    where: ProgressNoteWhereUniqueInput
    /**
     * In case the ProgressNote found by the `where` argument doesn't exist, create a new ProgressNote with this data.
     */
    create: XOR<ProgressNoteCreateInput, ProgressNoteUncheckedCreateInput>
    /**
     * In case the ProgressNote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgressNoteUpdateInput, ProgressNoteUncheckedUpdateInput>
  }

  /**
   * ProgressNote delete
   */
  export type ProgressNoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgressNote
     */
    select?: ProgressNoteSelect<ExtArgs> | null
    /**
     * Filter which ProgressNote to delete.
     */
    where: ProgressNoteWhereUniqueInput
  }

  /**
   * ProgressNote deleteMany
   */
  export type ProgressNoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProgressNotes to delete
     */
    where?: ProgressNoteWhereInput
  }

  /**
   * ProgressNote without action
   */
  export type ProgressNoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgressNote
     */
    select?: ProgressNoteSelect<ExtArgs> | null
  }


  /**
   * Model TreatmentGoal
   */

  export type AggregateTreatmentGoal = {
    _count: TreatmentGoalCountAggregateOutputType | null
    _avg: TreatmentGoalAvgAggregateOutputType | null
    _sum: TreatmentGoalSumAggregateOutputType | null
    _min: TreatmentGoalMinAggregateOutputType | null
    _max: TreatmentGoalMaxAggregateOutputType | null
  }

  export type TreatmentGoalAvgAggregateOutputType = {
    progress: number | null
  }

  export type TreatmentGoalSumAggregateOutputType = {
    progress: number | null
  }

  export type TreatmentGoalMinAggregateOutputType = {
    id: string | null
    treatmentPlanId: string | null
    title: string | null
    description: string | null
    targetDate: Date | null
    status: $Enums.TreatmentGoalStatus | null
    progress: number | null
    notes: string | null
    homework: string | null
    nextSessionDate: Date | null
    actualStartTime: Date | null
    actualEndTime: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TreatmentGoalMaxAggregateOutputType = {
    id: string | null
    treatmentPlanId: string | null
    title: string | null
    description: string | null
    targetDate: Date | null
    status: $Enums.TreatmentGoalStatus | null
    progress: number | null
    notes: string | null
    homework: string | null
    nextSessionDate: Date | null
    actualStartTime: Date | null
    actualEndTime: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TreatmentGoalCountAggregateOutputType = {
    id: number
    treatmentPlanId: number
    title: number
    description: number
    targetDate: number
    status: number
    progress: number
    interventions: number
    strategies: number
    measurements: number
    notes: number
    homework: number
    nextSessionDate: number
    actualStartTime: number
    actualEndTime: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TreatmentGoalAvgAggregateInputType = {
    progress?: true
  }

  export type TreatmentGoalSumAggregateInputType = {
    progress?: true
  }

  export type TreatmentGoalMinAggregateInputType = {
    id?: true
    treatmentPlanId?: true
    title?: true
    description?: true
    targetDate?: true
    status?: true
    progress?: true
    notes?: true
    homework?: true
    nextSessionDate?: true
    actualStartTime?: true
    actualEndTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TreatmentGoalMaxAggregateInputType = {
    id?: true
    treatmentPlanId?: true
    title?: true
    description?: true
    targetDate?: true
    status?: true
    progress?: true
    notes?: true
    homework?: true
    nextSessionDate?: true
    actualStartTime?: true
    actualEndTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TreatmentGoalCountAggregateInputType = {
    id?: true
    treatmentPlanId?: true
    title?: true
    description?: true
    targetDate?: true
    status?: true
    progress?: true
    interventions?: true
    strategies?: true
    measurements?: true
    notes?: true
    homework?: true
    nextSessionDate?: true
    actualStartTime?: true
    actualEndTime?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TreatmentGoalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TreatmentGoal to aggregate.
     */
    where?: TreatmentGoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TreatmentGoals to fetch.
     */
    orderBy?: TreatmentGoalOrderByWithRelationInput | TreatmentGoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TreatmentGoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TreatmentGoals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TreatmentGoals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TreatmentGoals
    **/
    _count?: true | TreatmentGoalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TreatmentGoalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TreatmentGoalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TreatmentGoalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TreatmentGoalMaxAggregateInputType
  }

  export type GetTreatmentGoalAggregateType<T extends TreatmentGoalAggregateArgs> = {
        [P in keyof T & keyof AggregateTreatmentGoal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTreatmentGoal[P]>
      : GetScalarType<T[P], AggregateTreatmentGoal[P]>
  }




  export type TreatmentGoalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TreatmentGoalWhereInput
    orderBy?: TreatmentGoalOrderByWithAggregationInput | TreatmentGoalOrderByWithAggregationInput[]
    by: TreatmentGoalScalarFieldEnum[] | TreatmentGoalScalarFieldEnum
    having?: TreatmentGoalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TreatmentGoalCountAggregateInputType | true
    _avg?: TreatmentGoalAvgAggregateInputType
    _sum?: TreatmentGoalSumAggregateInputType
    _min?: TreatmentGoalMinAggregateInputType
    _max?: TreatmentGoalMaxAggregateInputType
  }

  export type TreatmentGoalGroupByOutputType = {
    id: string
    treatmentPlanId: string
    title: string
    description: string | null
    targetDate: Date | null
    status: $Enums.TreatmentGoalStatus
    progress: number
    interventions: string[]
    strategies: string[]
    measurements: string[]
    notes: string | null
    homework: string | null
    nextSessionDate: Date | null
    actualStartTime: Date | null
    actualEndTime: Date | null
    createdAt: Date
    updatedAt: Date
    _count: TreatmentGoalCountAggregateOutputType | null
    _avg: TreatmentGoalAvgAggregateOutputType | null
    _sum: TreatmentGoalSumAggregateOutputType | null
    _min: TreatmentGoalMinAggregateOutputType | null
    _max: TreatmentGoalMaxAggregateOutputType | null
  }

  type GetTreatmentGoalGroupByPayload<T extends TreatmentGoalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TreatmentGoalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TreatmentGoalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TreatmentGoalGroupByOutputType[P]>
            : GetScalarType<T[P], TreatmentGoalGroupByOutputType[P]>
        }
      >
    >


  export type TreatmentGoalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    treatmentPlanId?: boolean
    title?: boolean
    description?: boolean
    targetDate?: boolean
    status?: boolean
    progress?: boolean
    interventions?: boolean
    strategies?: boolean
    measurements?: boolean
    notes?: boolean
    homework?: boolean
    nextSessionDate?: boolean
    actualStartTime?: boolean
    actualEndTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["treatmentGoal"]>

  export type TreatmentGoalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    treatmentPlanId?: boolean
    title?: boolean
    description?: boolean
    targetDate?: boolean
    status?: boolean
    progress?: boolean
    interventions?: boolean
    strategies?: boolean
    measurements?: boolean
    notes?: boolean
    homework?: boolean
    nextSessionDate?: boolean
    actualStartTime?: boolean
    actualEndTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["treatmentGoal"]>

  export type TreatmentGoalSelectScalar = {
    id?: boolean
    treatmentPlanId?: boolean
    title?: boolean
    description?: boolean
    targetDate?: boolean
    status?: boolean
    progress?: boolean
    interventions?: boolean
    strategies?: boolean
    measurements?: boolean
    notes?: boolean
    homework?: boolean
    nextSessionDate?: boolean
    actualStartTime?: boolean
    actualEndTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $TreatmentGoalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TreatmentGoal"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      treatmentPlanId: string
      title: string
      description: string | null
      targetDate: Date | null
      status: $Enums.TreatmentGoalStatus
      progress: number
      interventions: string[]
      strategies: string[]
      measurements: string[]
      notes: string | null
      homework: string | null
      nextSessionDate: Date | null
      actualStartTime: Date | null
      actualEndTime: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["treatmentGoal"]>
    composites: {}
  }

  type TreatmentGoalGetPayload<S extends boolean | null | undefined | TreatmentGoalDefaultArgs> = $Result.GetResult<Prisma.$TreatmentGoalPayload, S>

  type TreatmentGoalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TreatmentGoalFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TreatmentGoalCountAggregateInputType | true
    }

  export interface TreatmentGoalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TreatmentGoal'], meta: { name: 'TreatmentGoal' } }
    /**
     * Find zero or one TreatmentGoal that matches the filter.
     * @param {TreatmentGoalFindUniqueArgs} args - Arguments to find a TreatmentGoal
     * @example
     * // Get one TreatmentGoal
     * const treatmentGoal = await prisma.treatmentGoal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TreatmentGoalFindUniqueArgs>(args: SelectSubset<T, TreatmentGoalFindUniqueArgs<ExtArgs>>): Prisma__TreatmentGoalClient<$Result.GetResult<Prisma.$TreatmentGoalPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TreatmentGoal that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TreatmentGoalFindUniqueOrThrowArgs} args - Arguments to find a TreatmentGoal
     * @example
     * // Get one TreatmentGoal
     * const treatmentGoal = await prisma.treatmentGoal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TreatmentGoalFindUniqueOrThrowArgs>(args: SelectSubset<T, TreatmentGoalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TreatmentGoalClient<$Result.GetResult<Prisma.$TreatmentGoalPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TreatmentGoal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentGoalFindFirstArgs} args - Arguments to find a TreatmentGoal
     * @example
     * // Get one TreatmentGoal
     * const treatmentGoal = await prisma.treatmentGoal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TreatmentGoalFindFirstArgs>(args?: SelectSubset<T, TreatmentGoalFindFirstArgs<ExtArgs>>): Prisma__TreatmentGoalClient<$Result.GetResult<Prisma.$TreatmentGoalPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TreatmentGoal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentGoalFindFirstOrThrowArgs} args - Arguments to find a TreatmentGoal
     * @example
     * // Get one TreatmentGoal
     * const treatmentGoal = await prisma.treatmentGoal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TreatmentGoalFindFirstOrThrowArgs>(args?: SelectSubset<T, TreatmentGoalFindFirstOrThrowArgs<ExtArgs>>): Prisma__TreatmentGoalClient<$Result.GetResult<Prisma.$TreatmentGoalPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TreatmentGoals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentGoalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TreatmentGoals
     * const treatmentGoals = await prisma.treatmentGoal.findMany()
     * 
     * // Get first 10 TreatmentGoals
     * const treatmentGoals = await prisma.treatmentGoal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const treatmentGoalWithIdOnly = await prisma.treatmentGoal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TreatmentGoalFindManyArgs>(args?: SelectSubset<T, TreatmentGoalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TreatmentGoalPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TreatmentGoal.
     * @param {TreatmentGoalCreateArgs} args - Arguments to create a TreatmentGoal.
     * @example
     * // Create one TreatmentGoal
     * const TreatmentGoal = await prisma.treatmentGoal.create({
     *   data: {
     *     // ... data to create a TreatmentGoal
     *   }
     * })
     * 
     */
    create<T extends TreatmentGoalCreateArgs>(args: SelectSubset<T, TreatmentGoalCreateArgs<ExtArgs>>): Prisma__TreatmentGoalClient<$Result.GetResult<Prisma.$TreatmentGoalPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TreatmentGoals.
     * @param {TreatmentGoalCreateManyArgs} args - Arguments to create many TreatmentGoals.
     * @example
     * // Create many TreatmentGoals
     * const treatmentGoal = await prisma.treatmentGoal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TreatmentGoalCreateManyArgs>(args?: SelectSubset<T, TreatmentGoalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TreatmentGoals and returns the data saved in the database.
     * @param {TreatmentGoalCreateManyAndReturnArgs} args - Arguments to create many TreatmentGoals.
     * @example
     * // Create many TreatmentGoals
     * const treatmentGoal = await prisma.treatmentGoal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TreatmentGoals and only return the `id`
     * const treatmentGoalWithIdOnly = await prisma.treatmentGoal.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TreatmentGoalCreateManyAndReturnArgs>(args?: SelectSubset<T, TreatmentGoalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TreatmentGoalPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TreatmentGoal.
     * @param {TreatmentGoalDeleteArgs} args - Arguments to delete one TreatmentGoal.
     * @example
     * // Delete one TreatmentGoal
     * const TreatmentGoal = await prisma.treatmentGoal.delete({
     *   where: {
     *     // ... filter to delete one TreatmentGoal
     *   }
     * })
     * 
     */
    delete<T extends TreatmentGoalDeleteArgs>(args: SelectSubset<T, TreatmentGoalDeleteArgs<ExtArgs>>): Prisma__TreatmentGoalClient<$Result.GetResult<Prisma.$TreatmentGoalPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TreatmentGoal.
     * @param {TreatmentGoalUpdateArgs} args - Arguments to update one TreatmentGoal.
     * @example
     * // Update one TreatmentGoal
     * const treatmentGoal = await prisma.treatmentGoal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TreatmentGoalUpdateArgs>(args: SelectSubset<T, TreatmentGoalUpdateArgs<ExtArgs>>): Prisma__TreatmentGoalClient<$Result.GetResult<Prisma.$TreatmentGoalPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TreatmentGoals.
     * @param {TreatmentGoalDeleteManyArgs} args - Arguments to filter TreatmentGoals to delete.
     * @example
     * // Delete a few TreatmentGoals
     * const { count } = await prisma.treatmentGoal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TreatmentGoalDeleteManyArgs>(args?: SelectSubset<T, TreatmentGoalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TreatmentGoals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentGoalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TreatmentGoals
     * const treatmentGoal = await prisma.treatmentGoal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TreatmentGoalUpdateManyArgs>(args: SelectSubset<T, TreatmentGoalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TreatmentGoal.
     * @param {TreatmentGoalUpsertArgs} args - Arguments to update or create a TreatmentGoal.
     * @example
     * // Update or create a TreatmentGoal
     * const treatmentGoal = await prisma.treatmentGoal.upsert({
     *   create: {
     *     // ... data to create a TreatmentGoal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TreatmentGoal we want to update
     *   }
     * })
     */
    upsert<T extends TreatmentGoalUpsertArgs>(args: SelectSubset<T, TreatmentGoalUpsertArgs<ExtArgs>>): Prisma__TreatmentGoalClient<$Result.GetResult<Prisma.$TreatmentGoalPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TreatmentGoals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentGoalCountArgs} args - Arguments to filter TreatmentGoals to count.
     * @example
     * // Count the number of TreatmentGoals
     * const count = await prisma.treatmentGoal.count({
     *   where: {
     *     // ... the filter for the TreatmentGoals we want to count
     *   }
     * })
    **/
    count<T extends TreatmentGoalCountArgs>(
      args?: Subset<T, TreatmentGoalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TreatmentGoalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TreatmentGoal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentGoalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TreatmentGoalAggregateArgs>(args: Subset<T, TreatmentGoalAggregateArgs>): Prisma.PrismaPromise<GetTreatmentGoalAggregateType<T>>

    /**
     * Group by TreatmentGoal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentGoalGroupByArgs} args - Group by arguments.
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
      T extends TreatmentGoalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TreatmentGoalGroupByArgs['orderBy'] }
        : { orderBy?: TreatmentGoalGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TreatmentGoalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTreatmentGoalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TreatmentGoal model
   */
  readonly fields: TreatmentGoalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TreatmentGoal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TreatmentGoalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the TreatmentGoal model
   */ 
  interface TreatmentGoalFieldRefs {
    readonly id: FieldRef<"TreatmentGoal", 'String'>
    readonly treatmentPlanId: FieldRef<"TreatmentGoal", 'String'>
    readonly title: FieldRef<"TreatmentGoal", 'String'>
    readonly description: FieldRef<"TreatmentGoal", 'String'>
    readonly targetDate: FieldRef<"TreatmentGoal", 'DateTime'>
    readonly status: FieldRef<"TreatmentGoal", 'TreatmentGoalStatus'>
    readonly progress: FieldRef<"TreatmentGoal", 'Int'>
    readonly interventions: FieldRef<"TreatmentGoal", 'String[]'>
    readonly strategies: FieldRef<"TreatmentGoal", 'String[]'>
    readonly measurements: FieldRef<"TreatmentGoal", 'String[]'>
    readonly notes: FieldRef<"TreatmentGoal", 'String'>
    readonly homework: FieldRef<"TreatmentGoal", 'String'>
    readonly nextSessionDate: FieldRef<"TreatmentGoal", 'DateTime'>
    readonly actualStartTime: FieldRef<"TreatmentGoal", 'DateTime'>
    readonly actualEndTime: FieldRef<"TreatmentGoal", 'DateTime'>
    readonly createdAt: FieldRef<"TreatmentGoal", 'DateTime'>
    readonly updatedAt: FieldRef<"TreatmentGoal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TreatmentGoal findUnique
   */
  export type TreatmentGoalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentGoal
     */
    select?: TreatmentGoalSelect<ExtArgs> | null
    /**
     * Filter, which TreatmentGoal to fetch.
     */
    where: TreatmentGoalWhereUniqueInput
  }

  /**
   * TreatmentGoal findUniqueOrThrow
   */
  export type TreatmentGoalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentGoal
     */
    select?: TreatmentGoalSelect<ExtArgs> | null
    /**
     * Filter, which TreatmentGoal to fetch.
     */
    where: TreatmentGoalWhereUniqueInput
  }

  /**
   * TreatmentGoal findFirst
   */
  export type TreatmentGoalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentGoal
     */
    select?: TreatmentGoalSelect<ExtArgs> | null
    /**
     * Filter, which TreatmentGoal to fetch.
     */
    where?: TreatmentGoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TreatmentGoals to fetch.
     */
    orderBy?: TreatmentGoalOrderByWithRelationInput | TreatmentGoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TreatmentGoals.
     */
    cursor?: TreatmentGoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TreatmentGoals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TreatmentGoals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TreatmentGoals.
     */
    distinct?: TreatmentGoalScalarFieldEnum | TreatmentGoalScalarFieldEnum[]
  }

  /**
   * TreatmentGoal findFirstOrThrow
   */
  export type TreatmentGoalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentGoal
     */
    select?: TreatmentGoalSelect<ExtArgs> | null
    /**
     * Filter, which TreatmentGoal to fetch.
     */
    where?: TreatmentGoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TreatmentGoals to fetch.
     */
    orderBy?: TreatmentGoalOrderByWithRelationInput | TreatmentGoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TreatmentGoals.
     */
    cursor?: TreatmentGoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TreatmentGoals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TreatmentGoals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TreatmentGoals.
     */
    distinct?: TreatmentGoalScalarFieldEnum | TreatmentGoalScalarFieldEnum[]
  }

  /**
   * TreatmentGoal findMany
   */
  export type TreatmentGoalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentGoal
     */
    select?: TreatmentGoalSelect<ExtArgs> | null
    /**
     * Filter, which TreatmentGoals to fetch.
     */
    where?: TreatmentGoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TreatmentGoals to fetch.
     */
    orderBy?: TreatmentGoalOrderByWithRelationInput | TreatmentGoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TreatmentGoals.
     */
    cursor?: TreatmentGoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TreatmentGoals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TreatmentGoals.
     */
    skip?: number
    distinct?: TreatmentGoalScalarFieldEnum | TreatmentGoalScalarFieldEnum[]
  }

  /**
   * TreatmentGoal create
   */
  export type TreatmentGoalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentGoal
     */
    select?: TreatmentGoalSelect<ExtArgs> | null
    /**
     * The data needed to create a TreatmentGoal.
     */
    data: XOR<TreatmentGoalCreateInput, TreatmentGoalUncheckedCreateInput>
  }

  /**
   * TreatmentGoal createMany
   */
  export type TreatmentGoalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TreatmentGoals.
     */
    data: TreatmentGoalCreateManyInput | TreatmentGoalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TreatmentGoal createManyAndReturn
   */
  export type TreatmentGoalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentGoal
     */
    select?: TreatmentGoalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TreatmentGoals.
     */
    data: TreatmentGoalCreateManyInput | TreatmentGoalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TreatmentGoal update
   */
  export type TreatmentGoalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentGoal
     */
    select?: TreatmentGoalSelect<ExtArgs> | null
    /**
     * The data needed to update a TreatmentGoal.
     */
    data: XOR<TreatmentGoalUpdateInput, TreatmentGoalUncheckedUpdateInput>
    /**
     * Choose, which TreatmentGoal to update.
     */
    where: TreatmentGoalWhereUniqueInput
  }

  /**
   * TreatmentGoal updateMany
   */
  export type TreatmentGoalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TreatmentGoals.
     */
    data: XOR<TreatmentGoalUpdateManyMutationInput, TreatmentGoalUncheckedUpdateManyInput>
    /**
     * Filter which TreatmentGoals to update
     */
    where?: TreatmentGoalWhereInput
  }

  /**
   * TreatmentGoal upsert
   */
  export type TreatmentGoalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentGoal
     */
    select?: TreatmentGoalSelect<ExtArgs> | null
    /**
     * The filter to search for the TreatmentGoal to update in case it exists.
     */
    where: TreatmentGoalWhereUniqueInput
    /**
     * In case the TreatmentGoal found by the `where` argument doesn't exist, create a new TreatmentGoal with this data.
     */
    create: XOR<TreatmentGoalCreateInput, TreatmentGoalUncheckedCreateInput>
    /**
     * In case the TreatmentGoal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TreatmentGoalUpdateInput, TreatmentGoalUncheckedUpdateInput>
  }

  /**
   * TreatmentGoal delete
   */
  export type TreatmentGoalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentGoal
     */
    select?: TreatmentGoalSelect<ExtArgs> | null
    /**
     * Filter which TreatmentGoal to delete.
     */
    where: TreatmentGoalWhereUniqueInput
  }

  /**
   * TreatmentGoal deleteMany
   */
  export type TreatmentGoalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TreatmentGoals to delete
     */
    where?: TreatmentGoalWhereInput
  }

  /**
   * TreatmentGoal without action
   */
  export type TreatmentGoalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentGoal
     */
    select?: TreatmentGoalSelect<ExtArgs> | null
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


  export const TherapySessionScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    therapistId: 'therapistId',
    sessionType: 'sessionType',
    status: 'status',
    scheduledAt: 'scheduledAt',
    duration: 'duration',
    modality: 'modality',
    notes: 'notes',
    homework: 'homework',
    nextSessionDate: 'nextSessionDate',
    actualStartTime: 'actualStartTime',
    actualEndTime: 'actualEndTime',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TherapySessionScalarFieldEnum = (typeof TherapySessionScalarFieldEnum)[keyof typeof TherapySessionScalarFieldEnum]


  export const MentalHealthAssessmentScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    assessedBy: 'assessedBy',
    assessmentType: 'assessmentType',
    score: 'score',
    severity: 'severity',
    results: 'results',
    notes: 'notes',
    followUpRequired: 'followUpRequired',
    followUpDate: 'followUpDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MentalHealthAssessmentScalarFieldEnum = (typeof MentalHealthAssessmentScalarFieldEnum)[keyof typeof MentalHealthAssessmentScalarFieldEnum]


  export const CrisisInterventionScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    responderId: 'responderId',
    crisisType: 'crisisType',
    severity: 'severity',
    status: 'status',
    description: 'description',
    interventions: 'interventions',
    outcome: 'outcome',
    referredTo: 'referredTo',
    contactedAt: 'contactedAt',
    resolvedAt: 'resolvedAt',
    followUpNeeded: 'followUpNeeded',
    followUpDate: 'followUpDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CrisisInterventionScalarFieldEnum = (typeof CrisisInterventionScalarFieldEnum)[keyof typeof CrisisInterventionScalarFieldEnum]


  export const TreatmentPlanScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    providerId: 'providerId',
    diagnosis: 'diagnosis',
    goals: 'goals',
    interventions: 'interventions',
    medications: 'medications',
    frequency: 'frequency',
    startDate: 'startDate',
    reviewDate: 'reviewDate',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TreatmentPlanScalarFieldEnum = (typeof TreatmentPlanScalarFieldEnum)[keyof typeof TreatmentPlanScalarFieldEnum]


  export const MoodLogScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    moodRating: 'moodRating',
    notes: 'notes',
    triggers: 'triggers',
    activities: 'activities',
    logDate: 'logDate',
    createdAt: 'createdAt'
  };

  export type MoodLogScalarFieldEnum = (typeof MoodLogScalarFieldEnum)[keyof typeof MoodLogScalarFieldEnum]


  export const SupportGroupScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    type: 'type',
    facilitatorId: 'facilitatorId',
    schedule: 'schedule',
    maxMembers: 'maxMembers',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SupportGroupScalarFieldEnum = (typeof SupportGroupScalarFieldEnum)[keyof typeof SupportGroupScalarFieldEnum]


  export const SupportGroupMemberScalarFieldEnum: {
    id: 'id',
    groupId: 'groupId',
    patientId: 'patientId',
    joinedAt: 'joinedAt',
    status: 'status'
  };

  export type SupportGroupMemberScalarFieldEnum = (typeof SupportGroupMemberScalarFieldEnum)[keyof typeof SupportGroupMemberScalarFieldEnum]


  export const ConsentRecordScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    providerId: 'providerId',
    consentType: 'consentType',
    status: 'status',
    signedAt: 'signedAt',
    expiresAt: 'expiresAt',
    scope: 'scope',
    notes: 'notes',
    grantedTo: 'grantedTo',
    grantedAt: 'grantedAt',
    revokedAt: 'revokedAt',
    purpose: 'purpose',
    disclosureScope: 'disclosureScope',
    substanceUseDisclosure: 'substanceUseDisclosure',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConsentRecordScalarFieldEnum = (typeof ConsentRecordScalarFieldEnum)[keyof typeof ConsentRecordScalarFieldEnum]


  export const GroupSessionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    medicationName: 'medicationName',
    description: 'description',
    facilitatorId: 'facilitatorId',
    sessionType: 'sessionType',
    status: 'status',
    scheduledAt: 'scheduledAt',
    sessionDate: 'sessionDate',
    duration: 'duration',
    modality: 'modality',
    maxParticipants: 'maxParticipants',
    topic: 'topic',
    notes: 'notes',
    homework: 'homework',
    nextSessionDate: 'nextSessionDate',
    actualStartTime: 'actualStartTime',
    actualEndTime: 'actualEndTime',
    objectives: 'objectives',
    materials: 'materials',
    groupId: 'groupId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GroupSessionScalarFieldEnum = (typeof GroupSessionScalarFieldEnum)[keyof typeof GroupSessionScalarFieldEnum]


  export const GroupSessionAttendeeScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    patientId: 'patientId',
    attended: 'attended',
    notes: 'notes',
    participation: 'participation',
    createdAt: 'createdAt'
  };

  export type GroupSessionAttendeeScalarFieldEnum = (typeof GroupSessionAttendeeScalarFieldEnum)[keyof typeof GroupSessionAttendeeScalarFieldEnum]


  export const PsychMedicationScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    prescriberId: 'prescriberId',
    name: 'name',
    medicationName: 'medicationName',
    dosage: 'dosage',
    frequency: 'frequency',
    medicationClass: 'medicationClass',
    status: 'status',
    startDate: 'startDate',
    endDate: 'endDate',
    reason: 'reason',
    sideEffects: 'sideEffects',
    interactions: 'interactions',
    notes: 'notes',
    homework: 'homework',
    nextSessionDate: 'nextSessionDate',
    actualStartTime: 'actualStartTime',
    actualEndTime: 'actualEndTime',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PsychMedicationScalarFieldEnum = (typeof PsychMedicationScalarFieldEnum)[keyof typeof PsychMedicationScalarFieldEnum]


  export const ProgressNoteScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    providerId: 'providerId',
    sessionId: 'sessionId',
    noteType: 'noteType',
    content: 'content',
    diagnosis: 'diagnosis',
    interventions: 'interventions',
    plan: 'plan',
    isSigned: 'isSigned',
    signedAt: 'signedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProgressNoteScalarFieldEnum = (typeof ProgressNoteScalarFieldEnum)[keyof typeof ProgressNoteScalarFieldEnum]


  export const TreatmentGoalScalarFieldEnum: {
    id: 'id',
    treatmentPlanId: 'treatmentPlanId',
    title: 'title',
    description: 'description',
    targetDate: 'targetDate',
    status: 'status',
    progress: 'progress',
    interventions: 'interventions',
    strategies: 'strategies',
    measurements: 'measurements',
    notes: 'notes',
    homework: 'homework',
    nextSessionDate: 'nextSessionDate',
    actualStartTime: 'actualStartTime',
    actualEndTime: 'actualEndTime',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TreatmentGoalScalarFieldEnum = (typeof TreatmentGoalScalarFieldEnum)[keyof typeof TreatmentGoalScalarFieldEnum]


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
   * Reference to a field of type 'SessionType'
   */
  export type EnumSessionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionType'>
    


  /**
   * Reference to a field of type 'SessionType[]'
   */
  export type ListEnumSessionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionType[]'>
    


  /**
   * Reference to a field of type 'SessionStatus'
   */
  export type EnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus'>
    


  /**
   * Reference to a field of type 'SessionStatus[]'
   */
  export type ListEnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus[]'>
    


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
   * Reference to a field of type 'AssessmentType'
   */
  export type EnumAssessmentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentType'>
    


  /**
   * Reference to a field of type 'AssessmentType[]'
   */
  export type ListEnumAssessmentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentType[]'>
    


  /**
   * Reference to a field of type 'SeverityLevel'
   */
  export type EnumSeverityLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SeverityLevel'>
    


  /**
   * Reference to a field of type 'SeverityLevel[]'
   */
  export type ListEnumSeverityLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SeverityLevel[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'CrisisType'
   */
  export type EnumCrisisTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CrisisType'>
    


  /**
   * Reference to a field of type 'CrisisType[]'
   */
  export type ListEnumCrisisTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CrisisType[]'>
    


  /**
   * Reference to a field of type 'CrisisSeverity'
   */
  export type EnumCrisisSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CrisisSeverity'>
    


  /**
   * Reference to a field of type 'CrisisSeverity[]'
   */
  export type ListEnumCrisisSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CrisisSeverity[]'>
    


  /**
   * Reference to a field of type 'CrisisStatus'
   */
  export type EnumCrisisStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CrisisStatus'>
    


  /**
   * Reference to a field of type 'CrisisStatus[]'
   */
  export type ListEnumCrisisStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CrisisStatus[]'>
    


  /**
   * Reference to a field of type 'ConsentType'
   */
  export type EnumConsentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConsentType'>
    


  /**
   * Reference to a field of type 'ConsentType[]'
   */
  export type ListEnumConsentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConsentType[]'>
    


  /**
   * Reference to a field of type 'ConsentStatus'
   */
  export type EnumConsentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConsentStatus'>
    


  /**
   * Reference to a field of type 'ConsentStatus[]'
   */
  export type ListEnumConsentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConsentStatus[]'>
    


  /**
   * Reference to a field of type 'GroupSessionType'
   */
  export type EnumGroupSessionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GroupSessionType'>
    


  /**
   * Reference to a field of type 'GroupSessionType[]'
   */
  export type ListEnumGroupSessionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GroupSessionType[]'>
    


  /**
   * Reference to a field of type 'GroupSessionStatus'
   */
  export type EnumGroupSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GroupSessionStatus'>
    


  /**
   * Reference to a field of type 'GroupSessionStatus[]'
   */
  export type ListEnumGroupSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GroupSessionStatus[]'>
    


  /**
   * Reference to a field of type 'MedicationClass'
   */
  export type EnumMedicationClassFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MedicationClass'>
    


  /**
   * Reference to a field of type 'MedicationClass[]'
   */
  export type ListEnumMedicationClassFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MedicationClass[]'>
    


  /**
   * Reference to a field of type 'MedicationStatus'
   */
  export type EnumMedicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MedicationStatus'>
    


  /**
   * Reference to a field of type 'MedicationStatus[]'
   */
  export type ListEnumMedicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MedicationStatus[]'>
    


  /**
   * Reference to a field of type 'NoteType'
   */
  export type EnumNoteTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NoteType'>
    


  /**
   * Reference to a field of type 'NoteType[]'
   */
  export type ListEnumNoteTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NoteType[]'>
    


  /**
   * Reference to a field of type 'TreatmentGoalStatus'
   */
  export type EnumTreatmentGoalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TreatmentGoalStatus'>
    


  /**
   * Reference to a field of type 'TreatmentGoalStatus[]'
   */
  export type ListEnumTreatmentGoalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TreatmentGoalStatus[]'>
    


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


  export type TherapySessionWhereInput = {
    AND?: TherapySessionWhereInput | TherapySessionWhereInput[]
    OR?: TherapySessionWhereInput[]
    NOT?: TherapySessionWhereInput | TherapySessionWhereInput[]
    id?: StringFilter<"TherapySession"> | string
    patientId?: StringFilter<"TherapySession"> | string
    therapistId?: StringFilter<"TherapySession"> | string
    sessionType?: EnumSessionTypeFilter<"TherapySession"> | $Enums.SessionType
    status?: EnumSessionStatusFilter<"TherapySession"> | $Enums.SessionStatus
    scheduledAt?: DateTimeFilter<"TherapySession"> | Date | string
    duration?: IntFilter<"TherapySession"> | number
    modality?: StringNullableFilter<"TherapySession"> | string | null
    notes?: StringNullableFilter<"TherapySession"> | string | null
    homework?: StringNullableFilter<"TherapySession"> | string | null
    nextSessionDate?: DateTimeNullableFilter<"TherapySession"> | Date | string | null
    actualStartTime?: DateTimeNullableFilter<"TherapySession"> | Date | string | null
    actualEndTime?: DateTimeNullableFilter<"TherapySession"> | Date | string | null
    createdAt?: DateTimeFilter<"TherapySession"> | Date | string
    updatedAt?: DateTimeFilter<"TherapySession"> | Date | string
  }

  export type TherapySessionOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    therapistId?: SortOrder
    sessionType?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    duration?: SortOrder
    modality?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    homework?: SortOrderInput | SortOrder
    nextSessionDate?: SortOrderInput | SortOrder
    actualStartTime?: SortOrderInput | SortOrder
    actualEndTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TherapySessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TherapySessionWhereInput | TherapySessionWhereInput[]
    OR?: TherapySessionWhereInput[]
    NOT?: TherapySessionWhereInput | TherapySessionWhereInput[]
    patientId?: StringFilter<"TherapySession"> | string
    therapistId?: StringFilter<"TherapySession"> | string
    sessionType?: EnumSessionTypeFilter<"TherapySession"> | $Enums.SessionType
    status?: EnumSessionStatusFilter<"TherapySession"> | $Enums.SessionStatus
    scheduledAt?: DateTimeFilter<"TherapySession"> | Date | string
    duration?: IntFilter<"TherapySession"> | number
    modality?: StringNullableFilter<"TherapySession"> | string | null
    notes?: StringNullableFilter<"TherapySession"> | string | null
    homework?: StringNullableFilter<"TherapySession"> | string | null
    nextSessionDate?: DateTimeNullableFilter<"TherapySession"> | Date | string | null
    actualStartTime?: DateTimeNullableFilter<"TherapySession"> | Date | string | null
    actualEndTime?: DateTimeNullableFilter<"TherapySession"> | Date | string | null
    createdAt?: DateTimeFilter<"TherapySession"> | Date | string
    updatedAt?: DateTimeFilter<"TherapySession"> | Date | string
  }, "id">

  export type TherapySessionOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    therapistId?: SortOrder
    sessionType?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    duration?: SortOrder
    modality?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    homework?: SortOrderInput | SortOrder
    nextSessionDate?: SortOrderInput | SortOrder
    actualStartTime?: SortOrderInput | SortOrder
    actualEndTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TherapySessionCountOrderByAggregateInput
    _avg?: TherapySessionAvgOrderByAggregateInput
    _max?: TherapySessionMaxOrderByAggregateInput
    _min?: TherapySessionMinOrderByAggregateInput
    _sum?: TherapySessionSumOrderByAggregateInput
  }

  export type TherapySessionScalarWhereWithAggregatesInput = {
    AND?: TherapySessionScalarWhereWithAggregatesInput | TherapySessionScalarWhereWithAggregatesInput[]
    OR?: TherapySessionScalarWhereWithAggregatesInput[]
    NOT?: TherapySessionScalarWhereWithAggregatesInput | TherapySessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TherapySession"> | string
    patientId?: StringWithAggregatesFilter<"TherapySession"> | string
    therapistId?: StringWithAggregatesFilter<"TherapySession"> | string
    sessionType?: EnumSessionTypeWithAggregatesFilter<"TherapySession"> | $Enums.SessionType
    status?: EnumSessionStatusWithAggregatesFilter<"TherapySession"> | $Enums.SessionStatus
    scheduledAt?: DateTimeWithAggregatesFilter<"TherapySession"> | Date | string
    duration?: IntWithAggregatesFilter<"TherapySession"> | number
    modality?: StringNullableWithAggregatesFilter<"TherapySession"> | string | null
    notes?: StringNullableWithAggregatesFilter<"TherapySession"> | string | null
    homework?: StringNullableWithAggregatesFilter<"TherapySession"> | string | null
    nextSessionDate?: DateTimeNullableWithAggregatesFilter<"TherapySession"> | Date | string | null
    actualStartTime?: DateTimeNullableWithAggregatesFilter<"TherapySession"> | Date | string | null
    actualEndTime?: DateTimeNullableWithAggregatesFilter<"TherapySession"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TherapySession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TherapySession"> | Date | string
  }

  export type MentalHealthAssessmentWhereInput = {
    AND?: MentalHealthAssessmentWhereInput | MentalHealthAssessmentWhereInput[]
    OR?: MentalHealthAssessmentWhereInput[]
    NOT?: MentalHealthAssessmentWhereInput | MentalHealthAssessmentWhereInput[]
    id?: StringFilter<"MentalHealthAssessment"> | string
    patientId?: StringFilter<"MentalHealthAssessment"> | string
    assessedBy?: StringFilter<"MentalHealthAssessment"> | string
    assessmentType?: EnumAssessmentTypeFilter<"MentalHealthAssessment"> | $Enums.AssessmentType
    score?: IntNullableFilter<"MentalHealthAssessment"> | number | null
    severity?: EnumSeverityLevelNullableFilter<"MentalHealthAssessment"> | $Enums.SeverityLevel | null
    results?: JsonFilter<"MentalHealthAssessment">
    notes?: StringNullableFilter<"MentalHealthAssessment"> | string | null
    followUpRequired?: BoolFilter<"MentalHealthAssessment"> | boolean
    followUpDate?: DateTimeNullableFilter<"MentalHealthAssessment"> | Date | string | null
    createdAt?: DateTimeFilter<"MentalHealthAssessment"> | Date | string
    updatedAt?: DateTimeFilter<"MentalHealthAssessment"> | Date | string
  }

  export type MentalHealthAssessmentOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    assessedBy?: SortOrder
    assessmentType?: SortOrder
    score?: SortOrderInput | SortOrder
    severity?: SortOrderInput | SortOrder
    results?: SortOrder
    notes?: SortOrderInput | SortOrder
    followUpRequired?: SortOrder
    followUpDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MentalHealthAssessmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MentalHealthAssessmentWhereInput | MentalHealthAssessmentWhereInput[]
    OR?: MentalHealthAssessmentWhereInput[]
    NOT?: MentalHealthAssessmentWhereInput | MentalHealthAssessmentWhereInput[]
    patientId?: StringFilter<"MentalHealthAssessment"> | string
    assessedBy?: StringFilter<"MentalHealthAssessment"> | string
    assessmentType?: EnumAssessmentTypeFilter<"MentalHealthAssessment"> | $Enums.AssessmentType
    score?: IntNullableFilter<"MentalHealthAssessment"> | number | null
    severity?: EnumSeverityLevelNullableFilter<"MentalHealthAssessment"> | $Enums.SeverityLevel | null
    results?: JsonFilter<"MentalHealthAssessment">
    notes?: StringNullableFilter<"MentalHealthAssessment"> | string | null
    followUpRequired?: BoolFilter<"MentalHealthAssessment"> | boolean
    followUpDate?: DateTimeNullableFilter<"MentalHealthAssessment"> | Date | string | null
    createdAt?: DateTimeFilter<"MentalHealthAssessment"> | Date | string
    updatedAt?: DateTimeFilter<"MentalHealthAssessment"> | Date | string
  }, "id">

  export type MentalHealthAssessmentOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    assessedBy?: SortOrder
    assessmentType?: SortOrder
    score?: SortOrderInput | SortOrder
    severity?: SortOrderInput | SortOrder
    results?: SortOrder
    notes?: SortOrderInput | SortOrder
    followUpRequired?: SortOrder
    followUpDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MentalHealthAssessmentCountOrderByAggregateInput
    _avg?: MentalHealthAssessmentAvgOrderByAggregateInput
    _max?: MentalHealthAssessmentMaxOrderByAggregateInput
    _min?: MentalHealthAssessmentMinOrderByAggregateInput
    _sum?: MentalHealthAssessmentSumOrderByAggregateInput
  }

  export type MentalHealthAssessmentScalarWhereWithAggregatesInput = {
    AND?: MentalHealthAssessmentScalarWhereWithAggregatesInput | MentalHealthAssessmentScalarWhereWithAggregatesInput[]
    OR?: MentalHealthAssessmentScalarWhereWithAggregatesInput[]
    NOT?: MentalHealthAssessmentScalarWhereWithAggregatesInput | MentalHealthAssessmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MentalHealthAssessment"> | string
    patientId?: StringWithAggregatesFilter<"MentalHealthAssessment"> | string
    assessedBy?: StringWithAggregatesFilter<"MentalHealthAssessment"> | string
    assessmentType?: EnumAssessmentTypeWithAggregatesFilter<"MentalHealthAssessment"> | $Enums.AssessmentType
    score?: IntNullableWithAggregatesFilter<"MentalHealthAssessment"> | number | null
    severity?: EnumSeverityLevelNullableWithAggregatesFilter<"MentalHealthAssessment"> | $Enums.SeverityLevel | null
    results?: JsonWithAggregatesFilter<"MentalHealthAssessment">
    notes?: StringNullableWithAggregatesFilter<"MentalHealthAssessment"> | string | null
    followUpRequired?: BoolWithAggregatesFilter<"MentalHealthAssessment"> | boolean
    followUpDate?: DateTimeNullableWithAggregatesFilter<"MentalHealthAssessment"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MentalHealthAssessment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MentalHealthAssessment"> | Date | string
  }

  export type CrisisInterventionWhereInput = {
    AND?: CrisisInterventionWhereInput | CrisisInterventionWhereInput[]
    OR?: CrisisInterventionWhereInput[]
    NOT?: CrisisInterventionWhereInput | CrisisInterventionWhereInput[]
    id?: StringFilter<"CrisisIntervention"> | string
    patientId?: StringFilter<"CrisisIntervention"> | string
    responderId?: StringNullableFilter<"CrisisIntervention"> | string | null
    crisisType?: EnumCrisisTypeFilter<"CrisisIntervention"> | $Enums.CrisisType
    severity?: EnumCrisisSeverityFilter<"CrisisIntervention"> | $Enums.CrisisSeverity
    status?: EnumCrisisStatusFilter<"CrisisIntervention"> | $Enums.CrisisStatus
    description?: StringFilter<"CrisisIntervention"> | string
    interventions?: StringNullableListFilter<"CrisisIntervention">
    outcome?: StringNullableFilter<"CrisisIntervention"> | string | null
    referredTo?: StringNullableFilter<"CrisisIntervention"> | string | null
    contactedAt?: DateTimeFilter<"CrisisIntervention"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"CrisisIntervention"> | Date | string | null
    followUpNeeded?: BoolFilter<"CrisisIntervention"> | boolean
    followUpDate?: DateTimeNullableFilter<"CrisisIntervention"> | Date | string | null
    createdAt?: DateTimeFilter<"CrisisIntervention"> | Date | string
    updatedAt?: DateTimeFilter<"CrisisIntervention"> | Date | string
  }

  export type CrisisInterventionOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    responderId?: SortOrderInput | SortOrder
    crisisType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    description?: SortOrder
    interventions?: SortOrder
    outcome?: SortOrderInput | SortOrder
    referredTo?: SortOrderInput | SortOrder
    contactedAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    followUpNeeded?: SortOrder
    followUpDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CrisisInterventionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CrisisInterventionWhereInput | CrisisInterventionWhereInput[]
    OR?: CrisisInterventionWhereInput[]
    NOT?: CrisisInterventionWhereInput | CrisisInterventionWhereInput[]
    patientId?: StringFilter<"CrisisIntervention"> | string
    responderId?: StringNullableFilter<"CrisisIntervention"> | string | null
    crisisType?: EnumCrisisTypeFilter<"CrisisIntervention"> | $Enums.CrisisType
    severity?: EnumCrisisSeverityFilter<"CrisisIntervention"> | $Enums.CrisisSeverity
    status?: EnumCrisisStatusFilter<"CrisisIntervention"> | $Enums.CrisisStatus
    description?: StringFilter<"CrisisIntervention"> | string
    interventions?: StringNullableListFilter<"CrisisIntervention">
    outcome?: StringNullableFilter<"CrisisIntervention"> | string | null
    referredTo?: StringNullableFilter<"CrisisIntervention"> | string | null
    contactedAt?: DateTimeFilter<"CrisisIntervention"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"CrisisIntervention"> | Date | string | null
    followUpNeeded?: BoolFilter<"CrisisIntervention"> | boolean
    followUpDate?: DateTimeNullableFilter<"CrisisIntervention"> | Date | string | null
    createdAt?: DateTimeFilter<"CrisisIntervention"> | Date | string
    updatedAt?: DateTimeFilter<"CrisisIntervention"> | Date | string
  }, "id">

  export type CrisisInterventionOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    responderId?: SortOrderInput | SortOrder
    crisisType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    description?: SortOrder
    interventions?: SortOrder
    outcome?: SortOrderInput | SortOrder
    referredTo?: SortOrderInput | SortOrder
    contactedAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    followUpNeeded?: SortOrder
    followUpDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CrisisInterventionCountOrderByAggregateInput
    _max?: CrisisInterventionMaxOrderByAggregateInput
    _min?: CrisisInterventionMinOrderByAggregateInput
  }

  export type CrisisInterventionScalarWhereWithAggregatesInput = {
    AND?: CrisisInterventionScalarWhereWithAggregatesInput | CrisisInterventionScalarWhereWithAggregatesInput[]
    OR?: CrisisInterventionScalarWhereWithAggregatesInput[]
    NOT?: CrisisInterventionScalarWhereWithAggregatesInput | CrisisInterventionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CrisisIntervention"> | string
    patientId?: StringWithAggregatesFilter<"CrisisIntervention"> | string
    responderId?: StringNullableWithAggregatesFilter<"CrisisIntervention"> | string | null
    crisisType?: EnumCrisisTypeWithAggregatesFilter<"CrisisIntervention"> | $Enums.CrisisType
    severity?: EnumCrisisSeverityWithAggregatesFilter<"CrisisIntervention"> | $Enums.CrisisSeverity
    status?: EnumCrisisStatusWithAggregatesFilter<"CrisisIntervention"> | $Enums.CrisisStatus
    description?: StringWithAggregatesFilter<"CrisisIntervention"> | string
    interventions?: StringNullableListFilter<"CrisisIntervention">
    outcome?: StringNullableWithAggregatesFilter<"CrisisIntervention"> | string | null
    referredTo?: StringNullableWithAggregatesFilter<"CrisisIntervention"> | string | null
    contactedAt?: DateTimeWithAggregatesFilter<"CrisisIntervention"> | Date | string
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"CrisisIntervention"> | Date | string | null
    followUpNeeded?: BoolWithAggregatesFilter<"CrisisIntervention"> | boolean
    followUpDate?: DateTimeNullableWithAggregatesFilter<"CrisisIntervention"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CrisisIntervention"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CrisisIntervention"> | Date | string
  }

  export type TreatmentPlanWhereInput = {
    AND?: TreatmentPlanWhereInput | TreatmentPlanWhereInput[]
    OR?: TreatmentPlanWhereInput[]
    NOT?: TreatmentPlanWhereInput | TreatmentPlanWhereInput[]
    id?: StringFilter<"TreatmentPlan"> | string
    patientId?: StringFilter<"TreatmentPlan"> | string
    providerId?: StringFilter<"TreatmentPlan"> | string
    diagnosis?: StringNullableListFilter<"TreatmentPlan">
    goals?: JsonFilter<"TreatmentPlan">
    interventions?: JsonFilter<"TreatmentPlan">
    medications?: JsonNullableFilter<"TreatmentPlan">
    frequency?: StringNullableFilter<"TreatmentPlan"> | string | null
    startDate?: DateTimeFilter<"TreatmentPlan"> | Date | string
    reviewDate?: DateTimeFilter<"TreatmentPlan"> | Date | string
    status?: StringFilter<"TreatmentPlan"> | string
    createdAt?: DateTimeFilter<"TreatmentPlan"> | Date | string
    updatedAt?: DateTimeFilter<"TreatmentPlan"> | Date | string
  }

  export type TreatmentPlanOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    diagnosis?: SortOrder
    goals?: SortOrder
    interventions?: SortOrder
    medications?: SortOrderInput | SortOrder
    frequency?: SortOrderInput | SortOrder
    startDate?: SortOrder
    reviewDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TreatmentPlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TreatmentPlanWhereInput | TreatmentPlanWhereInput[]
    OR?: TreatmentPlanWhereInput[]
    NOT?: TreatmentPlanWhereInput | TreatmentPlanWhereInput[]
    patientId?: StringFilter<"TreatmentPlan"> | string
    providerId?: StringFilter<"TreatmentPlan"> | string
    diagnosis?: StringNullableListFilter<"TreatmentPlan">
    goals?: JsonFilter<"TreatmentPlan">
    interventions?: JsonFilter<"TreatmentPlan">
    medications?: JsonNullableFilter<"TreatmentPlan">
    frequency?: StringNullableFilter<"TreatmentPlan"> | string | null
    startDate?: DateTimeFilter<"TreatmentPlan"> | Date | string
    reviewDate?: DateTimeFilter<"TreatmentPlan"> | Date | string
    status?: StringFilter<"TreatmentPlan"> | string
    createdAt?: DateTimeFilter<"TreatmentPlan"> | Date | string
    updatedAt?: DateTimeFilter<"TreatmentPlan"> | Date | string
  }, "id">

  export type TreatmentPlanOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    diagnosis?: SortOrder
    goals?: SortOrder
    interventions?: SortOrder
    medications?: SortOrderInput | SortOrder
    frequency?: SortOrderInput | SortOrder
    startDate?: SortOrder
    reviewDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TreatmentPlanCountOrderByAggregateInput
    _max?: TreatmentPlanMaxOrderByAggregateInput
    _min?: TreatmentPlanMinOrderByAggregateInput
  }

  export type TreatmentPlanScalarWhereWithAggregatesInput = {
    AND?: TreatmentPlanScalarWhereWithAggregatesInput | TreatmentPlanScalarWhereWithAggregatesInput[]
    OR?: TreatmentPlanScalarWhereWithAggregatesInput[]
    NOT?: TreatmentPlanScalarWhereWithAggregatesInput | TreatmentPlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TreatmentPlan"> | string
    patientId?: StringWithAggregatesFilter<"TreatmentPlan"> | string
    providerId?: StringWithAggregatesFilter<"TreatmentPlan"> | string
    diagnosis?: StringNullableListFilter<"TreatmentPlan">
    goals?: JsonWithAggregatesFilter<"TreatmentPlan">
    interventions?: JsonWithAggregatesFilter<"TreatmentPlan">
    medications?: JsonNullableWithAggregatesFilter<"TreatmentPlan">
    frequency?: StringNullableWithAggregatesFilter<"TreatmentPlan"> | string | null
    startDate?: DateTimeWithAggregatesFilter<"TreatmentPlan"> | Date | string
    reviewDate?: DateTimeWithAggregatesFilter<"TreatmentPlan"> | Date | string
    status?: StringWithAggregatesFilter<"TreatmentPlan"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TreatmentPlan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TreatmentPlan"> | Date | string
  }

  export type MoodLogWhereInput = {
    AND?: MoodLogWhereInput | MoodLogWhereInput[]
    OR?: MoodLogWhereInput[]
    NOT?: MoodLogWhereInput | MoodLogWhereInput[]
    id?: StringFilter<"MoodLog"> | string
    patientId?: StringFilter<"MoodLog"> | string
    moodRating?: IntFilter<"MoodLog"> | number
    notes?: StringNullableFilter<"MoodLog"> | string | null
    triggers?: StringNullableListFilter<"MoodLog">
    activities?: StringNullableListFilter<"MoodLog">
    logDate?: DateTimeFilter<"MoodLog"> | Date | string
    createdAt?: DateTimeFilter<"MoodLog"> | Date | string
  }

  export type MoodLogOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    moodRating?: SortOrder
    notes?: SortOrderInput | SortOrder
    triggers?: SortOrder
    activities?: SortOrder
    logDate?: SortOrder
    createdAt?: SortOrder
  }

  export type MoodLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MoodLogWhereInput | MoodLogWhereInput[]
    OR?: MoodLogWhereInput[]
    NOT?: MoodLogWhereInput | MoodLogWhereInput[]
    patientId?: StringFilter<"MoodLog"> | string
    moodRating?: IntFilter<"MoodLog"> | number
    notes?: StringNullableFilter<"MoodLog"> | string | null
    triggers?: StringNullableListFilter<"MoodLog">
    activities?: StringNullableListFilter<"MoodLog">
    logDate?: DateTimeFilter<"MoodLog"> | Date | string
    createdAt?: DateTimeFilter<"MoodLog"> | Date | string
  }, "id">

  export type MoodLogOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    moodRating?: SortOrder
    notes?: SortOrderInput | SortOrder
    triggers?: SortOrder
    activities?: SortOrder
    logDate?: SortOrder
    createdAt?: SortOrder
    _count?: MoodLogCountOrderByAggregateInput
    _avg?: MoodLogAvgOrderByAggregateInput
    _max?: MoodLogMaxOrderByAggregateInput
    _min?: MoodLogMinOrderByAggregateInput
    _sum?: MoodLogSumOrderByAggregateInput
  }

  export type MoodLogScalarWhereWithAggregatesInput = {
    AND?: MoodLogScalarWhereWithAggregatesInput | MoodLogScalarWhereWithAggregatesInput[]
    OR?: MoodLogScalarWhereWithAggregatesInput[]
    NOT?: MoodLogScalarWhereWithAggregatesInput | MoodLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MoodLog"> | string
    patientId?: StringWithAggregatesFilter<"MoodLog"> | string
    moodRating?: IntWithAggregatesFilter<"MoodLog"> | number
    notes?: StringNullableWithAggregatesFilter<"MoodLog"> | string | null
    triggers?: StringNullableListFilter<"MoodLog">
    activities?: StringNullableListFilter<"MoodLog">
    logDate?: DateTimeWithAggregatesFilter<"MoodLog"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"MoodLog"> | Date | string
  }

  export type SupportGroupWhereInput = {
    AND?: SupportGroupWhereInput | SupportGroupWhereInput[]
    OR?: SupportGroupWhereInput[]
    NOT?: SupportGroupWhereInput | SupportGroupWhereInput[]
    id?: StringFilter<"SupportGroup"> | string
    name?: StringFilter<"SupportGroup"> | string
    description?: StringFilter<"SupportGroup"> | string
    type?: StringFilter<"SupportGroup"> | string
    facilitatorId?: StringFilter<"SupportGroup"> | string
    schedule?: JsonFilter<"SupportGroup">
    maxMembers?: IntFilter<"SupportGroup"> | number
    isActive?: BoolFilter<"SupportGroup"> | boolean
    createdAt?: DateTimeFilter<"SupportGroup"> | Date | string
    updatedAt?: DateTimeFilter<"SupportGroup"> | Date | string
    members?: SupportGroupMemberListRelationFilter
  }

  export type SupportGroupOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    facilitatorId?: SortOrder
    schedule?: SortOrder
    maxMembers?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    members?: SupportGroupMemberOrderByRelationAggregateInput
  }

  export type SupportGroupWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SupportGroupWhereInput | SupportGroupWhereInput[]
    OR?: SupportGroupWhereInput[]
    NOT?: SupportGroupWhereInput | SupportGroupWhereInput[]
    name?: StringFilter<"SupportGroup"> | string
    description?: StringFilter<"SupportGroup"> | string
    type?: StringFilter<"SupportGroup"> | string
    facilitatorId?: StringFilter<"SupportGroup"> | string
    schedule?: JsonFilter<"SupportGroup">
    maxMembers?: IntFilter<"SupportGroup"> | number
    isActive?: BoolFilter<"SupportGroup"> | boolean
    createdAt?: DateTimeFilter<"SupportGroup"> | Date | string
    updatedAt?: DateTimeFilter<"SupportGroup"> | Date | string
    members?: SupportGroupMemberListRelationFilter
  }, "id">

  export type SupportGroupOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    facilitatorId?: SortOrder
    schedule?: SortOrder
    maxMembers?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SupportGroupCountOrderByAggregateInput
    _avg?: SupportGroupAvgOrderByAggregateInput
    _max?: SupportGroupMaxOrderByAggregateInput
    _min?: SupportGroupMinOrderByAggregateInput
    _sum?: SupportGroupSumOrderByAggregateInput
  }

  export type SupportGroupScalarWhereWithAggregatesInput = {
    AND?: SupportGroupScalarWhereWithAggregatesInput | SupportGroupScalarWhereWithAggregatesInput[]
    OR?: SupportGroupScalarWhereWithAggregatesInput[]
    NOT?: SupportGroupScalarWhereWithAggregatesInput | SupportGroupScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SupportGroup"> | string
    name?: StringWithAggregatesFilter<"SupportGroup"> | string
    description?: StringWithAggregatesFilter<"SupportGroup"> | string
    type?: StringWithAggregatesFilter<"SupportGroup"> | string
    facilitatorId?: StringWithAggregatesFilter<"SupportGroup"> | string
    schedule?: JsonWithAggregatesFilter<"SupportGroup">
    maxMembers?: IntWithAggregatesFilter<"SupportGroup"> | number
    isActive?: BoolWithAggregatesFilter<"SupportGroup"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SupportGroup"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SupportGroup"> | Date | string
  }

  export type SupportGroupMemberWhereInput = {
    AND?: SupportGroupMemberWhereInput | SupportGroupMemberWhereInput[]
    OR?: SupportGroupMemberWhereInput[]
    NOT?: SupportGroupMemberWhereInput | SupportGroupMemberWhereInput[]
    id?: StringFilter<"SupportGroupMember"> | string
    groupId?: StringFilter<"SupportGroupMember"> | string
    patientId?: StringFilter<"SupportGroupMember"> | string
    joinedAt?: DateTimeFilter<"SupportGroupMember"> | Date | string
    status?: StringFilter<"SupportGroupMember"> | string
    group?: XOR<SupportGroupRelationFilter, SupportGroupWhereInput>
  }

  export type SupportGroupMemberOrderByWithRelationInput = {
    id?: SortOrder
    groupId?: SortOrder
    patientId?: SortOrder
    joinedAt?: SortOrder
    status?: SortOrder
    group?: SupportGroupOrderByWithRelationInput
  }

  export type SupportGroupMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    groupId_patientId?: SupportGroupMemberGroupIdPatientIdCompoundUniqueInput
    AND?: SupportGroupMemberWhereInput | SupportGroupMemberWhereInput[]
    OR?: SupportGroupMemberWhereInput[]
    NOT?: SupportGroupMemberWhereInput | SupportGroupMemberWhereInput[]
    groupId?: StringFilter<"SupportGroupMember"> | string
    patientId?: StringFilter<"SupportGroupMember"> | string
    joinedAt?: DateTimeFilter<"SupportGroupMember"> | Date | string
    status?: StringFilter<"SupportGroupMember"> | string
    group?: XOR<SupportGroupRelationFilter, SupportGroupWhereInput>
  }, "id" | "groupId_patientId">

  export type SupportGroupMemberOrderByWithAggregationInput = {
    id?: SortOrder
    groupId?: SortOrder
    patientId?: SortOrder
    joinedAt?: SortOrder
    status?: SortOrder
    _count?: SupportGroupMemberCountOrderByAggregateInput
    _max?: SupportGroupMemberMaxOrderByAggregateInput
    _min?: SupportGroupMemberMinOrderByAggregateInput
  }

  export type SupportGroupMemberScalarWhereWithAggregatesInput = {
    AND?: SupportGroupMemberScalarWhereWithAggregatesInput | SupportGroupMemberScalarWhereWithAggregatesInput[]
    OR?: SupportGroupMemberScalarWhereWithAggregatesInput[]
    NOT?: SupportGroupMemberScalarWhereWithAggregatesInput | SupportGroupMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SupportGroupMember"> | string
    groupId?: StringWithAggregatesFilter<"SupportGroupMember"> | string
    patientId?: StringWithAggregatesFilter<"SupportGroupMember"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"SupportGroupMember"> | Date | string
    status?: StringWithAggregatesFilter<"SupportGroupMember"> | string
  }

  export type ConsentRecordWhereInput = {
    AND?: ConsentRecordWhereInput | ConsentRecordWhereInput[]
    OR?: ConsentRecordWhereInput[]
    NOT?: ConsentRecordWhereInput | ConsentRecordWhereInput[]
    id?: StringFilter<"ConsentRecord"> | string
    patientId?: StringFilter<"ConsentRecord"> | string
    providerId?: StringFilter<"ConsentRecord"> | string
    consentType?: EnumConsentTypeFilter<"ConsentRecord"> | $Enums.ConsentType
    status?: EnumConsentStatusFilter<"ConsentRecord"> | $Enums.ConsentStatus
    signedAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    scope?: StringNullableListFilter<"ConsentRecord">
    notes?: StringNullableFilter<"ConsentRecord"> | string | null
    grantedTo?: StringNullableFilter<"ConsentRecord"> | string | null
    grantedAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    revokedAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    purpose?: StringNullableFilter<"ConsentRecord"> | string | null
    disclosureScope?: StringNullableListFilter<"ConsentRecord">
    substanceUseDisclosure?: BoolFilter<"ConsentRecord"> | boolean
    createdAt?: DateTimeFilter<"ConsentRecord"> | Date | string
    updatedAt?: DateTimeFilter<"ConsentRecord"> | Date | string
  }

  export type ConsentRecordOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    consentType?: SortOrder
    status?: SortOrder
    signedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    scope?: SortOrder
    notes?: SortOrderInput | SortOrder
    grantedTo?: SortOrderInput | SortOrder
    grantedAt?: SortOrderInput | SortOrder
    revokedAt?: SortOrderInput | SortOrder
    purpose?: SortOrderInput | SortOrder
    disclosureScope?: SortOrder
    substanceUseDisclosure?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConsentRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConsentRecordWhereInput | ConsentRecordWhereInput[]
    OR?: ConsentRecordWhereInput[]
    NOT?: ConsentRecordWhereInput | ConsentRecordWhereInput[]
    patientId?: StringFilter<"ConsentRecord"> | string
    providerId?: StringFilter<"ConsentRecord"> | string
    consentType?: EnumConsentTypeFilter<"ConsentRecord"> | $Enums.ConsentType
    status?: EnumConsentStatusFilter<"ConsentRecord"> | $Enums.ConsentStatus
    signedAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    scope?: StringNullableListFilter<"ConsentRecord">
    notes?: StringNullableFilter<"ConsentRecord"> | string | null
    grantedTo?: StringNullableFilter<"ConsentRecord"> | string | null
    grantedAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    revokedAt?: DateTimeNullableFilter<"ConsentRecord"> | Date | string | null
    purpose?: StringNullableFilter<"ConsentRecord"> | string | null
    disclosureScope?: StringNullableListFilter<"ConsentRecord">
    substanceUseDisclosure?: BoolFilter<"ConsentRecord"> | boolean
    createdAt?: DateTimeFilter<"ConsentRecord"> | Date | string
    updatedAt?: DateTimeFilter<"ConsentRecord"> | Date | string
  }, "id">

  export type ConsentRecordOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    consentType?: SortOrder
    status?: SortOrder
    signedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    scope?: SortOrder
    notes?: SortOrderInput | SortOrder
    grantedTo?: SortOrderInput | SortOrder
    grantedAt?: SortOrderInput | SortOrder
    revokedAt?: SortOrderInput | SortOrder
    purpose?: SortOrderInput | SortOrder
    disclosureScope?: SortOrder
    substanceUseDisclosure?: SortOrder
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
    patientId?: StringWithAggregatesFilter<"ConsentRecord"> | string
    providerId?: StringWithAggregatesFilter<"ConsentRecord"> | string
    consentType?: EnumConsentTypeWithAggregatesFilter<"ConsentRecord"> | $Enums.ConsentType
    status?: EnumConsentStatusWithAggregatesFilter<"ConsentRecord"> | $Enums.ConsentStatus
    signedAt?: DateTimeNullableWithAggregatesFilter<"ConsentRecord"> | Date | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"ConsentRecord"> | Date | string | null
    scope?: StringNullableListFilter<"ConsentRecord">
    notes?: StringNullableWithAggregatesFilter<"ConsentRecord"> | string | null
    grantedTo?: StringNullableWithAggregatesFilter<"ConsentRecord"> | string | null
    grantedAt?: DateTimeNullableWithAggregatesFilter<"ConsentRecord"> | Date | string | null
    revokedAt?: DateTimeNullableWithAggregatesFilter<"ConsentRecord"> | Date | string | null
    purpose?: StringNullableWithAggregatesFilter<"ConsentRecord"> | string | null
    disclosureScope?: StringNullableListFilter<"ConsentRecord">
    substanceUseDisclosure?: BoolWithAggregatesFilter<"ConsentRecord"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ConsentRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ConsentRecord"> | Date | string
  }

  export type GroupSessionWhereInput = {
    AND?: GroupSessionWhereInput | GroupSessionWhereInput[]
    OR?: GroupSessionWhereInput[]
    NOT?: GroupSessionWhereInput | GroupSessionWhereInput[]
    id?: StringFilter<"GroupSession"> | string
    name?: StringFilter<"GroupSession"> | string
    medicationName?: StringNullableFilter<"GroupSession"> | string | null
    description?: StringNullableFilter<"GroupSession"> | string | null
    facilitatorId?: StringFilter<"GroupSession"> | string
    sessionType?: EnumGroupSessionTypeFilter<"GroupSession"> | $Enums.GroupSessionType
    status?: EnumGroupSessionStatusFilter<"GroupSession"> | $Enums.GroupSessionStatus
    scheduledAt?: DateTimeFilter<"GroupSession"> | Date | string
    sessionDate?: DateTimeNullableFilter<"GroupSession"> | Date | string | null
    duration?: IntFilter<"GroupSession"> | number
    modality?: StringNullableFilter<"GroupSession"> | string | null
    maxParticipants?: IntFilter<"GroupSession"> | number
    topic?: StringNullableFilter<"GroupSession"> | string | null
    notes?: StringNullableFilter<"GroupSession"> | string | null
    homework?: StringNullableFilter<"GroupSession"> | string | null
    nextSessionDate?: DateTimeNullableFilter<"GroupSession"> | Date | string | null
    actualStartTime?: DateTimeNullableFilter<"GroupSession"> | Date | string | null
    actualEndTime?: DateTimeNullableFilter<"GroupSession"> | Date | string | null
    objectives?: StringNullableListFilter<"GroupSession">
    materials?: JsonNullableFilter<"GroupSession">
    groupId?: StringNullableFilter<"GroupSession"> | string | null
    createdAt?: DateTimeFilter<"GroupSession"> | Date | string
    updatedAt?: DateTimeFilter<"GroupSession"> | Date | string
    attendees?: GroupSessionAttendeeListRelationFilter
  }

  export type GroupSessionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    medicationName?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    facilitatorId?: SortOrder
    sessionType?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    sessionDate?: SortOrderInput | SortOrder
    duration?: SortOrder
    modality?: SortOrderInput | SortOrder
    maxParticipants?: SortOrder
    topic?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    homework?: SortOrderInput | SortOrder
    nextSessionDate?: SortOrderInput | SortOrder
    actualStartTime?: SortOrderInput | SortOrder
    actualEndTime?: SortOrderInput | SortOrder
    objectives?: SortOrder
    materials?: SortOrderInput | SortOrder
    groupId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    attendees?: GroupSessionAttendeeOrderByRelationAggregateInput
  }

  export type GroupSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GroupSessionWhereInput | GroupSessionWhereInput[]
    OR?: GroupSessionWhereInput[]
    NOT?: GroupSessionWhereInput | GroupSessionWhereInput[]
    name?: StringFilter<"GroupSession"> | string
    medicationName?: StringNullableFilter<"GroupSession"> | string | null
    description?: StringNullableFilter<"GroupSession"> | string | null
    facilitatorId?: StringFilter<"GroupSession"> | string
    sessionType?: EnumGroupSessionTypeFilter<"GroupSession"> | $Enums.GroupSessionType
    status?: EnumGroupSessionStatusFilter<"GroupSession"> | $Enums.GroupSessionStatus
    scheduledAt?: DateTimeFilter<"GroupSession"> | Date | string
    sessionDate?: DateTimeNullableFilter<"GroupSession"> | Date | string | null
    duration?: IntFilter<"GroupSession"> | number
    modality?: StringNullableFilter<"GroupSession"> | string | null
    maxParticipants?: IntFilter<"GroupSession"> | number
    topic?: StringNullableFilter<"GroupSession"> | string | null
    notes?: StringNullableFilter<"GroupSession"> | string | null
    homework?: StringNullableFilter<"GroupSession"> | string | null
    nextSessionDate?: DateTimeNullableFilter<"GroupSession"> | Date | string | null
    actualStartTime?: DateTimeNullableFilter<"GroupSession"> | Date | string | null
    actualEndTime?: DateTimeNullableFilter<"GroupSession"> | Date | string | null
    objectives?: StringNullableListFilter<"GroupSession">
    materials?: JsonNullableFilter<"GroupSession">
    groupId?: StringNullableFilter<"GroupSession"> | string | null
    createdAt?: DateTimeFilter<"GroupSession"> | Date | string
    updatedAt?: DateTimeFilter<"GroupSession"> | Date | string
    attendees?: GroupSessionAttendeeListRelationFilter
  }, "id">

  export type GroupSessionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    medicationName?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    facilitatorId?: SortOrder
    sessionType?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    sessionDate?: SortOrderInput | SortOrder
    duration?: SortOrder
    modality?: SortOrderInput | SortOrder
    maxParticipants?: SortOrder
    topic?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    homework?: SortOrderInput | SortOrder
    nextSessionDate?: SortOrderInput | SortOrder
    actualStartTime?: SortOrderInput | SortOrder
    actualEndTime?: SortOrderInput | SortOrder
    objectives?: SortOrder
    materials?: SortOrderInput | SortOrder
    groupId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GroupSessionCountOrderByAggregateInput
    _avg?: GroupSessionAvgOrderByAggregateInput
    _max?: GroupSessionMaxOrderByAggregateInput
    _min?: GroupSessionMinOrderByAggregateInput
    _sum?: GroupSessionSumOrderByAggregateInput
  }

  export type GroupSessionScalarWhereWithAggregatesInput = {
    AND?: GroupSessionScalarWhereWithAggregatesInput | GroupSessionScalarWhereWithAggregatesInput[]
    OR?: GroupSessionScalarWhereWithAggregatesInput[]
    NOT?: GroupSessionScalarWhereWithAggregatesInput | GroupSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GroupSession"> | string
    name?: StringWithAggregatesFilter<"GroupSession"> | string
    medicationName?: StringNullableWithAggregatesFilter<"GroupSession"> | string | null
    description?: StringNullableWithAggregatesFilter<"GroupSession"> | string | null
    facilitatorId?: StringWithAggregatesFilter<"GroupSession"> | string
    sessionType?: EnumGroupSessionTypeWithAggregatesFilter<"GroupSession"> | $Enums.GroupSessionType
    status?: EnumGroupSessionStatusWithAggregatesFilter<"GroupSession"> | $Enums.GroupSessionStatus
    scheduledAt?: DateTimeWithAggregatesFilter<"GroupSession"> | Date | string
    sessionDate?: DateTimeNullableWithAggregatesFilter<"GroupSession"> | Date | string | null
    duration?: IntWithAggregatesFilter<"GroupSession"> | number
    modality?: StringNullableWithAggregatesFilter<"GroupSession"> | string | null
    maxParticipants?: IntWithAggregatesFilter<"GroupSession"> | number
    topic?: StringNullableWithAggregatesFilter<"GroupSession"> | string | null
    notes?: StringNullableWithAggregatesFilter<"GroupSession"> | string | null
    homework?: StringNullableWithAggregatesFilter<"GroupSession"> | string | null
    nextSessionDate?: DateTimeNullableWithAggregatesFilter<"GroupSession"> | Date | string | null
    actualStartTime?: DateTimeNullableWithAggregatesFilter<"GroupSession"> | Date | string | null
    actualEndTime?: DateTimeNullableWithAggregatesFilter<"GroupSession"> | Date | string | null
    objectives?: StringNullableListFilter<"GroupSession">
    materials?: JsonNullableWithAggregatesFilter<"GroupSession">
    groupId?: StringNullableWithAggregatesFilter<"GroupSession"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"GroupSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GroupSession"> | Date | string
  }

  export type GroupSessionAttendeeWhereInput = {
    AND?: GroupSessionAttendeeWhereInput | GroupSessionAttendeeWhereInput[]
    OR?: GroupSessionAttendeeWhereInput[]
    NOT?: GroupSessionAttendeeWhereInput | GroupSessionAttendeeWhereInput[]
    id?: StringFilter<"GroupSessionAttendee"> | string
    sessionId?: StringFilter<"GroupSessionAttendee"> | string
    patientId?: StringFilter<"GroupSessionAttendee"> | string
    attended?: BoolFilter<"GroupSessionAttendee"> | boolean
    notes?: StringNullableFilter<"GroupSessionAttendee"> | string | null
    participation?: StringNullableFilter<"GroupSessionAttendee"> | string | null
    createdAt?: DateTimeFilter<"GroupSessionAttendee"> | Date | string
    session?: XOR<GroupSessionRelationFilter, GroupSessionWhereInput>
  }

  export type GroupSessionAttendeeOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    patientId?: SortOrder
    attended?: SortOrder
    notes?: SortOrderInput | SortOrder
    participation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    session?: GroupSessionOrderByWithRelationInput
  }

  export type GroupSessionAttendeeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionId_patientId?: GroupSessionAttendeeSessionIdPatientIdCompoundUniqueInput
    AND?: GroupSessionAttendeeWhereInput | GroupSessionAttendeeWhereInput[]
    OR?: GroupSessionAttendeeWhereInput[]
    NOT?: GroupSessionAttendeeWhereInput | GroupSessionAttendeeWhereInput[]
    sessionId?: StringFilter<"GroupSessionAttendee"> | string
    patientId?: StringFilter<"GroupSessionAttendee"> | string
    attended?: BoolFilter<"GroupSessionAttendee"> | boolean
    notes?: StringNullableFilter<"GroupSessionAttendee"> | string | null
    participation?: StringNullableFilter<"GroupSessionAttendee"> | string | null
    createdAt?: DateTimeFilter<"GroupSessionAttendee"> | Date | string
    session?: XOR<GroupSessionRelationFilter, GroupSessionWhereInput>
  }, "id" | "sessionId_patientId">

  export type GroupSessionAttendeeOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    patientId?: SortOrder
    attended?: SortOrder
    notes?: SortOrderInput | SortOrder
    participation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: GroupSessionAttendeeCountOrderByAggregateInput
    _max?: GroupSessionAttendeeMaxOrderByAggregateInput
    _min?: GroupSessionAttendeeMinOrderByAggregateInput
  }

  export type GroupSessionAttendeeScalarWhereWithAggregatesInput = {
    AND?: GroupSessionAttendeeScalarWhereWithAggregatesInput | GroupSessionAttendeeScalarWhereWithAggregatesInput[]
    OR?: GroupSessionAttendeeScalarWhereWithAggregatesInput[]
    NOT?: GroupSessionAttendeeScalarWhereWithAggregatesInput | GroupSessionAttendeeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GroupSessionAttendee"> | string
    sessionId?: StringWithAggregatesFilter<"GroupSessionAttendee"> | string
    patientId?: StringWithAggregatesFilter<"GroupSessionAttendee"> | string
    attended?: BoolWithAggregatesFilter<"GroupSessionAttendee"> | boolean
    notes?: StringNullableWithAggregatesFilter<"GroupSessionAttendee"> | string | null
    participation?: StringNullableWithAggregatesFilter<"GroupSessionAttendee"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"GroupSessionAttendee"> | Date | string
  }

  export type PsychMedicationWhereInput = {
    AND?: PsychMedicationWhereInput | PsychMedicationWhereInput[]
    OR?: PsychMedicationWhereInput[]
    NOT?: PsychMedicationWhereInput | PsychMedicationWhereInput[]
    id?: StringFilter<"PsychMedication"> | string
    patientId?: StringFilter<"PsychMedication"> | string
    prescriberId?: StringFilter<"PsychMedication"> | string
    name?: StringFilter<"PsychMedication"> | string
    medicationName?: StringNullableFilter<"PsychMedication"> | string | null
    dosage?: StringFilter<"PsychMedication"> | string
    frequency?: StringFilter<"PsychMedication"> | string
    medicationClass?: EnumMedicationClassFilter<"PsychMedication"> | $Enums.MedicationClass
    status?: EnumMedicationStatusFilter<"PsychMedication"> | $Enums.MedicationStatus
    startDate?: DateTimeFilter<"PsychMedication"> | Date | string
    endDate?: DateTimeNullableFilter<"PsychMedication"> | Date | string | null
    reason?: StringNullableFilter<"PsychMedication"> | string | null
    sideEffects?: StringNullableListFilter<"PsychMedication">
    interactions?: StringNullableListFilter<"PsychMedication">
    notes?: StringNullableFilter<"PsychMedication"> | string | null
    homework?: StringNullableFilter<"PsychMedication"> | string | null
    nextSessionDate?: DateTimeNullableFilter<"PsychMedication"> | Date | string | null
    actualStartTime?: DateTimeNullableFilter<"PsychMedication"> | Date | string | null
    actualEndTime?: DateTimeNullableFilter<"PsychMedication"> | Date | string | null
    createdAt?: DateTimeFilter<"PsychMedication"> | Date | string
    updatedAt?: DateTimeFilter<"PsychMedication"> | Date | string
  }

  export type PsychMedicationOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    prescriberId?: SortOrder
    name?: SortOrder
    medicationName?: SortOrderInput | SortOrder
    dosage?: SortOrder
    frequency?: SortOrder
    medicationClass?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    sideEffects?: SortOrder
    interactions?: SortOrder
    notes?: SortOrderInput | SortOrder
    homework?: SortOrderInput | SortOrder
    nextSessionDate?: SortOrderInput | SortOrder
    actualStartTime?: SortOrderInput | SortOrder
    actualEndTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PsychMedicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PsychMedicationWhereInput | PsychMedicationWhereInput[]
    OR?: PsychMedicationWhereInput[]
    NOT?: PsychMedicationWhereInput | PsychMedicationWhereInput[]
    patientId?: StringFilter<"PsychMedication"> | string
    prescriberId?: StringFilter<"PsychMedication"> | string
    name?: StringFilter<"PsychMedication"> | string
    medicationName?: StringNullableFilter<"PsychMedication"> | string | null
    dosage?: StringFilter<"PsychMedication"> | string
    frequency?: StringFilter<"PsychMedication"> | string
    medicationClass?: EnumMedicationClassFilter<"PsychMedication"> | $Enums.MedicationClass
    status?: EnumMedicationStatusFilter<"PsychMedication"> | $Enums.MedicationStatus
    startDate?: DateTimeFilter<"PsychMedication"> | Date | string
    endDate?: DateTimeNullableFilter<"PsychMedication"> | Date | string | null
    reason?: StringNullableFilter<"PsychMedication"> | string | null
    sideEffects?: StringNullableListFilter<"PsychMedication">
    interactions?: StringNullableListFilter<"PsychMedication">
    notes?: StringNullableFilter<"PsychMedication"> | string | null
    homework?: StringNullableFilter<"PsychMedication"> | string | null
    nextSessionDate?: DateTimeNullableFilter<"PsychMedication"> | Date | string | null
    actualStartTime?: DateTimeNullableFilter<"PsychMedication"> | Date | string | null
    actualEndTime?: DateTimeNullableFilter<"PsychMedication"> | Date | string | null
    createdAt?: DateTimeFilter<"PsychMedication"> | Date | string
    updatedAt?: DateTimeFilter<"PsychMedication"> | Date | string
  }, "id">

  export type PsychMedicationOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    prescriberId?: SortOrder
    name?: SortOrder
    medicationName?: SortOrderInput | SortOrder
    dosage?: SortOrder
    frequency?: SortOrder
    medicationClass?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    sideEffects?: SortOrder
    interactions?: SortOrder
    notes?: SortOrderInput | SortOrder
    homework?: SortOrderInput | SortOrder
    nextSessionDate?: SortOrderInput | SortOrder
    actualStartTime?: SortOrderInput | SortOrder
    actualEndTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PsychMedicationCountOrderByAggregateInput
    _max?: PsychMedicationMaxOrderByAggregateInput
    _min?: PsychMedicationMinOrderByAggregateInput
  }

  export type PsychMedicationScalarWhereWithAggregatesInput = {
    AND?: PsychMedicationScalarWhereWithAggregatesInput | PsychMedicationScalarWhereWithAggregatesInput[]
    OR?: PsychMedicationScalarWhereWithAggregatesInput[]
    NOT?: PsychMedicationScalarWhereWithAggregatesInput | PsychMedicationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PsychMedication"> | string
    patientId?: StringWithAggregatesFilter<"PsychMedication"> | string
    prescriberId?: StringWithAggregatesFilter<"PsychMedication"> | string
    name?: StringWithAggregatesFilter<"PsychMedication"> | string
    medicationName?: StringNullableWithAggregatesFilter<"PsychMedication"> | string | null
    dosage?: StringWithAggregatesFilter<"PsychMedication"> | string
    frequency?: StringWithAggregatesFilter<"PsychMedication"> | string
    medicationClass?: EnumMedicationClassWithAggregatesFilter<"PsychMedication"> | $Enums.MedicationClass
    status?: EnumMedicationStatusWithAggregatesFilter<"PsychMedication"> | $Enums.MedicationStatus
    startDate?: DateTimeWithAggregatesFilter<"PsychMedication"> | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter<"PsychMedication"> | Date | string | null
    reason?: StringNullableWithAggregatesFilter<"PsychMedication"> | string | null
    sideEffects?: StringNullableListFilter<"PsychMedication">
    interactions?: StringNullableListFilter<"PsychMedication">
    notes?: StringNullableWithAggregatesFilter<"PsychMedication"> | string | null
    homework?: StringNullableWithAggregatesFilter<"PsychMedication"> | string | null
    nextSessionDate?: DateTimeNullableWithAggregatesFilter<"PsychMedication"> | Date | string | null
    actualStartTime?: DateTimeNullableWithAggregatesFilter<"PsychMedication"> | Date | string | null
    actualEndTime?: DateTimeNullableWithAggregatesFilter<"PsychMedication"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PsychMedication"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PsychMedication"> | Date | string
  }

  export type ProgressNoteWhereInput = {
    AND?: ProgressNoteWhereInput | ProgressNoteWhereInput[]
    OR?: ProgressNoteWhereInput[]
    NOT?: ProgressNoteWhereInput | ProgressNoteWhereInput[]
    id?: StringFilter<"ProgressNote"> | string
    patientId?: StringFilter<"ProgressNote"> | string
    providerId?: StringFilter<"ProgressNote"> | string
    sessionId?: StringNullableFilter<"ProgressNote"> | string | null
    noteType?: EnumNoteTypeFilter<"ProgressNote"> | $Enums.NoteType
    content?: StringFilter<"ProgressNote"> | string
    diagnosis?: StringNullableListFilter<"ProgressNote">
    interventions?: StringNullableListFilter<"ProgressNote">
    plan?: StringNullableFilter<"ProgressNote"> | string | null
    isSigned?: BoolFilter<"ProgressNote"> | boolean
    signedAt?: DateTimeNullableFilter<"ProgressNote"> | Date | string | null
    createdAt?: DateTimeFilter<"ProgressNote"> | Date | string
    updatedAt?: DateTimeFilter<"ProgressNote"> | Date | string
  }

  export type ProgressNoteOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    sessionId?: SortOrderInput | SortOrder
    noteType?: SortOrder
    content?: SortOrder
    diagnosis?: SortOrder
    interventions?: SortOrder
    plan?: SortOrderInput | SortOrder
    isSigned?: SortOrder
    signedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgressNoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProgressNoteWhereInput | ProgressNoteWhereInput[]
    OR?: ProgressNoteWhereInput[]
    NOT?: ProgressNoteWhereInput | ProgressNoteWhereInput[]
    patientId?: StringFilter<"ProgressNote"> | string
    providerId?: StringFilter<"ProgressNote"> | string
    sessionId?: StringNullableFilter<"ProgressNote"> | string | null
    noteType?: EnumNoteTypeFilter<"ProgressNote"> | $Enums.NoteType
    content?: StringFilter<"ProgressNote"> | string
    diagnosis?: StringNullableListFilter<"ProgressNote">
    interventions?: StringNullableListFilter<"ProgressNote">
    plan?: StringNullableFilter<"ProgressNote"> | string | null
    isSigned?: BoolFilter<"ProgressNote"> | boolean
    signedAt?: DateTimeNullableFilter<"ProgressNote"> | Date | string | null
    createdAt?: DateTimeFilter<"ProgressNote"> | Date | string
    updatedAt?: DateTimeFilter<"ProgressNote"> | Date | string
  }, "id">

  export type ProgressNoteOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    sessionId?: SortOrderInput | SortOrder
    noteType?: SortOrder
    content?: SortOrder
    diagnosis?: SortOrder
    interventions?: SortOrder
    plan?: SortOrderInput | SortOrder
    isSigned?: SortOrder
    signedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProgressNoteCountOrderByAggregateInput
    _max?: ProgressNoteMaxOrderByAggregateInput
    _min?: ProgressNoteMinOrderByAggregateInput
  }

  export type ProgressNoteScalarWhereWithAggregatesInput = {
    AND?: ProgressNoteScalarWhereWithAggregatesInput | ProgressNoteScalarWhereWithAggregatesInput[]
    OR?: ProgressNoteScalarWhereWithAggregatesInput[]
    NOT?: ProgressNoteScalarWhereWithAggregatesInput | ProgressNoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProgressNote"> | string
    patientId?: StringWithAggregatesFilter<"ProgressNote"> | string
    providerId?: StringWithAggregatesFilter<"ProgressNote"> | string
    sessionId?: StringNullableWithAggregatesFilter<"ProgressNote"> | string | null
    noteType?: EnumNoteTypeWithAggregatesFilter<"ProgressNote"> | $Enums.NoteType
    content?: StringWithAggregatesFilter<"ProgressNote"> | string
    diagnosis?: StringNullableListFilter<"ProgressNote">
    interventions?: StringNullableListFilter<"ProgressNote">
    plan?: StringNullableWithAggregatesFilter<"ProgressNote"> | string | null
    isSigned?: BoolWithAggregatesFilter<"ProgressNote"> | boolean
    signedAt?: DateTimeNullableWithAggregatesFilter<"ProgressNote"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProgressNote"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProgressNote"> | Date | string
  }

  export type TreatmentGoalWhereInput = {
    AND?: TreatmentGoalWhereInput | TreatmentGoalWhereInput[]
    OR?: TreatmentGoalWhereInput[]
    NOT?: TreatmentGoalWhereInput | TreatmentGoalWhereInput[]
    id?: StringFilter<"TreatmentGoal"> | string
    treatmentPlanId?: StringFilter<"TreatmentGoal"> | string
    title?: StringFilter<"TreatmentGoal"> | string
    description?: StringNullableFilter<"TreatmentGoal"> | string | null
    targetDate?: DateTimeNullableFilter<"TreatmentGoal"> | Date | string | null
    status?: EnumTreatmentGoalStatusFilter<"TreatmentGoal"> | $Enums.TreatmentGoalStatus
    progress?: IntFilter<"TreatmentGoal"> | number
    interventions?: StringNullableListFilter<"TreatmentGoal">
    strategies?: StringNullableListFilter<"TreatmentGoal">
    measurements?: StringNullableListFilter<"TreatmentGoal">
    notes?: StringNullableFilter<"TreatmentGoal"> | string | null
    homework?: StringNullableFilter<"TreatmentGoal"> | string | null
    nextSessionDate?: DateTimeNullableFilter<"TreatmentGoal"> | Date | string | null
    actualStartTime?: DateTimeNullableFilter<"TreatmentGoal"> | Date | string | null
    actualEndTime?: DateTimeNullableFilter<"TreatmentGoal"> | Date | string | null
    createdAt?: DateTimeFilter<"TreatmentGoal"> | Date | string
    updatedAt?: DateTimeFilter<"TreatmentGoal"> | Date | string
  }

  export type TreatmentGoalOrderByWithRelationInput = {
    id?: SortOrder
    treatmentPlanId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    targetDate?: SortOrderInput | SortOrder
    status?: SortOrder
    progress?: SortOrder
    interventions?: SortOrder
    strategies?: SortOrder
    measurements?: SortOrder
    notes?: SortOrderInput | SortOrder
    homework?: SortOrderInput | SortOrder
    nextSessionDate?: SortOrderInput | SortOrder
    actualStartTime?: SortOrderInput | SortOrder
    actualEndTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TreatmentGoalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TreatmentGoalWhereInput | TreatmentGoalWhereInput[]
    OR?: TreatmentGoalWhereInput[]
    NOT?: TreatmentGoalWhereInput | TreatmentGoalWhereInput[]
    treatmentPlanId?: StringFilter<"TreatmentGoal"> | string
    title?: StringFilter<"TreatmentGoal"> | string
    description?: StringNullableFilter<"TreatmentGoal"> | string | null
    targetDate?: DateTimeNullableFilter<"TreatmentGoal"> | Date | string | null
    status?: EnumTreatmentGoalStatusFilter<"TreatmentGoal"> | $Enums.TreatmentGoalStatus
    progress?: IntFilter<"TreatmentGoal"> | number
    interventions?: StringNullableListFilter<"TreatmentGoal">
    strategies?: StringNullableListFilter<"TreatmentGoal">
    measurements?: StringNullableListFilter<"TreatmentGoal">
    notes?: StringNullableFilter<"TreatmentGoal"> | string | null
    homework?: StringNullableFilter<"TreatmentGoal"> | string | null
    nextSessionDate?: DateTimeNullableFilter<"TreatmentGoal"> | Date | string | null
    actualStartTime?: DateTimeNullableFilter<"TreatmentGoal"> | Date | string | null
    actualEndTime?: DateTimeNullableFilter<"TreatmentGoal"> | Date | string | null
    createdAt?: DateTimeFilter<"TreatmentGoal"> | Date | string
    updatedAt?: DateTimeFilter<"TreatmentGoal"> | Date | string
  }, "id">

  export type TreatmentGoalOrderByWithAggregationInput = {
    id?: SortOrder
    treatmentPlanId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    targetDate?: SortOrderInput | SortOrder
    status?: SortOrder
    progress?: SortOrder
    interventions?: SortOrder
    strategies?: SortOrder
    measurements?: SortOrder
    notes?: SortOrderInput | SortOrder
    homework?: SortOrderInput | SortOrder
    nextSessionDate?: SortOrderInput | SortOrder
    actualStartTime?: SortOrderInput | SortOrder
    actualEndTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TreatmentGoalCountOrderByAggregateInput
    _avg?: TreatmentGoalAvgOrderByAggregateInput
    _max?: TreatmentGoalMaxOrderByAggregateInput
    _min?: TreatmentGoalMinOrderByAggregateInput
    _sum?: TreatmentGoalSumOrderByAggregateInput
  }

  export type TreatmentGoalScalarWhereWithAggregatesInput = {
    AND?: TreatmentGoalScalarWhereWithAggregatesInput | TreatmentGoalScalarWhereWithAggregatesInput[]
    OR?: TreatmentGoalScalarWhereWithAggregatesInput[]
    NOT?: TreatmentGoalScalarWhereWithAggregatesInput | TreatmentGoalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TreatmentGoal"> | string
    treatmentPlanId?: StringWithAggregatesFilter<"TreatmentGoal"> | string
    title?: StringWithAggregatesFilter<"TreatmentGoal"> | string
    description?: StringNullableWithAggregatesFilter<"TreatmentGoal"> | string | null
    targetDate?: DateTimeNullableWithAggregatesFilter<"TreatmentGoal"> | Date | string | null
    status?: EnumTreatmentGoalStatusWithAggregatesFilter<"TreatmentGoal"> | $Enums.TreatmentGoalStatus
    progress?: IntWithAggregatesFilter<"TreatmentGoal"> | number
    interventions?: StringNullableListFilter<"TreatmentGoal">
    strategies?: StringNullableListFilter<"TreatmentGoal">
    measurements?: StringNullableListFilter<"TreatmentGoal">
    notes?: StringNullableWithAggregatesFilter<"TreatmentGoal"> | string | null
    homework?: StringNullableWithAggregatesFilter<"TreatmentGoal"> | string | null
    nextSessionDate?: DateTimeNullableWithAggregatesFilter<"TreatmentGoal"> | Date | string | null
    actualStartTime?: DateTimeNullableWithAggregatesFilter<"TreatmentGoal"> | Date | string | null
    actualEndTime?: DateTimeNullableWithAggregatesFilter<"TreatmentGoal"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TreatmentGoal"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TreatmentGoal"> | Date | string
  }

  export type TherapySessionCreateInput = {
    id?: string
    patientId: string
    therapistId: string
    sessionType: $Enums.SessionType
    status?: $Enums.SessionStatus
    scheduledAt: Date | string
    duration: number
    modality?: string | null
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TherapySessionUncheckedCreateInput = {
    id?: string
    patientId: string
    therapistId: string
    sessionType: $Enums.SessionType
    status?: $Enums.SessionStatus
    scheduledAt: Date | string
    duration: number
    modality?: string | null
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TherapySessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    therapistId?: StringFieldUpdateOperationsInput | string
    sessionType?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    modality?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TherapySessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    therapistId?: StringFieldUpdateOperationsInput | string
    sessionType?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    modality?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TherapySessionCreateManyInput = {
    id?: string
    patientId: string
    therapistId: string
    sessionType: $Enums.SessionType
    status?: $Enums.SessionStatus
    scheduledAt: Date | string
    duration: number
    modality?: string | null
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TherapySessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    therapistId?: StringFieldUpdateOperationsInput | string
    sessionType?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    modality?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TherapySessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    therapistId?: StringFieldUpdateOperationsInput | string
    sessionType?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    modality?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MentalHealthAssessmentCreateInput = {
    id?: string
    patientId: string
    assessedBy: string
    assessmentType: $Enums.AssessmentType
    score?: number | null
    severity?: $Enums.SeverityLevel | null
    results: JsonNullValueInput | InputJsonValue
    notes?: string | null
    followUpRequired?: boolean
    followUpDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MentalHealthAssessmentUncheckedCreateInput = {
    id?: string
    patientId: string
    assessedBy: string
    assessmentType: $Enums.AssessmentType
    score?: number | null
    severity?: $Enums.SeverityLevel | null
    results: JsonNullValueInput | InputJsonValue
    notes?: string | null
    followUpRequired?: boolean
    followUpDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MentalHealthAssessmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    assessedBy?: StringFieldUpdateOperationsInput | string
    assessmentType?: EnumAssessmentTypeFieldUpdateOperationsInput | $Enums.AssessmentType
    score?: NullableIntFieldUpdateOperationsInput | number | null
    severity?: NullableEnumSeverityLevelFieldUpdateOperationsInput | $Enums.SeverityLevel | null
    results?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    followUpDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MentalHealthAssessmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    assessedBy?: StringFieldUpdateOperationsInput | string
    assessmentType?: EnumAssessmentTypeFieldUpdateOperationsInput | $Enums.AssessmentType
    score?: NullableIntFieldUpdateOperationsInput | number | null
    severity?: NullableEnumSeverityLevelFieldUpdateOperationsInput | $Enums.SeverityLevel | null
    results?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    followUpDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MentalHealthAssessmentCreateManyInput = {
    id?: string
    patientId: string
    assessedBy: string
    assessmentType: $Enums.AssessmentType
    score?: number | null
    severity?: $Enums.SeverityLevel | null
    results: JsonNullValueInput | InputJsonValue
    notes?: string | null
    followUpRequired?: boolean
    followUpDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MentalHealthAssessmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    assessedBy?: StringFieldUpdateOperationsInput | string
    assessmentType?: EnumAssessmentTypeFieldUpdateOperationsInput | $Enums.AssessmentType
    score?: NullableIntFieldUpdateOperationsInput | number | null
    severity?: NullableEnumSeverityLevelFieldUpdateOperationsInput | $Enums.SeverityLevel | null
    results?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    followUpDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MentalHealthAssessmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    assessedBy?: StringFieldUpdateOperationsInput | string
    assessmentType?: EnumAssessmentTypeFieldUpdateOperationsInput | $Enums.AssessmentType
    score?: NullableIntFieldUpdateOperationsInput | number | null
    severity?: NullableEnumSeverityLevelFieldUpdateOperationsInput | $Enums.SeverityLevel | null
    results?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    followUpDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrisisInterventionCreateInput = {
    id?: string
    patientId: string
    responderId?: string | null
    crisisType: $Enums.CrisisType
    severity: $Enums.CrisisSeverity
    status?: $Enums.CrisisStatus
    description: string
    interventions?: CrisisInterventionCreateinterventionsInput | string[]
    outcome?: string | null
    referredTo?: string | null
    contactedAt?: Date | string
    resolvedAt?: Date | string | null
    followUpNeeded?: boolean
    followUpDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CrisisInterventionUncheckedCreateInput = {
    id?: string
    patientId: string
    responderId?: string | null
    crisisType: $Enums.CrisisType
    severity: $Enums.CrisisSeverity
    status?: $Enums.CrisisStatus
    description: string
    interventions?: CrisisInterventionCreateinterventionsInput | string[]
    outcome?: string | null
    referredTo?: string | null
    contactedAt?: Date | string
    resolvedAt?: Date | string | null
    followUpNeeded?: boolean
    followUpDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CrisisInterventionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    responderId?: NullableStringFieldUpdateOperationsInput | string | null
    crisisType?: EnumCrisisTypeFieldUpdateOperationsInput | $Enums.CrisisType
    severity?: EnumCrisisSeverityFieldUpdateOperationsInput | $Enums.CrisisSeverity
    status?: EnumCrisisStatusFieldUpdateOperationsInput | $Enums.CrisisStatus
    description?: StringFieldUpdateOperationsInput | string
    interventions?: CrisisInterventionUpdateinterventionsInput | string[]
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    referredTo?: NullableStringFieldUpdateOperationsInput | string | null
    contactedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpNeeded?: BoolFieldUpdateOperationsInput | boolean
    followUpDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrisisInterventionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    responderId?: NullableStringFieldUpdateOperationsInput | string | null
    crisisType?: EnumCrisisTypeFieldUpdateOperationsInput | $Enums.CrisisType
    severity?: EnumCrisisSeverityFieldUpdateOperationsInput | $Enums.CrisisSeverity
    status?: EnumCrisisStatusFieldUpdateOperationsInput | $Enums.CrisisStatus
    description?: StringFieldUpdateOperationsInput | string
    interventions?: CrisisInterventionUpdateinterventionsInput | string[]
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    referredTo?: NullableStringFieldUpdateOperationsInput | string | null
    contactedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpNeeded?: BoolFieldUpdateOperationsInput | boolean
    followUpDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrisisInterventionCreateManyInput = {
    id?: string
    patientId: string
    responderId?: string | null
    crisisType: $Enums.CrisisType
    severity: $Enums.CrisisSeverity
    status?: $Enums.CrisisStatus
    description: string
    interventions?: CrisisInterventionCreateinterventionsInput | string[]
    outcome?: string | null
    referredTo?: string | null
    contactedAt?: Date | string
    resolvedAt?: Date | string | null
    followUpNeeded?: boolean
    followUpDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CrisisInterventionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    responderId?: NullableStringFieldUpdateOperationsInput | string | null
    crisisType?: EnumCrisisTypeFieldUpdateOperationsInput | $Enums.CrisisType
    severity?: EnumCrisisSeverityFieldUpdateOperationsInput | $Enums.CrisisSeverity
    status?: EnumCrisisStatusFieldUpdateOperationsInput | $Enums.CrisisStatus
    description?: StringFieldUpdateOperationsInput | string
    interventions?: CrisisInterventionUpdateinterventionsInput | string[]
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    referredTo?: NullableStringFieldUpdateOperationsInput | string | null
    contactedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpNeeded?: BoolFieldUpdateOperationsInput | boolean
    followUpDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrisisInterventionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    responderId?: NullableStringFieldUpdateOperationsInput | string | null
    crisisType?: EnumCrisisTypeFieldUpdateOperationsInput | $Enums.CrisisType
    severity?: EnumCrisisSeverityFieldUpdateOperationsInput | $Enums.CrisisSeverity
    status?: EnumCrisisStatusFieldUpdateOperationsInput | $Enums.CrisisStatus
    description?: StringFieldUpdateOperationsInput | string
    interventions?: CrisisInterventionUpdateinterventionsInput | string[]
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    referredTo?: NullableStringFieldUpdateOperationsInput | string | null
    contactedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpNeeded?: BoolFieldUpdateOperationsInput | boolean
    followUpDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreatmentPlanCreateInput = {
    id?: string
    patientId: string
    providerId: string
    diagnosis?: TreatmentPlanCreatediagnosisInput | string[]
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    medications?: NullableJsonNullValueInput | InputJsonValue
    frequency?: string | null
    startDate: Date | string
    reviewDate: Date | string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TreatmentPlanUncheckedCreateInput = {
    id?: string
    patientId: string
    providerId: string
    diagnosis?: TreatmentPlanCreatediagnosisInput | string[]
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    medications?: NullableJsonNullValueInput | InputJsonValue
    frequency?: string | null
    startDate: Date | string
    reviewDate: Date | string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TreatmentPlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    diagnosis?: TreatmentPlanUpdatediagnosisInput | string[]
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    medications?: NullableJsonNullValueInput | InputJsonValue
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreatmentPlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    diagnosis?: TreatmentPlanUpdatediagnosisInput | string[]
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    medications?: NullableJsonNullValueInput | InputJsonValue
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreatmentPlanCreateManyInput = {
    id?: string
    patientId: string
    providerId: string
    diagnosis?: TreatmentPlanCreatediagnosisInput | string[]
    goals: JsonNullValueInput | InputJsonValue
    interventions: JsonNullValueInput | InputJsonValue
    medications?: NullableJsonNullValueInput | InputJsonValue
    frequency?: string | null
    startDate: Date | string
    reviewDate: Date | string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TreatmentPlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    diagnosis?: TreatmentPlanUpdatediagnosisInput | string[]
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    medications?: NullableJsonNullValueInput | InputJsonValue
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreatmentPlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    diagnosis?: TreatmentPlanUpdatediagnosisInput | string[]
    goals?: JsonNullValueInput | InputJsonValue
    interventions?: JsonNullValueInput | InputJsonValue
    medications?: NullableJsonNullValueInput | InputJsonValue
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoodLogCreateInput = {
    id?: string
    patientId: string
    moodRating: number
    notes?: string | null
    triggers?: MoodLogCreatetriggersInput | string[]
    activities?: MoodLogCreateactivitiesInput | string[]
    logDate?: Date | string
    createdAt?: Date | string
  }

  export type MoodLogUncheckedCreateInput = {
    id?: string
    patientId: string
    moodRating: number
    notes?: string | null
    triggers?: MoodLogCreatetriggersInput | string[]
    activities?: MoodLogCreateactivitiesInput | string[]
    logDate?: Date | string
    createdAt?: Date | string
  }

  export type MoodLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    moodRating?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    triggers?: MoodLogUpdatetriggersInput | string[]
    activities?: MoodLogUpdateactivitiesInput | string[]
    logDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoodLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    moodRating?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    triggers?: MoodLogUpdatetriggersInput | string[]
    activities?: MoodLogUpdateactivitiesInput | string[]
    logDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoodLogCreateManyInput = {
    id?: string
    patientId: string
    moodRating: number
    notes?: string | null
    triggers?: MoodLogCreatetriggersInput | string[]
    activities?: MoodLogCreateactivitiesInput | string[]
    logDate?: Date | string
    createdAt?: Date | string
  }

  export type MoodLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    moodRating?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    triggers?: MoodLogUpdatetriggersInput | string[]
    activities?: MoodLogUpdateactivitiesInput | string[]
    logDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoodLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    moodRating?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    triggers?: MoodLogUpdatetriggersInput | string[]
    activities?: MoodLogUpdateactivitiesInput | string[]
    logDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupportGroupCreateInput = {
    id?: string
    name: string
    description: string
    type: string
    facilitatorId: string
    schedule: JsonNullValueInput | InputJsonValue
    maxMembers?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: SupportGroupMemberCreateNestedManyWithoutGroupInput
  }

  export type SupportGroupUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    type: string
    facilitatorId: string
    schedule: JsonNullValueInput | InputJsonValue
    maxMembers?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: SupportGroupMemberUncheckedCreateNestedManyWithoutGroupInput
  }

  export type SupportGroupUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    facilitatorId?: StringFieldUpdateOperationsInput | string
    schedule?: JsonNullValueInput | InputJsonValue
    maxMembers?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: SupportGroupMemberUpdateManyWithoutGroupNestedInput
  }

  export type SupportGroupUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    facilitatorId?: StringFieldUpdateOperationsInput | string
    schedule?: JsonNullValueInput | InputJsonValue
    maxMembers?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: SupportGroupMemberUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type SupportGroupCreateManyInput = {
    id?: string
    name: string
    description: string
    type: string
    facilitatorId: string
    schedule: JsonNullValueInput | InputJsonValue
    maxMembers?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupportGroupUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    facilitatorId?: StringFieldUpdateOperationsInput | string
    schedule?: JsonNullValueInput | InputJsonValue
    maxMembers?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupportGroupUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    facilitatorId?: StringFieldUpdateOperationsInput | string
    schedule?: JsonNullValueInput | InputJsonValue
    maxMembers?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupportGroupMemberCreateInput = {
    id?: string
    patientId: string
    joinedAt?: Date | string
    status?: string
    group: SupportGroupCreateNestedOneWithoutMembersInput
  }

  export type SupportGroupMemberUncheckedCreateInput = {
    id?: string
    groupId: string
    patientId: string
    joinedAt?: Date | string
    status?: string
  }

  export type SupportGroupMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    group?: SupportGroupUpdateOneRequiredWithoutMembersNestedInput
  }

  export type SupportGroupMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type SupportGroupMemberCreateManyInput = {
    id?: string
    groupId: string
    patientId: string
    joinedAt?: Date | string
    status?: string
  }

  export type SupportGroupMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type SupportGroupMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ConsentRecordCreateInput = {
    id?: string
    patientId: string
    providerId: string
    consentType: $Enums.ConsentType
    status?: $Enums.ConsentStatus
    signedAt?: Date | string | null
    expiresAt?: Date | string | null
    scope?: ConsentRecordCreatescopeInput | string[]
    notes?: string | null
    grantedTo?: string | null
    grantedAt?: Date | string | null
    revokedAt?: Date | string | null
    purpose?: string | null
    disclosureScope?: ConsentRecordCreatedisclosureScopeInput | string[]
    substanceUseDisclosure?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConsentRecordUncheckedCreateInput = {
    id?: string
    patientId: string
    providerId: string
    consentType: $Enums.ConsentType
    status?: $Enums.ConsentStatus
    signedAt?: Date | string | null
    expiresAt?: Date | string | null
    scope?: ConsentRecordCreatescopeInput | string[]
    notes?: string | null
    grantedTo?: string | null
    grantedAt?: Date | string | null
    revokedAt?: Date | string | null
    purpose?: string | null
    disclosureScope?: ConsentRecordCreatedisclosureScopeInput | string[]
    substanceUseDisclosure?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConsentRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    consentType?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType
    status?: EnumConsentStatusFieldUpdateOperationsInput | $Enums.ConsentStatus
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: ConsentRecordUpdatescopeInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    grantedTo?: NullableStringFieldUpdateOperationsInput | string | null
    grantedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    disclosureScope?: ConsentRecordUpdatedisclosureScopeInput | string[]
    substanceUseDisclosure?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    consentType?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType
    status?: EnumConsentStatusFieldUpdateOperationsInput | $Enums.ConsentStatus
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: ConsentRecordUpdatescopeInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    grantedTo?: NullableStringFieldUpdateOperationsInput | string | null
    grantedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    disclosureScope?: ConsentRecordUpdatedisclosureScopeInput | string[]
    substanceUseDisclosure?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordCreateManyInput = {
    id?: string
    patientId: string
    providerId: string
    consentType: $Enums.ConsentType
    status?: $Enums.ConsentStatus
    signedAt?: Date | string | null
    expiresAt?: Date | string | null
    scope?: ConsentRecordCreatescopeInput | string[]
    notes?: string | null
    grantedTo?: string | null
    grantedAt?: Date | string | null
    revokedAt?: Date | string | null
    purpose?: string | null
    disclosureScope?: ConsentRecordCreatedisclosureScopeInput | string[]
    substanceUseDisclosure?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConsentRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    consentType?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType
    status?: EnumConsentStatusFieldUpdateOperationsInput | $Enums.ConsentStatus
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: ConsentRecordUpdatescopeInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    grantedTo?: NullableStringFieldUpdateOperationsInput | string | null
    grantedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    disclosureScope?: ConsentRecordUpdatedisclosureScopeInput | string[]
    substanceUseDisclosure?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    consentType?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType
    status?: EnumConsentStatusFieldUpdateOperationsInput | $Enums.ConsentStatus
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: ConsentRecordUpdatescopeInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    grantedTo?: NullableStringFieldUpdateOperationsInput | string | null
    grantedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    disclosureScope?: ConsentRecordUpdatedisclosureScopeInput | string[]
    substanceUseDisclosure?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionCreateInput = {
    id?: string
    name: string
    medicationName?: string | null
    description?: string | null
    facilitatorId: string
    sessionType?: $Enums.GroupSessionType
    status?: $Enums.GroupSessionStatus
    scheduledAt: Date | string
    sessionDate?: Date | string | null
    duration: number
    modality?: string | null
    maxParticipants?: number
    topic?: string | null
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    objectives?: GroupSessionCreateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    groupId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendees?: GroupSessionAttendeeCreateNestedManyWithoutSessionInput
  }

  export type GroupSessionUncheckedCreateInput = {
    id?: string
    name: string
    medicationName?: string | null
    description?: string | null
    facilitatorId: string
    sessionType?: $Enums.GroupSessionType
    status?: $Enums.GroupSessionStatus
    scheduledAt: Date | string
    sessionDate?: Date | string | null
    duration: number
    modality?: string | null
    maxParticipants?: number
    topic?: string | null
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    objectives?: GroupSessionCreateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    groupId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendees?: GroupSessionAttendeeUncheckedCreateNestedManyWithoutSessionInput
  }

  export type GroupSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    medicationName?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorId?: StringFieldUpdateOperationsInput | string
    sessionType?: EnumGroupSessionTypeFieldUpdateOperationsInput | $Enums.GroupSessionType
    status?: EnumGroupSessionStatusFieldUpdateOperationsInput | $Enums.GroupSessionStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    modality?: NullableStringFieldUpdateOperationsInput | string | null
    maxParticipants?: IntFieldUpdateOperationsInput | number
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    objectives?: GroupSessionUpdateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendees?: GroupSessionAttendeeUpdateManyWithoutSessionNestedInput
  }

  export type GroupSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    medicationName?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorId?: StringFieldUpdateOperationsInput | string
    sessionType?: EnumGroupSessionTypeFieldUpdateOperationsInput | $Enums.GroupSessionType
    status?: EnumGroupSessionStatusFieldUpdateOperationsInput | $Enums.GroupSessionStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    modality?: NullableStringFieldUpdateOperationsInput | string | null
    maxParticipants?: IntFieldUpdateOperationsInput | number
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    objectives?: GroupSessionUpdateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendees?: GroupSessionAttendeeUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type GroupSessionCreateManyInput = {
    id?: string
    name: string
    medicationName?: string | null
    description?: string | null
    facilitatorId: string
    sessionType?: $Enums.GroupSessionType
    status?: $Enums.GroupSessionStatus
    scheduledAt: Date | string
    sessionDate?: Date | string | null
    duration: number
    modality?: string | null
    maxParticipants?: number
    topic?: string | null
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    objectives?: GroupSessionCreateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    groupId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroupSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    medicationName?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorId?: StringFieldUpdateOperationsInput | string
    sessionType?: EnumGroupSessionTypeFieldUpdateOperationsInput | $Enums.GroupSessionType
    status?: EnumGroupSessionStatusFieldUpdateOperationsInput | $Enums.GroupSessionStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    modality?: NullableStringFieldUpdateOperationsInput | string | null
    maxParticipants?: IntFieldUpdateOperationsInput | number
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    objectives?: GroupSessionUpdateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    medicationName?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorId?: StringFieldUpdateOperationsInput | string
    sessionType?: EnumGroupSessionTypeFieldUpdateOperationsInput | $Enums.GroupSessionType
    status?: EnumGroupSessionStatusFieldUpdateOperationsInput | $Enums.GroupSessionStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    modality?: NullableStringFieldUpdateOperationsInput | string | null
    maxParticipants?: IntFieldUpdateOperationsInput | number
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    objectives?: GroupSessionUpdateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionAttendeeCreateInput = {
    id?: string
    patientId: string
    attended?: boolean
    notes?: string | null
    participation?: string | null
    createdAt?: Date | string
    session: GroupSessionCreateNestedOneWithoutAttendeesInput
  }

  export type GroupSessionAttendeeUncheckedCreateInput = {
    id?: string
    sessionId: string
    patientId: string
    attended?: boolean
    notes?: string | null
    participation?: string | null
    createdAt?: Date | string
  }

  export type GroupSessionAttendeeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    attended?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    participation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: GroupSessionUpdateOneRequiredWithoutAttendeesNestedInput
  }

  export type GroupSessionAttendeeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    attended?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    participation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionAttendeeCreateManyInput = {
    id?: string
    sessionId: string
    patientId: string
    attended?: boolean
    notes?: string | null
    participation?: string | null
    createdAt?: Date | string
  }

  export type GroupSessionAttendeeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    attended?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    participation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionAttendeeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    attended?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    participation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PsychMedicationCreateInput = {
    id?: string
    patientId: string
    prescriberId: string
    name: string
    medicationName?: string | null
    dosage: string
    frequency: string
    medicationClass: $Enums.MedicationClass
    status?: $Enums.MedicationStatus
    startDate: Date | string
    endDate?: Date | string | null
    reason?: string | null
    sideEffects?: PsychMedicationCreatesideEffectsInput | string[]
    interactions?: PsychMedicationCreateinteractionsInput | string[]
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PsychMedicationUncheckedCreateInput = {
    id?: string
    patientId: string
    prescriberId: string
    name: string
    medicationName?: string | null
    dosage: string
    frequency: string
    medicationClass: $Enums.MedicationClass
    status?: $Enums.MedicationStatus
    startDate: Date | string
    endDate?: Date | string | null
    reason?: string | null
    sideEffects?: PsychMedicationCreatesideEffectsInput | string[]
    interactions?: PsychMedicationCreateinteractionsInput | string[]
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PsychMedicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    prescriberId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    medicationName?: NullableStringFieldUpdateOperationsInput | string | null
    dosage?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    medicationClass?: EnumMedicationClassFieldUpdateOperationsInput | $Enums.MedicationClass
    status?: EnumMedicationStatusFieldUpdateOperationsInput | $Enums.MedicationStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    sideEffects?: PsychMedicationUpdatesideEffectsInput | string[]
    interactions?: PsychMedicationUpdateinteractionsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PsychMedicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    prescriberId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    medicationName?: NullableStringFieldUpdateOperationsInput | string | null
    dosage?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    medicationClass?: EnumMedicationClassFieldUpdateOperationsInput | $Enums.MedicationClass
    status?: EnumMedicationStatusFieldUpdateOperationsInput | $Enums.MedicationStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    sideEffects?: PsychMedicationUpdatesideEffectsInput | string[]
    interactions?: PsychMedicationUpdateinteractionsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PsychMedicationCreateManyInput = {
    id?: string
    patientId: string
    prescriberId: string
    name: string
    medicationName?: string | null
    dosage: string
    frequency: string
    medicationClass: $Enums.MedicationClass
    status?: $Enums.MedicationStatus
    startDate: Date | string
    endDate?: Date | string | null
    reason?: string | null
    sideEffects?: PsychMedicationCreatesideEffectsInput | string[]
    interactions?: PsychMedicationCreateinteractionsInput | string[]
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PsychMedicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    prescriberId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    medicationName?: NullableStringFieldUpdateOperationsInput | string | null
    dosage?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    medicationClass?: EnumMedicationClassFieldUpdateOperationsInput | $Enums.MedicationClass
    status?: EnumMedicationStatusFieldUpdateOperationsInput | $Enums.MedicationStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    sideEffects?: PsychMedicationUpdatesideEffectsInput | string[]
    interactions?: PsychMedicationUpdateinteractionsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PsychMedicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    prescriberId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    medicationName?: NullableStringFieldUpdateOperationsInput | string | null
    dosage?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    medicationClass?: EnumMedicationClassFieldUpdateOperationsInput | $Enums.MedicationClass
    status?: EnumMedicationStatusFieldUpdateOperationsInput | $Enums.MedicationStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    sideEffects?: PsychMedicationUpdatesideEffectsInput | string[]
    interactions?: PsychMedicationUpdateinteractionsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressNoteCreateInput = {
    id?: string
    patientId: string
    providerId: string
    sessionId?: string | null
    noteType: $Enums.NoteType
    content: string
    diagnosis?: ProgressNoteCreatediagnosisInput | string[]
    interventions?: ProgressNoteCreateinterventionsInput | string[]
    plan?: string | null
    isSigned?: boolean
    signedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgressNoteUncheckedCreateInput = {
    id?: string
    patientId: string
    providerId: string
    sessionId?: string | null
    noteType: $Enums.NoteType
    content: string
    diagnosis?: ProgressNoteCreatediagnosisInput | string[]
    interventions?: ProgressNoteCreateinterventionsInput | string[]
    plan?: string | null
    isSigned?: boolean
    signedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgressNoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    diagnosis?: ProgressNoteUpdatediagnosisInput | string[]
    interventions?: ProgressNoteUpdateinterventionsInput | string[]
    plan?: NullableStringFieldUpdateOperationsInput | string | null
    isSigned?: BoolFieldUpdateOperationsInput | boolean
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressNoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    diagnosis?: ProgressNoteUpdatediagnosisInput | string[]
    interventions?: ProgressNoteUpdateinterventionsInput | string[]
    plan?: NullableStringFieldUpdateOperationsInput | string | null
    isSigned?: BoolFieldUpdateOperationsInput | boolean
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressNoteCreateManyInput = {
    id?: string
    patientId: string
    providerId: string
    sessionId?: string | null
    noteType: $Enums.NoteType
    content: string
    diagnosis?: ProgressNoteCreatediagnosisInput | string[]
    interventions?: ProgressNoteCreateinterventionsInput | string[]
    plan?: string | null
    isSigned?: boolean
    signedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgressNoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    diagnosis?: ProgressNoteUpdatediagnosisInput | string[]
    interventions?: ProgressNoteUpdateinterventionsInput | string[]
    plan?: NullableStringFieldUpdateOperationsInput | string | null
    isSigned?: BoolFieldUpdateOperationsInput | boolean
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressNoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    diagnosis?: ProgressNoteUpdatediagnosisInput | string[]
    interventions?: ProgressNoteUpdateinterventionsInput | string[]
    plan?: NullableStringFieldUpdateOperationsInput | string | null
    isSigned?: BoolFieldUpdateOperationsInput | boolean
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreatmentGoalCreateInput = {
    id?: string
    treatmentPlanId: string
    title: string
    description?: string | null
    targetDate?: Date | string | null
    status?: $Enums.TreatmentGoalStatus
    progress?: number
    interventions?: TreatmentGoalCreateinterventionsInput | string[]
    strategies?: TreatmentGoalCreatestrategiesInput | string[]
    measurements?: TreatmentGoalCreatemeasurementsInput | string[]
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TreatmentGoalUncheckedCreateInput = {
    id?: string
    treatmentPlanId: string
    title: string
    description?: string | null
    targetDate?: Date | string | null
    status?: $Enums.TreatmentGoalStatus
    progress?: number
    interventions?: TreatmentGoalCreateinterventionsInput | string[]
    strategies?: TreatmentGoalCreatestrategiesInput | string[]
    measurements?: TreatmentGoalCreatemeasurementsInput | string[]
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TreatmentGoalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    treatmentPlanId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTreatmentGoalStatusFieldUpdateOperationsInput | $Enums.TreatmentGoalStatus
    progress?: IntFieldUpdateOperationsInput | number
    interventions?: TreatmentGoalUpdateinterventionsInput | string[]
    strategies?: TreatmentGoalUpdatestrategiesInput | string[]
    measurements?: TreatmentGoalUpdatemeasurementsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreatmentGoalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    treatmentPlanId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTreatmentGoalStatusFieldUpdateOperationsInput | $Enums.TreatmentGoalStatus
    progress?: IntFieldUpdateOperationsInput | number
    interventions?: TreatmentGoalUpdateinterventionsInput | string[]
    strategies?: TreatmentGoalUpdatestrategiesInput | string[]
    measurements?: TreatmentGoalUpdatemeasurementsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreatmentGoalCreateManyInput = {
    id?: string
    treatmentPlanId: string
    title: string
    description?: string | null
    targetDate?: Date | string | null
    status?: $Enums.TreatmentGoalStatus
    progress?: number
    interventions?: TreatmentGoalCreateinterventionsInput | string[]
    strategies?: TreatmentGoalCreatestrategiesInput | string[]
    measurements?: TreatmentGoalCreatemeasurementsInput | string[]
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TreatmentGoalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    treatmentPlanId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTreatmentGoalStatusFieldUpdateOperationsInput | $Enums.TreatmentGoalStatus
    progress?: IntFieldUpdateOperationsInput | number
    interventions?: TreatmentGoalUpdateinterventionsInput | string[]
    strategies?: TreatmentGoalUpdatestrategiesInput | string[]
    measurements?: TreatmentGoalUpdatemeasurementsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreatmentGoalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    treatmentPlanId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTreatmentGoalStatusFieldUpdateOperationsInput | $Enums.TreatmentGoalStatus
    progress?: IntFieldUpdateOperationsInput | number
    interventions?: TreatmentGoalUpdateinterventionsInput | string[]
    strategies?: TreatmentGoalUpdatestrategiesInput | string[]
    measurements?: TreatmentGoalUpdatemeasurementsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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

  export type EnumSessionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionType | EnumSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionTypeFilter<$PrismaModel> | $Enums.SessionType
  }

  export type EnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TherapySessionCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    therapistId?: SortOrder
    sessionType?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    duration?: SortOrder
    modality?: SortOrder
    notes?: SortOrder
    homework?: SortOrder
    nextSessionDate?: SortOrder
    actualStartTime?: SortOrder
    actualEndTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TherapySessionAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type TherapySessionMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    therapistId?: SortOrder
    sessionType?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    duration?: SortOrder
    modality?: SortOrder
    notes?: SortOrder
    homework?: SortOrder
    nextSessionDate?: SortOrder
    actualStartTime?: SortOrder
    actualEndTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TherapySessionMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    therapistId?: SortOrder
    sessionType?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    duration?: SortOrder
    modality?: SortOrder
    notes?: SortOrder
    homework?: SortOrder
    nextSessionDate?: SortOrder
    actualStartTime?: SortOrder
    actualEndTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TherapySessionSumOrderByAggregateInput = {
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

  export type EnumSessionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionType | EnumSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionTypeWithAggregatesFilter<$PrismaModel> | $Enums.SessionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionTypeFilter<$PrismaModel>
    _max?: NestedEnumSessionTypeFilter<$PrismaModel>
  }

  export type EnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
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

  export type EnumAssessmentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentType | EnumAssessmentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AssessmentType[] | ListEnumAssessmentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssessmentType[] | ListEnumAssessmentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAssessmentTypeFilter<$PrismaModel> | $Enums.AssessmentType
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

  export type EnumSeverityLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SeverityLevel | EnumSeverityLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.SeverityLevel[] | ListEnumSeverityLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SeverityLevel[] | ListEnumSeverityLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSeverityLevelNullableFilter<$PrismaModel> | $Enums.SeverityLevel | null
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type MentalHealthAssessmentCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    assessedBy?: SortOrder
    assessmentType?: SortOrder
    score?: SortOrder
    severity?: SortOrder
    results?: SortOrder
    notes?: SortOrder
    followUpRequired?: SortOrder
    followUpDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MentalHealthAssessmentAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type MentalHealthAssessmentMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    assessedBy?: SortOrder
    assessmentType?: SortOrder
    score?: SortOrder
    severity?: SortOrder
    notes?: SortOrder
    followUpRequired?: SortOrder
    followUpDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MentalHealthAssessmentMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    assessedBy?: SortOrder
    assessmentType?: SortOrder
    score?: SortOrder
    severity?: SortOrder
    notes?: SortOrder
    followUpRequired?: SortOrder
    followUpDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MentalHealthAssessmentSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type EnumAssessmentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentType | EnumAssessmentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AssessmentType[] | ListEnumAssessmentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssessmentType[] | ListEnumAssessmentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAssessmentTypeWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssessmentTypeFilter<$PrismaModel>
    _max?: NestedEnumAssessmentTypeFilter<$PrismaModel>
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

  export type EnumSeverityLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SeverityLevel | EnumSeverityLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.SeverityLevel[] | ListEnumSeverityLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SeverityLevel[] | ListEnumSeverityLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSeverityLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.SeverityLevel | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumSeverityLevelNullableFilter<$PrismaModel>
    _max?: NestedEnumSeverityLevelNullableFilter<$PrismaModel>
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumCrisisTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CrisisType | EnumCrisisTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CrisisType[] | ListEnumCrisisTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrisisType[] | ListEnumCrisisTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumCrisisTypeFilter<$PrismaModel> | $Enums.CrisisType
  }

  export type EnumCrisisSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.CrisisSeverity | EnumCrisisSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.CrisisSeverity[] | ListEnumCrisisSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrisisSeverity[] | ListEnumCrisisSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumCrisisSeverityFilter<$PrismaModel> | $Enums.CrisisSeverity
  }

  export type EnumCrisisStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CrisisStatus | EnumCrisisStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CrisisStatus[] | ListEnumCrisisStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrisisStatus[] | ListEnumCrisisStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCrisisStatusFilter<$PrismaModel> | $Enums.CrisisStatus
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type CrisisInterventionCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    responderId?: SortOrder
    crisisType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    description?: SortOrder
    interventions?: SortOrder
    outcome?: SortOrder
    referredTo?: SortOrder
    contactedAt?: SortOrder
    resolvedAt?: SortOrder
    followUpNeeded?: SortOrder
    followUpDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CrisisInterventionMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    responderId?: SortOrder
    crisisType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    description?: SortOrder
    outcome?: SortOrder
    referredTo?: SortOrder
    contactedAt?: SortOrder
    resolvedAt?: SortOrder
    followUpNeeded?: SortOrder
    followUpDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CrisisInterventionMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    responderId?: SortOrder
    crisisType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    description?: SortOrder
    outcome?: SortOrder
    referredTo?: SortOrder
    contactedAt?: SortOrder
    resolvedAt?: SortOrder
    followUpNeeded?: SortOrder
    followUpDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumCrisisTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CrisisType | EnumCrisisTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CrisisType[] | ListEnumCrisisTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrisisType[] | ListEnumCrisisTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumCrisisTypeWithAggregatesFilter<$PrismaModel> | $Enums.CrisisType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCrisisTypeFilter<$PrismaModel>
    _max?: NestedEnumCrisisTypeFilter<$PrismaModel>
  }

  export type EnumCrisisSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CrisisSeverity | EnumCrisisSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.CrisisSeverity[] | ListEnumCrisisSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrisisSeverity[] | ListEnumCrisisSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumCrisisSeverityWithAggregatesFilter<$PrismaModel> | $Enums.CrisisSeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCrisisSeverityFilter<$PrismaModel>
    _max?: NestedEnumCrisisSeverityFilter<$PrismaModel>
  }

  export type EnumCrisisStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CrisisStatus | EnumCrisisStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CrisisStatus[] | ListEnumCrisisStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrisisStatus[] | ListEnumCrisisStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCrisisStatusWithAggregatesFilter<$PrismaModel> | $Enums.CrisisStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCrisisStatusFilter<$PrismaModel>
    _max?: NestedEnumCrisisStatusFilter<$PrismaModel>
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

  export type TreatmentPlanCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    diagnosis?: SortOrder
    goals?: SortOrder
    interventions?: SortOrder
    medications?: SortOrder
    frequency?: SortOrder
    startDate?: SortOrder
    reviewDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TreatmentPlanMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    frequency?: SortOrder
    startDate?: SortOrder
    reviewDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TreatmentPlanMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    frequency?: SortOrder
    startDate?: SortOrder
    reviewDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type MoodLogCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    moodRating?: SortOrder
    notes?: SortOrder
    triggers?: SortOrder
    activities?: SortOrder
    logDate?: SortOrder
    createdAt?: SortOrder
  }

  export type MoodLogAvgOrderByAggregateInput = {
    moodRating?: SortOrder
  }

  export type MoodLogMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    moodRating?: SortOrder
    notes?: SortOrder
    logDate?: SortOrder
    createdAt?: SortOrder
  }

  export type MoodLogMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    moodRating?: SortOrder
    notes?: SortOrder
    logDate?: SortOrder
    createdAt?: SortOrder
  }

  export type MoodLogSumOrderByAggregateInput = {
    moodRating?: SortOrder
  }

  export type SupportGroupMemberListRelationFilter = {
    every?: SupportGroupMemberWhereInput
    some?: SupportGroupMemberWhereInput
    none?: SupportGroupMemberWhereInput
  }

  export type SupportGroupMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SupportGroupCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    facilitatorId?: SortOrder
    schedule?: SortOrder
    maxMembers?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupportGroupAvgOrderByAggregateInput = {
    maxMembers?: SortOrder
  }

  export type SupportGroupMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    facilitatorId?: SortOrder
    maxMembers?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupportGroupMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    facilitatorId?: SortOrder
    maxMembers?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupportGroupSumOrderByAggregateInput = {
    maxMembers?: SortOrder
  }

  export type SupportGroupRelationFilter = {
    is?: SupportGroupWhereInput
    isNot?: SupportGroupWhereInput
  }

  export type SupportGroupMemberGroupIdPatientIdCompoundUniqueInput = {
    groupId: string
    patientId: string
  }

  export type SupportGroupMemberCountOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    patientId?: SortOrder
    joinedAt?: SortOrder
    status?: SortOrder
  }

  export type SupportGroupMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    patientId?: SortOrder
    joinedAt?: SortOrder
    status?: SortOrder
  }

  export type SupportGroupMemberMinOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    patientId?: SortOrder
    joinedAt?: SortOrder
    status?: SortOrder
  }

  export type EnumConsentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentType | EnumConsentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumConsentTypeFilter<$PrismaModel> | $Enums.ConsentType
  }

  export type EnumConsentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentStatus | EnumConsentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConsentStatus[] | ListEnumConsentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsentStatus[] | ListEnumConsentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConsentStatusFilter<$PrismaModel> | $Enums.ConsentStatus
  }

  export type ConsentRecordCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    consentType?: SortOrder
    status?: SortOrder
    signedAt?: SortOrder
    expiresAt?: SortOrder
    scope?: SortOrder
    notes?: SortOrder
    grantedTo?: SortOrder
    grantedAt?: SortOrder
    revokedAt?: SortOrder
    purpose?: SortOrder
    disclosureScope?: SortOrder
    substanceUseDisclosure?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConsentRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    consentType?: SortOrder
    status?: SortOrder
    signedAt?: SortOrder
    expiresAt?: SortOrder
    notes?: SortOrder
    grantedTo?: SortOrder
    grantedAt?: SortOrder
    revokedAt?: SortOrder
    purpose?: SortOrder
    substanceUseDisclosure?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConsentRecordMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    consentType?: SortOrder
    status?: SortOrder
    signedAt?: SortOrder
    expiresAt?: SortOrder
    notes?: SortOrder
    grantedTo?: SortOrder
    grantedAt?: SortOrder
    revokedAt?: SortOrder
    purpose?: SortOrder
    substanceUseDisclosure?: SortOrder
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

  export type EnumConsentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentStatus | EnumConsentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConsentStatus[] | ListEnumConsentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsentStatus[] | ListEnumConsentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConsentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ConsentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConsentStatusFilter<$PrismaModel>
    _max?: NestedEnumConsentStatusFilter<$PrismaModel>
  }

  export type EnumGroupSessionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.GroupSessionType | EnumGroupSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GroupSessionType[] | ListEnumGroupSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.GroupSessionType[] | ListEnumGroupSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumGroupSessionTypeFilter<$PrismaModel> | $Enums.GroupSessionType
  }

  export type EnumGroupSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GroupSessionStatus | EnumGroupSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GroupSessionStatus[] | ListEnumGroupSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GroupSessionStatus[] | ListEnumGroupSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGroupSessionStatusFilter<$PrismaModel> | $Enums.GroupSessionStatus
  }

  export type GroupSessionAttendeeListRelationFilter = {
    every?: GroupSessionAttendeeWhereInput
    some?: GroupSessionAttendeeWhereInput
    none?: GroupSessionAttendeeWhereInput
  }

  export type GroupSessionAttendeeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GroupSessionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    medicationName?: SortOrder
    description?: SortOrder
    facilitatorId?: SortOrder
    sessionType?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    sessionDate?: SortOrder
    duration?: SortOrder
    modality?: SortOrder
    maxParticipants?: SortOrder
    topic?: SortOrder
    notes?: SortOrder
    homework?: SortOrder
    nextSessionDate?: SortOrder
    actualStartTime?: SortOrder
    actualEndTime?: SortOrder
    objectives?: SortOrder
    materials?: SortOrder
    groupId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroupSessionAvgOrderByAggregateInput = {
    duration?: SortOrder
    maxParticipants?: SortOrder
  }

  export type GroupSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    medicationName?: SortOrder
    description?: SortOrder
    facilitatorId?: SortOrder
    sessionType?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    sessionDate?: SortOrder
    duration?: SortOrder
    modality?: SortOrder
    maxParticipants?: SortOrder
    topic?: SortOrder
    notes?: SortOrder
    homework?: SortOrder
    nextSessionDate?: SortOrder
    actualStartTime?: SortOrder
    actualEndTime?: SortOrder
    groupId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroupSessionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    medicationName?: SortOrder
    description?: SortOrder
    facilitatorId?: SortOrder
    sessionType?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    sessionDate?: SortOrder
    duration?: SortOrder
    modality?: SortOrder
    maxParticipants?: SortOrder
    topic?: SortOrder
    notes?: SortOrder
    homework?: SortOrder
    nextSessionDate?: SortOrder
    actualStartTime?: SortOrder
    actualEndTime?: SortOrder
    groupId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroupSessionSumOrderByAggregateInput = {
    duration?: SortOrder
    maxParticipants?: SortOrder
  }

  export type EnumGroupSessionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GroupSessionType | EnumGroupSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GroupSessionType[] | ListEnumGroupSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.GroupSessionType[] | ListEnumGroupSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumGroupSessionTypeWithAggregatesFilter<$PrismaModel> | $Enums.GroupSessionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGroupSessionTypeFilter<$PrismaModel>
    _max?: NestedEnumGroupSessionTypeFilter<$PrismaModel>
  }

  export type EnumGroupSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GroupSessionStatus | EnumGroupSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GroupSessionStatus[] | ListEnumGroupSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GroupSessionStatus[] | ListEnumGroupSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGroupSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.GroupSessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGroupSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumGroupSessionStatusFilter<$PrismaModel>
  }

  export type GroupSessionRelationFilter = {
    is?: GroupSessionWhereInput
    isNot?: GroupSessionWhereInput
  }

  export type GroupSessionAttendeeSessionIdPatientIdCompoundUniqueInput = {
    sessionId: string
    patientId: string
  }

  export type GroupSessionAttendeeCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    patientId?: SortOrder
    attended?: SortOrder
    notes?: SortOrder
    participation?: SortOrder
    createdAt?: SortOrder
  }

  export type GroupSessionAttendeeMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    patientId?: SortOrder
    attended?: SortOrder
    notes?: SortOrder
    participation?: SortOrder
    createdAt?: SortOrder
  }

  export type GroupSessionAttendeeMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    patientId?: SortOrder
    attended?: SortOrder
    notes?: SortOrder
    participation?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumMedicationClassFilter<$PrismaModel = never> = {
    equals?: $Enums.MedicationClass | EnumMedicationClassFieldRefInput<$PrismaModel>
    in?: $Enums.MedicationClass[] | ListEnumMedicationClassFieldRefInput<$PrismaModel>
    notIn?: $Enums.MedicationClass[] | ListEnumMedicationClassFieldRefInput<$PrismaModel>
    not?: NestedEnumMedicationClassFilter<$PrismaModel> | $Enums.MedicationClass
  }

  export type EnumMedicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MedicationStatus | EnumMedicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MedicationStatus[] | ListEnumMedicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MedicationStatus[] | ListEnumMedicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMedicationStatusFilter<$PrismaModel> | $Enums.MedicationStatus
  }

  export type PsychMedicationCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    prescriberId?: SortOrder
    name?: SortOrder
    medicationName?: SortOrder
    dosage?: SortOrder
    frequency?: SortOrder
    medicationClass?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    reason?: SortOrder
    sideEffects?: SortOrder
    interactions?: SortOrder
    notes?: SortOrder
    homework?: SortOrder
    nextSessionDate?: SortOrder
    actualStartTime?: SortOrder
    actualEndTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PsychMedicationMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    prescriberId?: SortOrder
    name?: SortOrder
    medicationName?: SortOrder
    dosage?: SortOrder
    frequency?: SortOrder
    medicationClass?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    reason?: SortOrder
    notes?: SortOrder
    homework?: SortOrder
    nextSessionDate?: SortOrder
    actualStartTime?: SortOrder
    actualEndTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PsychMedicationMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    prescriberId?: SortOrder
    name?: SortOrder
    medicationName?: SortOrder
    dosage?: SortOrder
    frequency?: SortOrder
    medicationClass?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    reason?: SortOrder
    notes?: SortOrder
    homework?: SortOrder
    nextSessionDate?: SortOrder
    actualStartTime?: SortOrder
    actualEndTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumMedicationClassWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MedicationClass | EnumMedicationClassFieldRefInput<$PrismaModel>
    in?: $Enums.MedicationClass[] | ListEnumMedicationClassFieldRefInput<$PrismaModel>
    notIn?: $Enums.MedicationClass[] | ListEnumMedicationClassFieldRefInput<$PrismaModel>
    not?: NestedEnumMedicationClassWithAggregatesFilter<$PrismaModel> | $Enums.MedicationClass
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMedicationClassFilter<$PrismaModel>
    _max?: NestedEnumMedicationClassFilter<$PrismaModel>
  }

  export type EnumMedicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MedicationStatus | EnumMedicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MedicationStatus[] | ListEnumMedicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MedicationStatus[] | ListEnumMedicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMedicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.MedicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMedicationStatusFilter<$PrismaModel>
    _max?: NestedEnumMedicationStatusFilter<$PrismaModel>
  }

  export type EnumNoteTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NoteType | EnumNoteTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNoteTypeFilter<$PrismaModel> | $Enums.NoteType
  }

  export type ProgressNoteCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    sessionId?: SortOrder
    noteType?: SortOrder
    content?: SortOrder
    diagnosis?: SortOrder
    interventions?: SortOrder
    plan?: SortOrder
    isSigned?: SortOrder
    signedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgressNoteMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    sessionId?: SortOrder
    noteType?: SortOrder
    content?: SortOrder
    plan?: SortOrder
    isSigned?: SortOrder
    signedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgressNoteMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    sessionId?: SortOrder
    noteType?: SortOrder
    content?: SortOrder
    plan?: SortOrder
    isSigned?: SortOrder
    signedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumNoteTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NoteType | EnumNoteTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNoteTypeWithAggregatesFilter<$PrismaModel> | $Enums.NoteType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNoteTypeFilter<$PrismaModel>
    _max?: NestedEnumNoteTypeFilter<$PrismaModel>
  }

  export type EnumTreatmentGoalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TreatmentGoalStatus | EnumTreatmentGoalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TreatmentGoalStatus[] | ListEnumTreatmentGoalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TreatmentGoalStatus[] | ListEnumTreatmentGoalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTreatmentGoalStatusFilter<$PrismaModel> | $Enums.TreatmentGoalStatus
  }

  export type TreatmentGoalCountOrderByAggregateInput = {
    id?: SortOrder
    treatmentPlanId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    targetDate?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    interventions?: SortOrder
    strategies?: SortOrder
    measurements?: SortOrder
    notes?: SortOrder
    homework?: SortOrder
    nextSessionDate?: SortOrder
    actualStartTime?: SortOrder
    actualEndTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TreatmentGoalAvgOrderByAggregateInput = {
    progress?: SortOrder
  }

  export type TreatmentGoalMaxOrderByAggregateInput = {
    id?: SortOrder
    treatmentPlanId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    targetDate?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    notes?: SortOrder
    homework?: SortOrder
    nextSessionDate?: SortOrder
    actualStartTime?: SortOrder
    actualEndTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TreatmentGoalMinOrderByAggregateInput = {
    id?: SortOrder
    treatmentPlanId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    targetDate?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    notes?: SortOrder
    homework?: SortOrder
    nextSessionDate?: SortOrder
    actualStartTime?: SortOrder
    actualEndTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TreatmentGoalSumOrderByAggregateInput = {
    progress?: SortOrder
  }

  export type EnumTreatmentGoalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TreatmentGoalStatus | EnumTreatmentGoalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TreatmentGoalStatus[] | ListEnumTreatmentGoalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TreatmentGoalStatus[] | ListEnumTreatmentGoalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTreatmentGoalStatusWithAggregatesFilter<$PrismaModel> | $Enums.TreatmentGoalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTreatmentGoalStatusFilter<$PrismaModel>
    _max?: NestedEnumTreatmentGoalStatusFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumSessionTypeFieldUpdateOperationsInput = {
    set?: $Enums.SessionType
  }

  export type EnumSessionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SessionStatus
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

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumAssessmentTypeFieldUpdateOperationsInput = {
    set?: $Enums.AssessmentType
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableEnumSeverityLevelFieldUpdateOperationsInput = {
    set?: $Enums.SeverityLevel | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type CrisisInterventionCreateinterventionsInput = {
    set: string[]
  }

  export type EnumCrisisTypeFieldUpdateOperationsInput = {
    set?: $Enums.CrisisType
  }

  export type EnumCrisisSeverityFieldUpdateOperationsInput = {
    set?: $Enums.CrisisSeverity
  }

  export type EnumCrisisStatusFieldUpdateOperationsInput = {
    set?: $Enums.CrisisStatus
  }

  export type CrisisInterventionUpdateinterventionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TreatmentPlanCreatediagnosisInput = {
    set: string[]
  }

  export type TreatmentPlanUpdatediagnosisInput = {
    set?: string[]
    push?: string | string[]
  }

  export type MoodLogCreatetriggersInput = {
    set: string[]
  }

  export type MoodLogCreateactivitiesInput = {
    set: string[]
  }

  export type MoodLogUpdatetriggersInput = {
    set?: string[]
    push?: string | string[]
  }

  export type MoodLogUpdateactivitiesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SupportGroupMemberCreateNestedManyWithoutGroupInput = {
    create?: XOR<SupportGroupMemberCreateWithoutGroupInput, SupportGroupMemberUncheckedCreateWithoutGroupInput> | SupportGroupMemberCreateWithoutGroupInput[] | SupportGroupMemberUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: SupportGroupMemberCreateOrConnectWithoutGroupInput | SupportGroupMemberCreateOrConnectWithoutGroupInput[]
    createMany?: SupportGroupMemberCreateManyGroupInputEnvelope
    connect?: SupportGroupMemberWhereUniqueInput | SupportGroupMemberWhereUniqueInput[]
  }

  export type SupportGroupMemberUncheckedCreateNestedManyWithoutGroupInput = {
    create?: XOR<SupportGroupMemberCreateWithoutGroupInput, SupportGroupMemberUncheckedCreateWithoutGroupInput> | SupportGroupMemberCreateWithoutGroupInput[] | SupportGroupMemberUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: SupportGroupMemberCreateOrConnectWithoutGroupInput | SupportGroupMemberCreateOrConnectWithoutGroupInput[]
    createMany?: SupportGroupMemberCreateManyGroupInputEnvelope
    connect?: SupportGroupMemberWhereUniqueInput | SupportGroupMemberWhereUniqueInput[]
  }

  export type SupportGroupMemberUpdateManyWithoutGroupNestedInput = {
    create?: XOR<SupportGroupMemberCreateWithoutGroupInput, SupportGroupMemberUncheckedCreateWithoutGroupInput> | SupportGroupMemberCreateWithoutGroupInput[] | SupportGroupMemberUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: SupportGroupMemberCreateOrConnectWithoutGroupInput | SupportGroupMemberCreateOrConnectWithoutGroupInput[]
    upsert?: SupportGroupMemberUpsertWithWhereUniqueWithoutGroupInput | SupportGroupMemberUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: SupportGroupMemberCreateManyGroupInputEnvelope
    set?: SupportGroupMemberWhereUniqueInput | SupportGroupMemberWhereUniqueInput[]
    disconnect?: SupportGroupMemberWhereUniqueInput | SupportGroupMemberWhereUniqueInput[]
    delete?: SupportGroupMemberWhereUniqueInput | SupportGroupMemberWhereUniqueInput[]
    connect?: SupportGroupMemberWhereUniqueInput | SupportGroupMemberWhereUniqueInput[]
    update?: SupportGroupMemberUpdateWithWhereUniqueWithoutGroupInput | SupportGroupMemberUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: SupportGroupMemberUpdateManyWithWhereWithoutGroupInput | SupportGroupMemberUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: SupportGroupMemberScalarWhereInput | SupportGroupMemberScalarWhereInput[]
  }

  export type SupportGroupMemberUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: XOR<SupportGroupMemberCreateWithoutGroupInput, SupportGroupMemberUncheckedCreateWithoutGroupInput> | SupportGroupMemberCreateWithoutGroupInput[] | SupportGroupMemberUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: SupportGroupMemberCreateOrConnectWithoutGroupInput | SupportGroupMemberCreateOrConnectWithoutGroupInput[]
    upsert?: SupportGroupMemberUpsertWithWhereUniqueWithoutGroupInput | SupportGroupMemberUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: SupportGroupMemberCreateManyGroupInputEnvelope
    set?: SupportGroupMemberWhereUniqueInput | SupportGroupMemberWhereUniqueInput[]
    disconnect?: SupportGroupMemberWhereUniqueInput | SupportGroupMemberWhereUniqueInput[]
    delete?: SupportGroupMemberWhereUniqueInput | SupportGroupMemberWhereUniqueInput[]
    connect?: SupportGroupMemberWhereUniqueInput | SupportGroupMemberWhereUniqueInput[]
    update?: SupportGroupMemberUpdateWithWhereUniqueWithoutGroupInput | SupportGroupMemberUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: SupportGroupMemberUpdateManyWithWhereWithoutGroupInput | SupportGroupMemberUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: SupportGroupMemberScalarWhereInput | SupportGroupMemberScalarWhereInput[]
  }

  export type SupportGroupCreateNestedOneWithoutMembersInput = {
    create?: XOR<SupportGroupCreateWithoutMembersInput, SupportGroupUncheckedCreateWithoutMembersInput>
    connectOrCreate?: SupportGroupCreateOrConnectWithoutMembersInput
    connect?: SupportGroupWhereUniqueInput
  }

  export type SupportGroupUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<SupportGroupCreateWithoutMembersInput, SupportGroupUncheckedCreateWithoutMembersInput>
    connectOrCreate?: SupportGroupCreateOrConnectWithoutMembersInput
    upsert?: SupportGroupUpsertWithoutMembersInput
    connect?: SupportGroupWhereUniqueInput
    update?: XOR<XOR<SupportGroupUpdateToOneWithWhereWithoutMembersInput, SupportGroupUpdateWithoutMembersInput>, SupportGroupUncheckedUpdateWithoutMembersInput>
  }

  export type ConsentRecordCreatescopeInput = {
    set: string[]
  }

  export type ConsentRecordCreatedisclosureScopeInput = {
    set: string[]
  }

  export type EnumConsentTypeFieldUpdateOperationsInput = {
    set?: $Enums.ConsentType
  }

  export type EnumConsentStatusFieldUpdateOperationsInput = {
    set?: $Enums.ConsentStatus
  }

  export type ConsentRecordUpdatescopeInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ConsentRecordUpdatedisclosureScopeInput = {
    set?: string[]
    push?: string | string[]
  }

  export type GroupSessionCreateobjectivesInput = {
    set: string[]
  }

  export type GroupSessionAttendeeCreateNestedManyWithoutSessionInput = {
    create?: XOR<GroupSessionAttendeeCreateWithoutSessionInput, GroupSessionAttendeeUncheckedCreateWithoutSessionInput> | GroupSessionAttendeeCreateWithoutSessionInput[] | GroupSessionAttendeeUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: GroupSessionAttendeeCreateOrConnectWithoutSessionInput | GroupSessionAttendeeCreateOrConnectWithoutSessionInput[]
    createMany?: GroupSessionAttendeeCreateManySessionInputEnvelope
    connect?: GroupSessionAttendeeWhereUniqueInput | GroupSessionAttendeeWhereUniqueInput[]
  }

  export type GroupSessionAttendeeUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<GroupSessionAttendeeCreateWithoutSessionInput, GroupSessionAttendeeUncheckedCreateWithoutSessionInput> | GroupSessionAttendeeCreateWithoutSessionInput[] | GroupSessionAttendeeUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: GroupSessionAttendeeCreateOrConnectWithoutSessionInput | GroupSessionAttendeeCreateOrConnectWithoutSessionInput[]
    createMany?: GroupSessionAttendeeCreateManySessionInputEnvelope
    connect?: GroupSessionAttendeeWhereUniqueInput | GroupSessionAttendeeWhereUniqueInput[]
  }

  export type EnumGroupSessionTypeFieldUpdateOperationsInput = {
    set?: $Enums.GroupSessionType
  }

  export type EnumGroupSessionStatusFieldUpdateOperationsInput = {
    set?: $Enums.GroupSessionStatus
  }

  export type GroupSessionUpdateobjectivesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type GroupSessionAttendeeUpdateManyWithoutSessionNestedInput = {
    create?: XOR<GroupSessionAttendeeCreateWithoutSessionInput, GroupSessionAttendeeUncheckedCreateWithoutSessionInput> | GroupSessionAttendeeCreateWithoutSessionInput[] | GroupSessionAttendeeUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: GroupSessionAttendeeCreateOrConnectWithoutSessionInput | GroupSessionAttendeeCreateOrConnectWithoutSessionInput[]
    upsert?: GroupSessionAttendeeUpsertWithWhereUniqueWithoutSessionInput | GroupSessionAttendeeUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: GroupSessionAttendeeCreateManySessionInputEnvelope
    set?: GroupSessionAttendeeWhereUniqueInput | GroupSessionAttendeeWhereUniqueInput[]
    disconnect?: GroupSessionAttendeeWhereUniqueInput | GroupSessionAttendeeWhereUniqueInput[]
    delete?: GroupSessionAttendeeWhereUniqueInput | GroupSessionAttendeeWhereUniqueInput[]
    connect?: GroupSessionAttendeeWhereUniqueInput | GroupSessionAttendeeWhereUniqueInput[]
    update?: GroupSessionAttendeeUpdateWithWhereUniqueWithoutSessionInput | GroupSessionAttendeeUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: GroupSessionAttendeeUpdateManyWithWhereWithoutSessionInput | GroupSessionAttendeeUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: GroupSessionAttendeeScalarWhereInput | GroupSessionAttendeeScalarWhereInput[]
  }

  export type GroupSessionAttendeeUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<GroupSessionAttendeeCreateWithoutSessionInput, GroupSessionAttendeeUncheckedCreateWithoutSessionInput> | GroupSessionAttendeeCreateWithoutSessionInput[] | GroupSessionAttendeeUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: GroupSessionAttendeeCreateOrConnectWithoutSessionInput | GroupSessionAttendeeCreateOrConnectWithoutSessionInput[]
    upsert?: GroupSessionAttendeeUpsertWithWhereUniqueWithoutSessionInput | GroupSessionAttendeeUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: GroupSessionAttendeeCreateManySessionInputEnvelope
    set?: GroupSessionAttendeeWhereUniqueInput | GroupSessionAttendeeWhereUniqueInput[]
    disconnect?: GroupSessionAttendeeWhereUniqueInput | GroupSessionAttendeeWhereUniqueInput[]
    delete?: GroupSessionAttendeeWhereUniqueInput | GroupSessionAttendeeWhereUniqueInput[]
    connect?: GroupSessionAttendeeWhereUniqueInput | GroupSessionAttendeeWhereUniqueInput[]
    update?: GroupSessionAttendeeUpdateWithWhereUniqueWithoutSessionInput | GroupSessionAttendeeUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: GroupSessionAttendeeUpdateManyWithWhereWithoutSessionInput | GroupSessionAttendeeUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: GroupSessionAttendeeScalarWhereInput | GroupSessionAttendeeScalarWhereInput[]
  }

  export type GroupSessionCreateNestedOneWithoutAttendeesInput = {
    create?: XOR<GroupSessionCreateWithoutAttendeesInput, GroupSessionUncheckedCreateWithoutAttendeesInput>
    connectOrCreate?: GroupSessionCreateOrConnectWithoutAttendeesInput
    connect?: GroupSessionWhereUniqueInput
  }

  export type GroupSessionUpdateOneRequiredWithoutAttendeesNestedInput = {
    create?: XOR<GroupSessionCreateWithoutAttendeesInput, GroupSessionUncheckedCreateWithoutAttendeesInput>
    connectOrCreate?: GroupSessionCreateOrConnectWithoutAttendeesInput
    upsert?: GroupSessionUpsertWithoutAttendeesInput
    connect?: GroupSessionWhereUniqueInput
    update?: XOR<XOR<GroupSessionUpdateToOneWithWhereWithoutAttendeesInput, GroupSessionUpdateWithoutAttendeesInput>, GroupSessionUncheckedUpdateWithoutAttendeesInput>
  }

  export type PsychMedicationCreatesideEffectsInput = {
    set: string[]
  }

  export type PsychMedicationCreateinteractionsInput = {
    set: string[]
  }

  export type EnumMedicationClassFieldUpdateOperationsInput = {
    set?: $Enums.MedicationClass
  }

  export type EnumMedicationStatusFieldUpdateOperationsInput = {
    set?: $Enums.MedicationStatus
  }

  export type PsychMedicationUpdatesideEffectsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PsychMedicationUpdateinteractionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProgressNoteCreatediagnosisInput = {
    set: string[]
  }

  export type ProgressNoteCreateinterventionsInput = {
    set: string[]
  }

  export type EnumNoteTypeFieldUpdateOperationsInput = {
    set?: $Enums.NoteType
  }

  export type ProgressNoteUpdatediagnosisInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProgressNoteUpdateinterventionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TreatmentGoalCreateinterventionsInput = {
    set: string[]
  }

  export type TreatmentGoalCreatestrategiesInput = {
    set: string[]
  }

  export type TreatmentGoalCreatemeasurementsInput = {
    set: string[]
  }

  export type EnumTreatmentGoalStatusFieldUpdateOperationsInput = {
    set?: $Enums.TreatmentGoalStatus
  }

  export type TreatmentGoalUpdateinterventionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TreatmentGoalUpdatestrategiesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TreatmentGoalUpdatemeasurementsInput = {
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

  export type NestedEnumSessionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionType | EnumSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionTypeFilter<$PrismaModel> | $Enums.SessionType
  }

  export type NestedEnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
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

  export type NestedEnumSessionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionType | EnumSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionTypeWithAggregatesFilter<$PrismaModel> | $Enums.SessionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionTypeFilter<$PrismaModel>
    _max?: NestedEnumSessionTypeFilter<$PrismaModel>
  }

  export type NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
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

  export type NestedEnumAssessmentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentType | EnumAssessmentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AssessmentType[] | ListEnumAssessmentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssessmentType[] | ListEnumAssessmentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAssessmentTypeFilter<$PrismaModel> | $Enums.AssessmentType
  }

  export type NestedEnumSeverityLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SeverityLevel | EnumSeverityLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.SeverityLevel[] | ListEnumSeverityLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SeverityLevel[] | ListEnumSeverityLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSeverityLevelNullableFilter<$PrismaModel> | $Enums.SeverityLevel | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumAssessmentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentType | EnumAssessmentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AssessmentType[] | ListEnumAssessmentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssessmentType[] | ListEnumAssessmentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAssessmentTypeWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssessmentTypeFilter<$PrismaModel>
    _max?: NestedEnumAssessmentTypeFilter<$PrismaModel>
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

  export type NestedEnumSeverityLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SeverityLevel | EnumSeverityLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.SeverityLevel[] | ListEnumSeverityLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SeverityLevel[] | ListEnumSeverityLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSeverityLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.SeverityLevel | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumSeverityLevelNullableFilter<$PrismaModel>
    _max?: NestedEnumSeverityLevelNullableFilter<$PrismaModel>
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumCrisisTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CrisisType | EnumCrisisTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CrisisType[] | ListEnumCrisisTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrisisType[] | ListEnumCrisisTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumCrisisTypeFilter<$PrismaModel> | $Enums.CrisisType
  }

  export type NestedEnumCrisisSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.CrisisSeverity | EnumCrisisSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.CrisisSeverity[] | ListEnumCrisisSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrisisSeverity[] | ListEnumCrisisSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumCrisisSeverityFilter<$PrismaModel> | $Enums.CrisisSeverity
  }

  export type NestedEnumCrisisStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CrisisStatus | EnumCrisisStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CrisisStatus[] | ListEnumCrisisStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrisisStatus[] | ListEnumCrisisStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCrisisStatusFilter<$PrismaModel> | $Enums.CrisisStatus
  }

  export type NestedEnumCrisisTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CrisisType | EnumCrisisTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CrisisType[] | ListEnumCrisisTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrisisType[] | ListEnumCrisisTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumCrisisTypeWithAggregatesFilter<$PrismaModel> | $Enums.CrisisType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCrisisTypeFilter<$PrismaModel>
    _max?: NestedEnumCrisisTypeFilter<$PrismaModel>
  }

  export type NestedEnumCrisisSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CrisisSeverity | EnumCrisisSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.CrisisSeverity[] | ListEnumCrisisSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrisisSeverity[] | ListEnumCrisisSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumCrisisSeverityWithAggregatesFilter<$PrismaModel> | $Enums.CrisisSeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCrisisSeverityFilter<$PrismaModel>
    _max?: NestedEnumCrisisSeverityFilter<$PrismaModel>
  }

  export type NestedEnumCrisisStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CrisisStatus | EnumCrisisStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CrisisStatus[] | ListEnumCrisisStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrisisStatus[] | ListEnumCrisisStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCrisisStatusWithAggregatesFilter<$PrismaModel> | $Enums.CrisisStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCrisisStatusFilter<$PrismaModel>
    _max?: NestedEnumCrisisStatusFilter<$PrismaModel>
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

  export type NestedEnumConsentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentType | EnumConsentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumConsentTypeFilter<$PrismaModel> | $Enums.ConsentType
  }

  export type NestedEnumConsentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentStatus | EnumConsentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConsentStatus[] | ListEnumConsentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsentStatus[] | ListEnumConsentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConsentStatusFilter<$PrismaModel> | $Enums.ConsentStatus
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

  export type NestedEnumConsentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentStatus | EnumConsentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConsentStatus[] | ListEnumConsentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsentStatus[] | ListEnumConsentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConsentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ConsentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConsentStatusFilter<$PrismaModel>
    _max?: NestedEnumConsentStatusFilter<$PrismaModel>
  }

  export type NestedEnumGroupSessionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.GroupSessionType | EnumGroupSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GroupSessionType[] | ListEnumGroupSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.GroupSessionType[] | ListEnumGroupSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumGroupSessionTypeFilter<$PrismaModel> | $Enums.GroupSessionType
  }

  export type NestedEnumGroupSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GroupSessionStatus | EnumGroupSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GroupSessionStatus[] | ListEnumGroupSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GroupSessionStatus[] | ListEnumGroupSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGroupSessionStatusFilter<$PrismaModel> | $Enums.GroupSessionStatus
  }

  export type NestedEnumGroupSessionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GroupSessionType | EnumGroupSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GroupSessionType[] | ListEnumGroupSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.GroupSessionType[] | ListEnumGroupSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumGroupSessionTypeWithAggregatesFilter<$PrismaModel> | $Enums.GroupSessionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGroupSessionTypeFilter<$PrismaModel>
    _max?: NestedEnumGroupSessionTypeFilter<$PrismaModel>
  }

  export type NestedEnumGroupSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GroupSessionStatus | EnumGroupSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GroupSessionStatus[] | ListEnumGroupSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GroupSessionStatus[] | ListEnumGroupSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGroupSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.GroupSessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGroupSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumGroupSessionStatusFilter<$PrismaModel>
  }

  export type NestedEnumMedicationClassFilter<$PrismaModel = never> = {
    equals?: $Enums.MedicationClass | EnumMedicationClassFieldRefInput<$PrismaModel>
    in?: $Enums.MedicationClass[] | ListEnumMedicationClassFieldRefInput<$PrismaModel>
    notIn?: $Enums.MedicationClass[] | ListEnumMedicationClassFieldRefInput<$PrismaModel>
    not?: NestedEnumMedicationClassFilter<$PrismaModel> | $Enums.MedicationClass
  }

  export type NestedEnumMedicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MedicationStatus | EnumMedicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MedicationStatus[] | ListEnumMedicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MedicationStatus[] | ListEnumMedicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMedicationStatusFilter<$PrismaModel> | $Enums.MedicationStatus
  }

  export type NestedEnumMedicationClassWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MedicationClass | EnumMedicationClassFieldRefInput<$PrismaModel>
    in?: $Enums.MedicationClass[] | ListEnumMedicationClassFieldRefInput<$PrismaModel>
    notIn?: $Enums.MedicationClass[] | ListEnumMedicationClassFieldRefInput<$PrismaModel>
    not?: NestedEnumMedicationClassWithAggregatesFilter<$PrismaModel> | $Enums.MedicationClass
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMedicationClassFilter<$PrismaModel>
    _max?: NestedEnumMedicationClassFilter<$PrismaModel>
  }

  export type NestedEnumMedicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MedicationStatus | EnumMedicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MedicationStatus[] | ListEnumMedicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MedicationStatus[] | ListEnumMedicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMedicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.MedicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMedicationStatusFilter<$PrismaModel>
    _max?: NestedEnumMedicationStatusFilter<$PrismaModel>
  }

  export type NestedEnumNoteTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NoteType | EnumNoteTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNoteTypeFilter<$PrismaModel> | $Enums.NoteType
  }

  export type NestedEnumNoteTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NoteType | EnumNoteTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNoteTypeWithAggregatesFilter<$PrismaModel> | $Enums.NoteType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNoteTypeFilter<$PrismaModel>
    _max?: NestedEnumNoteTypeFilter<$PrismaModel>
  }

  export type NestedEnumTreatmentGoalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TreatmentGoalStatus | EnumTreatmentGoalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TreatmentGoalStatus[] | ListEnumTreatmentGoalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TreatmentGoalStatus[] | ListEnumTreatmentGoalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTreatmentGoalStatusFilter<$PrismaModel> | $Enums.TreatmentGoalStatus
  }

  export type NestedEnumTreatmentGoalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TreatmentGoalStatus | EnumTreatmentGoalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TreatmentGoalStatus[] | ListEnumTreatmentGoalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TreatmentGoalStatus[] | ListEnumTreatmentGoalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTreatmentGoalStatusWithAggregatesFilter<$PrismaModel> | $Enums.TreatmentGoalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTreatmentGoalStatusFilter<$PrismaModel>
    _max?: NestedEnumTreatmentGoalStatusFilter<$PrismaModel>
  }

  export type SupportGroupMemberCreateWithoutGroupInput = {
    id?: string
    patientId: string
    joinedAt?: Date | string
    status?: string
  }

  export type SupportGroupMemberUncheckedCreateWithoutGroupInput = {
    id?: string
    patientId: string
    joinedAt?: Date | string
    status?: string
  }

  export type SupportGroupMemberCreateOrConnectWithoutGroupInput = {
    where: SupportGroupMemberWhereUniqueInput
    create: XOR<SupportGroupMemberCreateWithoutGroupInput, SupportGroupMemberUncheckedCreateWithoutGroupInput>
  }

  export type SupportGroupMemberCreateManyGroupInputEnvelope = {
    data: SupportGroupMemberCreateManyGroupInput | SupportGroupMemberCreateManyGroupInput[]
    skipDuplicates?: boolean
  }

  export type SupportGroupMemberUpsertWithWhereUniqueWithoutGroupInput = {
    where: SupportGroupMemberWhereUniqueInput
    update: XOR<SupportGroupMemberUpdateWithoutGroupInput, SupportGroupMemberUncheckedUpdateWithoutGroupInput>
    create: XOR<SupportGroupMemberCreateWithoutGroupInput, SupportGroupMemberUncheckedCreateWithoutGroupInput>
  }

  export type SupportGroupMemberUpdateWithWhereUniqueWithoutGroupInput = {
    where: SupportGroupMemberWhereUniqueInput
    data: XOR<SupportGroupMemberUpdateWithoutGroupInput, SupportGroupMemberUncheckedUpdateWithoutGroupInput>
  }

  export type SupportGroupMemberUpdateManyWithWhereWithoutGroupInput = {
    where: SupportGroupMemberScalarWhereInput
    data: XOR<SupportGroupMemberUpdateManyMutationInput, SupportGroupMemberUncheckedUpdateManyWithoutGroupInput>
  }

  export type SupportGroupMemberScalarWhereInput = {
    AND?: SupportGroupMemberScalarWhereInput | SupportGroupMemberScalarWhereInput[]
    OR?: SupportGroupMemberScalarWhereInput[]
    NOT?: SupportGroupMemberScalarWhereInput | SupportGroupMemberScalarWhereInput[]
    id?: StringFilter<"SupportGroupMember"> | string
    groupId?: StringFilter<"SupportGroupMember"> | string
    patientId?: StringFilter<"SupportGroupMember"> | string
    joinedAt?: DateTimeFilter<"SupportGroupMember"> | Date | string
    status?: StringFilter<"SupportGroupMember"> | string
  }

  export type SupportGroupCreateWithoutMembersInput = {
    id?: string
    name: string
    description: string
    type: string
    facilitatorId: string
    schedule: JsonNullValueInput | InputJsonValue
    maxMembers?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupportGroupUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    description: string
    type: string
    facilitatorId: string
    schedule: JsonNullValueInput | InputJsonValue
    maxMembers?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupportGroupCreateOrConnectWithoutMembersInput = {
    where: SupportGroupWhereUniqueInput
    create: XOR<SupportGroupCreateWithoutMembersInput, SupportGroupUncheckedCreateWithoutMembersInput>
  }

  export type SupportGroupUpsertWithoutMembersInput = {
    update: XOR<SupportGroupUpdateWithoutMembersInput, SupportGroupUncheckedUpdateWithoutMembersInput>
    create: XOR<SupportGroupCreateWithoutMembersInput, SupportGroupUncheckedCreateWithoutMembersInput>
    where?: SupportGroupWhereInput
  }

  export type SupportGroupUpdateToOneWithWhereWithoutMembersInput = {
    where?: SupportGroupWhereInput
    data: XOR<SupportGroupUpdateWithoutMembersInput, SupportGroupUncheckedUpdateWithoutMembersInput>
  }

  export type SupportGroupUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    facilitatorId?: StringFieldUpdateOperationsInput | string
    schedule?: JsonNullValueInput | InputJsonValue
    maxMembers?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupportGroupUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    facilitatorId?: StringFieldUpdateOperationsInput | string
    schedule?: JsonNullValueInput | InputJsonValue
    maxMembers?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionAttendeeCreateWithoutSessionInput = {
    id?: string
    patientId: string
    attended?: boolean
    notes?: string | null
    participation?: string | null
    createdAt?: Date | string
  }

  export type GroupSessionAttendeeUncheckedCreateWithoutSessionInput = {
    id?: string
    patientId: string
    attended?: boolean
    notes?: string | null
    participation?: string | null
    createdAt?: Date | string
  }

  export type GroupSessionAttendeeCreateOrConnectWithoutSessionInput = {
    where: GroupSessionAttendeeWhereUniqueInput
    create: XOR<GroupSessionAttendeeCreateWithoutSessionInput, GroupSessionAttendeeUncheckedCreateWithoutSessionInput>
  }

  export type GroupSessionAttendeeCreateManySessionInputEnvelope = {
    data: GroupSessionAttendeeCreateManySessionInput | GroupSessionAttendeeCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type GroupSessionAttendeeUpsertWithWhereUniqueWithoutSessionInput = {
    where: GroupSessionAttendeeWhereUniqueInput
    update: XOR<GroupSessionAttendeeUpdateWithoutSessionInput, GroupSessionAttendeeUncheckedUpdateWithoutSessionInput>
    create: XOR<GroupSessionAttendeeCreateWithoutSessionInput, GroupSessionAttendeeUncheckedCreateWithoutSessionInput>
  }

  export type GroupSessionAttendeeUpdateWithWhereUniqueWithoutSessionInput = {
    where: GroupSessionAttendeeWhereUniqueInput
    data: XOR<GroupSessionAttendeeUpdateWithoutSessionInput, GroupSessionAttendeeUncheckedUpdateWithoutSessionInput>
  }

  export type GroupSessionAttendeeUpdateManyWithWhereWithoutSessionInput = {
    where: GroupSessionAttendeeScalarWhereInput
    data: XOR<GroupSessionAttendeeUpdateManyMutationInput, GroupSessionAttendeeUncheckedUpdateManyWithoutSessionInput>
  }

  export type GroupSessionAttendeeScalarWhereInput = {
    AND?: GroupSessionAttendeeScalarWhereInput | GroupSessionAttendeeScalarWhereInput[]
    OR?: GroupSessionAttendeeScalarWhereInput[]
    NOT?: GroupSessionAttendeeScalarWhereInput | GroupSessionAttendeeScalarWhereInput[]
    id?: StringFilter<"GroupSessionAttendee"> | string
    sessionId?: StringFilter<"GroupSessionAttendee"> | string
    patientId?: StringFilter<"GroupSessionAttendee"> | string
    attended?: BoolFilter<"GroupSessionAttendee"> | boolean
    notes?: StringNullableFilter<"GroupSessionAttendee"> | string | null
    participation?: StringNullableFilter<"GroupSessionAttendee"> | string | null
    createdAt?: DateTimeFilter<"GroupSessionAttendee"> | Date | string
  }

  export type GroupSessionCreateWithoutAttendeesInput = {
    id?: string
    name: string
    medicationName?: string | null
    description?: string | null
    facilitatorId: string
    sessionType?: $Enums.GroupSessionType
    status?: $Enums.GroupSessionStatus
    scheduledAt: Date | string
    sessionDate?: Date | string | null
    duration: number
    modality?: string | null
    maxParticipants?: number
    topic?: string | null
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    objectives?: GroupSessionCreateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    groupId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroupSessionUncheckedCreateWithoutAttendeesInput = {
    id?: string
    name: string
    medicationName?: string | null
    description?: string | null
    facilitatorId: string
    sessionType?: $Enums.GroupSessionType
    status?: $Enums.GroupSessionStatus
    scheduledAt: Date | string
    sessionDate?: Date | string | null
    duration: number
    modality?: string | null
    maxParticipants?: number
    topic?: string | null
    notes?: string | null
    homework?: string | null
    nextSessionDate?: Date | string | null
    actualStartTime?: Date | string | null
    actualEndTime?: Date | string | null
    objectives?: GroupSessionCreateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    groupId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroupSessionCreateOrConnectWithoutAttendeesInput = {
    where: GroupSessionWhereUniqueInput
    create: XOR<GroupSessionCreateWithoutAttendeesInput, GroupSessionUncheckedCreateWithoutAttendeesInput>
  }

  export type GroupSessionUpsertWithoutAttendeesInput = {
    update: XOR<GroupSessionUpdateWithoutAttendeesInput, GroupSessionUncheckedUpdateWithoutAttendeesInput>
    create: XOR<GroupSessionCreateWithoutAttendeesInput, GroupSessionUncheckedCreateWithoutAttendeesInput>
    where?: GroupSessionWhereInput
  }

  export type GroupSessionUpdateToOneWithWhereWithoutAttendeesInput = {
    where?: GroupSessionWhereInput
    data: XOR<GroupSessionUpdateWithoutAttendeesInput, GroupSessionUncheckedUpdateWithoutAttendeesInput>
  }

  export type GroupSessionUpdateWithoutAttendeesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    medicationName?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorId?: StringFieldUpdateOperationsInput | string
    sessionType?: EnumGroupSessionTypeFieldUpdateOperationsInput | $Enums.GroupSessionType
    status?: EnumGroupSessionStatusFieldUpdateOperationsInput | $Enums.GroupSessionStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    modality?: NullableStringFieldUpdateOperationsInput | string | null
    maxParticipants?: IntFieldUpdateOperationsInput | number
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    objectives?: GroupSessionUpdateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionUncheckedUpdateWithoutAttendeesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    medicationName?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorId?: StringFieldUpdateOperationsInput | string
    sessionType?: EnumGroupSessionTypeFieldUpdateOperationsInput | $Enums.GroupSessionType
    status?: EnumGroupSessionStatusFieldUpdateOperationsInput | $Enums.GroupSessionStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    modality?: NullableStringFieldUpdateOperationsInput | string | null
    maxParticipants?: IntFieldUpdateOperationsInput | number
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    homework?: NullableStringFieldUpdateOperationsInput | string | null
    nextSessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    objectives?: GroupSessionUpdateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupportGroupMemberCreateManyGroupInput = {
    id?: string
    patientId: string
    joinedAt?: Date | string
    status?: string
  }

  export type SupportGroupMemberUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type SupportGroupMemberUncheckedUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type SupportGroupMemberUncheckedUpdateManyWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type GroupSessionAttendeeCreateManySessionInput = {
    id?: string
    patientId: string
    attended?: boolean
    notes?: string | null
    participation?: string | null
    createdAt?: Date | string
  }

  export type GroupSessionAttendeeUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    attended?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    participation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionAttendeeUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    attended?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    participation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionAttendeeUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    attended?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    participation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use SupportGroupCountOutputTypeDefaultArgs instead
     */
    export type SupportGroupCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SupportGroupCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GroupSessionCountOutputTypeDefaultArgs instead
     */
    export type GroupSessionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GroupSessionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TherapySessionDefaultArgs instead
     */
    export type TherapySessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TherapySessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MentalHealthAssessmentDefaultArgs instead
     */
    export type MentalHealthAssessmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MentalHealthAssessmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CrisisInterventionDefaultArgs instead
     */
    export type CrisisInterventionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CrisisInterventionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TreatmentPlanDefaultArgs instead
     */
    export type TreatmentPlanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TreatmentPlanDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MoodLogDefaultArgs instead
     */
    export type MoodLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MoodLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SupportGroupDefaultArgs instead
     */
    export type SupportGroupArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SupportGroupDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SupportGroupMemberDefaultArgs instead
     */
    export type SupportGroupMemberArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SupportGroupMemberDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConsentRecordDefaultArgs instead
     */
    export type ConsentRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConsentRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GroupSessionDefaultArgs instead
     */
    export type GroupSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GroupSessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GroupSessionAttendeeDefaultArgs instead
     */
    export type GroupSessionAttendeeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GroupSessionAttendeeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PsychMedicationDefaultArgs instead
     */
    export type PsychMedicationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PsychMedicationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProgressNoteDefaultArgs instead
     */
    export type ProgressNoteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProgressNoteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TreatmentGoalDefaultArgs instead
     */
    export type TreatmentGoalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TreatmentGoalDefaultArgs<ExtArgs>

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