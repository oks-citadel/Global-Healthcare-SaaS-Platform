/**
 * Input Guardrail
 * Validates and sanitizes AI assistant inputs with PHI minimization
 */

import {
  GuardrailResult,
  GuardrailViolation,
  GuardrailError,
  PHIRedactionResult,
  AssistantType,
} from '../types';

export interface InputValidationRule {
  name: string;
  severity: 'error' | 'warning';
  validate: (input: any) => boolean | Promise<boolean>;
  message: string;
}

export class InputGuardrail {
  private validationRules: Map<string, InputValidationRule[]> = new Map();
  private maxInputLength: number = 50000; // characters
  private enablePHIMinimization: boolean = true;

  constructor(config?: {
    maxInputLength?: number;
    enablePHIMinimization?: boolean;
  }) {
    if (config?.maxInputLength) {
      this.maxInputLength = config.maxInputLength;
    }
    if (config?.enablePHIMinimization !== undefined) {
      this.enablePHIMinimization = config.enablePHIMinimization;
    }

    this.registerDefaultRules();
  }

  /**
   * Register default validation rules
   */
  private registerDefaultRules(): void {
    // Universal rules (apply to all assistant types)
    this.addRule('*', {
      name: 'max_length',
      severity: 'error',
      validate: (input: any) => {
        const jsonString = JSON.stringify(input);
        return jsonString.length <= this.maxInputLength;
      },
      message: `Input exceeds maximum length of ${this.maxInputLength} characters`,
    });

    this.addRule('*', {
      name: 'no_null_input',
      severity: 'error',
      validate: (input: any) => input !== null && input !== undefined,
      message: 'Input cannot be null or undefined',
    });

    this.addRule('*', {
      name: 'no_injection_attempts',
      severity: 'error',
      validate: (input: any) => {
        const jsonString = JSON.stringify(input).toLowerCase();
        const injectionPatterns = [
          'ignore previous',
          'ignore all previous',
          'disregard previous',
          'system prompt',
          'you are now',
          'new instructions',
          '<script',
          'javascript:',
          'onerror=',
        ];
        return !injectionPatterns.some(pattern => jsonString.includes(pattern));
      },
      message: 'Potential prompt injection detected',
    });

    // Documentation assistant rules
    this.addRule(AssistantType.DOCUMENTATION, {
      name: 'valid_encounter_type',
      severity: 'error',
      validate: (input: any) => {
        if (!input.encounterType) return false;
        return typeof input.encounterType === 'string' && input.encounterType.length > 0;
      },
      message: 'Valid encounterType is required',
    });

    // Triage assistant rules
    this.addRule(AssistantType.TRIAGE, {
      name: 'valid_chief_complaint',
      severity: 'error',
      validate: (input: any) => {
        if (!input.chiefComplaint) return false;
        return typeof input.chiefComplaint === 'string' && input.chiefComplaint.length > 0;
      },
      message: 'Chief complaint is required',
    });

    this.addRule(AssistantType.TRIAGE, {
      name: 'valid_vitals',
      severity: 'warning',
      validate: (input: any) => {
        if (!input.vitals) return true; // Optional
        const vitals = input.vitals;

        // Temperature validation (Fahrenheit: 95-107, Celsius: 35-42)
        if (vitals.temperature !== undefined) {
          const temp = vitals.temperature;
          if (typeof temp !== 'number' || temp < 35 || temp > 107) {
            return false;
          }
        }

        // Heart rate validation (30-300 bpm)
        if (vitals.heartRate !== undefined) {
          const hr = vitals.heartRate;
          if (typeof hr !== 'number' || hr < 30 || hr > 300) {
            return false;
          }
        }

        // Oxygen saturation validation (50-100%)
        if (vitals.oxygenSaturation !== undefined) {
          const spo2 = vitals.oxygenSaturation;
          if (typeof spo2 !== 'number' || spo2 < 50 || spo2 > 100) {
            return false;
          }
        }

        return true;
      },
      message: 'Vital signs are out of valid ranges',
    });

    // Medication safety rules
    this.addRule(AssistantType.MEDICATION_SAFETY, {
      name: 'valid_proposed_medication',
      severity: 'error',
      validate: (input: any) => {
        if (!input.proposedMedication) return false;
        const med = input.proposedMedication;
        return (
          typeof med.name === 'string' && med.name.length > 0 &&
          typeof med.dosage === 'string' && med.dosage.length > 0 &&
          typeof med.route === 'string' && med.route.length > 0 &&
          typeof med.frequency === 'string' && med.frequency.length > 0
        );
      },
      message: 'Proposed medication must include name, dosage, route, and frequency',
    });

    this.addRule(AssistantType.MEDICATION_SAFETY, {
      name: 'valid_current_medications',
      severity: 'warning',
      validate: (input: any) => {
        if (!input.currentMedications) return true; // Optional
        if (!Array.isArray(input.currentMedications)) return false;

        return input.currentMedications.every((med: any) =>
          typeof med.name === 'string' && med.name.length > 0
        );
      },
      message: 'Current medications must be an array with valid medication names',
    });

    // Coding assistant rules
    this.addRule(AssistantType.CODING, {
      name: 'valid_encounter_notes',
      severity: 'error',
      validate: (input: any) => {
        if (!input.encounterNotes) return false;
        return typeof input.encounterNotes === 'string' && input.encounterNotes.length > 0;
      },
      message: 'Encounter notes are required for coding suggestions',
    });

    // Patient messaging rules
    this.addRule(AssistantType.PATIENT_MESSAGING, {
      name: 'valid_patient_message',
      severity: 'error',
      validate: (input: any) => {
        if (!input.patientMessage) return false;
        return typeof input.patientMessage === 'string' && input.patientMessage.length > 0;
      },
      message: 'Patient message is required',
    });
  }

