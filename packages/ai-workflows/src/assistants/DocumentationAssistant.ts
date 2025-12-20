/**
 * Documentation Assistant
 * AI-powered SOAP note generation and clinical documentation support
 */

import {
  AssistantRequest,
  AssistantResponse,
  AssistantType,
  DocumentationInput,
  DocumentationSuggestion,
  ConfidenceLevel,
  SOAPNote,
} from '../types';

export interface DocumentationModel {
  generateSOAPNote(input: DocumentationInput, context: Record<string, any>): Promise<{
    soapNote: SOAPNote;
    confidence: number;
    processingTimeMs: number;
  }>;
}

export class DocumentationAssistant {
  constructor(
    private model: DocumentationModel,
    private modelVersion: string = 'doc-model-v1.0'
  ) {}

  /**
   * Generate SOAP note suggestions
   */
  async generateSuggestions(request: AssistantRequest): Promise<AssistantResponse> {
    const startTime = Date.now();
    const input = request.input as DocumentationInput;

    try {
      // Call AI model to generate SOAP note
      const result = await this.model.generateSOAPNote(input, request.context);

      // Create suggestion
      const suggestion: DocumentationSuggestion = {
        id: this.generateSuggestionId(),
        type: 'soap_note',
        content: result.soapNote,
        confidence: this.mapConfidenceToLevel(result.confidence),
        confidenceScore: result.confidence,
        rationale: this.generateRationale(input, result.soapNote),
        warnings: this.generateWarnings(input, result.soapNote, result.confidence),
        requiresApproval: true, // Always requires provider review
      };

      const processingTimeMs = Date.now() - startTime;

      const response: AssistantResponse = {
        requestId: request.requestId,
        assistantType: AssistantType.DOCUMENTATION,
        suggestions: [suggestion],
        metadata: {
          modelVersion: this.modelVersion,
          promptTemplateId: 'soap-note-generation-v1',
          processingTimeMs,
          phiMinimized: true,
        },
        requiresHumanReview: true, // Always requires review
        timestamp: new Date(),
      };

      return response;
    } catch (error) {
      throw new Error(`Documentation generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Enhance existing documentation
   */
  async enhanceDocumentation(
    existingNote: SOAPNote,
    additionalContext: Record<string, any>
  ): Promise<SOAPNote> {
    // Prepare input with existing note
    const input: DocumentationInput = {
      encounterType: additionalContext.encounterType || 'follow-up',
      existingNotes: JSON.stringify(existingNote),
      ...additionalContext,
    };

    const result = await this.model.generateSOAPNote(input, additionalContext);
    return result.soapNote;
  }

  /**
   * Generate addendum to existing note
   */
  async generateAddendum(
    existingNote: SOAPNote,
    addendumReason: string,
    additionalInfo: Record<string, any>
  ): Promise<string> {
    const input: DocumentationInput = {
      encounterType: 'addendum',
      existingNotes: JSON.stringify(existingNote),
      ...additionalInfo,
    };

    const result = await this.model.generateSOAPNote(input, {
      addendumReason,
      ...additionalInfo,
    });

    // Return only the assessment and plan as addendum
    return `ADDENDUM (${new Date().toISOString()}):\nReason: ${addendumReason}\n\n${result.soapNote.assessment || ''}\n${result.soapNote.plan || ''}`;
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
   * Generate rationale for suggestions
   */
  private generateRationale(input: DocumentationInput, soapNote: SOAPNote): string {
    const parts: string[] = [];

    if (input.chiefComplaint) {
      parts.push(`Based on chief complaint: ${input.chiefComplaint}`);
    }

    if (input.symptoms && input.symptoms.length > 0) {
      parts.push(`Incorporating ${input.symptoms.length} documented symptoms`);
    }

    if (input.vitals) {
      parts.push('Including vital signs in objective section');
    }

    if (input.examFindings && input.examFindings.length > 0) {
      parts.push(`${input.examFindings.length} examination findings documented`);
    }

    return parts.join('. ') + '.';
  }

  /**
   * Generate warnings for suggestions
   */
  private generateWarnings(
    input: DocumentationInput,
    soapNote: SOAPNote,
    confidence: number
  ): string[] {
    const warnings: string[] = [];

    if (confidence < 0.7) {
      warnings.push('Lower confidence - please review carefully and modify as needed');
    }

    if (!input.vitals) {
      warnings.push('No vital signs provided - ensure they are documented separately');
    }

    if (!input.examFindings || input.examFindings.length === 0) {
      warnings.push('No physical examination findings provided - assessment may be incomplete');
    }

    if (!soapNote.plan) {
      warnings.push('No treatment plan generated - provider must add plan section');
    }

    // Check for completeness
    const sections = [soapNote.subjective, soapNote.objective, soapNote.assessment, soapNote.plan];
    const completedSections = sections.filter(s => s && s.length > 0).length;

    if (completedSections < 4) {
      warnings.push(`Only ${completedSections}/4 SOAP sections completed - review for completeness`);
    }

    return warnings;
  }

  /**
   * Generate unique suggestion ID
   */
  private generateSuggestionId(): string {
    return `doc-sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Mock documentation model (for development/testing)
 */
export class MockDocumentationModel implements DocumentationModel {
  async generateSOAPNote(
    input: DocumentationInput,
    context: Record<string, any>
  ): Promise<{
    soapNote: SOAPNote;
    confidence: number;
    processingTimeMs: number;
  }> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    // Generate mock SOAP note based on input
    const soapNote: SOAPNote = {
      subjective: this.generateSubjective(input),
      objective: this.generateObjective(input),
      assessment: this.generateAssessment(input),
      plan: this.generatePlan(input),
    };

    // Calculate mock confidence based on input completeness
    const confidence = this.calculateConfidence(input);

    return {
      soapNote,
      confidence,
      processingTimeMs: 500 + Math.random() * 500,
    };
  }

  private generateSubjective(input: DocumentationInput): string {
    const parts: string[] = [];

    if (input.chiefComplaint) {
      parts.push(`Chief Complaint: ${input.chiefComplaint}`);
    }

    if (input.symptoms && input.symptoms.length > 0) {
      parts.push(`\nSymptoms: Patient reports ${input.symptoms.join(', ')}.`);
    }

    parts.push('\n\nHistory of Present Illness: [Provider should complete with patient history and timeline]');

    return parts.join(' ');
  }

  private generateObjective(input: DocumentationInput): string {
    const parts: string[] = [];

    if (input.vitals) {
      parts.push('Vital Signs:');
      Object.entries(input.vitals).forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
        parts.push(`- ${formattedKey}: ${value}`);
      });
    }

    if (input.examFindings && input.examFindings.length > 0) {
      parts.push('\nPhysical Examination:');
      input.examFindings.forEach(finding => {
        parts.push(`- ${finding}`);
      });
    } else {
      parts.push('\n\n[Provider should document physical examination findings]');
    }

    return parts.join('\n');
  }

  private generateAssessment(input: DocumentationInput): string {
    let assessment = '[Provider should provide clinical assessment and differential diagnosis]\n\n';

    if (input.chiefComplaint) {
      assessment += `Clinical impression based on chief complaint of ${input.chiefComplaint}:\n`;
      assessment += '1. [Primary diagnosis - to be confirmed by provider]\n';
      assessment += '2. [Rule out alternative diagnoses]\n';
    }

    return assessment;
  }

  private generatePlan(input: DocumentationInput): string {
    return [
      'Treatment Plan:',
      '1. [Diagnostic tests ordered]',
      '2. [Medications prescribed]',
      '3. [Patient education provided]',
      '4. [Follow-up instructions]',
      '5. [Referrals if needed]',
      '',
      '[Provider must complete and approve plan before finalization]',
    ].join('\n');
  }

  private calculateConfidence(input: DocumentationInput): number {
    let score = 0.5; // Base score

    if (input.chiefComplaint) score += 0.1;
    if (input.symptoms && input.symptoms.length > 0) score += 0.1;
    if (input.vitals) score += 0.1;
    if (input.examFindings && input.examFindings.length > 0) score += 0.15;
    if (input.existingNotes) score += 0.05;

    return Math.min(score, 0.95); // Cap at 0.95 to always require review
  }
}
