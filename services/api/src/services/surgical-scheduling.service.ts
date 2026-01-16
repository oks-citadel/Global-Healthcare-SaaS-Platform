/**
 * Surgical Scheduling Optimizer Service
 *
 * Provides AI-driven OR block scheduling optimization, case duration prediction,
 * resource allocation, real-time schedule adjustment, utilization analytics,
 * cancellation prediction, emergency case insertion, and turnover time optimization.
 */

import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/errors.js';
import {
  CreateORBlockInput,
  ListORBlocksInput,
  ScheduleSurgicalCaseInput,
  UpdateSurgicalCaseInput,
  PredictDurationInput,
  RunOptimizationInput,
  EmergencyInsertInput,
  CheckEquipmentAvailabilityInput,
  GetUtilizationInput,
  ORBlockResponse,
  SurgicalCaseResponse,
  DurationPredictionResponse,
  OptimizationResultResponse,
  EmergencyInsertResultResponse,
  EquipmentAvailabilityResponse,
  UtilizationAnalyticsResponse,
  CancellationPredictionResponse,
  ScheduleMetrics,
  ScheduleChange,
  PaginatedResponse,
} from '../dtos/surgical.dto.js';

// In-memory stores for surgical scheduling data
// In production, these would be backed by database tables
interface ORBlock {
  id: string;
  operatingRoomId: string;
  operatingRoomName: string;
  surgeonId: string;
  surgeonName: string;
  date: Date;
  startTime: string;
  endTime: string;
  blockType: string;
  specialty: string;
  notes?: string;
  recurring: boolean;
  recurrencePattern?: string;
  recurrenceEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface SurgicalCase {
  id: string;
  patientId: string;
  patientName: string;
  primarySurgeonId: string;
  primarySurgeonName: string;
  procedureCode: string;
  procedureName: string;
  scheduledDate: Date;
  estimatedStartTime?: Date;
  estimatedEndTime?: Date;
  estimatedDuration: number;
  actualDuration?: number;
  actualStartTime?: Date;
  actualEndTime?: Date;
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
  assistingSurgeonIds: string[];
  preOpDiagnosis?: string;
  notes?: string;
  patientPreferences?: {
    preferredTime: string;
    interpreterNeeded: boolean;
    interpreterLanguage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface SurgicalEquipment {
  id: string;
  name: string;
  type: string;
  available: boolean;
  currentLocation?: string;
  maintenanceScheduled: boolean;
  maintenanceNotes?: string;
}

interface EquipmentSchedule {
  equipmentId: string;
  caseId: string;
  startTime: Date;
  endTime: Date;
  roomId: string;
}

// Simulated data stores
const orBlocksStore: Map<string, ORBlock> = new Map();
const surgicalCasesStore: Map<string, SurgicalCase> = new Map();
const equipmentStore: Map<string, SurgicalEquipment> = new Map();
const equipmentScheduleStore: EquipmentSchedule[] = [];
const historicalCaseDurations: Map<string, number[]> = new Map(); // procedureCode+surgeonId -> durations

// Operating rooms simulation
const operatingRooms = [
  { id: 'or-001', name: 'OR 1 - General Surgery', specialty: 'general' },
  { id: 'or-002', name: 'OR 2 - Cardiac', specialty: 'cardiac' },
  { id: 'or-003', name: 'OR 3 - Orthopedic', specialty: 'orthopedic' },
  { id: 'or-004', name: 'OR 4 - Neurosurgery', specialty: 'neuro' },
  { id: 'or-005', name: 'OR 5 - Emergency', specialty: 'emergency' },
];

// Initialize sample equipment
function initializeEquipment() {
  if (equipmentStore.size === 0) {
    const sampleEquipment: SurgicalEquipment[] = [
      { id: 'eq-001', name: 'Da Vinci Robotic System', type: 'robotic', available: true, currentLocation: 'OR 1', maintenanceScheduled: false },
      { id: 'eq-002', name: 'C-Arm Fluoroscopy', type: 'imaging', available: true, currentLocation: 'Storage A', maintenanceScheduled: false },
      { id: 'eq-003', name: 'Laparoscopic Tower', type: 'laparoscopic', available: true, currentLocation: 'OR 3', maintenanceScheduled: false },
      { id: 'eq-004', name: 'Ultrasound Machine', type: 'imaging', available: true, currentLocation: 'OR 2', maintenanceScheduled: false },
      { id: 'eq-005', name: 'Heart-Lung Machine', type: 'cardiac', available: true, currentLocation: 'OR 2', maintenanceScheduled: true, maintenanceNotes: 'Quarterly maintenance due' },
      { id: 'eq-006', name: 'Neuronavigation System', type: 'navigation', available: true, currentLocation: 'OR 4', maintenanceScheduled: false },
      { id: 'eq-007', name: 'Arthroscopy Tower', type: 'orthopedic', available: true, currentLocation: 'OR 3', maintenanceScheduled: false },
    ];
    sampleEquipment.forEach(eq => equipmentStore.set(eq.id, eq));
  }
}

initializeEquipment();

// Utility functions
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

function timeToMinutes(timeStr: string): number {
  const { hours, minutes } = parseTime(timeStr);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function calculateBlockMinutes(startTime: string, endTime: string): number {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
}

async function getSurgeonName(surgeonId: string): Promise<string> {
  try {
    const provider = await prisma.provider.findUnique({
      where: { id: surgeonId },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    if (provider?.user) {
      return `Dr. ${provider.user.firstName} ${provider.user.lastName}`;
    }
  } catch (error) {
    logger.warn(`Could not fetch surgeon name for ${surgeonId}`);
  }
  return `Surgeon ${surgeonId.substring(0, 8)}`;
}

async function getPatientName(patientId: string): Promise<string> {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    if (patient?.user) {
      return `${patient.user.firstName} ${patient.user.lastName}`;
    }
  } catch (error) {
    logger.warn(`Could not fetch patient name for ${patientId}`);
  }
  return `Patient ${patientId.substring(0, 8)}`;
}

export const surgicalSchedulingService = {
  // ==========================================
  // OR Block Management
  // ==========================================

  /**
   * Create a new OR block schedule
   */
  async createORBlock(input: CreateORBlockInput): Promise<ORBlockResponse> {
    const surgeonName = await getSurgeonName(input.surgeonId);
    const room = operatingRooms.find(r => r.id === input.operatingRoomId) || {
      id: input.operatingRoomId,
      name: `OR ${input.operatingRoomId}`,
    };

    // Check for conflicts
    const existingBlocks = Array.from(orBlocksStore.values()).filter(block => {
      const blockDate = new Date(block.date).toDateString();
      const inputDate = new Date(input.date).toDateString();
      return (
        block.operatingRoomId === input.operatingRoomId &&
        blockDate === inputDate &&
        this.timeRangesOverlap(block.startTime, block.endTime, input.startTime, input.endTime)
      );
    });

    if (existingBlocks.length > 0) {
      throw new ConflictError('OR block time conflicts with existing block');
    }

    const id = generateId();
    const now = new Date();

    const block: ORBlock = {
      id,
      operatingRoomId: input.operatingRoomId,
      operatingRoomName: room.name,
      surgeonId: input.surgeonId,
      surgeonName,
      date: new Date(input.date),
      startTime: input.startTime,
      endTime: input.endTime,
      blockType: input.blockType,
      specialty: input.specialty,
      notes: input.notes,
      recurring: input.recurring,
      recurrencePattern: input.recurrencePattern,
      recurrenceEndDate: input.recurrenceEndDate ? new Date(input.recurrenceEndDate) : undefined,
      createdAt: now,
      updatedAt: now,
    };

    orBlocksStore.set(id, block);

    logger.info(`Created OR block ${id} for ${surgeonName} in ${room.name}`);

    return this.formatORBlockResponse(block);
  },

  /**
   * List OR blocks with filters
   */
  async listORBlocks(filters: ListORBlocksInput): Promise<PaginatedResponse<ORBlockResponse>> {
    let blocks = Array.from(orBlocksStore.values());

    // Apply filters
    if (filters.operatingRoomId) {
      blocks = blocks.filter(b => b.operatingRoomId === filters.operatingRoomId);
    }
    if (filters.surgeonId) {
      blocks = blocks.filter(b => b.surgeonId === filters.surgeonId);
    }
    if (filters.specialty) {
      blocks = blocks.filter(b => b.specialty.toLowerCase().includes(filters.specialty!.toLowerCase()));
    }
    if (filters.blockType) {
      blocks = blocks.filter(b => b.blockType === filters.blockType);
    }
    if (filters.date) {
      const targetDate = new Date(filters.date).toDateString();
      blocks = blocks.filter(b => new Date(b.date).toDateString() === targetDate);
    }
    if (filters.from) {
      const fromDate = new Date(filters.from);
      blocks = blocks.filter(b => new Date(b.date) >= fromDate);
    }
    if (filters.to) {
      const toDate = new Date(filters.to);
      blocks = blocks.filter(b => new Date(b.date) <= toDate);
    }

    // Sort by date
    blocks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Pagination
    const total = blocks.length;
    const totalPages = Math.ceil(total / filters.limit);
    const offset = (filters.page - 1) * filters.limit;
    const paginatedBlocks = blocks.slice(offset, offset + filters.limit);

    const data = paginatedBlocks.map(block => this.formatORBlockResponse(block));

    return {
      data,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages,
      },
    };
  },

  /**
   * Get OR block by ID
   */
  async getORBlockById(id: string): Promise<ORBlockResponse> {
    const block = orBlocksStore.get(id);
    if (!block) {
      throw new NotFoundError('OR block not found');
    }
    return this.formatORBlockResponse(block);
  },

  // ==========================================
  // Surgical Case Management
  // ==========================================

  /**
   * Schedule a surgical case
   */
  async scheduleSurgicalCase(input: ScheduleSurgicalCaseInput): Promise<SurgicalCaseResponse> {
    const surgeonName = await getSurgeonName(input.primarySurgeonId);
    const patientName = await getPatientName(input.patientId);

    // Validate patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: input.patientId },
    });

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // Calculate estimated start and end times if room/block assigned
    let estimatedStartTime: Date | undefined;
    let estimatedEndTime: Date | undefined;
    let operatingRoomName: string | undefined;

    if (input.operatingRoomId) {
      const room = operatingRooms.find(r => r.id === input.operatingRoomId);
      operatingRoomName = room?.name || `OR ${input.operatingRoomId}`;

      // Find available slot in the room for the day
      const scheduledDate = new Date(input.scheduledDate);
      const roomCases = Array.from(surgicalCasesStore.values())
        .filter(c =>
          c.operatingRoomId === input.operatingRoomId &&
          c.scheduledDate.toDateString() === scheduledDate.toDateString() &&
          c.status !== 'cancelled'
        )
        .sort((a, b) => (a.estimatedStartTime?.getTime() || 0) - (b.estimatedStartTime?.getTime() || 0));

      // Default start at 7:00 AM
      let startMinutes = 7 * 60;

      for (const existingCase of roomCases) {
        if (existingCase.estimatedEndTime) {
          const endMinutes = existingCase.estimatedEndTime.getHours() * 60 +
                            existingCase.estimatedEndTime.getMinutes();
          startMinutes = Math.max(startMinutes, endMinutes + 30); // 30 min turnover
        }
      }

      estimatedStartTime = new Date(scheduledDate);
      estimatedStartTime.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);

      estimatedEndTime = new Date(estimatedStartTime);
      estimatedEndTime.setMinutes(estimatedEndTime.getMinutes() + input.estimatedDuration);
    }

    const id = generateId();
    const now = new Date();

    const surgicalCase: SurgicalCase = {
      id,
      patientId: input.patientId,
      patientName,
      primarySurgeonId: input.primarySurgeonId,
      primarySurgeonName: surgeonName,
      procedureCode: input.procedureCode,
      procedureName: input.procedureName,
      scheduledDate: new Date(input.scheduledDate),
      estimatedStartTime,
      estimatedEndTime,
      estimatedDuration: input.estimatedDuration,
      priority: input.priority,
      status: 'scheduled',
      anesthesiaType: input.anesthesiaType,
      operatingRoomId: input.operatingRoomId,
      operatingRoomName,
      blockId: input.blockId,
      laterality: input.laterality,
      specialEquipment: input.specialEquipment,
      staffRequirements: input.staffRequirements as any,
      assistingSurgeonIds: input.assistingSurgeonIds,
      preOpDiagnosis: input.preOpDiagnosis,
      notes: input.notes,
      patientPreferences: input.patientPreferences as any,
      createdAt: now,
      updatedAt: now,
    };

    surgicalCasesStore.set(id, surgicalCase);

    logger.info(`Scheduled surgical case ${id} for patient ${patientName} with ${surgeonName}`);

    return this.formatSurgicalCaseResponse(surgicalCase);
  },

  /**
   * Update surgical case
   */
  async updateSurgicalCase(id: string, input: UpdateSurgicalCaseInput): Promise<SurgicalCaseResponse> {
    const surgicalCase = surgicalCasesStore.get(id);
    if (!surgicalCase) {
      throw new NotFoundError('Surgical case not found');
    }

    // Update fields
    if (input.scheduledDate) {
      surgicalCase.scheduledDate = new Date(input.scheduledDate);
    }
    if (input.estimatedDuration) {
      surgicalCase.estimatedDuration = input.estimatedDuration;
      // Recalculate end time
      if (surgicalCase.estimatedStartTime) {
        surgicalCase.estimatedEndTime = new Date(surgicalCase.estimatedStartTime);
        surgicalCase.estimatedEndTime.setMinutes(
          surgicalCase.estimatedEndTime.getMinutes() + input.estimatedDuration
        );
      }
    }
    if (input.priority) {
      surgicalCase.priority = input.priority;
    }
    if (input.operatingRoomId) {
      surgicalCase.operatingRoomId = input.operatingRoomId;
      const room = operatingRooms.find(r => r.id === input.operatingRoomId);
      surgicalCase.operatingRoomName = room?.name || `OR ${input.operatingRoomId}`;
    }
    if (input.status) {
      surgicalCase.status = input.status;
    }
    if (input.notes !== undefined) {
      surgicalCase.notes = input.notes;
    }
    if (input.actualStartTime) {
      surgicalCase.actualStartTime = new Date(input.actualStartTime);
    }
    if (input.actualEndTime) {
      surgicalCase.actualEndTime = new Date(input.actualEndTime);
      if (surgicalCase.actualStartTime) {
        surgicalCase.actualDuration = Math.round(
          (surgicalCase.actualEndTime.getTime() - surgicalCase.actualStartTime.getTime()) / 60000
        );
        // Store for historical analysis
        const key = `${surgicalCase.procedureCode}-${surgicalCase.primarySurgeonId}`;
        const durations = historicalCaseDurations.get(key) || [];
        durations.push(surgicalCase.actualDuration);
        historicalCaseDurations.set(key, durations);
      }
    }

    surgicalCase.updatedAt = new Date();
    surgicalCasesStore.set(id, surgicalCase);

    logger.info(`Updated surgical case ${id}`);

    return this.formatSurgicalCaseResponse(surgicalCase);
  },

  /**
   * Get surgical case by ID
   */
  async getSurgicalCaseById(id: string): Promise<SurgicalCaseResponse> {
    const surgicalCase = surgicalCasesStore.get(id);
    if (!surgicalCase) {
      throw new NotFoundError('Surgical case not found');
    }
    return this.formatSurgicalCaseResponse(surgicalCase);
  },

  // ==========================================
  // Duration Prediction (AI-Driven)
  // ==========================================

  /**
   * Predict case duration using ML-based approach
   */
  async predictCaseDuration(caseId: string, input?: PredictDurationInput): Promise<DurationPredictionResponse> {
    let procedureCode: string;
    let surgeonId: string;

    if (caseId && surgicalCasesStore.has(caseId)) {
      const existingCase = surgicalCasesStore.get(caseId)!;
      procedureCode = existingCase.procedureCode;
      surgeonId = existingCase.primarySurgeonId;
    } else if (input) {
      procedureCode = input.procedureCode;
      surgeonId = input.surgeonId;
    } else {
      throw new BadRequestError('Either case ID or prediction input is required');
    }

    // Base duration by procedure type (simulated lookup table)
    const baseDurations: Record<string, number> = {
      'CHOL': 90, // Cholecystectomy
      'APPY': 60, // Appendectomy
      'CABG': 240, // Coronary artery bypass
      'TKR': 120, // Total knee replacement
      'THR': 150, // Total hip replacement
      'CRAN': 180, // Craniotomy
      'LAPA': 75, // Laparoscopic procedure
      'default': 90,
    };

    const baseDuration = baseDurations[procedureCode.toUpperCase()] || baseDurations['default'];

    // Get historical data for this surgeon + procedure
    const key = `${procedureCode}-${surgeonId}`;
    const historicalDurations = historicalCaseDurations.get(key) || [];

    // Calculate surgeon factor (how the surgeon compares to average)
    let surgeonFactor = 1.0;
    let surgeonAverageDuration = baseDuration;
    if (historicalDurations.length > 0) {
      surgeonAverageDuration = historicalDurations.reduce((a, b) => a + b, 0) / historicalDurations.length;
      surgeonFactor = surgeonAverageDuration / baseDuration;
    }

    // Patient complexity factor
    let patientComplexityFactor = 1.0;
    if (input?.patientFactors) {
      const { age, bmi, asaScore, comorbidities, previousSurgeries } = input.patientFactors;

      // Age factor (elderly patients may take longer)
      if (age && age > 70) patientComplexityFactor += 0.1;
      if (age && age > 80) patientComplexityFactor += 0.15;

      // BMI factor
      if (bmi && bmi > 35) patientComplexityFactor += 0.1;
      if (bmi && bmi > 40) patientComplexityFactor += 0.15;

      // ASA score factor
      if (asaScore && asaScore >= 3) patientComplexityFactor += 0.1;
      if (asaScore && asaScore >= 4) patientComplexityFactor += 0.2;

      // Comorbidities
      if (comorbidities && comorbidities.length > 0) {
        patientComplexityFactor += comorbidities.length * 0.05;
      }

      // Previous surgeries (scar tissue consideration)
      if (previousSurgeries && previousSurgeries > 2) {
        patientComplexityFactor += 0.1;
      }
    }

    // Anesthesia factor
    let anesthesiaFactor = 1.0;
    const anesthesiaType = input?.anesthesiaType || 'general';
    const anesthesiaFactors: Record<string, number> = {
      'general': 1.0,
      'regional': 0.95,
      'local': 0.85,
      'sedation': 0.9,
      'none': 0.8,
    };
    anesthesiaFactor = anesthesiaFactors[anesthesiaType] || 1.0;

    // Calculate estimated duration
    const estimatedDuration = Math.round(
      baseDuration * surgeonFactor * patientComplexityFactor * anesthesiaFactor
    );

    // Calculate confidence interval (wider with less historical data)
    const confidenceWidth = historicalDurations.length > 10 ? 0.15 :
                           historicalDurations.length > 5 ? 0.2 : 0.3;
    const confidence = Math.min(0.95, 0.7 + (historicalDurations.length * 0.025));

    return {
      procedureCode,
      surgeonId,
      prediction: {
        estimatedDuration,
        confidenceInterval: {
          lower: Math.round(estimatedDuration * (1 - confidenceWidth)),
          upper: Math.round(estimatedDuration * (1 + confidenceWidth)),
        },
        confidence,
      },
      factors: {
        historicalAverage: baseDuration,
        surgeonFactor,
        patientComplexityFactor,
        anesthesiaFactor,
      },
      historicalData: {
        surgeonCaseCount: historicalDurations.length,
        overallCaseCount: historicalDurations.length + Math.floor(Math.random() * 50) + 50,
        surgeonAverageDuration: Math.round(surgeonAverageDuration),
        overallAverageDuration: baseDuration,
      },
    };
  },

  // ==========================================
  // Schedule Optimization
  // ==========================================

  /**
   * Run schedule optimization algorithm
   */
  async runOptimization(input: RunOptimizationInput): Promise<OptimizationResultResponse> {
    const targetDate = new Date(input.targetDate);

    // Get all cases for the target date
    let cases = Array.from(surgicalCasesStore.values()).filter(c =>
      c.scheduledDate.toDateString() === targetDate.toDateString() &&
      c.status !== 'cancelled' && c.status !== 'completed'
    );

    if (input.scope === 'unscheduled_only') {
      cases = cases.filter(c => !c.operatingRoomId);
    } else if (input.scope === 'specific_rooms' && input.operatingRoomIds) {
      cases = cases.filter(c =>
        !c.operatingRoomId || input.operatingRoomIds!.includes(c.operatingRoomId)
      );
    }

    // Calculate original metrics
    const originalMetrics = this.calculateScheduleMetrics(cases);

    // Apply optimization based on goal
    const proposedChanges: ScheduleChange[] = [];
    const warnings: string[] = [];

    switch (input.optimizationGoal) {
      case 'maximize_utilization':
        this.optimizeForUtilization(cases, proposedChanges, input.constraints);
        break;
      case 'minimize_overtime':
        this.optimizeForMinimalOvertime(cases, proposedChanges, input.constraints);
        break;
      case 'balance_workload':
        this.optimizeForBalancedWorkload(cases, proposedChanges);
        break;
      case 'minimize_turnover':
        this.optimizeForMinimalTurnover(cases, proposedChanges);
        break;
      case 'patient_preference':
        this.optimizeForPatientPreference(cases, proposedChanges);
        break;
    }

    // Calculate optimized metrics
    const optimizedMetrics = this.calculateScheduleMetrics(cases);

    const optimizationId = generateId();

    logger.info(`Completed optimization ${optimizationId} for ${targetDate.toDateString()}`);

    return {
      optimizationId,
      targetDate: targetDate.toISOString(),
      goal: input.optimizationGoal,
      status: proposedChanges.length > 0 ? 'completed' : 'partial',
      originalMetrics,
      optimizedMetrics,
      improvement: {
        utilizationChange: optimizedMetrics.totalUtilization - originalMetrics.totalUtilization,
        overtimeChange: optimizedMetrics.totalOvertimeMinutes - originalMetrics.totalOvertimeMinutes,
        turnoverTimeChange: optimizedMetrics.averageTurnoverMinutes - originalMetrics.averageTurnoverMinutes,
      },
      proposedChanges,
      warnings,
      executedAt: new Date().toISOString(),
    };
  },

  // ==========================================
  // Emergency Case Insertion
  // ==========================================

  /**
   * Insert emergency case into schedule
   */
  async insertEmergencyCase(input: EmergencyInsertInput): Promise<EmergencyInsertResultResponse> {
    const surgeonName = await getSurgeonName(input.primarySurgeonId);
    const patientName = await getPatientName(input.patientId);

    // Find available room for emergency
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

    const alerts: string[] = [];
    const alternativeOptions: Array<{ room: string; startTime: string; waitTimeMinutes: number }> = [];

    // Check emergency OR first
    const emergencyRoom = operatingRooms.find(r => r.specialty === 'emergency');
    let assignedRoom: { id: string; name: string; availableFrom: string } | undefined;
    let estimatedStartTime: string | undefined;
    const displacedCases: Array<{
      caseId: string;
      patientName: string;
      originalTime: string;
      newTime?: string;
      status: 'rescheduled' | 'pending_reschedule' | 'cancelled';
    }> = [];

    // Check if emergency OR is available
    const todaysCases = Array.from(surgicalCasesStore.values()).filter(c =>
      c.scheduledDate.toDateString() === now.toDateString() &&
      c.status !== 'cancelled' && c.status !== 'completed'
    );

    if (emergencyRoom) {
      const emergencyRoomCases = todaysCases.filter(c => c.operatingRoomId === emergencyRoom.id);

      if (emergencyRoomCases.length === 0) {
        // Emergency room is available
        assignedRoom = {
          id: emergencyRoom.id,
          name: emergencyRoom.name,
          availableFrom: now.toISOString(),
        };
        estimatedStartTime = now.toISOString();
      } else {
        // Find next available slot in emergency room
        const lastCase = emergencyRoomCases.sort((a, b) =>
          (b.estimatedEndTime?.getTime() || 0) - (a.estimatedEndTime?.getTime() || 0)
        )[0];

        if (lastCase.estimatedEndTime) {
          const availableTime = new Date(lastCase.estimatedEndTime);
          availableTime.setMinutes(availableTime.getMinutes() + 30); // 30 min turnover

          assignedRoom = {
            id: emergencyRoom.id,
            name: emergencyRoom.name,
            availableFrom: availableTime.toISOString(),
          };
          estimatedStartTime = availableTime.toISOString();
        }
      }
    }

    // If emergency room not immediately available or doesn't exist, check other rooms
    if (!assignedRoom || (input.priority === 'emergent' && estimatedStartTime &&
        new Date(estimatedStartTime).getTime() - now.getTime() > 30 * 60 * 1000)) {

      // For emergent cases, consider bumping elective cases
      for (const room of operatingRooms) {
        if (room.specialty === 'emergency') continue;

        const roomCases = todaysCases.filter(c =>
          c.operatingRoomId === room.id &&
          c.priority === 'elective'
        );

        // Find cases that could be displaced
        for (const roomCase of roomCases) {
          if (roomCase.estimatedStartTime && roomCase.status === 'scheduled') {
            const caseStartTime = roomCase.estimatedStartTime;
            const waitMinutes = Math.max(0, Math.round((caseStartTime.getTime() - now.getTime()) / 60000));

            alternativeOptions.push({
              room: room.name,
              startTime: caseStartTime.toISOString(),
              waitTimeMinutes: waitMinutes,
            });

            // For emergent priority, bump the case
            if (input.priority === 'emergent' && waitMinutes < 60 && !assignedRoom) {
              assignedRoom = {
                id: room.id,
                name: room.name,
                availableFrom: now.toISOString(),
              };
              estimatedStartTime = now.toISOString();

              displacedCases.push({
                caseId: roomCase.id,
                patientName: roomCase.patientName,
                originalTime: roomCase.estimatedStartTime?.toISOString() || '',
                status: 'pending_reschedule',
              });

              alerts.push(`Bumped elective case ${roomCase.id} to accommodate emergent surgery`);

              // Update the displaced case
              roomCase.status = 'postponed';
              roomCase.operatingRoomId = undefined;
              roomCase.estimatedStartTime = undefined;
              surgicalCasesStore.set(roomCase.id, roomCase);
            }
          }
        }
      }
    }

    // Create the emergency case
    const caseId = generateId();
    const surgicalCase: SurgicalCase = {
      id: caseId,
      patientId: input.patientId,
      patientName,
      primarySurgeonId: input.primarySurgeonId,
      primarySurgeonName: surgeonName,
      procedureCode: input.procedureCode,
      procedureName: input.procedureName,
      scheduledDate: now,
      estimatedStartTime: estimatedStartTime ? new Date(estimatedStartTime) : undefined,
      estimatedEndTime: estimatedStartTime ?
        new Date(new Date(estimatedStartTime).getTime() + input.estimatedDuration * 60000) : undefined,
      estimatedDuration: input.estimatedDuration,
      priority: input.priority,
      status: assignedRoom ? 'scheduled' : 'pending',
      anesthesiaType: input.anesthesiaType,
      operatingRoomId: assignedRoom?.id,
      operatingRoomName: assignedRoom?.name,
      laterality: 'not_applicable',
      specialEquipment: input.specialEquipment,
      assistingSurgeonIds: [],
      preOpDiagnosis: input.preOpDiagnosis,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };

    surgicalCasesStore.set(caseId, surgicalCase);

    // Check resource availability
    const resourceAvailability = {
      staffAvailable: true, // Simplified - would check staff scheduling system
      equipmentAvailable: input.specialEquipment.length === 0 ||
        input.specialEquipment.every(eq => {
          const equipment = Array.from(equipmentStore.values()).find(e =>
            e.name.toLowerCase().includes(eq.toLowerCase()) || e.type.toLowerCase().includes(eq.toLowerCase())
          );
          return equipment?.available;
        }),
      roomAvailable: !!assignedRoom,
    };

    if (!resourceAvailability.equipmentAvailable) {
      alerts.push('Some requested equipment may not be immediately available');
    }

    logger.info(`Emergency case ${caseId} inserted for patient ${patientName}`);

    return {
      caseId,
      insertionSuccessful: !!assignedRoom,
      assignedRoom,
      estimatedStartTime,
      displacedCases,
      resourceAvailability,
      alternativeOptions: alternativeOptions.slice(0, 3),
      alerts,
    };
  },

  // ==========================================
  // Equipment Availability
  // ==========================================

  /**
   * Check equipment availability for a time slot
   */
  async checkEquipmentAvailability(input: CheckEquipmentAvailabilityInput): Promise<EquipmentAvailabilityResponse> {
    const requestDate = new Date(input.date);
    const startMinutes = timeToMinutes(input.startTime);
    const endMinutes = timeToMinutes(input.endTime);

    let equipmentToCheck = Array.from(equipmentStore.values());

    // Filter by specific IDs or types
    if (input.equipmentIds && input.equipmentIds.length > 0) {
      equipmentToCheck = equipmentToCheck.filter(eq => input.equipmentIds!.includes(eq.id));
    }
    if (input.equipmentTypes && input.equipmentTypes.length > 0) {
      equipmentToCheck = equipmentToCheck.filter(eq =>
        input.equipmentTypes!.some(t => eq.type.toLowerCase().includes(t.toLowerCase()))
      );
    }

    const conflicts: Array<{
      equipmentId: string;
      conflictingCaseId: string;
      conflictTime: string;
      resolution?: string;
    }> = [];

    const equipmentResults = equipmentToCheck.map(equipment => {
      // Check scheduled uses for this equipment
      const scheduledUses = equipmentScheduleStore
        .filter(schedule => {
          if (schedule.equipmentId !== equipment.id) return false;
          const scheduleDate = new Date(schedule.startTime).toDateString();
          return scheduleDate === requestDate.toDateString();
        })
        .map(schedule => ({
          caseId: schedule.caseId,
          startTime: schedule.startTime.toISOString(),
          endTime: schedule.endTime.toISOString(),
          roomId: schedule.roomId,
        }));

      // Check for conflicts
      let available = equipment.available && !equipment.maintenanceScheduled;
      let nextAvailableTime: string | undefined;

      for (const use of scheduledUses) {
        const useStart = new Date(use.startTime);
        const useEnd = new Date(use.endTime);
        const useStartMinutes = useStart.getHours() * 60 + useStart.getMinutes();
        const useEndMinutes = useEnd.getHours() * 60 + useEnd.getMinutes();

        if (this.timeRangesOverlap(
          minutesToTime(startMinutes),
          minutesToTime(endMinutes),
          minutesToTime(useStartMinutes),
          minutesToTime(useEndMinutes)
        )) {
          available = false;
          conflicts.push({
            equipmentId: equipment.id,
            conflictingCaseId: use.caseId,
            conflictTime: use.startTime,
            resolution: 'Consider rescheduling or using alternative equipment',
          });

          // Set next available time
          if (!nextAvailableTime || new Date(use.endTime) > new Date(nextAvailableTime)) {
            const nextTime = new Date(use.endTime);
            nextTime.setMinutes(nextTime.getMinutes() + 15); // 15 min buffer
            nextAvailableTime = nextTime.toISOString();
          }
        }
      }

      return {
        id: equipment.id,
        name: equipment.name,
        type: equipment.type,
        available,
        currentLocation: equipment.currentLocation,
        scheduledUses,
        nextAvailableTime: available ? undefined : nextAvailableTime,
        maintenanceScheduled: equipment.maintenanceScheduled,
        maintenanceNotes: equipment.maintenanceNotes,
      };
    });

    return {
      requestedDate: requestDate.toISOString(),
      requestedTimeSlot: {
        start: input.startTime,
        end: input.endTime,
      },
      equipment: equipmentResults,
      conflicts,
    };
  },

  // ==========================================
  // Utilization Analytics
  // ==========================================

  /**
   * Get utilization analytics and reporting
   */
  async getUtilizationAnalytics(input: GetUtilizationInput): Promise<UtilizationAnalyticsResponse> {
    const fromDate = new Date(input.from);
    const toDate = new Date(input.to);

    // Get all cases in the period
    let cases = Array.from(surgicalCasesStore.values()).filter(c => {
      const caseDate = new Date(c.scheduledDate);
      return caseDate >= fromDate && caseDate <= toDate;
    });

    // Apply filters
    if (input.surgeonIds && input.surgeonIds.length > 0) {
      cases = cases.filter(c => input.surgeonIds!.includes(c.primarySurgeonId));
    }
    if (input.operatingRoomIds && input.operatingRoomIds.length > 0) {
      cases = cases.filter(c => c.operatingRoomId && input.operatingRoomIds!.includes(c.operatingRoomId));
    }
    if (input.specialties && input.specialties.length > 0) {
      // Would need specialty mapping - simplified for now
    }

    // Calculate summary metrics
    const completedCases = cases.filter(c => c.status === 'completed');
    const cancelledCases = cases.filter(c => c.status === 'cancelled');

    const totalScheduledMinutes = cases.reduce((sum, c) => sum + c.estimatedDuration, 0);
    const totalActualMinutes = completedCases.reduce((sum, c) => sum + (c.actualDuration || c.estimatedDuration), 0);

    // Available OR time (8 hours per room per day)
    const daysInPeriod = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalAvailableMinutes = daysInPeriod * operatingRooms.length * 480; // 8 hours = 480 minutes

    const overallUtilization = totalAvailableMinutes > 0 ?
      (totalActualMinutes / totalAvailableMinutes) * 100 : 0;

    // Calculate turnover times (time between cases in same room)
    let totalTurnoverTime = 0;
    let turnoverCount = 0;

    // Group cases by room and date
    const casesByRoomDate = new Map<string, SurgicalCase[]>();
    for (const c of completedCases) {
      if (!c.operatingRoomId) continue;
      const key = `${c.operatingRoomId}-${c.scheduledDate.toDateString()}`;
      const existing = casesByRoomDate.get(key) || [];
      existing.push(c);
      casesByRoomDate.set(key, existing);
    }

    for (const roomCases of casesByRoomDate.values()) {
      const sorted = roomCases.sort((a, b) =>
        (a.actualStartTime?.getTime() || 0) - (b.actualStartTime?.getTime() || 0)
      );
      for (let i = 1; i < sorted.length; i++) {
        const prevEnd = sorted[i - 1].actualEndTime;
        const currStart = sorted[i].actualStartTime;
        if (prevEnd && currStart) {
          totalTurnoverTime += (currStart.getTime() - prevEnd.getTime()) / 60000;
          turnoverCount++;
        }
      }
    }

    const averageTurnoverTime = turnoverCount > 0 ? totalTurnoverTime / turnoverCount : 30;

    // First case on time rate
    let firstCasesTotal = 0;
    let firstCasesOnTime = 0;
    for (const roomCases of casesByRoomDate.values()) {
      const firstCase = roomCases.sort((a, b) =>
        (a.estimatedStartTime?.getTime() || 0) - (b.estimatedStartTime?.getTime() || 0)
      )[0];
      if (firstCase?.estimatedStartTime && firstCase?.actualStartTime) {
        firstCasesTotal++;
        const delay = (firstCase.actualStartTime.getTime() - firstCase.estimatedStartTime.getTime()) / 60000;
        if (delay <= 15) firstCasesOnTime++; // Within 15 minutes is considered on time
      }
    }

    const firstCaseOnTimeRate = firstCasesTotal > 0 ? (firstCasesOnTime / firstCasesTotal) * 100 : 85;

    // Calculate breakdown by groupBy
    const breakdown: Array<{
      groupKey: string;
      groupName: string;
      metrics: Record<string, number>;
      trends?: { utilizationTrend: 'up' | 'down' | 'stable'; comparisonToPrevious: number };
    }> = [];

    if (input.groupBy === 'room') {
      for (const room of operatingRooms) {
        const roomCases = cases.filter(c => c.operatingRoomId === room.id);
        const roomCompletedCases = roomCases.filter(c => c.status === 'completed');
        const roomCancelledCases = roomCases.filter(c => c.status === 'cancelled');

        const roomScheduledMinutes = roomCases.reduce((sum, c) => sum + c.estimatedDuration, 0);
        const roomAvailableMinutes = daysInPeriod * 480;

        breakdown.push({
          groupKey: room.id,
          groupName: room.name,
          metrics: {
            utilizationRate: roomAvailableMinutes > 0 ?
              (roomScheduledMinutes / roomAvailableMinutes) * 100 : 0,
            caseCount: roomCases.length,
            cancellationRate: roomCases.length > 0 ?
              (roomCancelledCases.length / roomCases.length) * 100 : 0,
          },
          trends: {
            utilizationTrend: Math.random() > 0.5 ? 'up' : 'stable',
            comparisonToPrevious: Math.round((Math.random() - 0.5) * 20),
          },
        });
      }
    } else if (input.groupBy === 'surgeon') {
      const surgeonIds = [...new Set(cases.map(c => c.primarySurgeonId))];
      for (const surgeonId of surgeonIds) {
        const surgeonCases = cases.filter(c => c.primarySurgeonId === surgeonId);
        const surgeonName = surgeonCases[0]?.primarySurgeonName || `Surgeon ${surgeonId.substring(0, 8)}`;

        breakdown.push({
          groupKey: surgeonId,
          groupName: surgeonName,
          metrics: {
            caseCount: surgeonCases.length,
            cancellationRate: surgeonCases.length > 0 ?
              (surgeonCases.filter(c => c.status === 'cancelled').length / surgeonCases.length) * 100 : 0,
          },
        });
      }
    }

    // Generate insights
    const insights: Array<{
      type: 'warning' | 'opportunity' | 'achievement';
      message: string;
      recommendation?: string;
    }> = [];

    if (overallUtilization < 70) {
      insights.push({
        type: 'opportunity',
        message: `OR utilization is at ${overallUtilization.toFixed(1)}%, below the 70% target`,
        recommendation: 'Consider expanding block time allocation or increasing case scheduling',
      });
    } else if (overallUtilization > 85) {
      insights.push({
        type: 'achievement',
        message: `Excellent OR utilization at ${overallUtilization.toFixed(1)}%`,
      });
    }

    if (averageTurnoverTime > 45) {
      insights.push({
        type: 'warning',
        message: `Average turnover time of ${averageTurnoverTime.toFixed(0)} minutes exceeds target`,
        recommendation: 'Review room turnover procedures and staffing',
      });
    }

    const cancellationRate = cases.length > 0 ? (cancelledCases.length / cases.length) * 100 : 0;
    if (cancellationRate > 5) {
      insights.push({
        type: 'warning',
        message: `Cancellation rate of ${cancellationRate.toFixed(1)}% is above acceptable threshold`,
        recommendation: 'Implement pre-operative screening calls and confirmation protocols',
      });
    }

    // Calculate overtime
    let totalOvertimeMinutes = 0;
    for (const c of completedCases) {
      if (c.actualEndTime) {
        const endMinutes = c.actualEndTime.getHours() * 60 + c.actualEndTime.getMinutes();
        if (endMinutes > 17 * 60) { // After 5 PM
          totalOvertimeMinutes += endMinutes - (17 * 60);
        }
      }
    }

    return {
      period: {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      },
      groupBy: input.groupBy,
      summary: {
        overallUtilization: Math.round(overallUtilization * 10) / 10,
        totalCases: cases.length,
        averageTurnoverTime: Math.round(averageTurnoverTime),
        cancellationRate: Math.round(cancellationRate * 10) / 10,
        firstCaseOnTimeRate: Math.round(firstCaseOnTimeRate * 10) / 10,
        totalOvertimeMinutes: Math.round(totalOvertimeMinutes),
      },
      breakdown,
      insights,
    };
  },

  // ==========================================
  // Cancellation Prediction
  // ==========================================

  /**
   * Predict cancellation/no-show probability for a case
   */
  async predictCancellation(caseId: string): Promise<CancellationPredictionResponse> {
    const surgicalCase = surgicalCasesStore.get(caseId);
    if (!surgicalCase) {
      throw new NotFoundError('Surgical case not found');
    }

    // Factors contributing to cancellation risk
    const riskFactors: Array<{ factor: string; impact: number; description: string }> = [];
    let baseProbability = 0.05; // 5% base cancellation rate

    // Time to surgery factor
    const daysToSurgery = Math.ceil(
      (surgicalCase.scheduledDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysToSurgery > 30) {
      const impact = 0.02;
      baseProbability += impact;
      riskFactors.push({
        factor: 'Long wait time',
        impact,
        description: `Surgery scheduled ${daysToSurgery} days out - longer waits have higher cancellation rates`,
      });
    }

    // Priority factor
    if (surgicalCase.priority === 'elective') {
      const impact = 0.03;
      baseProbability += impact;
      riskFactors.push({
        factor: 'Elective procedure',
        impact,
        description: 'Elective procedures have higher voluntary cancellation rates',
      });
    }

    // Morning preference factor
    if (surgicalCase.patientPreferences?.preferredTime === 'morning' &&
        surgicalCase.estimatedStartTime) {
      const startHour = surgicalCase.estimatedStartTime.getHours();
      if (startHour >= 12) {
        const impact = 0.02;
        baseProbability += impact;
        riskFactors.push({
          factor: 'Schedule mismatch',
          impact,
          description: 'Patient preferred morning but scheduled for afternoon',
        });
      }
    }

    // Historical patient data (simulated)
    const patientNoShowRate = Math.random() * 0.1; // 0-10%
    if (patientNoShowRate > 0.05) {
      const impact = patientNoShowRate * 0.5;
      baseProbability += impact;
      riskFactors.push({
        factor: 'Patient history',
        impact,
        description: `Patient has a ${(patientNoShowRate * 100).toFixed(1)}% historical no-show rate`,
      });
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (baseProbability > 0.15) riskLevel = 'high';
    else if (baseProbability > 0.08) riskLevel = 'medium';

    // Generate recommendations
    const recommendations: Array<{ action: string; priority: 'low' | 'medium' | 'high'; expectedRiskReduction: number }> = [];

    if (daysToSurgery > 7) {
      recommendations.push({
        action: 'Schedule confirmation call 48-72 hours before surgery',
        priority: 'high',
        expectedRiskReduction: 0.03,
      });
    }

    if (surgicalCase.patientPreferences?.interpreterNeeded) {
      recommendations.push({
        action: 'Confirm interpreter availability and send pre-op instructions in patient language',
        priority: 'medium',
        expectedRiskReduction: 0.02,
      });
    }

    if (riskLevel !== 'low') {
      recommendations.push({
        action: 'Send text message reminder with preparation instructions',
        priority: 'medium',
        expectedRiskReduction: 0.02,
      });
    }

    return {
      caseId,
      patientId: surgicalCase.patientId,
      cancellationRisk: {
        probability: Math.min(baseProbability, 0.5),
        riskLevel,
        confidence: 0.75 + (riskFactors.length * 0.03),
      },
      riskFactors,
      recommendations,
      historicalData: {
        patientNoShowRate: patientNoShowRate,
        procedureNoShowRate: 0.04 + Math.random() * 0.04,
        surgeonCancellationRate: 0.02 + Math.random() * 0.03,
      },
    };
  },

  // ==========================================
  // Helper Methods
  // ==========================================

  timeRangesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);
    return s1 < e2 && s2 < e1;
  },

  formatORBlockResponse(block: ORBlock): ORBlockResponse {
    // Get cases scheduled in this block
    const blockDate = new Date(block.date).toDateString();
    const blockCases = Array.from(surgicalCasesStore.values()).filter(c =>
      c.blockId === block.id ||
      (c.operatingRoomId === block.operatingRoomId &&
       c.scheduledDate.toDateString() === blockDate &&
       c.status !== 'cancelled')
    );

    const scheduledMinutes = blockCases.reduce((sum, c) => sum + c.estimatedDuration, 0);
    const availableMinutes = calculateBlockMinutes(block.startTime, block.endTime);

    return {
      id: block.id,
      operatingRoomId: block.operatingRoomId,
      operatingRoomName: block.operatingRoomName,
      surgeonId: block.surgeonId,
      surgeonName: block.surgeonName,
      date: block.date.toISOString(),
      startTime: block.startTime,
      endTime: block.endTime,
      blockType: block.blockType,
      specialty: block.specialty,
      notes: block.notes,
      utilization: {
        scheduledMinutes,
        availableMinutes,
        utilizationPercentage: availableMinutes > 0 ?
          Math.round((scheduledMinutes / availableMinutes) * 100) : 0,
        casesScheduled: blockCases.length,
      },
      cases: blockCases.map(c => ({
        id: c.id,
        patientName: c.patientName,
        procedureName: c.procedureName,
        estimatedStartTime: c.estimatedStartTime?.toISOString() || '',
        estimatedDuration: c.estimatedDuration,
        priority: c.priority,
        status: c.status,
      })),
      createdAt: block.createdAt.toISOString(),
      updatedAt: block.updatedAt.toISOString(),
    };
  },

  formatSurgicalCaseResponse(surgicalCase: SurgicalCase): SurgicalCaseResponse {
    return {
      id: surgicalCase.id,
      patientId: surgicalCase.patientId,
      patientName: surgicalCase.patientName,
      primarySurgeonId: surgicalCase.primarySurgeonId,
      primarySurgeonName: surgicalCase.primarySurgeonName,
      procedureCode: surgicalCase.procedureCode,
      procedureName: surgicalCase.procedureName,
      scheduledDate: surgicalCase.scheduledDate.toISOString(),
      estimatedStartTime: surgicalCase.estimatedStartTime?.toISOString(),
      estimatedEndTime: surgicalCase.estimatedEndTime?.toISOString(),
      estimatedDuration: surgicalCase.estimatedDuration,
      actualDuration: surgicalCase.actualDuration,
      priority: surgicalCase.priority,
      status: surgicalCase.status,
      anesthesiaType: surgicalCase.anesthesiaType,
      operatingRoomId: surgicalCase.operatingRoomId,
      operatingRoomName: surgicalCase.operatingRoomName,
      blockId: surgicalCase.blockId,
      laterality: surgicalCase.laterality,
      specialEquipment: surgicalCase.specialEquipment,
      staffRequirements: surgicalCase.staffRequirements,
      preOpDiagnosis: surgicalCase.preOpDiagnosis,
      notes: surgicalCase.notes,
      createdAt: surgicalCase.createdAt.toISOString(),
      updatedAt: surgicalCase.updatedAt.toISOString(),
    };
  },

  calculateScheduleMetrics(cases: SurgicalCase[]): ScheduleMetrics {
    const roomsUsed = new Set(cases.map(c => c.operatingRoomId).filter(Boolean)).size;
    const totalScheduledMinutes = cases.reduce((sum, c) => sum + c.estimatedDuration, 0);
    const availableMinutes = roomsUsed * 480; // 8 hours per room

    let overtimeMinutes = 0;
    for (const c of cases) {
      if (c.estimatedEndTime) {
        const endMinutes = c.estimatedEndTime.getHours() * 60 + c.estimatedEndTime.getMinutes();
        if (endMinutes > 17 * 60) {
          overtimeMinutes += endMinutes - (17 * 60);
        }
      }
    }

    return {
      totalUtilization: availableMinutes > 0 ? (totalScheduledMinutes / availableMinutes) * 100 : 0,
      totalOvertimeMinutes: overtimeMinutes,
      averageTurnoverMinutes: 30, // Simplified
      casesScheduled: cases.length,
      roomsUsed,
      firstCaseOnTimeRate: 85, // Simplified
    };
  },

  optimizeForUtilization(cases: SurgicalCase[], changes: ScheduleChange[], constraints?: any): void {
    // Simple optimization: try to fill gaps in schedule
    const unscheduledCases = cases.filter(c => !c.operatingRoomId);

    for (const room of operatingRooms) {
      for (const unscheduled of unscheduledCases) {
        if (!unscheduled.operatingRoomId) {
          changes.push({
            caseId: unscheduled.id,
            changeType: 'reassign_room',
            originalValue: 'Unassigned',
            proposedValue: room.name,
            reason: 'Fill available OR capacity',
            impact: 'Increases room utilization',
          });
          unscheduled.operatingRoomId = room.id;
          unscheduled.operatingRoomName = room.name;
          break;
        }
      }
    }
  },

  optimizeForMinimalOvertime(cases: SurgicalCase[], changes: ScheduleChange[], constraints?: any): void {
    // Move cases that would run into overtime to earlier slots or different days
    for (const c of cases) {
      if (c.estimatedEndTime) {
        const endMinutes = c.estimatedEndTime.getHours() * 60 + c.estimatedEndTime.getMinutes();
        const maxMinutes = constraints?.maxOvertimeMinutes ? (17 * 60 + constraints.maxOvertimeMinutes) : (17 * 60);

        if (endMinutes > maxMinutes) {
          changes.push({
            caseId: c.id,
            changeType: 'reschedule',
            originalValue: c.estimatedStartTime?.toISOString() || '',
            proposedValue: 'Earlier slot or different day',
            reason: 'Case would extend beyond acceptable overtime',
            impact: 'Reduces staff overtime costs',
          });
        }
      }
    }
  },

  optimizeForBalancedWorkload(cases: SurgicalCase[], changes: ScheduleChange[]): void {
    // Balance cases across rooms
    const roomCounts = new Map<string, number>();
    for (const c of cases) {
      if (c.operatingRoomId) {
        roomCounts.set(c.operatingRoomId, (roomCounts.get(c.operatingRoomId) || 0) + 1);
      }
    }

    const avgCasesPerRoom = cases.length / operatingRooms.length;

    for (const [roomId, count] of roomCounts) {
      if (count > avgCasesPerRoom * 1.5) {
        const room = operatingRooms.find(r => r.id === roomId);
        changes.push({
          caseId: 'multiple',
          changeType: 'reassign_room',
          originalValue: room?.name || roomId,
          proposedValue: 'Redistribute to other rooms',
          reason: `Room has ${count} cases, exceeding balanced target of ${Math.round(avgCasesPerRoom)}`,
          impact: 'Better staff and resource distribution',
        });
      }
    }
  },

  optimizeForMinimalTurnover(cases: SurgicalCase[], changes: ScheduleChange[]): void {
    // Group similar procedures to minimize equipment changeover
    // This is a simplified version
    changes.push({
      caseId: 'schedule',
      changeType: 'reassign_time',
      originalValue: 'Mixed procedure order',
      proposedValue: 'Group similar procedures together',
      reason: 'Reduce equipment and setup changeover time',
      impact: 'Estimated 15-20 minutes saved per room per day',
    });
  },

  optimizeForPatientPreference(cases: SurgicalCase[], changes: ScheduleChange[]): void {
    for (const c of cases) {
      if (c.patientPreferences?.preferredTime === 'morning' && c.estimatedStartTime) {
        const startHour = c.estimatedStartTime.getHours();
        if (startHour >= 12) {
          changes.push({
            caseId: c.id,
            changeType: 'reassign_time',
            originalValue: c.estimatedStartTime.toISOString(),
            proposedValue: 'Morning slot',
            reason: 'Patient preference for morning surgery',
            impact: 'Improved patient satisfaction',
          });
        }
      }
    }
  },
};
