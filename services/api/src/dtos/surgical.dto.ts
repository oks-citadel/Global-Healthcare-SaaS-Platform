import { z } from 'zod';

// ==========================================
// OR Block Scheduling DTOs
// ==========================================

export const CreateORBlockSchema = z.object({
  operatingRoomId: z.string().uuid(),
  surgeonId: z.string().uuid(),
  date: z.string().datetime(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  blockType: z.enum(['dedicated', 'shared', 'open', 'emergency_reserve']),
  specialty: z.string().min(1),
  notes: z.string().optional(),
  recurring: z.boolean().default(false),
  recurrencePattern: z.enum(['daily', 'weekly', 'biweekly', 'monthly']).optional(),
  recurrenceEndDate: z.string().datetime().optional(),
});

export type CreateORBlockInput = z.infer<typeof CreateORBlockSchema>;

export const ListORBlocksSchema = z.object({
  operatingRoomId: z.string().uuid().optional(),
  surgeonId: z.string().uuid().optional(),
  specialty: z.string().optional(),
  blockType: z.enum(['dedicated', 'shared', 'open', 'emergency_reserve']).optional(),
  date: z.string().datetime().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ListORBlocksInput = z.infer<typeof ListORBlocksSchema>;

// ==========================================
// Surgical Case DTOs
// ==========================================

export const ScheduleSurgicalCaseSchema = z.object({
  patientId: z.string().uuid(),
  primarySurgeonId: z.string().uuid(),
  procedureCode: z.string().min(1),
  procedureName: z.string().min(1),
  scheduledDate: z.string().datetime(),
  estimatedDuration: z.number().int().positive(), // in minutes
  priority: z.enum(['elective', 'urgent', 'emergent']),
  anesthesiaType: z.enum(['general', 'regional', 'local', 'sedation', 'none']),
  preOpDiagnosis: z.string().optional(),
  specialEquipment: z.array(z.string()).default([]),
  staffRequirements: z.object({
    nurses: z.number().int().min(0).default(1),
    scrubTechs: z.number().int().min(0).default(1),
    anesthesiologists: z.number().int().min(0).default(1),
    residents: z.number().int().min(0).default(0),
  }).optional(),
  assistingSurgeonIds: z.array(z.string().uuid()).default([]),
  operatingRoomId: z.string().uuid().optional(),
  blockId: z.string().uuid().optional(),
  laterality: z.enum(['left', 'right', 'bilateral', 'not_applicable']).default('not_applicable'),
  notes: z.string().optional(),
  patientPreferences: z.object({
    preferredTime: z.enum(['morning', 'afternoon', 'no_preference']).default('no_preference'),
    interpreterNeeded: z.boolean().default(false),
    interpreterLanguage: z.string().optional(),
  }).optional(),
});

export type ScheduleSurgicalCaseInput = z.infer<typeof ScheduleSurgicalCaseSchema>;

export const UpdateSurgicalCaseSchema = z.object({
  scheduledDate: z.string().datetime().optional(),
  estimatedDuration: z.number().int().positive().optional(),
  priority: z.enum(['elective', 'urgent', 'emergent']).optional(),
  operatingRoomId: z.string().uuid().optional(),
  status: z.enum([
    'scheduled',
    'preop',
    'in_or',
    'in_progress',
    'closing',
    'in_pacu',
    'completed',
    'cancelled',
    'postponed'
  ]).optional(),
  notes: z.string().optional(),
  actualStartTime: z.string().datetime().optional(),
  actualEndTime: z.string().datetime().optional(),
});

export type UpdateSurgicalCaseInput = z.infer<typeof UpdateSurgicalCaseSchema>;

// ==========================================
// Duration Prediction DTOs
// ==========================================

export const PredictDurationSchema = z.object({
  procedureCode: z.string().min(1),
  surgeonId: z.string().uuid(),
  patientId: z.string().uuid().optional(),
  anesthesiaType: z.enum(['general', 'regional', 'local', 'sedation', 'none']).optional(),
  patientFactors: z.object({
    age: z.number().int().positive().optional(),
    bmi: z.number().positive().optional(),
    asaScore: z.number().int().min(1).max(6).optional(),
    comorbidities: z.array(z.string()).optional(),
    previousSurgeries: z.number().int().min(0).optional(),
  }).optional(),
});

export type PredictDurationInput = z.infer<typeof PredictDurationSchema>;

// ==========================================
// Optimization DTOs
// ==========================================

export const RunOptimizationSchema = z.object({
  targetDate: z.string().datetime(),
  optimizationGoal: z.enum([
    'maximize_utilization',
    'minimize_overtime',
    'balance_workload',
    'minimize_turnover',
    'patient_preference'
  ]),
  constraints: z.object({
    maxOvertimeMinutes: z.number().int().min(0).default(60),
    minTurnoverMinutes: z.number().int().min(0).default(30),
    respectBlockOwnership: z.boolean().default(true),
    considerStaffAvailability: z.boolean().default(true),
    considerEquipmentAvailability: z.boolean().default(true),
  }).optional(),
  scope: z.enum(['all', 'unscheduled_only', 'specific_rooms']).default('all'),
  operatingRoomIds: z.array(z.string().uuid()).optional(),
});

export type RunOptimizationInput = z.infer<typeof RunOptimizationSchema>;

// ==========================================
// Emergency Insert DTOs
// ==========================================

export const EmergencyInsertSchema = z.object({
  patientId: z.string().uuid(),
  primarySurgeonId: z.string().uuid(),
  procedureCode: z.string().min(1),
  procedureName: z.string().min(1),
  estimatedDuration: z.number().int().positive(),
  priority: z.enum(['urgent', 'emergent']),
  anesthesiaType: z.enum(['general', 'regional', 'local', 'sedation', 'none']),
  preOpDiagnosis: z.string(),
  specialEquipment: z.array(z.string()).default([]),
  mustStartBy: z.string().datetime().optional(), // Deadline for surgery start
  notes: z.string().optional(),
});

export type EmergencyInsertInput = z.infer<typeof EmergencyInsertSchema>;

// ==========================================
// Equipment Availability DTOs
// ==========================================

export const CheckEquipmentAvailabilitySchema = z.object({
  equipmentIds: z.array(z.string()).optional(),
  equipmentTypes: z.array(z.string()).optional(),
  date: z.string().datetime(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  operatingRoomId: z.string().uuid().optional(),
});

export type CheckEquipmentAvailabilityInput = z.infer<typeof CheckEquipmentAvailabilitySchema>;

// ==========================================
// Utilization Analytics DTOs
// ==========================================

export const GetUtilizationSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
  groupBy: z.enum(['room', 'surgeon', 'specialty', 'day', 'week', 'month']).default('room'),
  operatingRoomIds: z.array(z.string().uuid()).optional(),
  surgeonIds: z.array(z.string().uuid()).optional(),
  specialties: z.array(z.string()).optional(),
  includeMetrics: z.array(z.enum([
    'utilization_rate',
    'turnover_time',
    'case_count',
    'cancellation_rate',
    'first_case_on_time',
    'overtime_minutes',
    'room_idle_time'
  ])).default(['utilization_rate', 'case_count']),
});

export type GetUtilizationInput = z.infer<typeof GetUtilizationSchema>;

// ==========================================
// Response Types
// ==========================================

export interface ORBlockResponse {
  id: string;
  operatingRoomId: string;
  operatingRoomName: string;
  surgeonId: string;
  surgeonName: string;
  date: string;
  startTime: string;
  endTime: string;
  blockType: string;
  specialty: string;
  notes?: string;
  utilization: {
    scheduledMinutes: number;
    availableMinutes: number;
    utilizationPercentage: number;
    casesScheduled: number;
  };
  cases: SurgicalCaseSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface SurgicalCaseResponse {
  id: string;
  patientId: string;
  patientName: string;
  primarySurgeonId: string;
  primarySurgeonName: string;
  procedureCode: string;
  procedureName: string;
  scheduledDate: string;
  estimatedStartTime?: string;
  estimatedEndTime?: string;
  estimatedDuration: number;
  actualDuration?: number;
  priority: string;
  status: string;
  anesthesiaType: string;
  operatingRoomId?: string;
  operatingRoomName?: string;
  blockId?: string;
  laterality: string;
  specialEquipment: string[];
  staffRequirements?: {
    nurses: number;
    scrubTechs: number;
    anesthesiologists: number;
    residents: number;
  };
  preOpDiagnosis?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SurgicalCaseSummary {
  id: string;
  patientName: string;
  procedureName: string;
  estimatedStartTime: string;
  estimatedDuration: number;
  priority: string;
  status: string;
}

export interface DurationPredictionResponse {
  procedureCode: string;
  surgeonId: string;
  prediction: {
    estimatedDuration: number; // in minutes
    confidenceInterval: {
      lower: number;
      upper: number;
    };
    confidence: number; // 0-1 scale
  };
  factors: {
    historicalAverage: number;
    surgeonFactor: number; // multiplier based on surgeon's typical times
    patientComplexityFactor: number;
    anesthesiaFactor: number;
  };
  historicalData: {
    surgeonCaseCount: number;
    overallCaseCount: number;
    surgeonAverageDuration: number;
    overallAverageDuration: number;
  };
}

export interface OptimizationResultResponse {
  optimizationId: string;
  targetDate: string;
  goal: string;
  status: 'completed' | 'partial' | 'failed';
  originalMetrics: ScheduleMetrics;
  optimizedMetrics: ScheduleMetrics;
  improvement: {
    utilizationChange: number;
    overtimeChange: number;
    turnoverTimeChange: number;
  };
  proposedChanges: ScheduleChange[];
  warnings: string[];
  executedAt: string;
}

export interface ScheduleMetrics {
  totalUtilization: number;
  totalOvertimeMinutes: number;
  averageTurnoverMinutes: number;
  casesScheduled: number;
  roomsUsed: number;
  firstCaseOnTimeRate: number;
}

export interface ScheduleChange {
  caseId: string;
  changeType: 'reschedule' | 'reassign_room' | 'reassign_time' | 'cancel_recommendation';
  originalValue: string;
  proposedValue: string;
  reason: string;
  impact: string;
}

export interface EmergencyInsertResultResponse {
  caseId: string;
  insertionSuccessful: boolean;
  assignedRoom?: {
    id: string;
    name: string;
    availableFrom: string;
  };
  estimatedStartTime?: string;
  displacedCases: Array<{
    caseId: string;
    patientName: string;
    originalTime: string;
    newTime?: string;
    status: 'rescheduled' | 'pending_reschedule' | 'cancelled';
  }>;
  resourceAvailability: {
    staffAvailable: boolean;
    equipmentAvailable: boolean;
    roomAvailable: boolean;
  };
  alternativeOptions?: Array<{
    room: string;
    startTime: string;
    waitTimeMinutes: number;
  }>;
  alerts: string[];
}

export interface EquipmentAvailabilityResponse {
  requestedDate: string;
  requestedTimeSlot: {
    start: string;
    end: string;
  };
  equipment: Array<{
    id: string;
    name: string;
    type: string;
    available: boolean;
    currentLocation?: string;
    scheduledUses: Array<{
      caseId: string;
      startTime: string;
      endTime: string;
      roomId: string;
    }>;
    nextAvailableTime?: string;
    maintenanceScheduled?: boolean;
    maintenanceNotes?: string;
  }>;
  conflicts: Array<{
    equipmentId: string;
    conflictingCaseId: string;
    conflictTime: string;
    resolution?: string;
  }>;
}

export interface UtilizationAnalyticsResponse {
  period: {
    from: string;
    to: string;
  };
  groupBy: string;
  summary: {
    overallUtilization: number;
    totalCases: number;
    averageTurnoverTime: number;
    cancellationRate: number;
    firstCaseOnTimeRate: number;
    totalOvertimeMinutes: number;
  };
  breakdown: Array<{
    groupKey: string;
    groupName: string;
    metrics: {
      utilizationRate?: number;
      turnoverTime?: number;
      caseCount?: number;
      cancellationRate?: number;
      firstCaseOnTime?: number;
      overtimeMinutes?: number;
      roomIdleTime?: number;
    };
    trends?: {
      utilizationTrend: 'up' | 'down' | 'stable';
      comparisonToPrevious: number;
    };
  }>;
  insights: Array<{
    type: 'warning' | 'opportunity' | 'achievement';
    message: string;
    recommendation?: string;
  }>;
}

export interface CancellationPredictionResponse {
  caseId: string;
  patientId: string;
  cancellationRisk: {
    probability: number; // 0-1 scale
    riskLevel: 'low' | 'medium' | 'high';
    confidence: number;
  };
  riskFactors: Array<{
    factor: string;
    impact: number; // contribution to risk score
    description: string;
  }>;
  recommendations: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high';
    expectedRiskReduction: number;
  }>;
  historicalData: {
    patientNoShowRate: number;
    procedureNoShowRate: number;
    surgeonCancellationRate: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
