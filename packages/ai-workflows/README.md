# @unified-health/ai-workflows

AI-powered clinical workflow orchestration with comprehensive guardrails, audit trail, and human-in-the-loop controls for healthcare applications.

## Features

### Workflow Orchestration
- **Event-driven workflows**: Trigger workflows based on clinical events (encounter created, lab results, medication orders, etc.)
- **Pre-configured templates**: Ready-to-use workflow definitions for common clinical scenarios
- **Step execution with retry logic**: Automatic retry with exponential backoff for failed steps
- **Human-in-the-loop checkpoints**: Required approvals at critical decision points
- **Workflow status tracking**: Real-time monitoring of workflow execution state

### AI Assistants (Suggestions Only)

#### 1. Documentation Assistant
- SOAP note generation suggestions
- Clinical documentation enhancement
- Addendum generation
- **Always requires provider review and approval**

#### 2. Triage Assistant
- Patient priority suggestions (Critical, Urgent, Semi-Urgent, Non-Urgent)
- Red flag identification
- Estimated wait time recommendations
- **Critical cases require immediate human review**

#### 3. Coding Assistant
- ICD-10 code suggestions
- CPT code suggestions
- **Always requires certified coder review**

#### 4. Medication Safety Assistant
- Drug interaction detection
- Allergy checking
- Contraindication alerts
- Dosing recommendations
- **Major interactions and contraindications require pharmacist review**

#### 5. Patient Messaging Assistant
- Response draft generation
- Tone adjustment (professional, empathetic, educational)
- Urgency assessment
- **All messages require provider review before sending**

### Guardrails

#### Input Guardrails
- Input validation and sanitization
- PHI minimization and redaction
- Injection attack prevention
- Size and format validation
- Type-specific validation rules

#### Output Guardrails
- Confidence threshold enforcement
- Safety validation (no autonomous diagnosis)
- Harmful content detection
- Medical advice prevention
- Quality checks

#### Consent Management
- Patient consent verification
- Consent expiration tracking
- Consent revocation support
- Batch consent checking

### Audit Trail

Comprehensive logging of all AI operations:
- Redacted input summaries (no PHI in logs)
- Model version and prompt template ID
- Output hash for tamper detection
- Reviewer identity and approval status
- Confidence scores
- Processing time metrics
- Guardrail violation tracking

## Installation

```bash
npm install @unified-health/ai-workflows
```

## Quick Start

```typescript
import {
  WorkflowOrchestrator,
  WorkflowTemplates,
  AIAuditLogger,
  InMemoryAuditRepository,
  DocumentationAssistant,
  MockDocumentationModel,
  InputGuardrail,
  OutputGuardrail,
  ConsentChecker,
  InMemoryConsentRepository,
  WorkflowTriggerType,
} from '@unified-health/ai-workflows';

// 1. Set up audit logging
const auditRepository = new InMemoryAuditRepository();
const auditLogger = new AIAuditLogger(auditRepository);

// 2. Set up workflow orchestrator
const orchestrator = new WorkflowOrchestrator(auditLogger, {
  maxConcurrentWorkflows: 100,
  stepTimeoutMs: 300000,
  enableAuditLogging: true,
});

// 3. Set up guardrails
const inputGuardrail = new InputGuardrail({
  maxInputLength: 50000,
  enablePHIMinimization: true,
});

const outputGuardrail = new OutputGuardrail({
  confidenceThresholds: {
    documentation: 0.7,
    triage: 0.8,
    medication_safety: 0.9,
  },
});

// 4. Set up consent checker
const consentRepository = new InMemoryConsentRepository();
const consentChecker = new ConsentChecker(consentRepository);

// 5. Set up AI assistants
const docModel = new MockDocumentationModel();
const docAssistant = new DocumentationAssistant(docModel);

// 6. Register step executors
orchestrator.registerStepExecutor('ai_assistant', async (step, context) => {
  // Validate consent
  await consentChecker.requireConsent(
    context.patientId!,
    context.organizationId
  );

  // Validate input
  const validationResult = await inputGuardrail.validateAndSanitize(
    step.input,
    step.assistantType!
  );

  // Call AI assistant
  const response = await docAssistant.generateSuggestions({
    requestId: context.workflowId,
    assistantType: step.assistantType!,
    organizationId: context.organizationId,
    tenantId: context.tenantId,
    userId: context.userId,
    patientId: context.patientId,
    input: validationResult.sanitizedInput,
    context: context.metadata,
    consentVerified: true,
    timestamp: new Date(),
  });

  // Validate output
  await outputGuardrail.validateAndEnhance(response);

  return response;
});

// 7. Trigger a workflow
const execution = await orchestrator.triggerWorkflows(
  WorkflowTriggerType.ENCOUNTER_CREATED,
  {
    organizationId: 'org-123',
    tenantId: 'tenant-456',
    userId: 'provider-789',
    patientId: 'patient-101',
    encounterId: 'encounter-202',
    triggeredBy: 'system',
    metadata: {
      encounterType: 'office-visit',
      chiefComplaint: 'Annual checkup',
    },
  }
);

console.log('Workflow started:', execution[0].id);
```

## Workflow Templates

Pre-configured workflows for common scenarios:

### Encounter Documentation
```typescript
const workflow = WorkflowTemplates.encounterDocumentation();
orchestrator.registerWorkflow(workflow);
```