  /**
   * Add a validation rule for a specific assistant type
   */
  addRule(assistantType: AssistantType | '*', rule: InputValidationRule): void {
    if (!this.validationRules.has(assistantType)) {
      this.validationRules.set(assistantType, []);
    }
    this.validationRules.get(assistantType)!.push(rule);
  }

  /**
   * Validate input against all applicable rules
   */
  async validate(input: any, assistantType: AssistantType): Promise<GuardrailResult> {
    const violations: GuardrailViolation[] = [];

    // Get universal rules
    const universalRules = this.validationRules.get('*') || [];
    const typeSpecificRules = this.validationRules.get(assistantType) || [];
    const allRules = [...universalRules, ...typeSpecificRules];

    // Run all validation rules
    for (const rule of allRules) {
      try {
        const isValid = await rule.validate(input);
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
        assistantType,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Sanitize input by removing/redacting sensitive content
   */
  async sanitize(input: any, assistantType: AssistantType): Promise<any> {
    let sanitized = JSON.parse(JSON.stringify(input)); // Deep clone

    // Apply PHI minimization if enabled
    if (this.enablePHIMinimization) {
      sanitized = await this.minimizePHI(sanitized);
    }

    // Remove any script tags or potentially dangerous HTML
    sanitized = this.sanitizeHTML(sanitized);

    // Trim excessive whitespace
    sanitized = this.trimWhitespace(sanitized);

    return sanitized;
  }

  /**
   * Minimize PHI in input
   */
  private async minimizePHI(input: any): Promise<any> {
    if (typeof input === 'string') {
      const redactionResult = this.redactPHI(input);
      return redactionResult.redactedText;
    }

    if (Array.isArray(input)) {
      return Promise.all(input.map(item => this.minimizePHI(item)));
    }

    if (typeof input === 'object' && input !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(input)) {
        result[key] = await this.minimizePHI(value);
      }
      return result;
    }

    return input;
  }

  /**
   * Redact PHI from text
   */
  redactPHI(text: string): PHIRedactionResult {
    let redactedText = text;
    const redactedFields: PHIRedactionResult['redactedFields'] = [];

    // SSN pattern (XXX-XX-XXXX)
    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    const ssnMatches = text.match(ssnRegex);
    if (ssnMatches) {
      ssnMatches.forEach((match, index) => {
        const token = `[SSN_${index + 1}]`;
        redactedText = redactedText.replace(match, token);
        redactedFields.push({
          type: 'ssn',
          originalValue: match,
          replacementToken: token,
        });
      });
    }

    // MRN pattern (common formats)
    const mrnRegex = /\b(?:MRN|mrn|medical record number)[\s:]*([A-Z0-9]{6,12})\b/gi;
    const mrnMatches = Array.from(text.matchAll(mrnRegex));
    if (mrnMatches.length > 0) {
      mrnMatches.forEach((match, index) => {
        const token = `[MRN_${index + 1}]`;
        redactedText = redactedText.replace(match[0], token);
        redactedFields.push({
          type: 'mrn',
          originalValue: match[1],
          replacementToken: token,
        });
      });
    }

    // Phone numbers (various formats)
    const phoneRegex = /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
    const phoneMatches = text.match(phoneRegex);
    if (phoneMatches) {
      phoneMatches.forEach((match, index) => {
        const token = `[PHONE_${index + 1}]`;
        redactedText = redactedText.replace(match, token);
        redactedFields.push({
          type: 'phone',
          originalValue: match,
          replacementToken: token,
        });
      });
    }

    // Email addresses
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emailMatches = text.match(emailRegex);
    if (emailMatches) {
      emailMatches.forEach((match, index) => {
        const token = `[EMAIL_${index + 1}]`;
        redactedText = redactedText.replace(match, token);
        redactedFields.push({
          type: 'email',
          originalValue: match,
          replacementToken: token,
        });
      });
    }

    // Dates (MM/DD/YYYY, MM-DD-YYYY, etc.)
    const dateRegex = /\b(?:0?[1-9]|1[0-2])[-/](?:0?[1-9]|[12][0-9]|3[01])[-/](?:19|20)\d{2}\b/g;
    const dateMatches = text.match(dateRegex);
    if (dateMatches) {
      dateMatches.forEach((match, index) => {
        const token = `[DATE_${index + 1}]`;
        redactedText = redactedText.replace(match, token);
        redactedFields.push({
          type: 'date',
          originalValue: match,
          replacementToken: token,
        });
      });
    }

    return {
      redactedText,
      phiDetected: redactedFields.length > 0,
      redactedFields,
    };
  }

  /**
   * Sanitize HTML content
   */
  private sanitizeHTML(input: any): any {
    if (typeof input === 'string') {
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }

    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeHTML(item));
    }

    if (typeof input === 'object' && input !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(input)) {
        result[key] = this.sanitizeHTML(value);
      }
      return result;
    }

    return input;
  }

  /**
   * Trim excessive whitespace
   */
  private trimWhitespace(input: any): any {
    if (typeof input === 'string') {
      return input
        .replace(/\s+/g, ' ') // Multiple spaces to single space
        .replace(/^\s+|\s+$/g, ''); // Trim start/end
    }

    if (Array.isArray(input)) {
      return input.map(item => this.trimWhitespace(item));
    }

    if (typeof input === 'object' && input !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(input)) {
        result[key] = this.trimWhitespace(value);
      }
      return result;
    }

    return input;
  }

  /**
   * Validate and sanitize in one operation
   */
  async validateAndSanitize(
    input: any,
    assistantType: AssistantType
  ): Promise<GuardrailResult> {
    // First validate
    const validationResult = await this.validate(input, assistantType);

    if (!validationResult.passed) {
      throw new GuardrailError(
        'Input validation failed',
        validationResult.violations
      );
    }

    // Then sanitize
    const sanitizedInput = await this.sanitize(input, assistantType);

    return {
      ...validationResult,
      sanitizedInput,
    };
  }
}
