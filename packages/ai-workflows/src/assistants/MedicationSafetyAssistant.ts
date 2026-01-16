/**
 * Medication Safety Assistant
 * AI-powered medication interaction and safety screening
 */

import {
  AssistantRequest,
  AssistantResponse,
  AssistantType,
  MedicationSafetyInput,
  MedicationSafetySuggestion,
  InteractionSeverity,
  ConfidenceLevel,
} from '../types';

export interface MedicationSafetyModel {
  checkSafety(input: MedicationSafetyInput, context: Record<string, any>): Promise<{
    interactions: Array<{
      severity: InteractionSeverity;
      message: string;
      affectedMedications: string[];
      recommendedAction: string;
      references?: string[];
      confidence: number;
    }>;
    allergyAlerts: Array<{
      message: string;
      allergen: string;
      recommendedAction: string;
      confidence: number;
    }>;
    contraindications: Array<{
      message: string;
      condition: string;
      recommendedAction: string;
      confidence: number;
    }>;
    dosingRecommendations: Array<{
      message: string;
      recommendedAction: string;
      confidence: number;
    }>;
    processingTimeMs: number;
  }>;
}

export class MedicationSafetyAssistant {
  constructor(
    private model: MedicationSafetyModel,
    private modelVersion: string = 'med-safety-model-v1.0'
  ) {}

