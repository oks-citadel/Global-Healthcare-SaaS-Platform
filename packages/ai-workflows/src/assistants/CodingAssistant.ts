/**
 * Coding Assistant
 * AI-powered ICD and CPT code suggestions for medical billing
 */

import {
  AssistantRequest,
  AssistantResponse,
  AssistantType,
  CodingInput,
  CodingSuggestion,
  ConfidenceLevel,
} from '../types';

export interface CodingModel {
  suggestCodes(input: CodingInput, context: Record<string, any>): Promise<{
    icdCodes: Array<{
      code: string;
      description: string;
      category: string;
      confidence: number;
    }>;
    cptCodes: Array<{
      code: string;
      description: string;
      category: string;
      confidence: number;
    }>;
    processingTimeMs: number;
  }>;
}

export class CodingAssistant {
  constructor(
    private model: CodingModel,
    private modelVersion: string = 'coding-model-v1.0'
  ) {}

  /**
   * Generate ICD and CPT code suggestions
   */
  async generateSuggestions(request: AssistantRequest): Promise<AssistantResponse> {
    const startTime = Date.now();
    const input = request.input as CodingInput;

    try {
      // Call AI model to suggest codes
      const result = await this.model.suggestCodes(input, request.context);

      // Create suggestions for ICD codes
      const icdSuggestions: CodingSuggestion[] = result.icdCodes.map(code => ({
        id: this.generateSuggestionId('icd'),
        type: 'icd_code',
        content: {
          code: code.code,
          description: code.description,
          category: code.category,
        },
        confidence: this.mapConfidenceToLevel(code.confidence),
        confidenceScore: code.confidence,
        rationale: `Suggested based on clinical documentation`,
        warnings: this.generateWarnings(code.confidence, 'icd'),
        requiresApproval: true, // Always requires certified coder review
      }));

      // Create suggestions for CPT codes
      const cptSuggestions: CodingSuggestion[] = result.cptCodes.map(code => ({
        id: this.generateSuggestionId('cpt'),
        type: 'cpt_code',
        content: {
          code: code.code,
          description: code.description,
          category: code.category,
        },
        confidence: this.mapConfidenceToLevel(code.confidence),
        confidenceScore: code.confidence,
        rationale: `Suggested based on procedures documented`,
        warnings: this.generateWarnings(code.confidence, 'cpt'),
        requiresApproval: true, // Always requires certified coder review
      }));

      const allSuggestions = [...icdSuggestions, ...cptSuggestions];
      const processingTimeMs = Date.now() - startTime;

      const response: AssistantResponse = {
        requestId: request.requestId,
        assistantType: AssistantType.CODING,
        suggestions: allSuggestions,
        metadata: {
          modelVersion: this.modelVersion,
          promptTemplateId: 'coding-suggestion-v1',
          processingTimeMs,
          phiMinimized: true,
        },
        requiresHumanReview: true, // Always requires certified coder review
        timestamp: new Date(),
      };

      return response;
    } catch (error) {
      throw new Error(`Coding suggestion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Validate code format
   */
  validateICD10Code(code: string): boolean {
    // ICD-10 format: Letter followed by 2 digits, optional dot and 1-4 more digits
    return /^[A-Z]\d{2}(\.\d{1,4})?$/.test(code);
  }

  /**
   * Validate CPT code format
   */
  validateCPTCode(code: string): boolean {
    // CPT format: 5 digits
    return /^\d{5}$/.test(code);
  }

  /**
   * Search for codes by description
   */
  async searchCodes(
    query: string,
    codeType: 'icd' | 'cpt' | 'both' = 'both'
  ): Promise<Array<{
    code: string;
    description: string;
    type: 'icd' | 'cpt';
  }>> {
    // This would integrate with a code database
    // Placeholder implementation
    return [];
  }

  /**
   * Get code details
   */
  async getCodeDetails(code: string, codeType: 'icd' | 'cpt'): Promise<{
    code: string;
    description: string;
    category: string;
    effectiveDate?: Date;
    notes?: string;
  } | null> {
    // This would integrate with a code database
    // Placeholder implementation
    return null;
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
   * Generate warnings
   */
  private generateWarnings(confidence: number, codeType: 'icd' | 'cpt'): string[] {
    const warnings: string[] = [
      'Requires certified coder review and approval',
      'Verify code is appropriate for documented services',
    ];

    if (confidence < 0.75) {
      warnings.push('Lower confidence - careful review recommended');
    }

    if (codeType === 'cpt') {
      warnings.push('Ensure procedure was actually performed and documented');
      warnings.push('Verify medical necessity and coverage criteria');
    }

    if (codeType === 'icd') {
      warnings.push('Confirm diagnosis is supported by clinical documentation');
      warnings.push('Check for more specific code if applicable');
    }

    return warnings;
  }

  /**
   * Generate unique suggestion ID
   */
  private generateSuggestionId(type: string): string {
    return `${type}-sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Mock coding model (for development/testing)
 */
export class MockCodingModel implements CodingModel {
  async suggestCodes(
    input: CodingInput,
    context: Record<string, any>
  ): Promise<{
    icdCodes: Array<{
      code: string;
      description: string;
      category: string;
      confidence: number;
    }>;
    cptCodes: Array<{
      code: string;
      description: string;
      category: string;
      confidence: number;
    }>;
    processingTimeMs: number;
  }> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400));

    // Generate mock ICD codes based on diagnoses
    const icdCodes = this.generateICD10Codes(input);

    // Generate mock CPT codes based on procedures
    const cptCodes = this.generateCPTCodes(input);

    return {
      icdCodes,
      cptCodes,
      processingTimeMs: 400 + Math.random() * 400,
    };
  }

  private generateICD10Codes(input: CodingInput): Array<{
    code: string;
    description: string;
    category: string;
    confidence: number;
  }> {
    const codes: Array<{
      code: string;
      description: string;
      category: string;
      confidence: number;
    }> = [];

    // Extract potential diagnoses from notes or provided diagnoses
    const notes = input.encounterNotes.toLowerCase();

    // Common condition mappings (simplified examples)
    const conditionMappings = [
      {
        keywords: ['hypertension', 'high blood pressure'],
        code: 'I10',
        description: 'Essential (primary) hypertension',
        category: 'Circulatory System',
      },
      {
        keywords: ['diabetes', 'type 2 diabetes'],
        code: 'E11.9',
        description: 'Type 2 diabetes mellitus without complications',
        category: 'Endocrine/Metabolic',
      },
      {
        keywords: ['upper respiratory infection', 'uri', 'common cold'],
        code: 'J06.9',
        description: 'Acute upper respiratory infection, unspecified',
        category: 'Respiratory System',
      },
      {
        keywords: ['headache', 'migraine'],
        code: 'R51.9',
        description: 'Headache, unspecified',
        category: 'Symptoms/Signs',
      },
      {
        keywords: ['back pain', 'lower back pain'],
        code: 'M54.5',
        description: 'Low back pain',
        category: 'Musculoskeletal',
      },
    ];

    // Check for matching conditions
    conditionMappings.forEach(mapping => {
      const matches = mapping.keywords.some(keyword => notes.includes(keyword));
      if (matches) {
        codes.push({
          code: mapping.code,
          description: mapping.description,
          category: mapping.category,
          confidence: 0.75 + Math.random() * 0.15,
        });
      }
    });

    // Also check provided diagnoses
    if (input.diagnoses && input.diagnoses.length > 0) {
      input.diagnoses.forEach(diagnosis => {
        const matchedMapping = conditionMappings.find(m =>
          m.keywords.some(k => diagnosis.toLowerCase().includes(k))
        );

        if (matchedMapping && !codes.find(c => c.code === matchedMapping.code)) {
          codes.push({
            code: matchedMapping.code,
            description: matchedMapping.description,
            category: matchedMapping.category,
            confidence: 0.8 + Math.random() * 0.15,
          });
        }
      });
    }

    // If no specific codes found, suggest a generic encounter code
    if (codes.length === 0) {
      codes.push({
        code: 'Z00.00',
        description: 'Encounter for general adult medical examination without abnormal findings',
        category: 'Factors Influencing Health Status',
        confidence: 0.6,
      });
    }

    return codes;
  }

  private generateCPTCodes(input: CodingInput): Array<{
    code: string;
    description: string;
    category: string;
    confidence: number;
  }> {
    const codes: Array<{
      code: string;
      description: string;
      category: string;
      confidence: number;
    }> = [];

    const notes = input.encounterNotes.toLowerCase();

    // Common procedure mappings (simplified examples)
    const procedureMappings = [
      {
        keywords: ['office visit', 'consultation', 'exam'],
        code: '99213',
        description: 'Office visit, established patient, level 3',
        category: 'Evaluation & Management',
      },
      {
        keywords: ['new patient', 'initial visit'],
        code: '99203',
        description: 'Office visit, new patient, level 3',
        category: 'Evaluation & Management',
      },
      {
        keywords: ['blood test', 'lab work', 'cbc'],
        code: '85025',
        description: 'Blood count, complete (CBC), automated',
        category: 'Pathology & Laboratory',
      },
      {
        keywords: ['ekg', 'electrocardiogram', 'ecg'],
        code: '93000',
        description: 'Electrocardiogram, complete',
        category: 'Cardiovascular',
      },
      {
        keywords: ['x-ray', 'chest x-ray'],
        code: '71046',
        description: 'Radiologic examination, chest, 2 views',
        category: 'Radiology',
      },
    ];

    // Check for matching procedures
    procedureMappings.forEach(mapping => {
      const matches = mapping.keywords.some(keyword => notes.includes(keyword));
      if (matches) {
        codes.push({
          code: mapping.code,
          description: mapping.description,
          category: mapping.category,
          confidence: 0.7 + Math.random() * 0.15,
        });
      }
    });

    // Check provided procedures
    if (input.procedures && input.procedures.length > 0) {
      input.procedures.forEach(procedure => {
        const matchedMapping = procedureMappings.find(m =>
          m.keywords.some(k => procedure.toLowerCase().includes(k))
        );

        if (matchedMapping && !codes.find(c => c.code === matchedMapping.code)) {
          codes.push({
            code: matchedMapping.code,
            description: matchedMapping.description,
            category: matchedMapping.category,
            confidence: 0.75 + Math.random() * 0.15,
          });
        }
      });
    }

    // Default to basic office visit if nothing specific found
    if (codes.length === 0) {
      codes.push({
        code: '99213',
        description: 'Office visit, established patient, level 3',
        category: 'Evaluation & Management',
        confidence: 0.65,
      });
    }

    return codes;
  }
}
