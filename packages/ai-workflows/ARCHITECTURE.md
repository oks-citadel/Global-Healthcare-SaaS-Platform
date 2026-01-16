# AI Workflows Architecture

## Overview

The AI Workflows package provides a comprehensive framework for AI-powered clinical workflow orchestration with built-in safety guardrails, consent management, and comprehensive audit logging.

## Core Components

### 1. Workflow Orchestrator

**Location**: `src/orchestrator/WorkflowOrchestrator.ts`

**Responsibilities**:
- Event-driven workflow execution
- Step execution with retry logic
- Human-in-the-loop checkpoint management
- Workflow state tracking
- Concurrent workflow management

**Key Features**:
- Automatic retry with exponential backoff
- Timeout protection (configurable, default 5 minutes)
- Event emission for workflow state changes
- Support for manual approval/rejection
- Workflow cancellation
- Statistics and monitoring

### 2. Workflow Definitions

**Location**: `src/orchestrator/WorkflowDefinition.ts`

**Pre-configured Templates**:
1. **Encounter Documentation** - SOAP note generation with coding suggestions
2. **Lab Result Triage** - Automated lab result analysis and prioritization
3. **Medication Safety Check** - Drug interaction and safety screening
4. **Patient Message Response** - AI-drafted patient communication
5. **Discharge Planning** - Comprehensive discharge documentation

**Builder Pattern**:
```typescript
new WorkflowDefinitionBuilder()
  .withId('custom-workflow-v1')
  .withName('Custom Workflow')
  .addAIStep(...)
  .addHumanReviewStep(...)
  .build();
```

### 3. AI Assistants

All assistants operate on a **suggestions-only** model - they never make autonomous decisions.

#### Documentation Assistant
**Location**: `src/assistants/DocumentationAssistant.ts`

**Capabilities**:
- SOAP note generation
- Documentation enhancement
- Addendum generation

**Safety**:
- Always requires provider review
- Confidence scoring on all suggestions
- Completeness warnings

#### Triage Assistant
**Location**: `src/assistants/TriageAssistant.ts`

**Capabilities**:
- Priority assessment (Critical/Urgent/Semi-Urgent/Non-Urgent)
- Red flag identification
- Wait time estimation
- Recommended actions

**Safety**:
- Critical cases require immediate review
- Abnormal vital sign detection
- Escalation recommendations

#### Coding Assistant
**Location**: `src/assistants/CodingAssistant.ts`

**Capabilities**:
- ICD-10 code suggestions
- CPT code suggestions
- Code validation

**Safety**:
- Always requires certified coder review
- Code format validation
- Medical necessity reminders

#### Medication Safety Assistant
**Location**: `src/assistants/MedicationSafetyAssistant.ts`

**Capabilities**:
- Drug interaction detection
- Allergy checking
- Contraindication alerts
- Dosing recommendations

**Safety**:
- Contraindications require pharmacist review
- Major interactions flagged for review
- Multiple severity levels (Contraindicated/Major/Moderate/Minor)

#### Patient Messaging Assistant
**Location**: `src/assistants/PatientMessagingAssistant.ts`

**Capabilities**:
- Response draft generation
- Tone adjustment (professional/empathetic/educational)
- Urgency assessment
- Literacy level adaptation

**Safety**:
- Always requires provider review
- No direct medical advice
- Escalation flags for urgent concerns

### 4. Guardrails

#### Input Guardrail
**Location**: `src/guardrails/InputGuardrail.ts`

**Functions**:
- Input validation
- PHI redaction and minimization
- Injection attack prevention
- Size limit enforcement
- Type-specific validation rules

**PHI Redaction**:
- SSN detection and redaction
- MRN detection and redaction
- Phone number redaction
- Email redaction
- Date redaction

#### Output Guardrail
**Location**: `src/guardrails/OutputGuardrail.ts`

**Functions**:
- Confidence threshold enforcement
- Safety validation
- Harmful content detection
- Autonomous diagnosis prevention
- Quality checks

**Validation Rules**:
- Must contain suggestions
- Valid confidence scores (0-1)
- No harmful content
- No diagnostic claims
- Required metadata present
- Type-specific validation

#### Consent Checker
**Location**: `src/guardrails/ConsentChecker.ts`

**Functions**:
- Consent verification
- Expiration tracking
- Revocation support
- Batch checking

**Consent Lifecycle**:
1. Grant consent (with optional expiration)
2. Check consent before AI processing
3. Revoke consent if needed
4. Track consent version

### 5. Audit Logger

**Location**: `src/audit/AIAuditLogger.ts`

**Logged Events**:
- AI_REQUEST - Every AI assistant call
- AI_RESPONSE - Every AI response
- HUMAN_REVIEW - Human review events
- APPROVAL - Step approvals
- REJECTION - Step rejections
- GUARDRAIL_VIOLATION - Guardrail failures
- CONSENT_CHECK - Consent verification

**Audit Log Fields**:
- Event metadata (organization, tenant, user, patient)
- Redacted input summary (no PHI)
- Model version and prompt template ID
- Output hash (SHA-256 for tamper detection)
- Confidence scores
- Reviewer identity
- Approval status
- Processing time
- Guardrail results

