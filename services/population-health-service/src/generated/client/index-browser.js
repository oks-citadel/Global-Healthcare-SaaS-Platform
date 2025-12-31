
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.PopulationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  organizationId: 'organizationId',
  definitionType: 'definitionType',
  criteria: 'criteria',
  memberCount: 'memberCount',
  status: 'status',
  fhirGroupId: 'fhirGroupId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy'
};

exports.Prisma.PopulationMemberScalarFieldEnum = {
  id: 'id',
  populationId: 'populationId',
  patientId: 'patientId',
  fhirPatientRef: 'fhirPatientRef',
  enrolledAt: 'enrolledAt',
  disenrolledAt: 'disenrolledAt',
  status: 'status',
  currentRiskScore: 'currentRiskScore',
  riskTier: 'riskTier',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CohortScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  populationId: 'populationId',
  cohortType: 'cohortType',
  criteria: 'criteria',
  memberCount: 'memberCount',
  fhirGroupId: 'fhirGroupId',
  riskLevel: 'riskLevel',
  interventionPriority: 'interventionPriority',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy'
};

exports.Prisma.CohortMemberScalarFieldEnum = {
  id: 'id',
  cohortId: 'cohortId',
  patientId: 'patientId',
  fhirPatientRef: 'fhirPatientRef',
  assignedAt: 'assignedAt',
  removedAt: 'removedAt',
  status: 'status',
  riskScore: 'riskScore',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QualityMeasureScalarFieldEnum = {
  id: 'id',
  measureId: 'measureId',
  name: 'name',
  description: 'description',
  measureType: 'measureType',
  category: 'category',
  steward: 'steward',
  domain: 'domain',
  fhirMeasureId: 'fhirMeasureId',
  fhirVersion: 'fhirVersion',
  numeratorCriteria: 'numeratorCriteria',
  denominatorCriteria: 'denominatorCriteria',
  exclusionCriteria: 'exclusionCriteria',
  targetRate: 'targetRate',
  measurePeriodStart: 'measurePeriodStart',
  measurePeriodEnd: 'measurePeriodEnd',
  reportingYear: 'reportingYear',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PopulationQualityMeasureScalarFieldEnum = {
  id: 'id',
  populationId: 'populationId',
  qualityMeasureId: 'qualityMeasureId',
  numerator: 'numerator',
  denominator: 'denominator',
  exclusions: 'exclusions',
  performanceRate: 'performanceRate',
  benchmarkRate: 'benchmarkRate',
  benchmarkPercentile: 'benchmarkPercentile',
  starRating: 'starRating',
  measurePeriod: 'measurePeriod',
  calculatedAt: 'calculatedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PatientQualityMeasureScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  fhirPatientRef: 'fhirPatientRef',
  qualityMeasureId: 'qualityMeasureId',
  inDenominator: 'inDenominator',
  inNumerator: 'inNumerator',
  isExcluded: 'isExcluded',
  exclusionReason: 'exclusionReason',
  status: 'status',
  dueDate: 'dueDate',
  completedDate: 'completedDate',
  evidenceRef: 'evidenceRef',
  notes: 'notes',
  measurePeriod: 'measurePeriod',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RiskScoreScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  fhirPatientRef: 'fhirPatientRef',
  modelName: 'modelName',
  modelVersion: 'modelVersion',
  scoreType: 'scoreType',
  rawScore: 'rawScore',
  normalizedScore: 'normalizedScore',
  percentile: 'percentile',
  riskTier: 'riskTier',
  riskFactors: 'riskFactors',
  clinicalFactors: 'clinicalFactors',
  socialFactors: 'socialFactors',
  predictedCost: 'predictedCost',
  predictedEvents: 'predictedEvents',
  effectiveDate: 'effectiveDate',
  expirationDate: 'expirationDate',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CareGapScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  fhirPatientRef: 'fhirPatientRef',
  cohortId: 'cohortId',
  gapType: 'gapType',
  title: 'title',
  description: 'description',
  priority: 'priority',
  qualityMeasureId: 'qualityMeasureId',
  recommendedAction: 'recommendedAction',
  actionDueDate: 'actionDueDate',
  status: 'status',
  identifiedAt: 'identifiedAt',
  resolvedAt: 'resolvedAt',
  resolvedBy: 'resolvedBy',
  resolutionNotes: 'resolutionNotes',
  fhirConditionRef: 'fhirConditionRef',
  fhirProcedureRef: 'fhirProcedureRef',
  fhirMedicationRef: 'fhirMedicationRef',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SdohFactorScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  populationId: 'populationId',
  fhirPatientRef: 'fhirPatientRef',
  category: 'category',
  factor: 'factor',
  value: 'value',
  severity: 'severity',
  assessmentDate: 'assessmentDate',
  assessmentTool: 'assessmentTool',
  screeningScore: 'screeningScore',
  isPositiveScreen: 'isPositiveScreen',
  interventionNeeded: 'interventionNeeded',
  interventionType: 'interventionType',
  interventionStatus: 'interventionStatus',
  referralMade: 'referralMade',
  referralDetails: 'referralDetails',
  fhirObservationRef: 'fhirObservationRef',
  fhirConditionRef: 'fhirConditionRef',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiseaseRegistryScalarFieldEnum = {
  id: 'id',
  conditionCode: 'conditionCode',
  conditionName: 'conditionName',
  populationId: 'populationId',
  prevalenceCount: 'prevalenceCount',
  prevalenceRate: 'prevalenceRate',
  incidenceCount: 'incidenceCount',
  incidenceRate: 'incidenceRate',
  periodStart: 'periodStart',
  periodEnd: 'periodEnd',
  ageDistribution: 'ageDistribution',
  genderDistribution: 'genderDistribution',
  raceDistribution: 'raceDistribution',
  previousPeriodPrevalence: 'previousPeriodPrevalence',
  trendDirection: 'trendDirection',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HealthEquityMetricScalarFieldEnum = {
  id: 'id',
  populationId: 'populationId',
  measureType: 'measureType',
  stratificationDimension: 'stratificationDimension',
  stratificationValue: 'stratificationValue',
  metricName: 'metricName',
  metricValue: 'metricValue',
  referenceValue: 'referenceValue',
  disparityIndex: 'disparityIndex',
  confidenceInterval: 'confidenceInterval',
  pValue: 'pValue',
  sampleSize: 'sampleSize',
  measurePeriod: 'measurePeriod',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AnalyticsReportScalarFieldEnum = {
  id: 'id',
  populationId: 'populationId',
  reportType: 'reportType',
  title: 'title',
  description: 'description',
  parameters: 'parameters',
  data: 'data',
  visualizations: 'visualizations',
  generatedAt: 'generatedAt',
  generatedBy: 'generatedBy',
  periodStart: 'periodStart',
  periodEnd: 'periodEnd',
  exportFormats: 'exportFormats',
  lastExportedAt: 'lastExportedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PredictiveModelScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  modelType: 'modelType',
  algorithm: 'algorithm',
  features: 'features',
  hyperparameters: 'hyperparameters',
  accuracy: 'accuracy',
  auc: 'auc',
  precision: 'precision',
  recall: 'recall',
  f1Score: 'f1Score',
  version: 'version',
  isActive: 'isActive',
  trainedAt: 'trainedAt',
  trainingSampleSize: 'trainingSampleSize',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AnalyticsAuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  resourceType: 'resourceType',
  resourceId: 'resourceId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
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
exports.DefinitionType = exports.$Enums.DefinitionType = {
  geographic: 'geographic',
  demographic: 'demographic',
  condition_based: 'condition_based',
  payer_based: 'payer_based',
  provider_panel: 'provider_panel',
  custom: 'custom'
};

exports.PopulationStatus = exports.$Enums.PopulationStatus = {
  active: 'active',
  inactive: 'inactive',
  archived: 'archived'
};

exports.MemberStatus = exports.$Enums.MemberStatus = {
  active: 'active',
  inactive: 'inactive',
  deceased: 'deceased',
  transferred: 'transferred'
};

exports.RiskTier = exports.$Enums.RiskTier = {
  low: 'low',
  moderate: 'moderate',
  high: 'high',
  very_high: 'very_high',
  critical: 'critical'
};

exports.CohortType = exports.$Enums.CohortType = {
  risk_stratification: 'risk_stratification',
  disease_registry: 'disease_registry',
  care_management: 'care_management',
  quality_improvement: 'quality_improvement',
  research: 'research',
  custom: 'custom'
};

exports.MeasureType = exports.$Enums.MeasureType = {
  process: 'process',
  outcome: 'outcome',
  structure: 'structure',
  patient_experience: 'patient_experience',
  intermediate_outcome: 'intermediate_outcome',
  composite: 'composite'
};

exports.MeasureCategory = exports.$Enums.MeasureCategory = {
  hedis: 'hedis',
  cms_stars: 'cms_stars',
  mips: 'mips',
  pcmh: 'pcmh',
  aco: 'aco',
  state_medicaid: 'state_medicaid',
  commercial: 'commercial',
  custom: 'custom'
};

exports.ComplianceStatus = exports.$Enums.ComplianceStatus = {
  pending: 'pending',
  compliant: 'compliant',
  non_compliant: 'non_compliant',
  excluded: 'excluded',
  not_applicable: 'not_applicable'
};

exports.ScoreType = exports.$Enums.ScoreType = {
  hcc_raf: 'hcc_raf',
  cdps: 'cdps',
  hospitalization_risk: 'hospitalization_risk',
  ed_utilization: 'ed_utilization',
  readmission_risk: 'readmission_risk',
  mortality_risk: 'mortality_risk',
  cost_prediction: 'cost_prediction',
  composite: 'composite',
  custom: 'custom'
};

exports.GapType = exports.$Enums.GapType = {
  preventive_care: 'preventive_care',
  chronic_disease_management: 'chronic_disease_management',
  medication_adherence: 'medication_adherence',
  screening: 'screening',
  immunization: 'immunization',
  follow_up: 'follow_up',
  lab_test: 'lab_test',
  specialist_referral: 'specialist_referral',
  wellness_visit: 'wellness_visit',
  other: 'other'
};

exports.GapPriority = exports.$Enums.GapPriority = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  urgent: 'urgent'
};

exports.GapStatus = exports.$Enums.GapStatus = {
  open: 'open',
  in_progress: 'in_progress',
  scheduled: 'scheduled',
  resolved: 'resolved',
  closed: 'closed',
  patient_declined: 'patient_declined'
};

exports.SdohCategory = exports.$Enums.SdohCategory = {
  food_insecurity: 'food_insecurity',
  housing_instability: 'housing_instability',
  transportation: 'transportation',
  utilities: 'utilities',
  interpersonal_safety: 'interpersonal_safety',
  education: 'education',
  employment: 'employment',
  financial_strain: 'financial_strain',
  social_isolation: 'social_isolation',
  health_literacy: 'health_literacy',
  stress: 'stress',
  other: 'other'
};

exports.SdohSeverity = exports.$Enums.SdohSeverity = {
  none: 'none',
  mild: 'mild',
  moderate: 'moderate',
  severe: 'severe'
};

exports.TrendDirection = exports.$Enums.TrendDirection = {
  increasing: 'increasing',
  stable: 'stable',
  decreasing: 'decreasing'
};

exports.EquityMeasureType = exports.$Enums.EquityMeasureType = {
  access_to_care: 'access_to_care',
  quality_of_care: 'quality_of_care',
  health_outcomes: 'health_outcomes',
  patient_experience: 'patient_experience',
  utilization: 'utilization',
  cost: 'cost'
};

exports.ReportType = exports.$Enums.ReportType = {
  population_dashboard: 'population_dashboard',
  quality_scorecard: 'quality_scorecard',
  risk_stratification: 'risk_stratification',
  care_gap_analysis: 'care_gap_analysis',
  sdoh_assessment: 'sdoh_assessment',
  disease_surveillance: 'disease_surveillance',
  health_equity: 'health_equity',
  trend_analysis: 'trend_analysis',
  predictive_model: 'predictive_model',
  custom: 'custom'
};

exports.PredictiveModelType = exports.$Enums.PredictiveModelType = {
  hospitalization: 'hospitalization',
  readmission: 'readmission',
  ed_visit: 'ed_visit',
  mortality: 'mortality',
  disease_progression: 'disease_progression',
  cost: 'cost',
  medication_adherence: 'medication_adherence',
  care_gap_closure: 'care_gap_closure',
  custom: 'custom'
};

exports.Prisma.ModelName = {
  Population: 'Population',
  PopulationMember: 'PopulationMember',
  Cohort: 'Cohort',
  CohortMember: 'CohortMember',
  QualityMeasure: 'QualityMeasure',
  PopulationQualityMeasure: 'PopulationQualityMeasure',
  PatientQualityMeasure: 'PatientQualityMeasure',
  RiskScore: 'RiskScore',
  CareGap: 'CareGap',
  SdohFactor: 'SdohFactor',
  DiseaseRegistry: 'DiseaseRegistry',
  HealthEquityMetric: 'HealthEquityMetric',
  AnalyticsReport: 'AnalyticsReport',
  PredictiveModel: 'PredictiveModel',
  AnalyticsAuditLog: 'AnalyticsAuditLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
