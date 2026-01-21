/**
 * Trigger Evaluator Service
 * Orchestrates evaluation of trigger conditions for smart reminders
 */

import { TriggerCondition, TriggerEvaluationResult } from '../models/TriggerCondition.js';
import { ReminderConfig } from '../models/ReminderConfig.js';
import { UserContext } from './contextEngine.js';
import { WeatherTrigger } from '../triggers/weatherTrigger.js';
import { TravelTrigger } from '../triggers/travelTrigger.js';
import { CalendarTrigger } from '../triggers/calendarTrigger.js';
import { HealthEventTrigger } from '../triggers/healthEventTrigger.js';
import { logger } from '../utils/logger.js';

// Trigger evaluation request
export interface TriggerEvaluationRequest {
  reminder: ReminderConfig;
  triggers: TriggerCondition[];
  userContext: UserContext;
}

// Combined evaluation result
export interface CombinedEvaluationResult {
  reminderId: string;
  shouldTrigger: boolean;
  triggeredConditions: TriggerEvaluationResult[];
  notTriggeredConditions: TriggerEvaluationResult[];
  combinedContext: Record<string, unknown>;
  evaluatedAt: string;
  nextEvaluationAt: string;
}

// Trigger evaluator service
export class TriggerEvaluator {
  private weatherTrigger: WeatherTrigger;
  private travelTrigger: TravelTrigger;
  private calendarTrigger: CalendarTrigger;
  private healthEventTrigger: HealthEventTrigger;

  constructor() {
    this.weatherTrigger = new WeatherTrigger();
    this.travelTrigger = new TravelTrigger();
    this.calendarTrigger = new CalendarTrigger();
    this.healthEventTrigger = new HealthEventTrigger();
  }

  async evaluateTriggers(request: TriggerEvaluationRequest): Promise<CombinedEvaluationResult> {
    const { reminder, triggers, userContext } = request;

    logger.info(`Evaluating ${triggers.length} triggers for reminder ${reminder.id}`, {
      reminderId: reminder.id,
      triggerCount: triggers.length,
    });

    const results: TriggerEvaluationResult[] = [];
    const combinedContext: Record<string, unknown> = {};

    // Evaluate each trigger
    for (const trigger of triggers) {
      if (!trigger.isActive) {
        logger.debug(`Skipping inactive trigger ${trigger.id}`);
        continue;
      }

      // Check cooldown
      if (trigger.lastTriggeredAt && trigger.cooldownMinutes > 0) {
        const lastTriggered = new Date(trigger.lastTriggeredAt);
        const cooldownEnd = new Date(lastTriggered.getTime() + trigger.cooldownMinutes * 60 * 1000);
        if (new Date() < cooldownEnd) {
          logger.debug(`Trigger ${trigger.id} is in cooldown until ${cooldownEnd.toISOString()}`);
          results.push({
            triggerId: trigger.id,
            triggerType: trigger.type,
            triggered: false,
            evaluatedAt: new Date().toISOString(),
            reason: 'In cooldown period',
            nextEvaluationAt: cooldownEnd.toISOString(),
          });
          continue;
        }
      }

      // Check daily trigger limit
      if (trigger.maxTriggersPerDay > 0) {
        const todayTriggers = this.getTodayTriggerCount(trigger);
        if (todayTriggers >= trigger.maxTriggersPerDay) {
          logger.debug(`Trigger ${trigger.id} has reached daily limit (${trigger.maxTriggersPerDay})`);
          results.push({
            triggerId: trigger.id,
            triggerType: trigger.type,
            triggered: false,
            evaluatedAt: new Date().toISOString(),
            reason: `Daily trigger limit reached (${trigger.maxTriggersPerDay})`,
            nextEvaluationAt: this.getNextDayStart().toISOString(),
          });
          continue;
        }
      }

      // Evaluate based on trigger type
      let result: TriggerEvaluationResult;

      try {
        switch (trigger.type) {
          case 'weather':
            result = await this.weatherTrigger.evaluate(trigger, {
              latitude: userContext.location?.latitude,
              longitude: userContext.location?.longitude,
              locationId: userContext.location?.locationId,
            });
            break;

          case 'travel':
            result = await this.travelTrigger.evaluate(trigger, {
              userId: userContext.userId,
              homeTimezone: userContext.preferences?.timezone,
            });
            break;

          case 'calendar':
            result = await this.calendarTrigger.evaluate(trigger, {
              userId: userContext.userId,
              timezone: userContext.preferences?.timezone,
            });
            break;

          case 'health_event':
            result = await this.healthEventTrigger.evaluate(trigger, {
              userId: userContext.userId,
              patientId: userContext.patientId || userContext.userId,
            });
            break;

          default:
            result = {
              triggerId: trigger.id,
              triggerType: trigger.type,
              triggered: false,
              evaluatedAt: new Date().toISOString(),
              reason: `Unknown trigger type: ${trigger.type}`,
            };
        }
      } catch (error) {
        logger.error(`Error evaluating trigger ${trigger.id}:`, { error });
        result = {
          triggerId: trigger.id,
          triggerType: trigger.type,
          triggered: false,
          evaluatedAt: new Date().toISOString(),
          reason: `Evaluation error: ${error}`,
        };
      }

      results.push(result);

      // Collect context from triggered conditions
      if (result.triggered && result.context) {
        combinedContext[trigger.type] = result.context;
      }
    }

    // Determine if reminder should trigger based on logic
    const triggeredResults = results.filter((r) => r.triggered);
    const notTriggeredResults = results.filter((r) => !r.triggered);

    let shouldTrigger: boolean;

    if (reminder.requireAllTriggers) {
      // All triggers must be true (AND logic)
      shouldTrigger = triggeredResults.length === triggers.filter((t) => t.isActive).length;
    } else {
      // Any trigger can be true (OR logic)
      shouldTrigger = triggeredResults.length > 0;
    }

    // Calculate next evaluation time (minimum of all suggested times)
    const nextEvaluationTimes = results
      .filter((r) => r.nextEvaluationAt)
      .map((r) => new Date(r.nextEvaluationAt!).getTime());

    const nextEvaluationAt = nextEvaluationTimes.length > 0
      ? new Date(Math.min(...nextEvaluationTimes)).toISOString()
      : new Date(Date.now() + 60 * 60 * 1000).toISOString(); // Default: 1 hour

    logger.info(
      `Trigger evaluation complete for reminder ${reminder.id}: ${shouldTrigger ? 'SHOULD TRIGGER' : 'NOT TRIGGERED'}`,
      {
        reminderId: reminder.id,
        shouldTrigger,
        triggeredCount: triggeredResults.length,
        totalEvaluated: results.length,
        requireAllTriggers: reminder.requireAllTriggers,
      }
    );

    return {
      reminderId: reminder.id,
      shouldTrigger,
      triggeredConditions: triggeredResults,
      notTriggeredConditions: notTriggeredResults,
      combinedContext,
      evaluatedAt: new Date().toISOString(),
      nextEvaluationAt,
    };
  }