  /**
   * Generate medication safety suggestions and alerts
   */
  async generateSuggestions(request: AssistantRequest): Promise<AssistantResponse> {
    const startTime = Date.now();
    const input = request.input as MedicationSafetyInput;

    try {
      // Call AI model to check medication safety
      const result = await this.model.checkSafety(input, request.context);

      const suggestions: MedicationSafetySuggestion[] = [];

      // Add interaction alerts
      result.interactions.forEach(interaction => {
        suggestions.push({
          id: this.generateSuggestionId('interaction'),
          type: 'interaction_alert',
          content: {
            severity: interaction.severity,
            message: interaction.message,
            affectedMedications: interaction.affectedMedications,
            recommendedAction: interaction.recommendedAction,
            references: interaction.references,
          },
          confidence: this.mapConfidenceToLevel(interaction.confidence),
          confidenceScore: interaction.confidence,
          rationale: `Drug interaction detected between ${interaction.affectedMedications.join(' and ')}`,
          warnings: this.generateInteractionWarnings(interaction),
          requiresApproval: interaction.severity === InteractionSeverity.CONTRAINDICATED ||
                           interaction.severity === InteractionSeverity.MAJOR,
        });
      });

      // Add allergy alerts
      result.allergyAlerts.forEach(alert => {
        suggestions.push({
          id: this.generateSuggestionId('allergy'),
          type: 'allergy_alert',
          content: {
            severity: InteractionSeverity.CONTRAINDICATED,
            message: alert.message,
            recommendedAction: alert.recommendedAction,
          },
          confidence: this.mapConfidenceToLevel(alert.confidence),
          confidenceScore: alert.confidence,
          rationale: `Patient has documented allergy to ${alert.allergen}`,
          warnings: ['ALLERGY ALERT - Do not administer'],
          requiresApproval: true,
        });
      });

      // Add contraindication alerts
      result.contraindications.forEach(contraindication => {
        suggestions.push({
          id: this.generateSuggestionId('contraindication'),
          type: 'contraindication_alert',
          content: {
            severity: InteractionSeverity.CONTRAINDICATED,
            message: contraindication.message,
            recommendedAction: contraindication.recommendedAction,
          },
          confidence: this.mapConfidenceToLevel(contraindication.confidence),
          confidenceScore: contraindication.confidence,
          rationale: `Contraindicated due to ${contraindication.condition}`,
          warnings: ['CONTRAINDICATION - Physician override required'],
          requiresApproval: true,
        });
      });

      // Add dosing recommendations
      result.dosingRecommendations.forEach(dosing => {
        suggestions.push({
          id: this.generateSuggestionId('dosing'),
          type: 'dosing_recommendation',
          content: {
            severity: InteractionSeverity.MODERATE,
            message: dosing.message,
            recommendedAction: dosing.recommendedAction,
          },
          confidence: this.mapConfidenceToLevel(dosing.confidence),
          confidenceScore: dosing.confidence,
          rationale: 'Dosing adjustment may be needed based on patient factors',
          warnings: ['Review dosing - adjustment may be needed'],
          requiresApproval: true,
        });
      });

      const processingTimeMs = Date.now() - startTime;

      // Determine if human review is required
      const requiresHumanReview = suggestions.some(s =>
        s.type === 'allergy_alert' ||
        s.type === 'contraindication_alert' ||
        (s.type === 'interaction_alert' && (
          s.content.severity === InteractionSeverity.CONTRAINDICATED ||
          s.content.severity === InteractionSeverity.MAJOR
        ))
      );

      const response: AssistantResponse = {
        requestId: request.requestId,
        assistantType: AssistantType.MEDICATION_SAFETY,
        suggestions,
        metadata: {
          modelVersion: this.modelVersion,
          promptTemplateId: 'medication-safety-v1',
          processingTimeMs,
          phiMinimized: true,
        },
        requiresHumanReview,
        timestamp: new Date(),
      };

      return response;
    } catch (error) {
      throw new Error(`Medication safety check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Quick safety check (returns boolean for safe/unsafe)
   */
  async quickCheck(input: MedicationSafetyInput): Promise<{
    isSafe: boolean;
    criticalIssues: string[];
  }> {
    const result = await this.model.checkSafety(input, {});

    const criticalIssues: string[] = [];

    // Check for critical issues
    if (result.allergyAlerts.length > 0) {
      criticalIssues.push(...result.allergyAlerts.map(a => a.message));
    }

    if (result.contraindications.length > 0) {
      criticalIssues.push(...result.contraindications.map(c => c.message));
    }

    const criticalInteractions = result.interactions.filter(
      i => i.severity === InteractionSeverity.CONTRAINDICATED
    );
    if (criticalInteractions.length > 0) {
      criticalIssues.push(...criticalInteractions.map(i => i.message));
    }

    return {
      isSafe: criticalIssues.length === 0,
      criticalIssues,
    };
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
   * Generate warnings for interactions
   */
  private generateInteractionWarnings(interaction: any): string[] {
    const warnings: string[] = [];

    switch (interaction.severity) {
      case InteractionSeverity.CONTRAINDICATED:
        warnings.push('CONTRAINDICATED - Do not administer together');
        warnings.push('Physician override required if administration is necessary');
        break;

      case InteractionSeverity.MAJOR:
        warnings.push('MAJOR INTERACTION - Use with extreme caution');
        warnings.push('Enhanced monitoring required');
        warnings.push('Consider alternative medications');
        break;

      case InteractionSeverity.MODERATE:
        warnings.push('Moderate interaction - monitor patient closely');
        warnings.push('Dose adjustment may be needed');
        break;

      case InteractionSeverity.MINOR:
        warnings.push('Minor interaction noted');
        warnings.push('Routine monitoring recommended');
        break;
    }

    return warnings;
  }

  /**
   * Generate unique suggestion ID
   */
  private generateSuggestionId(type: string): string {
    return `med-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Mock medication safety model (for development/testing)
 */
export class MockMedicationSafetyModel implements MedicationSafetyModel {
  private interactionDatabase = this.initializeInteractionDatabase();
  private allergyDatabase = this.initializeAllergyDatabase();

  async checkSafety(
    input: MedicationSafetyInput,
    _context: Record<string, any>
  ): Promise<{
    interactions: Array<{
      severity: InteractionSeverity;
      message: string;
      affectedMedications: string[];
      recommendedAction: string;
      references?: string[];
      confidence: number;
    }>;
    allergyAlerts: Array<{
      message: string;
      allergen: string;
      recommendedAction: string;
      confidence: number;
    }>;
    contraindications: Array<{
      message: string;
      condition: string;
      recommendedAction: string;
      confidence: number;
    }>;
    dosingRecommendations: Array<{
      message: string;
      recommendedAction: string;
      confidence: number;
    }>;
    processingTimeMs: number;
  }> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    const interactions = this.checkInteractions(input);
    const allergyAlerts = this.checkAllergies(input);
    const contraindications = this.checkContraindications(input);
    const dosingRecommendations = this.checkDosing(input);

    return {
      interactions,
      allergyAlerts,
      contraindications,
      dosingRecommendations,
      processingTimeMs: 500 + Math.random() * 500,
    };
  }

  private checkInteractions(input: MedicationSafetyInput) {
    const interactions: any[] = [];
    const proposedMed = input.proposedMedication.name.toLowerCase();

    input.currentMedications.forEach(currentMed => {
      const currentMedName = currentMed.name.toLowerCase();
      const interactionKey = [proposedMed, currentMedName].sort().join('|');

      const interaction = this.interactionDatabase.get(interactionKey);
      if (interaction) {
        interactions.push({
          ...interaction,
          affectedMedications: [input.proposedMedication.name, currentMed.name],
          confidence: 0.85 + Math.random() * 0.1,
        });
      }
    });

    return interactions;
  }

  private checkAllergies(input: MedicationSafetyInput) {
    const alerts: any[] = [];
    const proposedMed = input.proposedMedication.name.toLowerCase();

    input.allergies.forEach(allergy => {
      const allergyLower = allergy.toLowerCase();
      const allergyInfo = this.allergyDatabase.get(proposedMed);

      if (allergyInfo && allergyInfo.allergens.includes(allergyLower)) {
        alerts.push({
          message: `Patient is allergic to ${allergy}. ${input.proposedMedication.name} contains or is related to this allergen.`,
          allergen: allergy,
          recommendedAction: 'DO NOT ADMINISTER. Consult physician for alternative medication.',
          confidence: 0.95,
        });
      }
    });

    return alerts;
  }

  private checkContraindications(input: MedicationSafetyInput) {
    const contraindications: any[] = [];

    // Example: Check for contraindications based on conditions
    const proposedMed = input.proposedMedication.name.toLowerCase();

    if (proposedMed.includes('aspirin') && input.conditions.some(c => c.toLowerCase().includes('bleeding'))) {
      contraindications.push({
        message: 'Aspirin is contraindicated in patients with active bleeding disorders',
        condition: 'Bleeding disorder',
        recommendedAction: 'Use alternative antiplatelet or analgesic medication',
        confidence: 0.9,
      });
    }

    if (proposedMed.includes('metformin') && input.renalFunction?.toLowerCase().includes('impaired')) {
      contraindications.push({
        message: 'Metformin is contraindicated in patients with impaired renal function',
        condition: 'Renal impairment',
        recommendedAction: 'Consider alternative diabetes medication or adjust dose under physician guidance',
        confidence: 0.92,
      });
    }

    return contraindications;
  }

  private checkDosing(input: MedicationSafetyInput) {
    const recommendations: any[] = [];

    // Check age-based dosing
    if (input.patientAge) {
      if (input.patientAge < 18) {
        recommendations.push({
          message: 'Pediatric patient - verify pediatric dosing guidelines',
          recommendedAction: 'Confirm dose is appropriate for patient age and weight',
          confidence: 0.9,
        });
      } else if (input.patientAge > 65) {
        recommendations.push({
          message: 'Geriatric patient - consider dose reduction',
          recommendedAction: 'Start with lower dose and titrate as needed. Monitor for adverse effects.',
          confidence: 0.85,
        });
      }
    }

    // Check weight-based dosing
    if (input.patientWeight && input.patientWeight < 50) {
      recommendations.push({
        message: 'Low body weight - dose adjustment may be needed',
        recommendedAction: 'Verify dose is appropriate for patient weight',
        confidence: 0.8,
      });
    }

    // Check renal function
    if (input.renalFunction?.toLowerCase().includes('impaired')) {
      recommendations.push({
        message: 'Impaired renal function - dose adjustment required',
        recommendedAction: 'Reduce dose based on creatinine clearance. Consult dosing guidelines.',
        confidence: 0.88,
      });
    }

    return recommendations;
  }

  private initializeInteractionDatabase(): Map<string, any> {
    const db = new Map();

    // Common drug interactions (simplified examples)
    db.set('warfarin|aspirin', {
      severity: InteractionSeverity.MAJOR,
      message: 'Increased risk of bleeding when warfarin and aspirin are used together',
      recommendedAction: 'Use with caution. Enhanced INR monitoring required. Consider alternative antiplatelet agent.',
      references: ['DrugBank', 'Micromedex'],
    });

    db.set('lisinopril|spironolactone', {
      severity: InteractionSeverity.MAJOR,
      message: 'Increased risk of hyperkalemia',
      recommendedAction: 'Monitor potassium levels closely. Consider dose adjustment.',
      references: ['Lexi-Comp'],
    });

    db.set('metformin|ibuprofen', {
      severity: InteractionSeverity.MODERATE,
      message: 'NSAIDs may reduce renal function and increase metformin levels',
      recommendedAction: 'Monitor renal function and blood glucose. Use lowest effective NSAID dose.',
      references: ['UpToDate'],
    });

    return db;
  }

  private initializeAllergyDatabase(): Map<string, any> {
    const db = new Map();

    // Common allergen cross-sensitivities
    db.set('penicillin', {
      allergens: ['penicillin', 'amoxicillin', 'ampicillin'],
    });

    db.set('amoxicillin', {
      allergens: ['penicillin', 'amoxicillin', 'ampicillin'],
    });

    db.set('aspirin', {
      allergens: ['aspirin', 'nsaid', 'salicylate'],
    });

    db.set('ibuprofen', {
      allergens: ['nsaid', 'ibuprofen'],
    });

    return db;
  }
}
