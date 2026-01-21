/**
 * TriggerCondition Model
 * Defines the schema for contextual trigger conditions
 */

import { z } from 'zod';

// Base trigger types
export const TriggerTypeSchema = z.enum([
  'weather',
  'travel',
  'calendar',
  'health_event',
  'location',
  'time_based',
  'medication_stock',
  'vital_threshold',
  'activity',
  'custom',
]);

export type TriggerType = z.infer<typeof TriggerTypeSchema>;

// Comparison operators
export const ComparisonOperatorSchema = z.enum([
  'equals',
  'not_equals',
  'greater_than',
  'less_than',
  'greater_than_or_equals',
  'less_than_or_equals',
  'contains',
  'not_contains',
  'starts_with',
  'ends_with',
  'in_range',
  'outside_range',
  'in_list',
  'not_in_list',
]);

export type ComparisonOperator = z.infer<typeof ComparisonOperatorSchema>;

// Logical operators for combining conditions
export const LogicalOperatorSchema = z.enum(['and', 'or', 'not']);

export type LogicalOperator = z.infer<typeof LogicalOperatorSchema>;

// Base condition schema
export const BaseConditionSchema = z.object({
  field: z.string(),
  operator: ComparisonOperatorSchema,
  value: z.unknown(),
  valueType: z.enum(['string', 'number', 'boolean', 'date', 'array']).optional(),
});

export type BaseCondition = z.infer<typeof BaseConditionSchema>;

// Weather condition parameters
export const WeatherConditionParamsSchema = z.object({
  conditions: z.array(z.enum([
    'rain',
    'snow',
    'extreme_heat',
    'extreme_cold',
    'high_humidity',
    'low_humidity',
    'high_pollen',
    'high_uv',
    'air_quality_poor',
    'storm_warning',
    'wind_advisory',
  ])).optional(),
  temperatureThreshold: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    unit: z.enum(['celsius', 'fahrenheit']).default('fahrenheit'),
  }).optional(),
  humidityThreshold: z.object({
    min: z.number().min(0).max(100).optional(),
    max: z.number().min(0).max(100).optional(),
  }).optional(),
  pollenLevel: z.enum(['low', 'medium', 'high', 'very_high']).optional(),
  uvIndex: z.object({
    min: z.number().min(0).max(11).optional(),
    max: z.number().min(0).max(11).optional(),
  }).optional(),
  airQualityIndex: z.object({
    min: z.number().min(0).max(500).optional(),
    max: z.number().min(0).max(500).optional(),
  }).optional(),
  locationId: z.string().optional(),
  usePatientLocation: z.boolean().default(true),
  forecastHours: z.number().min(0).max(168).default(24),
});

export type WeatherConditionParams = z.infer<typeof WeatherConditionParamsSchema>;

// Travel condition parameters
export const TravelConditionParamsSchema = z.object({
  travelType: z.enum(['flight', 'any']).optional(),
  timezoneChange: z.boolean().optional(),
  timezoneChangeHours: z.number().min(1).optional(),
  destinationType: z.enum(['domestic', 'international', 'any']).optional(),
  travelDurationHours: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  departureWindow: z.object({
    hoursBefore: z.number().default(24),
    hoursAfter: z.number().default(0),
  }).optional(),
  returnWindow: z.object({
    hoursBefore: z.number().default(0),
    hoursAfter: z.number().default(24),
  }).optional(),
  highRiskDestination: z.boolean().optional(),
  requiresVaccination: z.boolean().optional(),
});

export type TravelConditionParams = z.infer<typeof TravelConditionParamsSchema>;

// Calendar condition parameters
export const CalendarConditionParamsSchema = z.object({
  eventTypes: z.array(z.enum([
    'appointment',
    'meeting',
    'travel',
    'exercise',
    'meal',
    'medication',
    'custom',
  ])).optional(),
  eventKeywords: z.array(z.string()).optional(),
  beforeEvent: z.object({
    minutes: z.number().default(30),
  }).optional(),
  afterEvent: z.object({
    minutes: z.number().default(0),
  }).optional(),
  duringEvent: z.boolean().optional(),
  noEventsFor: z.object({
    hours: z.number().optional(),
  }).optional(),
  busyStatus: z.enum(['busy', 'free', 'tentative', 'out_of_office']).optional(),
  calendarIds: z.array(z.string()).optional(),
});

export type CalendarConditionParams = z.infer<typeof CalendarConditionParamsSchema>;

// Health event condition parameters
export const HealthEventConditionParamsSchema = z.object({
  eventTypes: z.array(z.enum([
    'appointment_scheduled',
    'appointment_completed',
    'appointment_missed',
    'lab_result_available',
    'lab_result_abnormal',
    'medication_prescribed',
    'medication_refill_due',
    'medication_missed',
    'vital_recorded',
    'vital_abnormal',
    'condition_diagnosed',
    'condition_resolved',
    'hospitalization',
    'discharge',
    'vaccination_due',
    'screening_due',
  ])).optional(),
  conditionCodes: z.array(z.string()).optional(),
  medicationIds: z.array(z.string()).optional(),
  providerIds: z.array(z.string()).optional(),
  severityLevels: z.array(z.enum(['low', 'moderate', 'high', 'critical'])).optional(),
  timeframeDays: z.number().optional(),
  sinceLastEvent: z.boolean().optional(),
});

