/**
 * Health Event Trigger
 * Evaluates health-related conditions for smart reminders
 */

import {
  TriggerCondition,
  TriggerEvaluationResult,
  HealthEventConditionParams,
} from '../models/TriggerCondition.js';
import { logger } from '../utils/logger.js';

// Health event interface
interface HealthEvent {
  id: string;
  patientId: string;
  type: string;
  title: string;
  description?: string;
  date: string;
  severity?: 'low' | 'moderate' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'pending';
  providerId?: string;
  conditionCodes?: string[];
  medicationIds?: string[];
  labValues?: Record<string, {
    value: number;
    unit: string;
    referenceRange?: { min: number; max: number };
    isAbnormal?: boolean;
  }>;
  metadata?: Record<string, unknown>;
}

// Health record service interface
interface HealthRecordService {
  getRecentEvents(
    patientId: string,
    eventTypes?: string[],
    daysBacks?: number
  ): Promise<HealthEvent[]>;
  getMedicationRefills(patientId: string): Promise<Array<{
    medicationId: string;
    medicationName: string;
    refillDate: string;
    daysUntilRefill: number;
    lastFilledDate: string;
  }>>;
  getUpcomingScreenings(patientId: string): Promise<Array<{
    screeningType: string;
    dueDate: string;
    lastCompletedDate?: string;
    priority: 'routine' | 'overdue' | 'urgent';
  }>>;
  getMissedMedications(patientId: string, hoursBack: number): Promise<Array<{
    medicationId: string;
    medicationName: string;
    scheduledTime: string;
    missedDuration: number;
  }>>;
}

// Mock health record service
class MockHealthRecordService implements HealthRecordService {
  async getRecentEvents(
    patientId: string,
    eventTypes?: string[],
    daysBack: number = 30
  ): Promise<HealthEvent[]> {
    const now = new Date();

    const events: HealthEvent[] = [
      {
        id: 'event-1',
        patientId,
        type: 'lab_result_available',
        title: 'Blood Test Results',
        description: 'Complete blood count results are ready',
        date: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        severity: 'low',
        status: 'active',
        labValues: {
          hemoglobin: { value: 14.5, unit: 'g/dL', referenceRange: { min: 12, max: 16 } },
          glucose: { value: 105, unit: 'mg/dL', referenceRange: { min: 70, max: 100 }, isAbnormal: true },
        },
      },
      {
        id: 'event-2',
        patientId,
        type: 'appointment_scheduled',
        title: 'Follow-up Appointment',
        description: 'Scheduled follow-up with Dr. Smith',
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        providerId: 'provider-1',
      },
      {
        id: 'event-3',
        patientId,
        type: 'vital_recorded',
        title: 'Blood Pressure Reading',
        description: 'Home blood pressure measurement',
        date: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        severity: 'moderate',
        status: 'active',
        labValues: {
          systolic: { value: 145, unit: 'mmHg', referenceRange: { min: 90, max: 120 }, isAbnormal: true },
          diastolic: { value: 92, unit: 'mmHg', referenceRange: { min: 60, max: 80 }, isAbnormal: true },
        },
      },
    ];

    if (eventTypes && eventTypes.length > 0) {
      return events.filter((e) => eventTypes.includes(e.type));
    }
    return events;
  }

