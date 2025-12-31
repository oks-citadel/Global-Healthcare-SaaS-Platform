
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/library.js')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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




  const path = require('path')

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\citad\\OneDrive\\Documents\\Global-Healthcare-SaaS-Platform\\services\\population-health-service\\src\\generated\\client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Users\\citad\\OneDrive\\Documents\\Global-Healthcare-SaaS-Platform\\services\\population-health-service\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  output   = \"./../src/generated/client\"\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// ==========================================\n// Population Health Analytics Domain\n// ==========================================\n\n// Population represents a defined group of patients\nmodel Population {\n  id             String           @id @default(uuid())\n  name           String\n  description    String?\n  organizationId String\n  definitionType DefinitionType   @default(custom)\n  criteria       Json // Flexible criteria for population definition\n  memberCount    Int              @default(0)\n  status         PopulationStatus @default(active)\n  fhirGroupId    String? // FHIR R4 Group resource reference\n\n  // Relations\n  cohorts         Cohort[]\n  qualityMeasures PopulationQualityMeasure[]\n  analytics       AnalyticsReport[]\n  sdohFactors     SdohFactor[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  createdBy String?\n\n  @@index([organizationId])\n  @@index([status])\n  @@index([definitionType])\n  @@index([fhirGroupId])\n}\n\nenum DefinitionType {\n  geographic\n  demographic\n  condition_based\n  payer_based\n  provider_panel\n  custom\n}\n\nenum PopulationStatus {\n  active\n  inactive\n  archived\n}\n\n// PopulationMember tracks individual members of a population\nmodel PopulationMember {\n  id             String       @id @default(uuid())\n  populationId   String\n  patientId      String\n  fhirPatientRef String? // FHIR R4 Patient reference\n  enrolledAt     DateTime     @default(now())\n  disenrolledAt  DateTime?\n  status         MemberStatus @default(active)\n\n  // Risk and health status\n  currentRiskScore Float?\n  riskTier         RiskTier?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([populationId, patientId])\n  @@index([populationId])\n  @@index([patientId])\n  @@index([status])\n  @@index([riskTier])\n}\n\nenum MemberStatus {\n  active\n  inactive\n  deceased\n  transferred\n}\n\n// Cohort for risk stratification and targeted interventions\nmodel Cohort {\n  id           String     @id @default(uuid())\n  name         String\n  description  String?\n  populationId String\n  population   Population @relation(fields: [populationId], references: [id], onDelete: Cascade)\n  cohortType   CohortType\n  criteria     Json // Criteria defining cohort membership\n  memberCount  Int        @default(0)\n  fhirGroupId  String? // FHIR R4 Group resource reference\n\n  // Risk stratification\n  riskLevel            RiskTier?\n  interventionPriority Int? // 1-5 priority scale\n\n  // Care gap tracking\n  careGaps CareGap[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  createdBy String?\n\n  @@index([populationId])\n  @@index([cohortType])\n  @@index([riskLevel])\n}\n\nenum CohortType {\n  risk_stratification\n  disease_registry\n  care_management\n  quality_improvement\n  research\n  custom\n}\n\nenum RiskTier {\n  low\n  moderate\n  high\n  very_high\n  critical\n}\n\n// CohortMember tracks individual members of a cohort\nmodel CohortMember {\n  id             String       @id @default(uuid())\n  cohortId       String\n  patientId      String\n  fhirPatientRef String? // FHIR R4 Patient reference\n  assignedAt     DateTime     @default(now())\n  removedAt      DateTime?\n  status         MemberStatus @default(active)\n  riskScore      Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([cohortId, patientId])\n  @@index([cohortId])\n  @@index([patientId])\n  @@index([status])\n}\n\n// Quality measures following HEDIS, CMS Stars standards\nmodel QualityMeasure {\n  id          String          @id @default(uuid())\n  measureId   String          @unique // e.g., \"NQF-0059\", \"HEDIS-BCS\"\n  name        String\n  description String?\n  measureType MeasureType\n  category    MeasureCategory\n  steward     String? // Measure steward (e.g., NCQA, CMS)\n  domain      String? // Clinical domain\n\n  // FHIR R4 Measure resource compatibility\n  fhirMeasureId String?\n  fhirVersion   String?\n\n  // Calculation details\n  numeratorCriteria   Json?\n  denominatorCriteria Json?\n  exclusionCriteria   Json?\n  targetRate          Float? // Target performance rate\n\n  // Measure period\n  measurePeriodStart DateTime?\n  measurePeriodEnd   DateTime?\n  reportingYear      Int?\n\n  isActive Boolean @default(true)\n\n  // Relations\n  populationMeasures PopulationQualityMeasure[]\n  patientMeasures    PatientQualityMeasure[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([measureType])\n  @@index([category])\n  @@index([reportingYear])\n  @@index([isActive])\n}\n\nenum MeasureType {\n  process\n  outcome\n  structure\n  patient_experience\n  intermediate_outcome\n  composite\n}\n\nenum MeasureCategory {\n  hedis\n  cms_stars\n  mips\n  pcmh\n  aco\n  state_medicaid\n  commercial\n  custom\n}\n\n// Population-level quality measure tracking\nmodel PopulationQualityMeasure {\n  id               String         @id @default(uuid())\n  populationId     String\n  population       Population     @relation(fields: [populationId], references: [id], onDelete: Cascade)\n  qualityMeasureId String\n  qualityMeasure   QualityMeasure @relation(fields: [qualityMeasureId], references: [id], onDelete: Cascade)\n\n  // Performance metrics\n  numerator       Int    @default(0)\n  denominator     Int    @default(0)\n  exclusions      Int    @default(0)\n  performanceRate Float? // Calculated: numerator / (denominator - exclusions)\n\n  // Benchmark comparison\n  benchmarkRate       Float?\n  benchmarkPercentile Int?\n  starRating          Int? // 1-5 stars for CMS Stars\n\n  // Period tracking\n  measurePeriod String // e.g., \"2024-Q1\", \"2024\"\n  calculatedAt  DateTime @default(now())\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([populationId, qualityMeasureId, measurePeriod])\n  @@index([populationId])\n  @@index([qualityMeasureId])\n  @@index([measurePeriod])\n  @@index([performanceRate])\n}\n\n// Patient-level quality measure tracking\nmodel PatientQualityMeasure {\n  id               String         @id @default(uuid())\n  patientId        String\n  fhirPatientRef   String? // FHIR R4 Patient reference\n  qualityMeasureId String\n  qualityMeasure   QualityMeasure @relation(fields: [qualityMeasureId], references: [id], onDelete: Cascade)\n\n  // Measure status\n  inDenominator   Boolean @default(false)\n  inNumerator     Boolean @default(false)\n  isExcluded      Boolean @default(false)\n  exclusionReason String?\n\n  // Compliance tracking\n  status        ComplianceStatus @default(pending)\n  dueDate       DateTime?\n  completedDate DateTime?\n\n  // Evidence/documentation\n  evidenceRef String? // Reference to supporting documentation\n  notes       String?\n\n  measurePeriod String // e.g., \"2024-Q1\", \"2024\"\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([patientId, qualityMeasureId, measurePeriod])\n  @@index([patientId])\n  @@index([qualityMeasureId])\n  @@index([status])\n  @@index([measurePeriod])\n}\n\nenum ComplianceStatus {\n  pending\n  compliant\n  non_compliant\n  excluded\n  not_applicable\n}\n\n// Risk scoring for patients\nmodel RiskScore {\n  id             String  @id @default(uuid())\n  patientId      String\n  fhirPatientRef String? // FHIR R4 Patient reference\n\n  // Risk model details\n  modelName    String // e.g., \"HCC\", \"CDPS\", \"Custom\"\n  modelVersion String?\n  scoreType    ScoreType\n\n  // Scores\n  rawScore        Float\n  normalizedScore Float? // 0-100 scale\n  percentile      Int? // Population percentile\n  riskTier        RiskTier\n\n  // Contributing factors\n  riskFactors     Json? // Array of contributing risk factors\n  clinicalFactors Json? // Clinical conditions contributing to risk\n  socialFactors   Json? // SDOH factors contributing to risk\n\n  // Predictions\n  predictedCost   Float? // Predicted annual cost\n  predictedEvents Json? // Predicted clinical events\n\n  // Validity period\n  effectiveDate  DateTime  @default(now())\n  expirationDate DateTime?\n  isActive       Boolean   @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([modelName])\n  @@index([riskTier])\n  @@index([effectiveDate])\n  @@index([isActive])\n}\n\nenum ScoreType {\n  hcc_raf // CMS HCC Risk Adjustment Factor\n  cdps // Chronic Illness and Disability Payment System\n  hospitalization_risk\n  ed_utilization\n  readmission_risk\n  mortality_risk\n  cost_prediction\n  composite\n  custom\n}\n\n// Care Gap identification\nmodel CareGap {\n  id             String  @id @default(uuid())\n  patientId      String\n  fhirPatientRef String? // FHIR R4 Patient reference\n  cohortId       String?\n  cohort         Cohort? @relation(fields: [cohortId], references: [id], onDelete: SetNull)\n\n  gapType     GapType\n  title       String\n  description String?\n  priority    GapPriority @default(medium)\n\n  // Measure linkage\n  qualityMeasureId String?\n\n  // Recommended action\n  recommendedAction String?\n  actionDueDate     DateTime?\n\n  // Status tracking\n  status          GapStatus @default(open)\n  identifiedAt    DateTime  @default(now())\n  resolvedAt      DateTime?\n  resolvedBy      String?\n  resolutionNotes String?\n\n  // FHIR references\n  fhirConditionRef  String? // Related Condition resource\n  fhirProcedureRef  String? // Related Procedure resource\n  fhirMedicationRef String? // Related MedicationRequest resource\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([cohortId])\n  @@index([gapType])\n  @@index([status])\n  @@index([priority])\n  @@index([qualityMeasureId])\n}\n\nenum GapType {\n  preventive_care\n  chronic_disease_management\n  medication_adherence\n  screening\n  immunization\n  follow_up\n  lab_test\n  specialist_referral\n  wellness_visit\n  other\n}\n\nenum GapPriority {\n  low\n  medium\n  high\n  urgent\n}\n\nenum GapStatus {\n  open\n  in_progress\n  scheduled\n  resolved\n  closed\n  patient_declined\n}\n\n// Social Determinants of Health (SDOH) tracking\nmodel SdohFactor {\n  id             String      @id @default(uuid())\n  patientId      String? // Individual patient SDOH\n  populationId   String? // Population-level SDOH aggregates\n  population     Population? @relation(fields: [populationId], references: [id], onDelete: SetNull)\n  fhirPatientRef String? // FHIR R4 Patient reference\n\n  category SdohCategory\n  factor   String // Specific SDOH factor\n  value    String? // Value/description\n  severity SdohSeverity?\n\n  // Assessment details\n  assessmentDate DateTime @default(now())\n  assessmentTool String? // e.g., \"PRAPARE\", \"AHC-HRSN\"\n\n  // Screening results\n  screeningScore   Float?\n  isPositiveScreen Boolean @default(false)\n\n  // Intervention tracking\n  interventionNeeded Boolean @default(false)\n  interventionType   String?\n  interventionStatus String?\n  referralMade       Boolean @default(false)\n  referralDetails    String?\n\n  // FHIR references\n  fhirObservationRef String? // SDOH Observation resource\n  fhirConditionRef   String? // SDOH-related Condition\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([populationId])\n  @@index([category])\n  @@index([isPositiveScreen])\n  @@index([interventionNeeded])\n}\n\nenum SdohCategory {\n  food_insecurity\n  housing_instability\n  transportation\n  utilities\n  interpersonal_safety\n  education\n  employment\n  financial_strain\n  social_isolation\n  health_literacy\n  stress\n  other\n}\n\nenum SdohSeverity {\n  none\n  mild\n  moderate\n  severe\n}\n\n// Disease prevalence and incidence tracking\nmodel DiseaseRegistry {\n  id            String  @id @default(uuid())\n  conditionCode String // ICD-10 or SNOMED code\n  conditionName String\n  populationId  String?\n\n  // Epidemiological metrics\n  prevalenceCount Int    @default(0)\n  prevalenceRate  Float? // Per 1000 population\n  incidenceCount  Int    @default(0)\n  incidenceRate   Float? // Per 1000 person-years\n\n  // Time period\n  periodStart DateTime\n  periodEnd   DateTime\n\n  // Demographics breakdown (stored as JSON for flexibility)\n  ageDistribution    Json?\n  genderDistribution Json?\n  raceDistribution   Json?\n\n  // Trend data\n  previousPeriodPrevalence Float?\n  trendDirection           TrendDirection?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([conditionCode, populationId, periodStart])\n  @@index([conditionCode])\n  @@index([populationId])\n  @@index([periodStart])\n}\n\nenum TrendDirection {\n  increasing\n  stable\n  decreasing\n}\n\n// Health Equity Analytics\nmodel HealthEquityMetric {\n  id           String            @id @default(uuid())\n  populationId String?\n  measureType  EquityMeasureType\n\n  // Stratification dimensions\n  stratificationDimension String // e.g., \"race\", \"ethnicity\", \"income\", \"geography\"\n  stratificationValue     String // e.g., \"Hispanic\", \"Rural\"\n\n  // Metric values\n  metricName     String\n  metricValue    Float\n  referenceValue Float? // Comparison/benchmark value\n  disparityIndex Float? // Ratio or difference from reference\n\n  // Statistical significance\n  confidenceInterval Json? // {lower: float, upper: float}\n  pValue             Float?\n  sampleSize         Int?\n\n  // Period\n  measurePeriod String // e.g., \"2024-Q1\"\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([populationId])\n  @@index([measureType])\n  @@index([stratificationDimension])\n  @@index([measurePeriod])\n}\n\nenum EquityMeasureType {\n  access_to_care\n  quality_of_care\n  health_outcomes\n  patient_experience\n  utilization\n  cost\n}\n\n// Analytics Reports\nmodel AnalyticsReport {\n  id           String      @id @default(uuid())\n  populationId String?\n  population   Population? @relation(fields: [populationId], references: [id], onDelete: SetNull)\n\n  reportType  ReportType\n  title       String\n  description String?\n\n  // Report parameters\n  parameters Json? // Filter parameters used\n\n  // Report data\n  data           Json // Report results/data\n  visualizations Json? // Chart configurations\n\n  // Report metadata\n  generatedAt DateTime  @default(now())\n  generatedBy String?\n  periodStart DateTime?\n  periodEnd   DateTime?\n\n  // Export tracking\n  exportFormats  Json? // Available export formats\n  lastExportedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([populationId])\n  @@index([reportType])\n  @@index([generatedAt])\n}\n\nenum ReportType {\n  population_dashboard\n  quality_scorecard\n  risk_stratification\n  care_gap_analysis\n  sdoh_assessment\n  disease_surveillance\n  health_equity\n  trend_analysis\n  predictive_model\n  custom\n}\n\n// Predictive Model configurations and results\nmodel PredictiveModel {\n  id          String              @id @default(uuid())\n  name        String\n  description String?\n  modelType   PredictiveModelType\n\n  // Model configuration\n  algorithm       String // e.g., \"logistic_regression\", \"random_forest\"\n  features        Json // Input features used\n  hyperparameters Json? // Model hyperparameters\n\n  // Model performance\n  accuracy  Float?\n  auc       Float? // Area Under ROC Curve\n  precision Float?\n  recall    Float?\n  f1Score   Float?\n\n  // Model versioning\n  version            String\n  isActive           Boolean   @default(true)\n  trainedAt          DateTime?\n  trainingSampleSize Int?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([modelType])\n  @@index([isActive])\n}\n\nenum PredictiveModelType {\n  hospitalization\n  readmission\n  ed_visit\n  mortality\n  disease_progression\n  cost\n  medication_adherence\n  care_gap_closure\n  custom\n}\n\n// Audit log for analytics activities\nmodel AnalyticsAuditLog {\n  id           String  @id @default(uuid())\n  userId       String\n  action       String // e.g., \"VIEW_REPORT\", \"EXPORT_DATA\", \"RUN_MODEL\"\n  resourceType String // e.g., \"Population\", \"Report\", \"RiskScore\"\n  resourceId   String?\n\n  // Request details\n  ipAddress String?\n  userAgent String?\n\n  // Additional context\n  metadata Json?\n\n  createdAt DateTime @default(now())\n\n  @@index([userId])\n  @@index([action])\n  @@index([resourceType])\n  @@index([createdAt])\n}\n",
  "inlineSchemaHash": "a9dc4300d5fb15ac3998b0da8e995352fae8ef26e5c8b21707e9fefcfc0ad738",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "src/generated/client",
    "generated/client",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"Population\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"definitionType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DefinitionType\",\"default\":\"custom\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criteria\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"memberCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PopulationStatus\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirGroupId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cohorts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Cohort\",\"relationName\":\"CohortToPopulation\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"qualityMeasures\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PopulationQualityMeasure\",\"relationName\":\"PopulationToPopulationQualityMeasure\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"analytics\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnalyticsReport\",\"relationName\":\"AnalyticsReportToPopulation\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sdohFactors\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SdohFactor\",\"relationName\":\"PopulationToSdohFactor\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PopulationMember\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"populationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirPatientRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"enrolledAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"disenrolledAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"MemberStatus\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentRiskScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"riskTier\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RiskTier\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"populationId\",\"patientId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"populationId\",\"patientId\"]}],\"isGenerated\":false},\"Cohort\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"populationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"population\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Population\",\"relationName\":\"CohortToPopulation\",\"relationFromFields\":[\"populationId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cohortType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CohortType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criteria\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"memberCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirGroupId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"riskLevel\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RiskTier\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"interventionPriority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"careGaps\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CareGap\",\"relationName\":\"CareGapToCohort\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CohortMember\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cohortId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirPatientRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"removedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"MemberStatus\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"riskScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"cohortId\",\"patientId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"cohortId\",\"patientId\"]}],\"isGenerated\":false},\"QualityMeasure\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"measureId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"measureType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MeasureType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MeasureCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"steward\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"domain\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirMeasureId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirVersion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"numeratorCriteria\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"denominatorCriteria\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"exclusionCriteria\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"measurePeriodStart\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"measurePeriodEnd\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reportingYear\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"populationMeasures\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PopulationQualityMeasure\",\"relationName\":\"PopulationQualityMeasureToQualityMeasure\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientMeasures\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PatientQualityMeasure\",\"relationName\":\"PatientQualityMeasureToQualityMeasure\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PopulationQualityMeasure\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"populationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"population\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Population\",\"relationName\":\"PopulationToPopulationQualityMeasure\",\"relationFromFields\":[\"populationId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"qualityMeasureId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"qualityMeasure\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"QualityMeasure\",\"relationName\":\"PopulationQualityMeasureToQualityMeasure\",\"relationFromFields\":[\"qualityMeasureId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"numerator\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"denominator\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"exclusions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"performanceRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"benchmarkRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"benchmarkPercentile\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"starRating\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"measurePeriod\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"calculatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"populationId\",\"qualityMeasureId\",\"measurePeriod\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"populationId\",\"qualityMeasureId\",\"measurePeriod\"]}],\"isGenerated\":false},\"PatientQualityMeasure\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirPatientRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"qualityMeasureId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"qualityMeasure\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"QualityMeasure\",\"relationName\":\"PatientQualityMeasureToQualityMeasure\",\"relationFromFields\":[\"qualityMeasureId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inDenominator\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inNumerator\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isExcluded\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"exclusionReason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ComplianceStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"evidenceRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"measurePeriod\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"patientId\",\"qualityMeasureId\",\"measurePeriod\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"patientId\",\"qualityMeasureId\",\"measurePeriod\"]}],\"isGenerated\":false},\"RiskScore\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirPatientRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"modelName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"modelVersion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scoreType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ScoreType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rawScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"normalizedScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"percentile\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"riskTier\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RiskTier\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"riskFactors\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clinicalFactors\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"socialFactors\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"predictedCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"predictedEvents\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"effectiveDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expirationDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CareGap\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirPatientRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cohortId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cohort\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Cohort\",\"relationName\":\"CareGapToCohort\",\"relationFromFields\":[\"cohortId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gapType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GapType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"GapPriority\",\"default\":\"medium\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"qualityMeasureId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recommendedAction\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actionDueDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"GapStatus\",\"default\":\"open\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"identifiedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resolvedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resolvedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resolutionNotes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirConditionRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirProcedureRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirMedicationRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SdohFactor\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"populationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"population\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Population\",\"relationName\":\"PopulationToSdohFactor\",\"relationFromFields\":[\"populationId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirPatientRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SdohCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"factor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"severity\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SdohSeverity\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assessmentDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assessmentTool\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"screeningScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPositiveScreen\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"interventionNeeded\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"interventionType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"interventionStatus\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referralMade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referralDetails\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirObservationRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirConditionRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"DiseaseRegistry\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conditionCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conditionName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"populationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"prevalenceCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"prevalenceRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"incidenceCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"incidenceRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodStart\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodEnd\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ageDistribution\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"genderDistribution\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"raceDistribution\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"previousPeriodPrevalence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trendDirection\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TrendDirection\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"conditionCode\",\"populationId\",\"periodStart\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"conditionCode\",\"populationId\",\"periodStart\"]}],\"isGenerated\":false},\"HealthEquityMetric\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"populationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"measureType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EquityMeasureType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stratificationDimension\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stratificationValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metricName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metricValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referenceValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"disparityIndex\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"confidenceInterval\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sampleSize\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"measurePeriod\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AnalyticsReport\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"populationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"population\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Population\",\"relationName\":\"AnalyticsReportToPopulation\",\"relationFromFields\":[\"populationId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reportType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ReportType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parameters\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visualizations\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"generatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"generatedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodStart\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodEnd\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"exportFormats\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastExportedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PredictiveModel\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"modelType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PredictiveModelType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"algorithm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"features\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hyperparameters\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accuracy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"auc\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"precision\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recall\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"f1Score\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"version\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trainedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trainingSampleSize\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AnalyticsAuditLog\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resourceType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resourceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"DefinitionType\":{\"values\":[{\"name\":\"geographic\",\"dbName\":null},{\"name\":\"demographic\",\"dbName\":null},{\"name\":\"condition_based\",\"dbName\":null},{\"name\":\"payer_based\",\"dbName\":null},{\"name\":\"provider_panel\",\"dbName\":null},{\"name\":\"custom\",\"dbName\":null}],\"dbName\":null},\"PopulationStatus\":{\"values\":[{\"name\":\"active\",\"dbName\":null},{\"name\":\"inactive\",\"dbName\":null},{\"name\":\"archived\",\"dbName\":null}],\"dbName\":null},\"MemberStatus\":{\"values\":[{\"name\":\"active\",\"dbName\":null},{\"name\":\"inactive\",\"dbName\":null},{\"name\":\"deceased\",\"dbName\":null},{\"name\":\"transferred\",\"dbName\":null}],\"dbName\":null},\"CohortType\":{\"values\":[{\"name\":\"risk_stratification\",\"dbName\":null},{\"name\":\"disease_registry\",\"dbName\":null},{\"name\":\"care_management\",\"dbName\":null},{\"name\":\"quality_improvement\",\"dbName\":null},{\"name\":\"research\",\"dbName\":null},{\"name\":\"custom\",\"dbName\":null}],\"dbName\":null},\"RiskTier\":{\"values\":[{\"name\":\"low\",\"dbName\":null},{\"name\":\"moderate\",\"dbName\":null},{\"name\":\"high\",\"dbName\":null},{\"name\":\"very_high\",\"dbName\":null},{\"name\":\"critical\",\"dbName\":null}],\"dbName\":null},\"MeasureType\":{\"values\":[{\"name\":\"process\",\"dbName\":null},{\"name\":\"outcome\",\"dbName\":null},{\"name\":\"structure\",\"dbName\":null},{\"name\":\"patient_experience\",\"dbName\":null},{\"name\":\"intermediate_outcome\",\"dbName\":null},{\"name\":\"composite\",\"dbName\":null}],\"dbName\":null},\"MeasureCategory\":{\"values\":[{\"name\":\"hedis\",\"dbName\":null},{\"name\":\"cms_stars\",\"dbName\":null},{\"name\":\"mips\",\"dbName\":null},{\"name\":\"pcmh\",\"dbName\":null},{\"name\":\"aco\",\"dbName\":null},{\"name\":\"state_medicaid\",\"dbName\":null},{\"name\":\"commercial\",\"dbName\":null},{\"name\":\"custom\",\"dbName\":null}],\"dbName\":null},\"ComplianceStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"compliant\",\"dbName\":null},{\"name\":\"non_compliant\",\"dbName\":null},{\"name\":\"excluded\",\"dbName\":null},{\"name\":\"not_applicable\",\"dbName\":null}],\"dbName\":null},\"ScoreType\":{\"values\":[{\"name\":\"hcc_raf\",\"dbName\":null},{\"name\":\"cdps\",\"dbName\":null},{\"name\":\"hospitalization_risk\",\"dbName\":null},{\"name\":\"ed_utilization\",\"dbName\":null},{\"name\":\"readmission_risk\",\"dbName\":null},{\"name\":\"mortality_risk\",\"dbName\":null},{\"name\":\"cost_prediction\",\"dbName\":null},{\"name\":\"composite\",\"dbName\":null},{\"name\":\"custom\",\"dbName\":null}],\"dbName\":null},\"GapType\":{\"values\":[{\"name\":\"preventive_care\",\"dbName\":null},{\"name\":\"chronic_disease_management\",\"dbName\":null},{\"name\":\"medication_adherence\",\"dbName\":null},{\"name\":\"screening\",\"dbName\":null},{\"name\":\"immunization\",\"dbName\":null},{\"name\":\"follow_up\",\"dbName\":null},{\"name\":\"lab_test\",\"dbName\":null},{\"name\":\"specialist_referral\",\"dbName\":null},{\"name\":\"wellness_visit\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"GapPriority\":{\"values\":[{\"name\":\"low\",\"dbName\":null},{\"name\":\"medium\",\"dbName\":null},{\"name\":\"high\",\"dbName\":null},{\"name\":\"urgent\",\"dbName\":null}],\"dbName\":null},\"GapStatus\":{\"values\":[{\"name\":\"open\",\"dbName\":null},{\"name\":\"in_progress\",\"dbName\":null},{\"name\":\"scheduled\",\"dbName\":null},{\"name\":\"resolved\",\"dbName\":null},{\"name\":\"closed\",\"dbName\":null},{\"name\":\"patient_declined\",\"dbName\":null}],\"dbName\":null},\"SdohCategory\":{\"values\":[{\"name\":\"food_insecurity\",\"dbName\":null},{\"name\":\"housing_instability\",\"dbName\":null},{\"name\":\"transportation\",\"dbName\":null},{\"name\":\"utilities\",\"dbName\":null},{\"name\":\"interpersonal_safety\",\"dbName\":null},{\"name\":\"education\",\"dbName\":null},{\"name\":\"employment\",\"dbName\":null},{\"name\":\"financial_strain\",\"dbName\":null},{\"name\":\"social_isolation\",\"dbName\":null},{\"name\":\"health_literacy\",\"dbName\":null},{\"name\":\"stress\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"SdohSeverity\":{\"values\":[{\"name\":\"none\",\"dbName\":null},{\"name\":\"mild\",\"dbName\":null},{\"name\":\"moderate\",\"dbName\":null},{\"name\":\"severe\",\"dbName\":null}],\"dbName\":null},\"TrendDirection\":{\"values\":[{\"name\":\"increasing\",\"dbName\":null},{\"name\":\"stable\",\"dbName\":null},{\"name\":\"decreasing\",\"dbName\":null}],\"dbName\":null},\"EquityMeasureType\":{\"values\":[{\"name\":\"access_to_care\",\"dbName\":null},{\"name\":\"quality_of_care\",\"dbName\":null},{\"name\":\"health_outcomes\",\"dbName\":null},{\"name\":\"patient_experience\",\"dbName\":null},{\"name\":\"utilization\",\"dbName\":null},{\"name\":\"cost\",\"dbName\":null}],\"dbName\":null},\"ReportType\":{\"values\":[{\"name\":\"population_dashboard\",\"dbName\":null},{\"name\":\"quality_scorecard\",\"dbName\":null},{\"name\":\"risk_stratification\",\"dbName\":null},{\"name\":\"care_gap_analysis\",\"dbName\":null},{\"name\":\"sdoh_assessment\",\"dbName\":null},{\"name\":\"disease_surveillance\",\"dbName\":null},{\"name\":\"health_equity\",\"dbName\":null},{\"name\":\"trend_analysis\",\"dbName\":null},{\"name\":\"predictive_model\",\"dbName\":null},{\"name\":\"custom\",\"dbName\":null}],\"dbName\":null},\"PredictiveModelType\":{\"values\":[{\"name\":\"hospitalization\",\"dbName\":null},{\"name\":\"readmission\",\"dbName\":null},{\"name\":\"ed_visit\",\"dbName\":null},{\"name\":\"mortality\",\"dbName\":null},{\"name\":\"disease_progression\",\"dbName\":null},{\"name\":\"cost\",\"dbName\":null},{\"name\":\"medication_adherence\",\"dbName\":null},{\"name\":\"care_gap_closure\",\"dbName\":null},{\"name\":\"custom\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "src/generated/client/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "src/generated/client/schema.prisma")