### Lab Result Triage
```typescript
const workflow = WorkflowTemplates.labResultTriage();
orchestrator.registerWorkflow(workflow);
```

### Medication Safety Check
```typescript
const workflow = WorkflowTemplates.medicationSafetyCheck();
orchestrator.registerWorkflow(workflow);
```

### Patient Message Response
```typescript
const workflow = WorkflowTemplates.patientMessageResponse();
orchestrator.registerWorkflow(workflow);
```

### Discharge Planning
```typescript
const workflow = WorkflowTemplates.dischargePlanning();
orchestrator.registerWorkflow(workflow);
```

## Custom Workflows

Build custom workflows using the builder:

```typescript
import { WorkflowDefinitionBuilder, AssistantType } from '@unified-health/ai-workflows';

const customWorkflow = new WorkflowDefinitionBuilder()
  .withId('custom-workflow-v1')
  .withName('Custom Clinical Workflow')
  .withDescription('Custom workflow description')
  .withTrigger(WorkflowTriggerType.MANUAL_TRIGGER)
  .addAIStep(
    'step-1',
    'AI Analysis',
    AssistantType.TRIAGE,
    { /* input config */ },
    true, // requires approval
    3 // max retries
  )
  .addHumanReviewStep(
    'step-2',
    'Physician Review',
    { allowEdits: true }
  )
  .addNotificationStep(
    'step-3',
    'Send Notification',
    { notifyProvider: true }
  )
  .requireConsent(true)
  .enable(true)
  .build();

orchestrator.registerWorkflow(customWorkflow);
```

## Human-in-the-Loop

Approve or reject workflow steps:

```typescript
// Approve a step
await orchestrator.approveStep(
  executionId,
  stepId,
  'provider-789',
  { /* optional modifications */ }
);

// Reject a step
await orchestrator.rejectStep(
  executionId,
  stepId,
  'provider-789',
  'Clinical assessment does not support AI suggestion'
);

// Cancel workflow
await orchestrator.cancelWorkflow(
  executionId,
  'provider-789',
  'Workflow no longer needed'
);
```

## Guardrail Configuration

### Input Guardrails

```typescript
const inputGuardrail = new InputGuardrail({
  maxInputLength: 50000,
  enablePHIMinimization: true,
});

// Add custom validation rules
inputGuardrail.addRule('documentation', {
  name: 'custom_rule',
  severity: 'error',
  validate: (input) => {
    // Custom validation logic
    return true;
  },
  message: 'Custom validation failed',
});

// Validate and sanitize
const result = await inputGuardrail.validateAndSanitize(
  input,
  AssistantType.DOCUMENTATION
);
```

### Output Guardrails

```typescript
const outputGuardrail = new OutputGuardrail({
  confidenceThresholds: {
    documentation: 0.7,
    triage: 0.8,
    coding: 0.75,
    medication_safety: 0.9,
    patient_messaging: 0.7,
  },
});

// Validate output
const result = await outputGuardrail.validate(response);

// Filter by confidence
const filtered = outputGuardrail.filterByConfidence(response, 0.8);

// Add safety warnings
const enhanced = outputGuardrail.addSafetyWarnings(response);
```

## Consent Management

```typescript
const consentChecker = new ConsentChecker(consentRepository);

// Grant consent
await consentChecker.grantConsent(
  'patient-101',
  'org-123',
  'v1.0',
  new Date('2025-12-31') // optional expiration
);

// Check consent
const result = await consentChecker.checkConsent(
  'patient-101',
  'org-123'
);

if (!result.granted) {
  console.log('Consent not granted:', result.reason);
}

// Revoke consent
await consentChecker.revokeConsent('patient-101', 'org-123');
```

## Audit Queries

```typescript
// Get patient audit trail
const logs = await auditLogger.getPatientAuditTrail(
  'patient-101',
  'org-123',
  {
    startDate: new Date('2025-01-01'),
    limit: 50,
  }
);

// Get workflow audit trail
const workflowLogs = await auditLogger.getWorkflowAuditTrail(
  'wf-exec-123',
  'org-123'
);

// Get usage statistics
const stats = await auditLogger.getUsageStatistics('org-123', {
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
});

console.log('Total AI requests:', stats.totalRequests);
console.log('Average confidence:', stats.averageConfidence);
console.log('By assistant type:', stats.byAssistantType);
```

## Safety Principles

1. **No Autonomous Diagnosis**: AI only provides suggestions, never autonomous diagnoses
2. **Human Approval Required**: Critical decisions require human review and approval
3. **Confidence Thresholds**: Low-confidence suggestions are flagged for review
4. **PHI Minimization**: Sensitive data is redacted in logs and summaries
5. **Consent Verification**: Patient consent checked before AI processing
6. **Comprehensive Audit**: All AI actions logged with reviewer identity
7. **Output Validation**: AI outputs checked for safety and quality

## Development

### Mock Models

Mock AI models are provided for development and testing:

```typescript
import {
  MockDocumentationModel,
  MockTriageModel,
  MockCodingModel,
  MockMedicationSafetyModel,
  MockPatientMessagingModel,
} from '@unified-health/ai-workflows';

const docModel = new MockDocumentationModel();
const docAssistant = new DocumentationAssistant(docModel);
```

### Testing

```bash
npm test
```

### Building

```bash
npm run build
```

## License

MIT

## Support

For issues and questions, please contact the Global Healthcare platform team.