export type HealthEventConditionParams = z.infer<typeof HealthEventConditionParamsSchema>;

// Location condition parameters
export const LocationConditionParamsSchema = z.object({
  locationType: z.enum([
    'home',
    'work',
    'gym',
    'pharmacy',
    'hospital',
    'clinic',
    'custom',
  ]).optional(),
  customLocationId: z.string().optional(),
  radiusMeters: z.number().default(100),
  entering: z.boolean().optional(),
  leaving: z.boolean().optional(),
  dwellTimeMinutes: z.number().optional(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
});

export type LocationConditionParams = z.infer<typeof LocationConditionParamsSchema>;

// Time-based condition parameters
export const TimeBasedConditionParamsSchema = z.object({
  timeOfDay: z.object({
    start: z.string(), // HH:MM format
    end: z.string(),
  }).optional(),
  daysOfWeek: z.array(z.enum([
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ])).optional(),
  dayOfMonth: z.array(z.number().min(1).max(31)).optional(),
  monthOfYear: z.array(z.number().min(1).max(12)).optional(),
  weekOfMonth: z.array(z.number().min(1).max(5)).optional(),
  relativeTo: z.enum(['now', 'sunrise', 'sunset', 'meal_time']).optional(),
  offsetMinutes: z.number().optional(),
});

export type TimeBasedConditionParams = z.infer<typeof TimeBasedConditionParamsSchema>;

// Vital threshold parameters
export const VitalThresholdParamsSchema = z.object({
  vitalType: z.enum([
    'blood_pressure_systolic',
    'blood_pressure_diastolic',
    'heart_rate',
    'blood_glucose',
    'weight',
    'temperature',
    'oxygen_saturation',
    'respiratory_rate',
    'steps',
    'sleep_hours',
    'hrv',
  ]),
  threshold: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }),
  consecutiveReadings: z.number().min(1).default(1),
  timeframHours: z.number().default(24),
  trend: z.enum(['increasing', 'decreasing', 'stable', 'any']).optional(),
  trendThresholdPercent: z.number().optional(),
});

export type VitalThresholdParams = z.infer<typeof VitalThresholdParamsSchema>;

// Activity condition parameters
export const ActivityConditionParamsSchema = z.object({
  activityType: z.enum([
    'sedentary',
    'walking',
    'running',
    'cycling',
    'exercise',
    'sleeping',
    'driving',
  ]).optional(),
  durationMinutes: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  stepsToday: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  inactivityMinutes: z.number().optional(),
});

export type ActivityConditionParams = z.infer<typeof ActivityConditionParamsSchema>;

// Unified trigger condition schema
export const TriggerConditionSchema = z.object({
  id: z.string().uuid(),
  type: TriggerTypeSchema,
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),

  // Type-specific parameters
  weatherParams: WeatherConditionParamsSchema.optional(),
  travelParams: TravelConditionParamsSchema.optional(),
  calendarParams: CalendarConditionParamsSchema.optional(),
  healthEventParams: HealthEventConditionParamsSchema.optional(),
  locationParams: LocationConditionParamsSchema.optional(),
  timeBasedParams: TimeBasedConditionParamsSchema.optional(),
  vitalThresholdParams: VitalThresholdParamsSchema.optional(),
  activityParams: ActivityConditionParamsSchema.optional(),

  // Custom conditions (for complex logic)
  customConditions: z.array(BaseConditionSchema).optional(),
  conditionLogic: LogicalOperatorSchema.optional(),

  // Evaluation settings
  evaluationIntervalMinutes: z.number().min(5).max(1440).default(60),
  cooldownMinutes: z.number().min(0).default(0),
  maxTriggersPerDay: z.number().min(0).default(0), // 0 = unlimited

  // State
  isActive: z.boolean().default(true),
  lastEvaluatedAt: z.string().datetime().optional(),
  lastTriggeredAt: z.string().datetime().optional(),
  triggerCount: z.number().default(0),

  // Timestamps
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type TriggerCondition = z.infer<typeof TriggerConditionSchema>;

// Trigger evaluation result
export const TriggerEvaluationResultSchema = z.object({
  triggerId: z.string().uuid(),
  triggerType: TriggerTypeSchema,
  triggered: z.boolean(),
  evaluatedAt: z.string().datetime(),
  context: z.record(z.unknown()).optional(),
  reason: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  nextEvaluationAt: z.string().datetime().optional(),
});

export type TriggerEvaluationResult = z.infer<typeof TriggerEvaluationResultSchema>;

// Create trigger condition input
export const CreateTriggerConditionSchema = TriggerConditionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastEvaluatedAt: true,
  lastTriggeredAt: true,
  triggerCount: true,
});

export type CreateTriggerCondition = z.infer<typeof CreateTriggerConditionSchema>;

// Update trigger condition input
export const UpdateTriggerConditionSchema = CreateTriggerConditionSchema.partial();

export type UpdateTriggerCondition = z.infer<typeof UpdateTriggerConditionSchema>;
