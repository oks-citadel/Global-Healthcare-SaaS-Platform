/**
 * Workflow Definition
 * Pre-configured clinical workflow templates
 */

import {
  WorkflowDefinition,
  WorkflowTriggerType,
  AssistantType,
} from '../types';

export class WorkflowDefinitionBuilder {
  private definition: Partial<WorkflowDefinition> = {
    steps: [],
    enabled: true,
    consentRequired: true,
  };

  withId(id: string): this {
    this.definition.id = id;
    return this;
  }

  withName(name: string): this {
    this.definition.name = name;
    return this;
  }

  withDescription(description: string): this {
    this.definition.description = description;
    return this;
  }

  withTrigger(triggerType: WorkflowTriggerType): this {
    this.definition.triggerType = triggerType;
    return this;
  }

  withVersion(version: string): this {
    this.definition.version = version;
    return this;
  }

  addAIStep(
    id: string,
    name: string,
    assistantType: AssistantType,
    input: any,
    requiresHumanApproval: boolean = true,
    maxRetries: number = 3
  ): this {
    this.definition.steps!.push({
      id,
      name,
      type: 'ai_assistant',
      assistantType,
      input,
      requiresHumanApproval,
      maxRetries,
    });
    return this;
  }

  addHumanReviewStep(
    id: string,
    name: string,
    input: any,
    maxRetries: number = 0
  ): this {
    this.definition.steps!.push({
      id,
      name,
      type: 'human_review',
      input,
      requiresHumanApproval: true,
      maxRetries,
    });
    return this;
  }

  addValidationStep(
    id: string,
    name: string,
    input: any,
    maxRetries: number = 2
  ): this {
    this.definition.steps!.push({
      id,
      name,
      type: 'validation',
      input,
      requiresHumanApproval: false,
      maxRetries,
    });
    return this;
  }

  addNotificationStep(
    id: string,
    name: string,
    input: any,
    maxRetries: number = 3
  ): this {
    this.definition.steps!.push({
      id,
      name,
      type: 'notification',
      input,
      requiresHumanApproval: false,
      maxRetries,
    });
    return this;
  }

  requireConsent(required: boolean = true): this {
    this.definition.consentRequired = required;
    return this;
  }

  enable(enabled: boolean = true): this {
    this.definition.enabled = enabled;
    return this;
  }

  build(): WorkflowDefinition {
    const now = new Date();
    return {
      id: this.definition.id!,
      name: this.definition.name!,
      description: this.definition.description!,
      triggerType: this.definition.triggerType!,
      enabled: this.definition.enabled!,
      version: this.definition.version || '1.0.0',
      steps: this.definition.steps!,
      consentRequired: this.definition.consentRequired!,
      createdAt: now,
      updatedAt: now,
    };
  }
}

/**
 * Pre-defined Clinical Workflow Templates
 */
export class WorkflowTemplates {
  /**
   * Encounter Documentation Workflow
   * Triggered when a new encounter is created
   */
  static encounterDocumentation(): WorkflowDefinition {
    return new WorkflowDefinitionBuilder()
      .withId('encounter-documentation-v1')
      .withName('Encounter Documentation Assistant')
      .withDescription('AI-assisted SOAP note generation for clinical encounters')
      .withTrigger(WorkflowTriggerType.ENCOUNTER_CREATED)
      .withVersion('1.0.0')
      .addAIStep(
        'generate-soap-note',
        'Generate SOAP Note Suggestions',
        AssistantType.DOCUMENTATION,
        {
          includeVitals: true,
          includeSymptoms: true,
          includeExamFindings: true,
        },
        true, // Requires human approval
        3
      )
      .addHumanReviewStep(
        'provider-review',
        'Provider Review and Edit',
        {
          allowEdits: true,
          requireSignature: true,
        }
      )
      .addAIStep(
        'suggest-coding',
        'Suggest ICD/CPT Codes',
        AssistantType.CODING,
        {
          basedOnApprovedNote: true,
        },
        true,
        2
      )
      .addHumanReviewStep(
        'coding-review',
        'Billing Coder Review',
        {
          allowEdits: true,
          requireValidation: true,
        }
      )
      .addNotificationStep(
        'notify-completion',
        'Notify Documentation Complete',
        {
          notifyProvider: true,
          notifyBilling: true,
        }
      )
      .requireConsent(true)
      .enable(true)
      .build();
  }

  /**
   * Lab Result Triage Workflow
   * Triggered when lab results are received
   */
  static labResultTriage(): WorkflowDefinition {
    return new WorkflowDefinitionBuilder()
      .withId('lab-result-triage-v1')
      .withName('Lab Result Triage Assistant')
      .withDescription('AI-assisted triage of incoming lab results')
      .withTrigger(WorkflowTriggerType.LAB_RESULT_RECEIVED)
      .withVersion('1.0.0')
      .addValidationStep(
        'validate-results',
        'Validate Lab Results Format',
        {
          checkCompleteness: true,
          checkReferenceRanges: true,
        },
        2
      )
      .addAIStep(
        'analyze-results',
        'Analyze Clinical Significance',
        AssistantType.TRIAGE,
        {
          compareToHistory: true,
          identifyCriticalValues: true,
        },
        false, // Auto-triage, human review only for critical
        2
      )
      .addHumanReviewStep(
        'physician-review',
        'Physician Review (Critical Only)',
        {
          conditionalOn: 'priority:critical',
          urgentNotification: true,
        }
      )
      .addNotificationStep(
        'notify-results',
        'Notify Provider and Patient',
        {
          notifyProvider: true,
          notifyPatient: true,
          patientMessageDraft: true,
        }
      )
      .requireConsent(true)
      .enable(true)
      .build();
  }

