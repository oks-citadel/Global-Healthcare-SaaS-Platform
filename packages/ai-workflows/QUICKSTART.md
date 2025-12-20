# Quick Start Guide

Get up and running with AI Workflows in 5 minutes.

## Installation

```bash
npm install @unified-health/ai-workflows
```

## Basic Setup

```typescript
import {
  WorkflowOrchestrator,
  AIAuditLogger,
  InMemoryAuditRepository,
  ConsentChecker,
  InMemoryConsentRepository,
  InputGuardrail,
  OutputGuardrail,
} from '@unified-health/ai-workflows';

// 1. Create audit logger
const auditLogger = new AIAuditLogger(new InMemoryAuditRepository());

// 2. Create orchestrator
const orchestrator = new WorkflowOrchestrator(auditLogger);

// 3. Create guardrails
const inputGuardrail = new InputGuardrail();
const outputGuardrail = new OutputGuardrail();

// 4. Create consent checker
const consentChecker = new ConsentChecker(new InMemoryConsentRepository());
```

## Grant Patient Consent

```typescript
await consentChecker.grantConsent(
  'patient-123',
  'org-456',
  'v1.0',
  new Date('2025-12-31') // optional expiration
);
```

## Use an AI Assistant

```typescript
import {
  DocumentationAssistant,
  MockDocumentationModel,
  AssistantType,
} from '@unified-health/ai-workflows';

// Create assistant
const assistant = new DocumentationAssistant(new MockDocumentationModel());

// Prepare request
const request = {
  requestId: 'req-001',
  assistantType: AssistantType.DOCUMENTATION,
  organizationId: 'org-456',
  tenantId: 'tenant-789',
  userId: 'provider-001',
  patientId: 'patient-123',
  input: {
    encounterType: 'office-visit',
    chiefComplaint: 'Annual physical',
    vitals: {
      temperature: 98.6,
      heartRate: 72,
      bloodPressure: '120/80',
    },
  },
  context: {},
  consentVerified: true,
  timestamp: new Date(),
};

// Validate input
const validated = await inputGuardrail.validateAndSanitize(
  request.input,
  AssistantType.DOCUMENTATION
);

// Get suggestions
const response = await assistant.generateSuggestions({
  ...request,
  input: validated.sanitizedInput,
});

// Validate output
await outputGuardrail.validate(response);

// Use suggestions
console.log('Suggestions:', response.suggestions);
console.log('Requires review:', response.requiresHumanReview);
```

## Trigger a Workflow

```typescript
import { WorkflowTriggerType } from '@unified-health/ai-workflows';

// Register step executors (see full example)
orchestrator.registerStepExecutor('ai_assistant', async (step, context) => {
  // Your AI step logic
});

// Trigger workflow
const executions = await orchestrator.triggerWorkflows(
  WorkflowTriggerType.ENCOUNTER_CREATED,
  {
    organizationId: 'org-456',
    tenantId: 'tenant-789',
    userId: 'provider-001',
    patientId: 'patient-123',
    triggeredBy: 'system',
    metadata: {
      encounterType: 'office-visit',
    },
  }
);

console.log('Workflow started:', executions[0].id);
```

## Approve a Workflow Step

```typescript
await orchestrator.approveStep(
  executionId,
  stepId,
  'provider-001',
  { /* optional modifications */ }
);
```

## Query Audit Logs

```typescript
const logs = await auditLogger.getPatientAuditTrail(
  'patient-123',
  'org-456'
);

const stats = await auditLogger.getUsageStatistics('org-456');
console.log('Total requests:', stats.totalRequests);
console.log('Average confidence:', stats.averageConfidence);
```

## Common Patterns

### Medication Safety Check

```typescript
import {
  MedicationSafetyAssistant,
  MockMedicationSafetyModel,
  AssistantType,
} from '@unified-health/ai-workflows';

const assistant = new MedicationSafetyAssistant(new MockMedicationSafetyModel());

const response = await assistant.generateSuggestions({
  requestId: 'med-001',
  assistantType: AssistantType.MEDICATION_SAFETY,
  organizationId: 'org-456',
  tenantId: 'tenant-789',
  userId: 'provider-001',
  patientId: 'patient-123',
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
    conditions: ['Atrial fibrillation'],
  },
  context: {},
  consentVerified: true,
  timestamp: new Date(),
});

// Check for critical issues
const hasCriticalIssues = response.suggestions.some(
  s => s.content.severity === 'contraindicated'
);
```

### Triage Assessment

```typescript
import {
  TriageAssistant,
  MockTriageModel,
  AssistantType,
} from '@unified-health/ai-workflows';

const assistant = new TriageAssistant(new MockTriageModel());

const response = await assistant.generateSuggestions({
  requestId: 'triage-001',
  assistantType: AssistantType.TRIAGE,
  organizationId: 'org-456',
  tenantId: 'tenant-789',
  userId: 'nurse-001',
  patientId: 'patient-123',
  input: {
    chiefComplaint: 'Chest pain',
    symptoms: ['chest pain', 'shortness of breath'],
    vitals: {
      heartRate: 110,
      bloodPressure: '160/95',
      oxygenSaturation: 94,
    },
    painLevel: 8,
  },
  context: {},
  consentVerified: true,
  timestamp: new Date(),
});

const priority = response.suggestions[0].content.priority;
console.log('Priority:', priority); // 'critical', 'urgent', etc.
```

## Production Checklist

Before deploying to production:

1. Replace mock models with real AI models
2. Replace in-memory repositories with persistent storage (PostgreSQL, MongoDB, etc.)
3. Configure appropriate timeouts and retry limits
4. Set up audit log archival and retention policies
5. Implement monitoring and alerting
6. Configure organization-specific settings
7. Set up proper access controls
8. Review and customize confidence thresholds
9. Test guardrail rules with real data
10. Ensure HIPAA compliance measures are in place

## Next Steps

- Read the [README.md](./README.md) for detailed documentation
- Review the [ARCHITECTURE.md](./ARCHITECTURE.md) for design details
- Check out [complete-workflow-example.ts](./examples/complete-workflow-example.ts) for a full example
- Customize workflows using `WorkflowDefinitionBuilder`
- Add custom validation rules to guardrails
- Implement production AI models
- Set up production-grade audit storage

## Support

For questions and issues:
- Check the documentation
- Review example code
- Contact the Global Healthcare platform team

## Important Safety Reminders

1. AI provides **suggestions only** - never autonomous decisions
2. **Always require human review** for critical decisions
3. **Verify patient consent** before AI processing
4. **Validate inputs and outputs** with guardrails
5. **Maintain comprehensive audit logs** for compliance
6. **Monitor confidence scores** and flag low-confidence suggestions
7. **Test thoroughly** before production deployment
