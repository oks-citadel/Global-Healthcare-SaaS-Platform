/**
 * Output Guardrail
 * Validates AI assistant outputs for safety and quality
 */

import {
  GuardrailResult,
  GuardrailViolation,
  GuardrailError,
  AssistantType,
  AssistantResponse,
  ConfidenceLevel,
} from '../types';

export interface OutputValidationRule {
  name: string;
  severity: 'error' | 'warning';
  validate: (output: AssistantResponse) => boolean | Promise<boolean>;
  message: string;
}

export class OutputGuardrail {
  private validationRules: Map<string, OutputValidationRule[]> = new Map();
  private confidenceThresholds: Map<AssistantType, number> = new Map();

  constructor(config?: {
    confidenceThresholds?: Partial<Record<AssistantType, number>>;
  }) {
    // Set default confidence thresholds (0-1 scale)
    this.confidenceThresholds.set(AssistantType.DOCUMENTATION, 0.7);
    this.confidenceThresholds.set(AssistantType.TRIAGE, 0.8);
    this.confidenceThresholds.set(AssistantType.CODING, 0.75);
    this.confidenceThresholds.set(AssistantType.MEDICATION_SAFETY, 0.9);
    this.confidenceThresholds.set(AssistantType.PATIENT_MESSAGING, 0.7);

    // Override with custom thresholds
    if (config?.confidenceThresholds) {
      Object.entries(config.confidenceThresholds).forEach(([type, threshold]) => {
        this.confidenceThresholds.set(type as AssistantType, threshold);
      });
    }

    this.registerDefaultRules();
  }

  /**
   * Register default validation rules
   */
  private registerDefaultRules(): void {
    // Universal rules (apply to all assistant types)
    this.addRule('*', {
      name: 'has_suggestions',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        return output.suggestions && output.suggestions.length > 0;
      },
      message: 'Output must contain at least one suggestion',
    });