  async getMedicationRefills(patientId: string): Promise<Array<{
    medicationId: string;
    medicationName: string;
    refillDate: string;
    daysUntilRefill: number;
    lastFilledDate: string;
  }>> {
    const now = new Date();
    return [
      {
        medicationId: 'med-1',
        medicationName: 'Metformin 500mg',
        refillDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilRefill: 5,
        lastFilledDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        medicationId: 'med-2',
        medicationName: 'Lisinopril 10mg',
        refillDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilRefill: 12,
        lastFilledDate: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  async getUpcomingScreenings(patientId: string): Promise<Array<{
    screeningType: string;
    dueDate: string;
    lastCompletedDate?: string;
    priority: 'routine' | 'overdue' | 'urgent';
  }>> {
    const now = new Date();
    return [
      {
        screeningType: 'Annual Physical',
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastCompletedDate: new Date(now.getTime() - 335 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'routine',
      },
      {
        screeningType: 'Flu Vaccination',
        dueDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        lastCompletedDate: new Date(now.getTime() - 380 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'overdue',
      },
    ];
  }

  async getMissedMedications(patientId: string, hoursBack: number): Promise<Array<{
    medicationId: string;
    medicationName: string;
    scheduledTime: string;
    missedDuration: number;
  }>> {
    // Return empty for mock - would check actual adherence data
    return [];
  }
}

// Health event trigger evaluator
export class HealthEventTrigger {
  private healthService: HealthRecordService;

  constructor(healthService?: HealthRecordService) {
    this.healthService = healthService || new MockHealthRecordService();
  }

  async evaluate(
    trigger: TriggerCondition,
    userContext: {
      userId: string;
      patientId: string;
    }
  ): Promise<TriggerEvaluationResult> {
    const params = trigger.healthEventParams;
    if (!params) {
      return this.createResult(trigger, false, 'No health event parameters configured');
    }

    try {
      const results: Array<{ condition: string; met: boolean; detail: string; data?: unknown }> = [];
      const { patientId } = userContext;

      // Check for specific health event types
      if (params.eventTypes && params.eventTypes.length > 0) {
        const events = await this.healthService.getRecentEvents(
          patientId,
          params.eventTypes,
          params.timeframeDays || 7
        );

        // Filter by severity if specified
        let filteredEvents = events;
        if (params.severityLevels && params.severityLevels.length > 0) {
          filteredEvents = events.filter(
            (e) => e.severity && params.severityLevels!.includes(e.severity)
          );
        }

        // Filter by condition codes if specified
        if (params.conditionCodes && params.conditionCodes.length > 0) {
          filteredEvents = filteredEvents.filter(
            (e) =>
              e.conditionCodes &&
              e.conditionCodes.some((code) => params.conditionCodes!.includes(code))
          );
        }

        // Filter by medication IDs if specified
        if (params.medicationIds && params.medicationIds.length > 0) {
          filteredEvents = filteredEvents.filter(
            (e) =>
              e.medicationIds &&
              e.medicationIds.some((id) => params.medicationIds!.includes(id))
          );
        }

        // Filter by provider if specified
        if (params.providerIds && params.providerIds.length > 0) {
          filteredEvents = filteredEvents.filter(
            (e) => e.providerId && params.providerIds!.includes(e.providerId)
          );
        }

        // Check for lab result abnormalities
        if (params.eventTypes.includes('lab_result_abnormal')) {
          const abnormalResults = filteredEvents.filter((e) => {
            if (!e.labValues) return false;
            return Object.values(e.labValues).some((v) => v.isAbnormal);
          });

          if (abnormalResults.length > 0) {
            results.push({
              condition: 'lab_result_abnormal',
              met: true,
              detail: `${abnormalResults.length} abnormal lab result(s) found`,
              data: abnormalResults,
            });
          }
        }

        // Check for vital abnormalities
        if (params.eventTypes.includes('vital_abnormal')) {
          const abnormalVitals = filteredEvents.filter(
            (e) => e.type === 'vital_recorded' && e.severity && ['moderate', 'high', 'critical'].includes(e.severity)
          );

          if (abnormalVitals.length > 0) {
            results.push({
              condition: 'vital_abnormal',
              met: true,
              detail: `${abnormalVitals.length} abnormal vital reading(s)`,
              data: abnormalVitals,
            });
          }
        }

        // General event match
        if (filteredEvents.length > 0 && results.length === 0) {
          results.push({
            condition: 'health_event_match',
            met: true,
            detail: `${filteredEvents.length} matching health event(s) found`,
            data: filteredEvents.slice(0, 5),
          });
        }
      }

      // Check for medication refill due
      if (params.eventTypes?.includes('medication_refill_due')) {
        const refills = await this.healthService.getMedicationRefills(patientId);
        const dueRefills = refills.filter((r) => r.daysUntilRefill <= 7);

        if (dueRefills.length > 0) {
          results.push({
            condition: 'medication_refill_due',
            met: true,
            detail: `${dueRefills.length} medication(s) need refill soon: ${dueRefills.map((r) => r.medicationName).join(', ')}`,
            data: dueRefills,
          });
        }
      }

      // Check for missed medications
      if (params.eventTypes?.includes('medication_missed')) {
        const missed = await this.healthService.getMissedMedications(patientId, 24);

        if (missed.length > 0) {
          results.push({
            condition: 'medication_missed',
            met: true,
            detail: `${missed.length} missed medication(s): ${missed.map((m) => m.medicationName).join(', ')}`,
            data: missed,
          });
        }
      }

      // Check for vaccination/screening due
      if (
        params.eventTypes?.includes('vaccination_due') ||
        params.eventTypes?.includes('screening_due')
      ) {
        const screenings = await this.healthService.getUpcomingScreenings(patientId);
        const dueScreenings = screenings.filter(
          (s) => s.priority === 'overdue' || s.priority === 'urgent'
        );

        if (dueScreenings.length > 0) {
          results.push({
            condition: 'screening_due',
            met: true,
            detail: `${dueScreenings.length} overdue screening(s): ${dueScreenings.map((s) => s.screeningType).join(', ')}`,
            data: dueScreenings,
          });
        }
      }

      const triggered = results.filter((r) => r.met).length > 0;

      logger.info(
        `Health event trigger ${trigger.id} evaluated: ${triggered ? 'TRIGGERED' : 'NOT TRIGGERED'}`,
        {
          triggerId: trigger.id,
          patientId,
          triggered,
          matchedConditions: results.filter((r) => r.met).length,
        }
      );

      return this.createResult(
        trigger,
        triggered,
        triggered
          ? results.filter((r) => r.met).map((r) => r.detail).join('; ')
          : 'No health event conditions met',
        {
          matchedConditions: results.filter((r) => r.met),
        }
      );
    } catch (error) {
      logger.error(`Health event trigger evaluation failed: ${error}`, {
        triggerId: trigger.id,
        error,
      });
      return this.createResult(trigger, false, `Evaluation error: ${error}`);
    }
  }

  private createResult(
    trigger: TriggerCondition,
    triggered: boolean,
    reason: string,
    context?: Record<string, unknown>
  ): TriggerEvaluationResult {
    return {
      triggerId: trigger.id,
      triggerType: 'health_event',
      triggered,
      evaluatedAt: new Date().toISOString(),
      reason,
      context,
      confidence: triggered ? 0.95 : 1.0,
      nextEvaluationAt: new Date(
        Date.now() + trigger.evaluationIntervalMinutes * 60 * 1000
      ).toISOString(),
    };
  }
}

export default HealthEventTrigger;
