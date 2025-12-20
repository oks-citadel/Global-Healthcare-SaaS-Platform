/**
 * AI Workflows Package
 *
 * AI-powered clinical workflow orchestration with comprehensive guardrails,
 * audit trail, and human-in-the-loop controls for healthcare applications.
 *
 * @packageDocumentation
 */

// ============================================================================
// Types
// ============================================================================
export * from './types';

// ============================================================================
// Orchestrator
// ============================================================================
export { WorkflowOrchestrator } from './orchestrator/WorkflowOrchestrator';
export {
  WorkflowDefinitionBuilder,
  WorkflowTemplates
} from './orchestrator/WorkflowDefinition';

// ============================================================================
// AI Assistants
// ============================================================================
export {
  DocumentationAssistant,
  MockDocumentationModel,
  type DocumentationModel
} from './assistants/DocumentationAssistant';

export {
  TriageAssistant,
  MockTriageModel,
  type TriageModel
} from './assistants/TriageAssistant';

export {
  CodingAssistant,
  MockCodingModel,
  type CodingModel
} from './assistants/CodingAssistant';

export {
  MedicationSafetyAssistant,
  MockMedicationSafetyModel,
  type MedicationSafetyModel
} from './assistants/MedicationSafetyAssistant';

export {
  PatientMessagingAssistant,
  MockPatientMessagingModel,
  type PatientMessagingModel
} from './assistants/PatientMessagingAssistant';

// ============================================================================
// Guardrails
// ============================================================================
export { InputGuardrail } from './guardrails/InputGuardrail';
export { OutputGuardrail } from './guardrails/OutputGuardrail';
export {
  ConsentChecker,
  InMemoryConsentRepository,
  type ConsentRepository
} from './guardrails/ConsentChecker';

// ============================================================================
// Audit
// ============================================================================
export {
  AIAuditLogger,
  InMemoryAuditRepository,
  type AuditRepository
} from './audit/AIAuditLogger';
