/**
 * Complete AI Workflow Example
 *
 * Demonstrates end-to-end usage of the AI Workflows package including:
 * - Workflow orchestration
 * - AI assistants
 * - Guardrails
 * - Consent management
 * - Audit logging
 * - Human-in-the-loop approvals
 */

import {
  // Orchestrator
  WorkflowOrchestrator,
  WorkflowTemplates,
  WorkflowTriggerType,
  WorkflowStatus,

  // AI Assistants
  DocumentationAssistant,
  MockDocumentationModel,
  TriageAssistant,
  MockTriageModel,
  MedicationSafetyAssistant,
  MockMedicationSafetyModel,

  // Guardrails
  InputGuardrail,
  OutputGuardrail,
  ConsentChecker,
  InMemoryConsentRepository,

  // Audit
  AIAuditLogger,
  InMemoryAuditRepository,

  // Types
  AssistantType,
  AssistantRequest,
} from '../src/index';

async function main() {
  console.log('=== AI Workflows Complete Example ===\n');

  // =========================================================================
  // 1. Initialize Infrastructure
  // =========================================================================
  console.log('1. Setting up infrastructure...');

  // Audit logging
  const auditRepository = new InMemoryAuditRepository();
  const auditLogger = new AIAuditLogger(auditRepository);

  // Workflow orchestrator
  const orchestrator = new WorkflowOrchestrator(auditLogger, {
    maxConcurrentWorkflows: 100,
    stepTimeoutMs: 300000,
    enableAuditLogging: true,
  });

  // Guardrails
  const inputGuardrail = new InputGuardrail({
    maxInputLength: 50000,
    enablePHIMinimization: true,
  });

  const outputGuardrail = new OutputGuardrail({
    confidenceThresholds: {
      documentation: 0.7,
      triage: 0.8,
      coding: 0.75,
      medication_safety: 0.9,
      patient_messaging: 0.7,
    },
  });

  // Consent management
  const consentRepository = new InMemoryConsentRepository();
  const consentChecker = new ConsentChecker(consentRepository);

  console.log('Infrastructure initialized\n');

  // =========================================================================
  // 2. Grant Patient Consent
  // =========================================================================
  console.log('2. Granting patient consent...');

  await consentChecker.grantConsent(
    'patient-001',
    'org-123',
    'v1.0',
    new Date('2025-12-31')
  );

  const consentCheck = await consentChecker.checkConsent('patient-001', 'org-123');
  console.log('Consent granted:', consentCheck.granted);
  console.log('');

  // =========================================================================
  // 3. Set Up AI Assistants
  // =========================================================================
  console.log('3. Setting up AI assistants...');

  // Documentation Assistant
  const docModel = new MockDocumentationModel();
  const docAssistant = new DocumentationAssistant(docModel);

  // Triage Assistant
  const triageModel = new MockTriageModel();
  const triageAssistant = new TriageAssistant(triageModel);

  // Medication Safety Assistant
  const medSafetyModel = new MockMedicationSafetyModel();
  const medSafetyAssistant = new MedicationSafetyAssistant(medSafetyModel);

  console.log('AI assistants initialized\n');

  // =========================================================================
  // 4. Register Step Executors
  // =========================================================================
  console.log('4. Registering step executors...');

  orchestrator.registerStepExecutor('ai_assistant', async (step, context) => {
    console.log(`  Executing AI step: ${step.name}`);

    // Check consent
    await consentChecker.requireConsent(
      context.patientId!,
      context.organizationId
    );

    // Validate and sanitize input
    const validationResult = await inputGuardrail.validateAndSanitize(
      step.input,
      step.assistantType!
    );

    if (!validationResult.passed) {
      throw new Error(`Input validation failed: ${validationResult.violations[0]?.message}`);
    }

    // Create assistant request
    const request: AssistantRequest = {
      requestId: `${context.workflowId}-${step.id}`,
      assistantType: step.assistantType!,
      organizationId: context.organizationId,
      tenantId: context.tenantId,
      userId: context.userId,
      patientId: context.patientId,
      encounterId: context.encounterId,
      input: validationResult.sanitizedInput,
      context: context.metadata,
      consentVerified: true,
      timestamp: new Date(),
    };

    // Log AI request
    await auditLogger.logAIRequest(request);

    // Call appropriate AI assistant
    let response;
    switch (step.assistantType) {
      case AssistantType.DOCUMENTATION:
        response = await docAssistant.generateSuggestions(request);
        break;
      case AssistantType.TRIAGE:
        response = await triageAssistant.generateSuggestions(request);
        break;
      case AssistantType.MEDICATION_SAFETY:
        response = await medSafetyAssistant.generateSuggestions(request);
        break;
      default:
        throw new Error(`Unsupported assistant type: ${step.assistantType}`);
    }

    // Validate output
    const outputValidation = await outputGuardrail.validateAndEnhance(response);
    if (!outputValidation.passed) {
      throw new Error(`Output validation failed: ${outputValidation.violations[0]?.message}`);
    }

    // Log AI response
    await auditLogger.logAIResponse(request, response);

    console.log(`  AI step completed: ${response.suggestions.length} suggestions generated`);
    return response;
  });

  orchestrator.registerStepExecutor('human_review', async (step, context) => {
    console.log(`  Human review required: ${step.name}`);
    // In real implementation, this would wait for human input
    return { reviewRequired: true };
  });

  orchestrator.registerStepExecutor('validation', async (step, context) => {
    console.log(`  Validation step: ${step.name}`);
    return { validated: true };
  });

  orchestrator.registerStepExecutor('notification', async (step, context) => {
    console.log(`  Sending notification: ${step.name}`);
    return { notificationSent: true };
  });

  console.log('Step executors registered\n');

  // =========================================================================
  // 5. Example 1: Documentation Workflow
  // =========================================================================
  console.log('5. Example 1: Clinical Documentation Workflow');
  console.log('   Triggering encounter documentation workflow...\n');

  const executions = await orchestrator.triggerWorkflows(
    WorkflowTriggerType.ENCOUNTER_CREATED,
    {
      organizationId: 'org-123',
      tenantId: 'tenant-456',
      userId: 'provider-789',
      patientId: 'patient-001',
      encounterId: 'encounter-001',
      triggeredBy: 'system',
      metadata: {
        encounterType: 'office-visit',
        chiefComplaint: 'Annual physical examination',
        vitals: {
          temperature: 98.6,
          heartRate: 72,
          bloodPressure: '120/80',
          respiratoryRate: 16,
          oxygenSaturation: 98,
        },
        symptoms: ['No acute symptoms'],
        examFindings: ['Patient appears well', 'No abnormalities noted'],
      },
    }
  );

  const docExecution = executions[0];
  console.log(`   Workflow started: ${docExecution.id}`);
  console.log(`   Status: ${docExecution.status}`);

  // Wait for workflow to reach approval state
  await new Promise(resolve => setTimeout(resolve, 2000));

  const currentExecution = orchestrator.getExecution(docExecution.id);
  console.log(`   Current status: ${currentExecution?.status}`);
  console.log('');

  // =========================================================================
  // 6. Example 2: Medication Safety Check
  // =========================================================================
  console.log('6. Example 2: Medication Safety Check');

  const medSafetyRequest: AssistantRequest = {
    requestId: 'med-safety-001',
    assistantType: AssistantType.MEDICATION_SAFETY,
    organizationId: 'org-123',
    tenantId: 'tenant-456',
    userId: 'provider-789',
    patientId: 'patient-001',
    input: {
      proposedMedication: {
        name: 'Aspirin',
        dosage: '81mg',
        route: 'oral',
        frequency: 'daily',
      },
      currentMedications: [
        {
          name: 'Warfarin',
          dosage: '5mg',
          route: 'oral',
          frequency: 'daily',
        },
      ],
      allergies: ['Penicillin'],
      conditions: ['Atrial fibrillation', 'Hypertension'],
      patientAge: 68,
      patientWeight: 75,
    },
    context: {},
    consentVerified: true,
    timestamp: new Date(),
  };

  console.log('   Checking medication safety...');

  // Validate input
  const inputValidation = await inputGuardrail.validateAndSanitize(
    medSafetyRequest.input,
    AssistantType.MEDICATION_SAFETY
  );

  if (inputValidation.passed) {
    // Log request
    await auditLogger.logAIRequest(medSafetyRequest);

    // Get safety check
    const safetyResponse = await medSafetyAssistant.generateSuggestions(medSafetyRequest);

    // Log response
    await auditLogger.logAIResponse(medSafetyRequest, safetyResponse);

    console.log(`   Safety check completed: ${safetyResponse.suggestions.length} alerts`);
    console.log(`   Requires human review: ${safetyResponse.requiresHumanReview}`);

    safetyResponse.suggestions.forEach((suggestion, index) => {
      console.log(`   Alert ${index + 1}: ${suggestion.type}`);
      console.log(`   - Severity: ${suggestion.content.severity}`);
      console.log(`   - Confidence: ${suggestion.confidence} (${(suggestion.confidenceScore * 100).toFixed(1)}%)`);
      console.log(`   - Message: ${suggestion.content.message}`);
      console.log(`   - Action: ${suggestion.content.recommendedAction}`);
    });
  }
  console.log('');

  // =========================================================================
  // 7. Example 3: Triage Assessment
  // =========================================================================
  console.log('7. Example 3: Triage Assessment');

  const triageRequest: AssistantRequest = {
    requestId: 'triage-001',
    assistantType: AssistantType.TRIAGE,
    organizationId: 'org-123',
    tenantId: 'tenant-456',
    userId: 'nurse-001',
    patientId: 'patient-002',
    input: {
      chiefComplaint: 'Chest pain',
      symptoms: ['chest pain', 'shortness of breath', 'sweating'],
      vitals: {
        temperature: 98.4,
        heartRate: 110,
        bloodPressure: '160/95',
        respiratoryRate: 22,
        oxygenSaturation: 94,
      },
      painLevel: 8,
    },
    context: {},
    consentVerified: true,
    timestamp: new Date(),
  };

  console.log('   Performing triage assessment...');

  // Grant consent for second patient
  await consentChecker.grantConsent('patient-002', 'org-123', 'v1.0');

  // Validate input
  const triageInputValidation = await inputGuardrail.validateAndSanitize(
    triageRequest.input,
    AssistantType.TRIAGE
  );

  if (triageInputValidation.passed) {
    // Log request
    await auditLogger.logAIRequest(triageRequest);

    // Get triage assessment
    const triageResponse = await triageAssistant.generateSuggestions(triageRequest);

    // Log response
    await auditLogger.logAIResponse(triageRequest, triageResponse);

    const triageSuggestion = triageResponse.suggestions[0];
    console.log(`   Triage completed:`);
    console.log(`   - Priority: ${triageSuggestion.content.priority}`);
    console.log(`   - Confidence: ${triageSuggestion.confidence} (${(triageSuggestion.confidenceScore * 100).toFixed(1)}%)`);
    console.log(`   - Wait time: ${triageSuggestion.content.estimatedWaitTime} minutes`);
    console.log(`   - Requires review: ${triageResponse.requiresHumanReview}`);

    if (triageSuggestion.content.redFlags.length > 0) {
      console.log(`   - Red flags: ${triageSuggestion.content.redFlags.join(', ')}`);
    }

    console.log(`   - Recommended actions:`);
    triageSuggestion.content.recommendedActions.forEach(action => {
      console.log(`     * ${action}`);
    });
  }
  console.log('');

  // =========================================================================
  // 8. Audit Trail
  // =========================================================================
  console.log('8. Audit Trail Summary');

  const stats = await auditLogger.getUsageStatistics('org-123');
  console.log(`   Total AI requests: ${stats.totalRequests}`);
  console.log(`   Total AI responses: ${stats.totalResponses}`);
  console.log(`   Average confidence: ${(stats.averageConfidence * 100).toFixed(1)}%`);
  console.log(`   Average processing time: ${stats.averageProcessingTime.toFixed(0)}ms`);
  console.log(`   By assistant type:`);
  Object.entries(stats.byAssistantType).forEach(([type, count]) => {
    console.log(`     - ${type}: ${count}`);
  });
  console.log('');

  // Get patient audit trail
  const patientLogs = await auditLogger.getPatientAuditTrail('patient-001', 'org-123');
  console.log(`   Patient audit trail (patient-001): ${patientLogs.length} events`);

  // =========================================================================
  // 9. Workflow Statistics
  // =========================================================================
  console.log('9. Workflow Statistics');

  const workflowStats = orchestrator.getStatistics();
  console.log(`   Total workflows: ${workflowStats.totalWorkflows}`);
  console.log(`   Active executions: ${workflowStats.activeExecutions}`);
  console.log(`   Completed: ${workflowStats.completedExecutions}`);
  console.log(`   Failed: ${workflowStats.failedExecutions}`);
  console.log(`   Awaiting approval: ${workflowStats.awaitingApproval}`);
  console.log('');

  console.log('=== Example Complete ===');
}

// Run the example
main().catch(error => {
  console.error('Example failed:', error);
  process.exit(1);
});
