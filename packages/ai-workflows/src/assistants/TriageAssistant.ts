/**
 * Triage Assistant
 * AI-powered patient triage and priority assessment
 */

import {
  AssistantRequest,
  AssistantResponse,
  AssistantType,
  TriageInput,
  TriageSuggestion,
  TriagePriority,
  ConfidenceLevel,
} from '../types';

export interface TriageModel {
  assessPriority(input: TriageInput, context: Record<string, any>): Promise<{
    priority: TriagePriority;
    estimatedWaitTime?: number;
    recommendedActions: string[];
    redFlags: string[];
    confidence: number;
    processingTimeMs: number;
  }>;
}

export class TriageAssistant {
  constructor(
    private model: TriageModel,
    private modelVersion: string = 'triage-model-v1.0'
  ) {}

  /**
   * Generate triage priority suggestions
   */
  async generateSuggestions(request: AssistantRequest): Promise<AssistantResponse> {
    const startTime = Date.now();
    const input = request.input as TriageInput;

    try {
      // Call AI model to assess priority
      const result = await this.model.assessPriority(input, request.context);

      // Create suggestion
      const suggestion: TriageSuggestion = {
        id: this.generateSuggestionId(),
        type: 'triage_priority',
        content: {
          priority: result.priority,
          estimatedWaitTime: result.estimatedWaitTime,
          recommendedActions: result.recommendedActions,
          redFlags: result.redFlags,
        },
        confidence: this.mapConfidenceToLevel(result.confidence),
        confidenceScore: result.confidence,
        rationale: this.generateRationale(input, result),
        warnings: this.generateWarnings(input, result),
        requiresApproval: result.priority === TriagePriority.CRITICAL, // Critical requires immediate review
      };

      const processingTimeMs = Date.now() - startTime;

      const response: AssistantResponse = {
        requestId: request.requestId,
        assistantType: AssistantType.TRIAGE,
        suggestions: [suggestion],
        metadata: {
          modelVersion: this.modelVersion,
          promptTemplateId: 'triage-assessment-v1',
          processingTimeMs,
          phiMinimized: true,
        },
        requiresHumanReview: result.priority === TriagePriority.CRITICAL || result.redFlags.length > 0,
        timestamp: new Date(),
      };

      return response;
    } catch (error) {
      throw new Error(`Triage assessment failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Batch triage multiple patients
   */
  async batchTriage(requests: AssistantRequest[]): Promise<AssistantResponse[]> {
    return Promise.all(requests.map(request => this.generateSuggestions(request)));
  }

  /**
   * Re-assess priority with updated information
   */
  async reassess(
    originalRequest: AssistantRequest,
    updatedInfo: Partial<TriageInput>
  ): Promise<AssistantResponse> {
    const updatedInput: TriageInput = {
      ...(originalRequest.input as TriageInput),
      ...updatedInfo,
    };

    return this.generateSuggestions({
      ...originalRequest,
      input: updatedInput,
    });
  }

  /**
   * Map confidence score to level
   */
  private mapConfidenceToLevel(score: number): ConfidenceLevel {
    if (score >= 0.9) return ConfidenceLevel.VERY_HIGH;
    if (score >= 0.8) return ConfidenceLevel.HIGH;
    if (score >= 0.6) return ConfidenceLevel.MEDIUM;
    if (score >= 0.4) return ConfidenceLevel.LOW;
    return ConfidenceLevel.VERY_LOW;
  }

  /**
   * Generate rationale for triage decision
   */
  private generateRationale(input: TriageInput, result: any): string {
    const factors: string[] = [];

    if (input.chiefComplaint) {
      factors.push(`Chief complaint: ${input.chiefComplaint}`);
    }

    if (input.vitals) {
      const abnormalVitals = this.identifyAbnormalVitals(input.vitals);
      if (abnormalVitals.length > 0) {
        factors.push(`Abnormal vitals: ${abnormalVitals.join(', ')}`);
      }
    }

    if (input.painLevel && input.painLevel >= 7) {
      factors.push(`High pain level (${input.painLevel}/10)`);
    }

    if (result.redFlags.length > 0) {
      factors.push(`${result.redFlags.length} red flag(s) identified`);
    }

    return `Priority: ${result.priority}. ${factors.join('. ')}.`;
  }

  /**
   * Generate warnings
   */
  private generateWarnings(input: TriageInput, result: any): string[] {
    const warnings: string[] = [];

    if (result.priority === TriagePriority.CRITICAL) {
      warnings.push('CRITICAL PRIORITY - Immediate physician evaluation required');
    }

    if (result.redFlags.length > 0) {
      warnings.push(`Red flags identified: ${result.redFlags.join(', ')}`);
    }

    if (!input.vitals) {
      warnings.push('No vital signs provided - assessment may be incomplete');
    }

    if (result.confidence < 0.7) {
      warnings.push('Lower confidence - clinical judgment should take precedence');
    }

    return warnings;
  }

  /**
   * Identify abnormal vital signs
   */
  private identifyAbnormalVitals(vitals: TriageInput['vitals']): string[] {
    const abnormal: string[] = [];

    if (!vitals) return abnormal;

    // Temperature (assuming Fahrenheit, normal: 97-99°F)
    if (vitals.temperature) {
      if (vitals.temperature < 95 || vitals.temperature > 100.4) {
        abnormal.push(`temperature ${vitals.temperature}`);
      }
    }

    // Heart rate (normal: 60-100 bpm)
    if (vitals.heartRate) {
      if (vitals.heartRate < 60 || vitals.heartRate > 100) {
        abnormal.push(`heart rate ${vitals.heartRate}`);
      }
    }

    // Respiratory rate (normal: 12-20 breaths/min)
    if (vitals.respiratoryRate) {
      if (vitals.respiratoryRate < 12 || vitals.respiratoryRate > 20) {
        abnormal.push(`respiratory rate ${vitals.respiratoryRate}`);
      }
    }

    // Oxygen saturation (normal: >95%)
    if (vitals.oxygenSaturation) {
      if (vitals.oxygenSaturation < 95) {
        abnormal.push(`O2 saturation ${vitals.oxygenSaturation}%`);
      }
    }

    return abnormal;
  }

  /**
   * Generate unique suggestion ID
   */
  private generateSuggestionId(): string {
    return `triage-sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Mock triage model (for development/testing)
 */
export class MockTriageModel implements TriageModel {
  async assessPriority(
    input: TriageInput,
    _context: Record<string, any>
  ): Promise<{
    priority: TriagePriority;
    estimatedWaitTime?: number;
    recommendedActions: string[];
    redFlags: string[];
    confidence: number;
    processingTimeMs: number;
  }> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

    // Assess priority based on inputs
    const { priority, redFlags } = this.determinePriority(input);
    const estimatedWaitTime = this.calculateWaitTime(priority);
    const recommendedActions = this.getRecommendedActions(priority, input);
    const confidence = this.calculateConfidence(input);

    return {
      priority,
      estimatedWaitTime,
      recommendedActions,
      redFlags,
      confidence,
      processingTimeMs: 300 + Math.random() * 300,
    };
  }

  private determinePriority(input: TriageInput): {
    priority: TriagePriority;
    redFlags: string[];
  } {
    const redFlags: string[] = [];

    // Check for critical red flags
    if (input.vitals) {
      if (input.vitals.oxygenSaturation && input.vitals.oxygenSaturation < 90) {
        redFlags.push('Critically low oxygen saturation');
        return { priority: TriagePriority.CRITICAL, redFlags };
      }

      if (input.vitals.heartRate && (input.vitals.heartRate < 40 || input.vitals.heartRate > 150)) {
        redFlags.push('Critical heart rate abnormality');
        return { priority: TriagePriority.CRITICAL, redFlags };
      }

      if (input.vitals.temperature && input.vitals.temperature > 104) {
        redFlags.push('Critically high temperature');
        return { priority: TriagePriority.CRITICAL, redFlags };
      }
    }

    // Check chief complaint for critical conditions
    const complaint = input.chiefComplaint.toLowerCase();
    const criticalKeywords = ['chest pain', 'stroke', 'unconscious', 'severe bleeding', 'difficulty breathing'];

    if (criticalKeywords.some(keyword => complaint.includes(keyword))) {
      redFlags.push(`Critical complaint: ${input.chiefComplaint}`);
      return { priority: TriagePriority.CRITICAL, redFlags };
    }

    // Check for urgent conditions
    if (input.painLevel && input.painLevel >= 8) {
      redFlags.push('Severe pain');
      return { priority: TriagePriority.URGENT, redFlags };
    }

    const urgentKeywords = ['severe pain', 'fever', 'vomiting', 'head injury'];
    if (urgentKeywords.some(keyword => complaint.includes(keyword))) {
      return { priority: TriagePriority.URGENT, redFlags };
    }

    // Check for semi-urgent
    if (input.painLevel && input.painLevel >= 5) {
      return { priority: TriagePriority.SEMI_URGENT, redFlags };
    }

    // Default to non-urgent
    return { priority: TriagePriority.NON_URGENT, redFlags };
  }

  private calculateWaitTime(priority: TriagePriority): number {
    switch (priority) {
      case TriagePriority.CRITICAL:
        return 0; // Immediate
      case TriagePriority.URGENT:
        return 15; // 15 minutes
      case TriagePriority.SEMI_URGENT:
        return 60; // 1 hour
      case TriagePriority.NON_URGENT:
        return 120; // 2 hours
      default:
        return 60;
    }
  }

  private getRecommendedActions(priority: TriagePriority, input: TriageInput): string[] {
    const actions: string[] = [];

    switch (priority) {
      case TriagePriority.CRITICAL:
        actions.push('Immediate physician evaluation');
        actions.push('Prepare for emergency intervention');
        actions.push('Continuous monitoring');
        actions.push('Alert emergency response team');
        break;

      case TriagePriority.URGENT:
        actions.push('Physician evaluation within 15 minutes');
        actions.push('Obtain vital signs');
        actions.push('Prepare examination room');
        if (input.painLevel && input.painLevel >= 7) {
          actions.push('Consider pain management');
        }
        break;

      case TriagePriority.SEMI_URGENT:
        actions.push('Physician evaluation within 1 hour');
        actions.push('Monitor vital signs');
        actions.push('Patient comfort measures');
        break;

      case TriagePriority.NON_URGENT:
        actions.push('Standard queue for evaluation');
        actions.push('Patient check-in complete');
        break;
    }

    return actions;
  }

  private calculateConfidence(input: TriageInput): number {
    let score = 0.6; // Base score

    if (input.chiefComplaint) score += 0.1;
    if (input.symptoms && input.symptoms.length > 0) score += 0.1;
    if (input.vitals) score += 0.15;
    if (input.painLevel !== undefined) score += 0.05;

    return Math.min(score, 0.95);
  }
}