    this.addRule('*', {
      name: 'valid_confidence_scores',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        return output.suggestions.every(s =>
          s.confidenceScore >= 0 && s.confidenceScore <= 1
        );
      },
      message: 'Confidence scores must be between 0 and 1',
    });

    this.addRule('*', {
      name: 'no_harmful_content',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        const content = JSON.stringify(output).toLowerCase();
        const harmfulPatterns = [
          'kill',
          'harm yourself',
          'suicide',
          'end your life',
          'illegal',
          'discriminat',
        ];
        return !harmfulPatterns.some(pattern => content.includes(pattern));
      },
      message: 'Output contains potentially harmful content',
    });

    this.addRule('*', {
      name: 'no_diagnostic_claims',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        const content = JSON.stringify(output).toLowerCase();
        const diagnosticClaims = [
          'you have',
          'you definitely have',
          'you are diagnosed with',
          'this is definitely',
          'i diagnose',
        ];
        return !diagnosticClaims.some(claim => content.includes(claim));
      },
      message: 'Output contains autonomous diagnostic claims (suggestions only)',
    });

    this.addRule('*', {
      name: 'requires_review_flag',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        return typeof output.requiresHumanReview === 'boolean';
      },
      message: 'Output must specify if human review is required',
    });

    this.addRule('*', {
      name: 'valid_metadata',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        return (
          output.metadata &&
          typeof output.metadata.modelVersion === 'string' &&
          typeof output.metadata.promptTemplateId === 'string' &&
          typeof output.metadata.processingTimeMs === 'number' &&
          typeof output.metadata.phiMinimized === 'boolean'
        );
      },
      message: 'Output must include valid metadata',
    });

    // Confidence threshold checks (type-specific)
    Object.values(AssistantType).forEach(type => {
      this.addRule(type, {
        name: 'meets_confidence_threshold',
        severity: 'warning',
        validate: (output: AssistantResponse) => {
          const threshold = this.confidenceThresholds.get(type) || 0.7;
          return output.suggestions.every(s => s.confidenceScore >= threshold);
        },
        message: `One or more suggestions below confidence threshold for ${type}`,
      });
    });

    // Documentation assistant rules
    this.addRule(AssistantType.DOCUMENTATION, {
      name: 'valid_soap_structure',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        return output.suggestions.every(s => {
          if (s.type !== 'soap_note') return true;
          const soap = s.content;
          return (
            soap &&
            (soap.subjective || soap.objective || soap.assessment || soap.plan)
          );
        });
      },
      message: 'SOAP note must have at least one section',
    });

    // Triage assistant rules
    this.addRule(AssistantType.TRIAGE, {
      name: 'valid_triage_priority',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        return output.suggestions.every(s => {
          if (s.type !== 'triage_priority') return true;
          const validPriorities = ['critical', 'urgent', 'semi_urgent', 'non_urgent'];
          return validPriorities.includes(s.content.priority);
        });
      },
      message: 'Triage priority must be valid',
    });

    this.addRule(AssistantType.TRIAGE, {
      name: 'critical_requires_immediate_review',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        const hasCritical = output.suggestions.some(s =>
          s.type === 'triage_priority' && s.content.priority === 'critical'
        );
        if (hasCritical) {
          return output.requiresHumanReview === true;
        }
        return true;
      },
      message: 'Critical triage results must require immediate human review',
    });

    // Medication safety rules
    this.addRule(AssistantType.MEDICATION_SAFETY, {
      name: 'contraindication_requires_review',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        const hasContraindication = output.suggestions.some(s =>
          s.content.severity === 'contraindicated'
        );
        if (hasContraindication) {
          return output.requiresHumanReview === true;
        }
        return true;
      },
      message: 'Contraindications must require human review',
    });

    this.addRule(AssistantType.MEDICATION_SAFETY, {
      name: 'has_recommended_action',
      severity: 'warning',
      validate: (output: AssistantResponse) => {
        return output.suggestions.every(s =>
          s.content.recommendedAction && s.content.recommendedAction.length > 0
        );
      },
      message: 'Medication safety alerts should include recommended actions',
    });

    // Coding assistant rules
    this.addRule(AssistantType.CODING, {
      name: 'valid_code_format',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        return output.suggestions.every(s => {
          if (s.type === 'icd_code') {
            // ICD-10 format: Letter followed by 2-7 alphanumeric
            return /^[A-Z]\d{2}(\.\d{1,4})?$/.test(s.content.code);
          }
          if (s.type === 'cpt_code') {
            // CPT format: 5 digits
            return /^\d{5}$/.test(s.content.code);
          }
          return true;
        });
      },
      message: 'Medical codes must be in valid format',
    });

    this.addRule(AssistantType.CODING, {
      name: 'requires_coder_review',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        return output.requiresHumanReview === true;
      },
      message: 'All coding suggestions must require certified coder review',
    });

    // Patient messaging rules
    this.addRule(AssistantType.PATIENT_MESSAGING, {
      name: 'appropriate_tone',
      severity: 'warning',
      validate: (output: AssistantResponse) => {
        return output.suggestions.every(s => {
          if (s.type !== 'message_draft') return true;
          const validTones = ['professional', 'empathetic', 'educational'];
          return validTones.includes(s.content.tone);
        });
      },
      message: 'Message tone should be professional, empathetic, or educational',
    });

    this.addRule(AssistantType.PATIENT_MESSAGING, {
      name: 'no_medical_advice',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        return output.suggestions.every(s => {
          if (s.type !== 'message_draft') return true;
          const content = s.content.draftResponse.toLowerCase();
          const medicalAdvicePatterns = [
            'take this medication',
            'stop taking',
            'increase your dose',
            'decrease your dose',
            'you should take',
            "you don't need",
          ];
          return !medicalAdvicePatterns.some(pattern => content.includes(pattern));
        });
      },
      message: 'Patient messages must not provide direct medical advice without provider approval',
    });

    this.addRule(AssistantType.PATIENT_MESSAGING, {
      name: 'escalation_flag_check',
      severity: 'error',
      validate: (output: AssistantResponse) => {
        return output.suggestions.every(s => {
          if (s.type !== 'message_draft') return true;
          return typeof s.content.escalationRequired === 'boolean';
        });
      },
      message: 'Message drafts must specify if escalation is required',
    });
  }

  /**
   * Add a validation rule for a specific assistant type
   */
  addRule(assistantType: AssistantType | '*', rule: OutputValidationRule): void {
    if (!this.validationRules.has(assistantType)) {
      this.validationRules.set(assistantType, []);
    }
    this.validationRules.get(assistantType)!.push(rule);
  }

  /**
   * Validate output against all applicable rules
   */
  async validate(output: AssistantResponse): Promise<GuardrailResult> {
    const violations: GuardrailViolation[] = [];

    // Get universal rules
    const universalRules = this.validationRules.get('*') || [];
    const typeSpecificRules = this.validationRules.get(output.assistantType) || [];
    const allRules = [...universalRules, ...typeSpecificRules];

    // Run all validation rules
    for (const rule of allRules) {
      try {
        const isValid = await rule.validate(output);
        if (!isValid) {
          violations.push({
            rule: rule.name,
            severity: rule.severity,
            message: rule.message,
          });
        }
      } catch (error) {
        violations.push({
          rule: rule.name,
          severity: 'error',
          message: `Validation rule error: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    }

    // Check for error-level violations
    const hasErrors = violations.some(v => v.severity === 'error');

    return {
      passed: !hasErrors,
      violations,
      metadata: {
        rulesChecked: allRules.length,
        assistantType: output.assistantType,
        timestamp: new Date().toISOString(),
        suggestionCount: output.suggestions.length,
      },
    };
  }

  /**
   * Filter suggestions based on confidence threshold
   */
  filterByConfidence(
    output: AssistantResponse,
    minimumConfidence?: number
  ): AssistantResponse {
    const threshold = minimumConfidence || this.confidenceThresholds.get(output.assistantType) || 0.7;

    const filteredSuggestions = output.suggestions.filter(
      s => s.confidenceScore >= threshold
    );

    return {
      ...output,
      suggestions: filteredSuggestions,
    };
  }

  /**
   * Determine if human review is required based on output characteristics
   */
  requiresHumanReview(output: AssistantResponse): boolean {
    // Explicit flag from AI
    if (output.requiresHumanReview) {
      return true;
    }

    // Check for low confidence suggestions
    const threshold = this.confidenceThresholds.get(output.assistantType) || 0.7;
    const hasLowConfidence = output.suggestions.some(s => s.confidenceScore < threshold);
    if (hasLowConfidence) {
      return true;
    }

    // Type-specific checks
    switch (output.assistantType) {
      case AssistantType.TRIAGE:
        // Critical triage always requires review
        return output.suggestions.some(s =>
          s.type === 'triage_priority' && s.content.priority === 'critical'
        );

      case AssistantType.MEDICATION_SAFETY:
        // Contraindications and major interactions require review
        return output.suggestions.some(s =>
          s.content.severity === 'contraindicated' || s.content.severity === 'major'
        );

      case AssistantType.CODING:
      case AssistantType.DOCUMENTATION:
      case AssistantType.PATIENT_MESSAGING:
        // These always require review
        return true;

      default:
        return false;
    }
  }

  /**
   * Add warnings to suggestions that need them
   */
  addSafetyWarnings(output: AssistantResponse): AssistantResponse {
    const updatedSuggestions = output.suggestions.map(suggestion => {
      const warnings = suggestion.warnings || [];

      // Add confidence warning
      const threshold = this.confidenceThresholds.get(output.assistantType) || 0.7;
      if (suggestion.confidenceScore < threshold) {
        warnings.push(`Low confidence (${(suggestion.confidenceScore * 100).toFixed(1)}%) - requires review`);
      }

      // Type-specific warnings
      if (output.assistantType === AssistantType.MEDICATION_SAFETY) {
        if (suggestion.content.severity === 'contraindicated') {
          warnings.push('CONTRAINDICATED - Do not administer without physician override');
        } else if (suggestion.content.severity === 'major') {
          warnings.push('Major interaction - Requires careful monitoring');
        }
      }

      if (output.assistantType === AssistantType.TRIAGE) {
        if (suggestion.content.priority === 'critical') {
          warnings.push('CRITICAL - Immediate physician evaluation required');
        }
      }

      return {
        ...suggestion,
        warnings,
      };
    });

    return {
      ...output,
      suggestions: updatedSuggestions,
    };
  }

  /**
   * Validate and enhance output in one operation
   */
  async validateAndEnhance(output: AssistantResponse): Promise<GuardrailResult> {
    // Validate
    const validationResult = await this.validate(output);

    if (!validationResult.passed) {
      throw new GuardrailError(
        'Output validation failed',
        validationResult.violations
      );
    }

    // Enhance with warnings and review flags
    let enhancedOutput = this.addSafetyWarnings(output);
    enhancedOutput.requiresHumanReview = this.requiresHumanReview(enhancedOutput);

    return {
      ...validationResult,
      sanitizedInput: enhancedOutput,
    };
  }

  /**
   * Set confidence threshold for a specific assistant type
   */
  setConfidenceThreshold(assistantType: AssistantType, threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new Error('Confidence threshold must be between 0 and 1');
    }
    this.confidenceThresholds.set(assistantType, threshold);
  }

  /**
   * Get confidence threshold for a specific assistant type
   */
  getConfidenceThreshold(assistantType: AssistantType): number {
    return this.confidenceThresholds.get(assistantType) || 0.7;
  }
}