  async evaluateSingleTrigger(
    trigger: TriggerCondition,
    userContext: UserContext
  ): Promise<TriggerEvaluationResult> {
    logger.info(`Evaluating single trigger ${trigger.id} of type ${trigger.type}`);

    try {
      switch (trigger.type) {
        case 'weather':
          return await this.weatherTrigger.evaluate(trigger, {
            latitude: userContext.location?.latitude,
            longitude: userContext.location?.longitude,
            locationId: userContext.location?.locationId,
          });

        case 'travel':
          return await this.travelTrigger.evaluate(trigger, {
            userId: userContext.userId,
            homeTimezone: userContext.preferences?.timezone,
          });

        case 'calendar':
          return await this.calendarTrigger.evaluate(trigger, {
            userId: userContext.userId,
            timezone: userContext.preferences?.timezone,
          });

        case 'health_event':
          return await this.healthEventTrigger.evaluate(trigger, {
            userId: userContext.userId,
            patientId: userContext.patientId || userContext.userId,
          });

        default:
          return {
            triggerId: trigger.id,
            triggerType: trigger.type,
            triggered: false,
            evaluatedAt: new Date().toISOString(),
            reason: `Unsupported trigger type: ${trigger.type}`,
          };
      }
    } catch (error) {
      logger.error(`Error evaluating trigger ${trigger.id}:`, { error });
      return {
        triggerId: trigger.id,
        triggerType: trigger.type,
        triggered: false,
        evaluatedAt: new Date().toISOString(),
        reason: `Evaluation error: ${error}`,
      };
    }
  }

  private getTodayTriggerCount(trigger: TriggerCondition): number {
    // In a real implementation, this would query the database
    // For now, return 0 (would need to track trigger history)
    return 0;
  }

  private getNextDayStart(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }
}

export default TriggerEvaluator;