  /**
   * Medication Safety Check Workflow
   * Triggered when medication is ordered
   */
  static medicationSafetyCheck(): WorkflowDefinition {
    return new WorkflowDefinitionBuilder()
      .withId('medication-safety-v1')
      .withName('Medication Safety Check')
      .withDescription('AI-powered medication interaction and safety screening')
      .withTrigger(WorkflowTriggerType.MEDICATION_ORDERED)
      .withVersion('1.0.0')
      .addAIStep(
        'check-interactions',
        'Check Drug Interactions',
        AssistantType.MEDICATION_SAFETY,
        {
          checkInteractions: true,
          checkAllergies: true,
          checkContraindications: true,
          checkDosing: true,
        },
        false, // Auto-screen, review only if issues found
        2
      )
      .addHumanReviewStep(
        'pharmacist-review',
        'Pharmacist Review (Issues Only)',
        {
          conditionalOn: 'severity:major|contraindicated',
          requireOverride: true,
        }
      )
      .addValidationStep(
        'final-safety-check',
        'Final Safety Validation',
        {
          ensureAllIssuesAddressed: true,
        },
        1
      )
      .addNotificationStep(
        'notify-prescriber',
        'Notify Prescriber',
        {
          notifyOnIssues: true,
          notifyOnApproval: true,
        }
      )
      .requireConsent(true)
      .enable(true)
      .build();
  }

  /**
   * Patient Message Response Workflow
   * Triggered when patient sends a message
   */
  static patientMessageResponse(): WorkflowDefinition {
    return new WorkflowDefinitionBuilder()
      .withId('patient-message-response-v1')
      .withName('Patient Message Response Assistant')
      .withDescription('AI-drafted responses to patient messages')
      .withTrigger(WorkflowTriggerType.PATIENT_MESSAGE_RECEIVED)
      .withVersion('1.0.0')
      .addAIStep(
        'triage-message',
        'Triage Message Urgency',
        AssistantType.TRIAGE,
        {
          assessUrgency: true,
          identifyEscalation: true,
        },
        false,
        2
      )
      .addAIStep(
        'draft-response',
        'Draft Patient Response',
        AssistantType.PATIENT_MESSAGING,
        {
          tone: 'empathetic',
          includeEducation: true,
          readingLevel: 'medium',
        },
        true, // Always requires provider review
        2
      )
      .addHumanReviewStep(
        'provider-review',
        'Provider Review and Edit',
        {
          allowEdits: true,
          requireApproval: true,
        }
      )
      .addNotificationStep(
        'send-response',
        'Send Response to Patient',
        {
          sendToPatient: true,
          logInEHR: true,
        }
      )
      .requireConsent(true)
      .enable(true)
      .build();
  }

  /**
   * Discharge Planning Workflow
   * Triggered when discharge is initiated
   */
  static dischargePlanning(): WorkflowDefinition {
    return new WorkflowDefinitionBuilder()
      .withId('discharge-planning-v1')
      .withName('Discharge Planning Assistant')
      .withDescription('AI-assisted discharge summary and instructions')
      .withTrigger(WorkflowTriggerType.DISCHARGE_INITIATED)
      .withVersion('1.0.0')
      .addAIStep(
        'generate-summary',
        'Generate Discharge Summary',
        AssistantType.DOCUMENTATION,
        {
          includeHospitalCourse: true,
          includeDiagnoses: true,
          includeProcedures: true,
          includeConditionOnDischarge: true,
        },
        true,
        2
      )
      .addAIStep(
        'draft-instructions',
        'Draft Patient Instructions',
        AssistantType.PATIENT_MESSAGING,
        {
          tone: 'educational',
          readingLevel: 'low',
          includeWarningsSigns: true,
        },
        true,
        2
      )
      .addAIStep(
        'check-medications',
        'Review Discharge Medications',
        AssistantType.MEDICATION_SAFETY,
        {
          reconcileMedications: true,
          checkInteractions: true,
        },
        true,
        2
      )
      .addHumanReviewStep(
        'physician-review',
        'Physician Final Review',
        {
          requireSignature: true,
          allowEdits: true,
        }
      )
      .addNotificationStep(
        'notify-and-send',
        'Send Discharge Documentation',
        {
          notifyPatient: true,
          notifyPCP: true,
          sendToEHR: true,
        }
      )
      .requireConsent(true)
      .enable(true)
      .build();
  }

  /**
   * Get all available workflow templates
   */
  static getAllTemplates(): WorkflowDefinition[] {
    return [
      this.encounterDocumentation(),
      this.labResultTriage(),
      this.medicationSafetyCheck(),
      this.patientMessageResponse(),
      this.dischargePlanning(),
    ];
  }

  /**
   * Get workflow template by ID
   */
  static getTemplateById(id: string): WorkflowDefinition | undefined {
    return this.getAllTemplates().find(template => template.id === id);
  }

  /**
   * Get workflow templates by trigger type
   */
  static getTemplatesByTrigger(triggerType: WorkflowTriggerType): WorkflowDefinition[] {
    return this.getAllTemplates().filter(
      template => template.triggerType === triggerType
    );
  }
}
