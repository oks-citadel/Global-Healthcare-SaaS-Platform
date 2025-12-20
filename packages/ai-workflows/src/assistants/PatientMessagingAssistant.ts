/**
 * Patient Messaging Assistant
 * AI-powered patient message response drafting
 */

import {
  AssistantRequest,
  AssistantResponse,
  AssistantType,
  PatientMessageInput,
  PatientMessageSuggestion,
  ConfidenceLevel,
} from '../types';

export interface PatientMessagingModel {
  draftResponse(input: PatientMessageInput, context: Record<string, any>): Promise<{
    draftResponse: string;
    tone: 'professional' | 'empathetic' | 'educational';
    suggestedActions?: string[];
    escalationRequired: boolean;
    confidence: number;
    processingTimeMs: number;
  }>;
}

export class PatientMessagingAssistant {
  constructor(
    private model: PatientMessagingModel,
    private modelVersion: string = 'messaging-model-v1.0'
  ) {}

  /**
   * Generate patient message response draft
   */
  async generateSuggestions(request: AssistantRequest): Promise<AssistantResponse> {
    const startTime = Date.now();
    const input = request.input as PatientMessageInput;

    try {
      // Call AI model to draft response
      const result = await this.model.draftResponse(input, request.context);

      // Create suggestion
      const suggestion: PatientMessageSuggestion = {
        id: this.generateSuggestionId(),
        type: 'message_draft',
        content: {
          draftResponse: result.draftResponse,
          tone: result.tone,
          suggestedActions: result.suggestedActions,
          escalationRequired: result.escalationRequired,
        },
        confidence: this.mapConfidenceToLevel(result.confidence),
        confidenceScore: result.confidence,
        rationale: this.generateRationale(input, result),
        warnings: this.generateWarnings(input, result),
        requiresApproval: true, // Always requires provider review
      };

      const processingTimeMs = Date.now() - startTime;

      const response: AssistantResponse = {
        requestId: request.requestId,
        assistantType: AssistantType.PATIENT_MESSAGING,
        suggestions: [suggestion],
        metadata: {
          modelVersion: this.modelVersion,
          promptTemplateId: 'patient-message-draft-v1',
          processingTimeMs,
          phiMinimized: true,
        },
        requiresHumanReview: true, // Always requires provider review
        timestamp: new Date(),
      };

      return response;
    } catch (error) {
      throw new Error(`Message drafting failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Assess if message requires urgent response
   */
  async assessUrgency(patientMessage: string): Promise<{
    isUrgent: boolean;
    requiresEscalation: boolean;
    reason?: string;
  }> {
    const urgentKeywords = [
      'emergency',
      'urgent',
      'severe pain',
      'chest pain',
      'difficulty breathing',
      'bleeding',
      'suicide',
      'can\'t breathe',
      'allergic reaction',
    ];

    const messageLower = patientMessage.toLowerCase();
    const hasUrgentKeyword = urgentKeywords.some(keyword => messageLower.includes(keyword));

    if (hasUrgentKeyword) {
      return {
        isUrgent: true,
        requiresEscalation: true,
        reason: 'Message contains urgent medical concern keywords',
      };
    }

    return {
      isUrgent: false,
      requiresEscalation: false,
    };
  }

  /**
   * Adjust tone of draft message
   */
  adjustTone(
    originalDraft: string,
    targetTone: 'professional' | 'empathetic' | 'educational'
  ): string {
    // This would call the AI model to adjust tone
    // Placeholder implementation
    return originalDraft;
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
   * Generate rationale
   */
  private generateRationale(input: PatientMessageInput, result: any): string {
    const parts: string[] = [];

    parts.push(`Response drafted in ${result.tone} tone`);

    if (input.patientContext?.preferredLanguage) {
      parts.push(`Considering patient's preferred language: ${input.patientContext.preferredLanguage}`);
    }

    if (input.patientContext?.literacyLevel) {
      parts.push(`Adjusted for ${input.patientContext.literacyLevel} literacy level`);
    }

    if (result.escalationRequired) {
      parts.push('Escalation to provider recommended');
    }

    return parts.join('. ') + '.';
  }

  /**
   * Generate warnings
   */
  private generateWarnings(input: PatientMessageInput, result: any): string[] {
    const warnings: string[] = [
      'Always requires provider review before sending',
      'Do not send medical advice without provider approval',
    ];

    if (result.escalationRequired) {
      warnings.push('URGENT - Requires immediate provider attention');
    }

    if (result.confidence < 0.7) {
      warnings.push('Lower confidence - review carefully and modify as needed');
    }

    const messageLower = input.patientMessage.toLowerCase();
    if (messageLower.includes('medication') || messageLower.includes('prescription')) {
      warnings.push('Message involves medication - ensure response is clinically appropriate');
    }

    if (messageLower.includes('symptom') || messageLower.includes('pain')) {
      warnings.push('Patient reporting symptoms - may require clinical assessment');
    }

    return warnings;
  }

  /**
   * Generate unique suggestion ID
   */
  private generateSuggestionId(): string {
    return `msg-sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Mock patient messaging model (for development/testing)
 */
export class MockPatientMessagingModel implements PatientMessagingModel {
  async draftResponse(
    input: PatientMessageInput,
    context: Record<string, any>
  ): Promise<{
    draftResponse: string;
    tone: 'professional' | 'empathetic' | 'educational';
    suggestedActions?: string[];
    escalationRequired: boolean;
    confidence: number;
    processingTimeMs: number;
  }> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400));

    const escalationRequired = this.checkForEscalation(input.patientMessage);
    const tone = this.determineTone(input);
    const draftResponse = this.generateDraft(input, tone, escalationRequired);
    const suggestedActions = this.getSuggestedActions(input, escalationRequired);
    const confidence = this.calculateConfidence(input);

    return {
      draftResponse,
      tone,
      suggestedActions,
      escalationRequired,
      confidence,
      processingTimeMs: 400 + Math.random() * 400,
    };
  }

  private checkForEscalation(message: string): boolean {
    const urgentKeywords = [
      'emergency',
      'urgent',
      'severe pain',
      'chest pain',
      'difficulty breathing',
      'bleeding',
      'can\'t breathe',
    ];

    const messageLower = message.toLowerCase();
    return urgentKeywords.some(keyword => messageLower.includes(keyword));
  }

  private determineTone(input: PatientMessageInput): 'professional' | 'empathetic' | 'educational' {
    const messageLower = input.patientMessage.toLowerCase();

    // Empathetic for concerns or anxiety
    if (messageLower.includes('worried') || messageLower.includes('concerned') ||
        messageLower.includes('anxious') || messageLower.includes('scared')) {
      return 'empathetic';
    }

    // Educational for questions
    if (messageLower.includes('what is') || messageLower.includes('how does') ||
        messageLower.includes('why') || messageLower.includes('explain')) {
      return 'educational';
    }

    // Default to professional
    return 'professional';
  }

  private generateDraft(
    input: PatientMessageInput,
    tone: string,
    escalationRequired: boolean
  ): string {
    if (escalationRequired) {
      return this.generateUrgentDraft(input);
    }

    const greeting = this.getGreeting(input);
    const body = this.getBody(input, tone);
    const closing = this.getClosing(tone);

    return `${greeting}\n\n${body}\n\n${closing}`;
  }

  private generateUrgentDraft(input: PatientMessageInput): string {
    return [
      'Dear Patient,',
      '',
      'Thank you for reaching out. Based on your message, we recommend that you seek immediate medical attention.',
      '',
      'Please:',
      '- Call 911 if this is a medical emergency',
      '- Visit the nearest emergency department, or',
      '- Call our office immediately at [PHONE NUMBER] to speak with a provider',
      '',
      'If you have already received care, please let us know so we can follow up appropriately.',
      '',
      'Your health and safety are our top priority.',
      '',
      'Best regards,',
      '[Provider Name]',
      '[Practice Name]',
    ].join('\n');
  }

  private getGreeting(input: PatientMessageInput): string {
    return 'Dear Patient,\n\nThank you for your message.';
  }

  private getBody(input: PatientMessageInput, tone: string): string {
    const messageLower = input.patientMessage.toLowerCase();

    if (tone === 'empathetic') {
      return 'I understand your concerns, and I appreciate you reaching out. [Provider should personalize response based on specific concerns mentioned in patient message].';
    }

    if (tone === 'educational') {
      return '[Provider should provide educational information addressing the patient\'s questions while avoiding direct medical advice without proper assessment].';
    }

    // Professional tone
    if (messageLower.includes('appointment') || messageLower.includes('schedule')) {
      return 'Regarding your appointment inquiry, [provider should provide specific appointment information or scheduling instructions].';
    }

    if (messageLower.includes('medication') || messageLower.includes('prescription')) {
      return 'Regarding your medication question, [provider must review patient chart and provide appropriate guidance].';
    }

    if (messageLower.includes('test result') || messageLower.includes('lab')) {
      return 'Regarding your test results, [provider should review results and provide appropriate interpretation and next steps].';
    }

    return '[Provider should craft personalized response addressing patient\'s specific concerns].';
  }

  private getClosing(tone: string): string {
    if (tone === 'empathetic') {
      return 'Please don\'t hesitate to reach out if you have any additional questions or concerns. We\'re here to help.\n\nTake care,\n[Provider Name]';
    }

    if (tone === 'educational') {
      return 'I hope this information is helpful. If you have any other questions, please feel free to ask.\n\nBest regards,\n[Provider Name]';
    }

    return 'If you have any further questions, please don\'t hesitate to contact us.\n\nBest regards,\n[Provider Name]\n[Practice Name]';
  }

  private getSuggestedActions(input: PatientMessageInput, escalationRequired: boolean): string[] {
    if (escalationRequired) {
      return [
        'Notify provider immediately',
        'Document in patient chart',
        'Follow up within 24 hours',
      ];
    }

    const actions: string[] = [
      'Review patient chart before finalizing response',
      'Document interaction in EHR',
    ];

    const messageLower = input.patientMessage.toLowerCase();

    if (messageLower.includes('appointment')) {
      actions.push('Check appointment availability');
    }

    if (messageLower.includes('medication') || messageLower.includes('prescription')) {
      actions.push('Review medication list');
      actions.push('Check for refill requests');
    }

    if (messageLower.includes('test result') || messageLower.includes('lab')) {
      actions.push('Review recent test results');
      actions.push('Determine if follow-up needed');
    }

    return actions;
  }

  private calculateConfidence(input: PatientMessageInput): number {
    let score = 0.6; // Base score

    if (input.patientMessage.length > 20) score += 0.1;
    if (input.previousMessages && input.previousMessages.length > 0) score += 0.1;
    if (input.patientContext?.literacyLevel) score += 0.05;
    if (input.relatedEncounter) score += 0.05;

    return Math.min(score, 0.85); // Cap at 0.85 to always require review
  }
}