**Query Capabilities**:
- Filter by organization, tenant, user, patient
- Filter by date range
- Filter by assistant type
- Filter by event type
- Pagination support
- Usage statistics

## Data Flow

```
1. Clinical Event Occurs
   ↓
2. Workflow Triggered
   ↓
3. Consent Check
   ↓
4. Input Validation & Sanitization (PHI Redaction)
   ↓
5. AI Assistant Processing
   ↓
6. Output Validation
   ↓
7. Audit Logging
   ↓
8. Human Review (if required)
   ↓
9. Approval/Rejection
   ↓
10. Next Step or Completion
```

## Security & Privacy

### PHI Protection
1. **Input Minimization**: PHI redacted before AI processing
2. **Output Validation**: No PHI in suggestions
3. **Audit Redaction**: Only summaries logged, no raw PHI
4. **Hash-based Tracking**: Output integrity without storing content

### Access Control
1. **Organization Isolation**: Multi-tenant separation
2. **User Attribution**: All actions tied to user identity
3. **Consent Requirement**: Patient consent verified before processing
4. **Audit Trail**: Complete history for compliance

### Safety Measures
1. **No Autonomous Decisions**: AI only suggests, humans decide
2. **Confidence Thresholds**: Low-confidence flagged for review
3. **Human-in-the-Loop**: Critical decisions require approval
4. **Guardrail Enforcement**: Input/output validation mandatory
5. **Tamper Detection**: Output hashing for integrity

## Extensibility

### Adding Custom Assistants

1. Define model interface:
```typescript
export interface CustomModel {
  process(input: CustomInput): Promise<CustomOutput>;
}
```

2. Implement assistant class:
```typescript
export class CustomAssistant {
  constructor(private model: CustomModel) {}
  async generateSuggestions(request: AssistantRequest): Promise<AssistantResponse> {
    // Implementation
  }
}
```

3. Add guardrail rules:
```typescript
inputGuardrail.addRule(AssistantType.CUSTOM, {
  name: 'custom_rule',
  severity: 'error',
  validate: (input) => { /* validation */ },
  message: 'Validation message'
});
```

### Adding Custom Workflows

Use the `WorkflowDefinitionBuilder`:
```typescript
const workflow = new WorkflowDefinitionBuilder()
  .withId('custom-workflow')
  .withName('Custom Workflow')
  .withTrigger(WorkflowTriggerType.CUSTOM)
  .addAIStep(...)
  .addHumanReviewStep(...)
  .build();

orchestrator.registerWorkflow(workflow);
```

### Custom Step Executors

Register custom step types:
```typescript
orchestrator.registerStepExecutor('custom_step', async (step, context) => {
  // Custom logic
  return result;
});
```

## Performance Considerations

### Timeouts
- Default step timeout: 5 minutes
- Configurable per workflow
- Automatic failure on timeout

### Retry Logic
- Exponential backoff (default: 1s * 2^retry)
- Configurable max retries (default: 3)
- Per-step retry configuration

### Concurrency
- Max concurrent workflows (default: 100)
- Per-organization limits possible
- Queue management for overflow

### Audit Performance
- Batch writes recommended for production
- Indexed queries on common fields
- Pagination for large result sets
- Archival strategy for old logs

## Testing

### Mock Models
All assistants include mock models for testing:
- `MockDocumentationModel`
- `MockTriageModel`
- `MockCodingModel`
- `MockMedicationSafetyModel`
- `MockPatientMessagingModel`

### In-Memory Repositories
- `InMemoryAuditRepository`
- `InMemoryConsentRepository`

### Testing Strategy
1. Unit tests for each component
2. Integration tests for workflows
3. Guardrail validation tests
4. Audit trail verification
5. Mock model behavior verification

## Deployment

### Production Requirements
1. Replace mock models with real AI models
2. Replace in-memory repositories with persistent storage
3. Configure appropriate timeouts and retry limits
4. Set up audit log archival
5. Implement monitoring and alerting
6. Configure organization-specific settings

### Configuration
All components support configuration:
- Workflow orchestrator: timeouts, concurrency
- Guardrails: thresholds, PHI patterns
- Audit logger: retention, batch size
- AI models: endpoints, credentials

## Monitoring

### Key Metrics
- Workflow completion rate
- Average processing time
- Confidence score distribution
- Human approval rate
- Guardrail violation frequency
- Consent denial rate

### Alerts
- Critical workflow failures
- Guardrail violations
- Low confidence patterns
- Consent issues
- Performance degradation

## Compliance

### HIPAA Considerations
- PHI minimization in all logs
- Audit trail for all PHI access
- Access control enforcement
- Tamper-evident logging
- Retention policy support

### Clinical Documentation
- Provider review requirement
- Signature capture support
- Addendum tracking
- Version control

### Liability Protection
- Suggestions only, not decisions
- Human approval on critical items
- Complete audit trail
- Confidence disclosure
- Warning generation
