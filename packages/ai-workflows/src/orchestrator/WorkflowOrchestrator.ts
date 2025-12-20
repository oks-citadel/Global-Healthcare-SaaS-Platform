/**
 * Workflow Orchestrator
 * Event-driven workflow execution engine with retry logic and human-in-the-loop
 */

import {
  WorkflowContext,
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowStatus,
  WorkflowStep,
  StepStatus,
  WorkflowTriggerType,
  AssistantType,
  WorkflowError,
  WorkflowConfig,
} from '../types';
import { WorkflowTemplates } from './WorkflowDefinition';
import { AIAuditLogger } from '../audit/AIAuditLogger';

interface WorkflowEventHandler {
  (execution: WorkflowExecution): Promise<void>;
}

export class WorkflowOrchestrator {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private eventHandlers: Map<WorkflowStatus, WorkflowEventHandler[]> = new Map();
  private stepExecutors: Map<string, (step: WorkflowStep, context: WorkflowContext) => Promise<any>> = new Map();
  private auditLogger: AIAuditLogger;
  private config: WorkflowConfig;

  constructor(
    auditLogger: AIAuditLogger,
    config: Partial<WorkflowConfig> = {}
  ) {
    this.auditLogger = auditLogger;
    this.config = {
      maxConcurrentWorkflows: config.maxConcurrentWorkflows || 100,
      stepTimeoutMs: config.stepTimeoutMs || 300000, // 5 minutes
      defaultRetryPolicy: config.defaultRetryPolicy || {
        maxRetries: 3,
        backoffMs: 1000,
        backoffMultiplier: 2,
      },
      enableAuditLogging: config.enableAuditLogging ?? true,
    };

    // Load default workflow templates
    this.loadDefaultWorkflows();
  }

  /**
   * Load default workflow templates
   */
  private loadDefaultWorkflows(): void {
    const templates = WorkflowTemplates.getAllTemplates();
    templates.forEach(template => {
      this.registerWorkflow(template);
    });
  }

  /**
   * Register a workflow definition
   */
  registerWorkflow(definition: WorkflowDefinition): void {
    this.workflows.set(definition.id, definition);
  }

  /**
   * Unregister a workflow definition
   */
  unregisterWorkflow(workflowId: string): void {
    this.workflows.delete(workflowId);
  }

  /**
   * Get workflow definition by ID
   */
  getWorkflow(workflowId: string): WorkflowDefinition | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get all registered workflows
   */
  getAllWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Get workflows by trigger type
   */
  getWorkflowsByTrigger(triggerType: WorkflowTriggerType): WorkflowDefinition[] {
    return Array.from(this.workflows.values()).filter(
      workflow => workflow.triggerType === triggerType && workflow.enabled
    );
  }

  /**
   * Register a step executor
   */
  registerStepExecutor(
    stepType: string,
    executor: (step: WorkflowStep, context: WorkflowContext) => Promise<any>
  ): void {
    this.stepExecutors.set(stepType, executor);
  }

  /**
   * Register an event handler
   */
  onWorkflowEvent(status: WorkflowStatus, handler: WorkflowEventHandler): void {
    if (!this.eventHandlers.has(status)) {
      this.eventHandlers.set(status, []);
    }
    this.eventHandlers.get(status)!.push(handler);
  }

  /**
   * Trigger workflows based on event type
   */
  async triggerWorkflows(
    triggerType: WorkflowTriggerType,
    context: Omit<WorkflowContext, 'workflowId' | 'triggeredAt'>
  ): Promise<WorkflowExecution[]> {
    const workflows = this.getWorkflowsByTrigger(triggerType);

    if (workflows.length === 0) {
      console.warn(`No workflows registered for trigger type: ${triggerType}`);
      return [];
    }

    const executions: WorkflowExecution[] = [];

    for (const workflow of workflows) {
      try {
        const execution = await this.startWorkflow(workflow.id, context);
        executions.push(execution);
      } catch (error) {
        console.error(`Failed to start workflow ${workflow.id}:`, error);
        // Continue with other workflows
      }
    }

    return executions;
  }

  /**
   * Start a workflow execution
   */
  async startWorkflow(
    workflowDefinitionId: string,
    context: Omit<WorkflowContext, 'workflowId' | 'triggeredAt'>
  ): Promise<WorkflowExecution> {
    const definition = this.workflows.get(workflowDefinitionId);
    if (!definition) {
      throw new WorkflowError(
        `Workflow definition not found: ${workflowDefinitionId}`,
        'WORKFLOW_NOT_FOUND'
      );
    }

    if (!definition.enabled) {
      throw new WorkflowError(
        `Workflow is disabled: ${workflowDefinitionId}`,
        'WORKFLOW_DISABLED'
      );
    }

    // Check concurrent workflow limit
    const activeExecutions = Array.from(this.executions.values()).filter(
      exec => exec.status === WorkflowStatus.IN_PROGRESS || exec.status === WorkflowStatus.PENDING
    );
    if (activeExecutions.length >= this.config.maxConcurrentWorkflows) {
      throw new WorkflowError(
        'Maximum concurrent workflows reached',
        'MAX_WORKFLOWS_EXCEEDED',
        { limit: this.config.maxConcurrentWorkflows }
      );
    }

    // Create workflow execution
    const executionId = this.generateExecutionId();
    const fullContext: WorkflowContext = {
      ...context,
      workflowId: executionId,
      triggeredAt: new Date(),
    };

    const execution: WorkflowExecution = {
      id: executionId,
      workflowDefinitionId: definition.id,
      context: fullContext,
      status: WorkflowStatus.PENDING,
      steps: definition.steps.map(step => ({
        ...step,
        status: StepStatus.PENDING,
        retryCount: 0,
      })),
      currentStepIndex: 0,
      startedAt: new Date(),
    };

    this.executions.set(executionId, execution);

    // Log workflow start
    if (this.config.enableAuditLogging) {
      await this.auditLogger.logAIRequest({
        requestId: executionId,
        assistantType: AssistantType.DOCUMENTATION, // Generic for workflow
        organizationId: context.organizationId,
        tenantId: context.tenantId,
        userId: context.userId,
        patientId: context.patientId,
        encounterId: context.encounterId,
        input: { workflow: workflowDefinitionId, trigger: definition.triggerType },
        context: context.metadata,
        consentVerified: true, // Will be checked per step
        timestamp: new Date(),
      });
    }

    // Start execution asynchronously
    this.executeWorkflow(executionId).catch(error => {
      console.error(`Workflow execution failed: ${executionId}`, error);
    });

    return execution;
  }

  /**
   * Execute workflow steps
   */
  private async executeWorkflow(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new WorkflowError('Execution not found', 'EXECUTION_NOT_FOUND');
    }

    try {
      execution.status = WorkflowStatus.IN_PROGRESS;
      await this.emitEvent(WorkflowStatus.IN_PROGRESS, execution);

      while (execution.currentStepIndex < execution.steps.length) {
        const step = execution.steps[execution.currentStepIndex];

        try {
          await this.executeStep(execution, step);

          // Check if step requires human approval
          if (step.requiresHumanApproval && step.status === StepStatus.COMPLETED) {
            execution.status = WorkflowStatus.AWAITING_APPROVAL;
            await this.emitEvent(WorkflowStatus.AWAITING_APPROVAL, execution);
            // Workflow pauses here until approval
            return;
          }

          // Move to next step
          execution.currentStepIndex++;
        } catch (error) {
          // Step execution failed
          await this.handleStepFailure(execution, step, error);

          // If step exhausted retries, fail the workflow
          if (step.retryCount >= step.maxRetries) {
            throw error;
          }

          // Otherwise, retry will be handled in next iteration
        }
      }

      // All steps completed
      execution.status = WorkflowStatus.COMPLETED;
      execution.completedAt = new Date();
      await this.emitEvent(WorkflowStatus.COMPLETED, execution);

    } catch (error) {
      execution.status = WorkflowStatus.FAILED;
      execution.error = error instanceof Error ? error.message : String(error);
      execution.completedAt = new Date();
      await this.emitEvent(WorkflowStatus.FAILED, execution);
    }
  }

  /**
   * Execute a single workflow step
   */
  private async executeStep(execution: WorkflowExecution, step: WorkflowStep): Promise<void> {
    step.status = StepStatus.IN_PROGRESS;

    const executor = this.stepExecutors.get(step.type);
    if (!executor) {
      throw new WorkflowError(
        `No executor registered for step type: ${step.type}`,
        'EXECUTOR_NOT_FOUND'
      );
    }

    // Execute with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Step execution timeout')), this.config.stepTimeoutMs);
    });

    const executionPromise = executor(step, execution.context);

    try {
      step.output = await Promise.race([executionPromise, timeoutPromise]);
      step.status = StepStatus.COMPLETED;
      step.completedAt = new Date();
    } catch (error) {
      step.status = StepStatus.FAILED;
      step.error = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  /**
   * Handle step failure with retry logic
   */
  private async handleStepFailure(
    execution: WorkflowExecution,
    step: WorkflowStep,
    error: any
  ): Promise<void> {
    step.retryCount++;

    if (step.retryCount < step.maxRetries) {
      // Calculate backoff delay
      const delay = this.config.defaultRetryPolicy.backoffMs *
        Math.pow(this.config.defaultRetryPolicy.backoffMultiplier, step.retryCount - 1);

      console.log(`Retrying step ${step.id} after ${delay}ms (attempt ${step.retryCount + 1}/${step.maxRetries})`);

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));

      // Reset step status for retry
      step.status = StepStatus.PENDING;
      step.error = undefined;
    } else {
      console.error(`Step ${step.id} exhausted all retries`, error);
    }
  }

  /**
   * Approve a workflow step (human-in-the-loop)
   */
  async approveStep(
    executionId: string,
    stepId: string,
    approvedBy: string,
    modifications?: any
  ): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new WorkflowError('Execution not found', 'EXECUTION_NOT_FOUND');
    }

    const step = execution.steps.find(s => s.id === stepId);
    if (!step) {
      throw new WorkflowError('Step not found', 'STEP_NOT_FOUND');
    }

    if (step.status !== StepStatus.COMPLETED && step.status !== StepStatus.AWAITING_HUMAN) {
      throw new WorkflowError('Step is not awaiting approval', 'INVALID_STEP_STATUS');
    }

    // Apply modifications if provided
    if (modifications) {
      step.output = { ...step.output, ...modifications };
    }

    step.completedBy = approvedBy;
    execution.status = WorkflowStatus.APPROVED;
    await this.emitEvent(WorkflowStatus.APPROVED, execution);

    // Log approval
    if (this.config.enableAuditLogging) {
      await this.auditLogger.logHumanReview({
        executionId,
        stepId,
        reviewerId: approvedBy,
        approvalStatus: 'approved',
        organizationId: execution.context.organizationId,
        tenantId: execution.context.tenantId,
        patientId: execution.context.patientId,
      });
    }

    // Continue workflow execution
    execution.currentStepIndex++;
    execution.status = WorkflowStatus.IN_PROGRESS;
    await this.executeWorkflow(executionId);
  }

  /**
   * Reject a workflow step
   */
  async rejectStep(
    executionId: string,
    stepId: string,
    rejectedBy: string,
    reason: string
  ): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new WorkflowError('Execution not found', 'EXECUTION_NOT_FOUND');
    }

    const step = execution.steps.find(s => s.id === stepId);
    if (!step) {
      throw new WorkflowError('Step not found', 'STEP_NOT_FOUND');
    }

    step.completedBy = rejectedBy;
    step.error = reason;
    execution.status = WorkflowStatus.REJECTED;
    execution.error = `Step ${stepId} rejected: ${reason}`;
    execution.completedAt = new Date();

    await this.emitEvent(WorkflowStatus.REJECTED, execution);

    // Log rejection
    if (this.config.enableAuditLogging) {
      await this.auditLogger.logHumanReview({
        executionId,
        stepId,
        reviewerId: rejectedBy,
        approvalStatus: 'rejected',
        reviewNotes: reason,
        organizationId: execution.context.organizationId,
        tenantId: execution.context.tenantId,
        patientId: execution.context.patientId,
      });
    }
  }

  /**
   * Cancel a workflow execution
   */
  async cancelWorkflow(executionId: string, cancelledBy: string, reason?: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new WorkflowError('Execution not found', 'EXECUTION_NOT_FOUND');
    }

    execution.status = WorkflowStatus.CANCELLED;
    execution.error = reason || 'Cancelled by user';
    execution.completedAt = new Date();

    // Mark current step as skipped
    if (execution.currentStepIndex < execution.steps.length) {
      execution.steps[execution.currentStepIndex].status = StepStatus.SKIPPED;
    }

    await this.emitEvent(WorkflowStatus.CANCELLED, execution);

    // Log cancellation
    if (this.config.enableAuditLogging) {
      await this.auditLogger.logHumanReview({
        executionId,
        stepId: 'workflow',
        reviewerId: cancelledBy,
        approvalStatus: 'rejected',
        reviewNotes: reason,
        organizationId: execution.context.organizationId,
        tenantId: execution.context.tenantId,
        patientId: execution.context.patientId,
      });
    }
  }

  /**
   * Get workflow execution status
   */
  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId);
  }

  /**
   * Get all executions for an organization
   */
  getExecutionsByOrganization(organizationId: string): WorkflowExecution[] {
    return Array.from(this.executions.values()).filter(
      exec => exec.context.organizationId === organizationId
    );
  }

  /**
   * Get executions by status
   */
  getExecutionsByStatus(status: WorkflowStatus): WorkflowExecution[] {
    return Array.from(this.executions.values()).filter(
      exec => exec.status === status
    );
  }

  /**
   * Emit workflow event
   */
  private async emitEvent(status: WorkflowStatus, execution: WorkflowExecution): Promise<void> {
    const handlers = this.eventHandlers.get(status);
    if (handlers) {
      for (const handler of handlers) {
        try {
          await handler(execution);
        } catch (error) {
          console.error(`Event handler error for status ${status}:`, error);
        }
      }
    }
  }

  /**
   * Generate unique execution ID
   */
  private generateExecutionId(): string {
    return `wf-exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean up completed executions (retain for audit purposes)
   */
  async cleanupCompletedExecutions(retentionDays: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    let cleaned = 0;
    for (const [id, execution] of this.executions.entries()) {
      if (
        execution.completedAt &&
        execution.completedAt < cutoffDate &&
        (execution.status === WorkflowStatus.COMPLETED ||
          execution.status === WorkflowStatus.FAILED ||
          execution.status === WorkflowStatus.CANCELLED)
      ) {
        this.executions.delete(id);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Get workflow statistics
   */
  getStatistics(): {
    totalWorkflows: number;
    activeExecutions: number;
    completedExecutions: number;
    failedExecutions: number;
    awaitingApproval: number;
  } {
    const executions = Array.from(this.executions.values());
    return {
      totalWorkflows: this.workflows.size,
      activeExecutions: executions.filter(e => e.status === WorkflowStatus.IN_PROGRESS).length,
      completedExecutions: executions.filter(e => e.status === WorkflowStatus.COMPLETED).length,
      failedExecutions: executions.filter(e => e.status === WorkflowStatus.FAILED).length,
      awaitingApproval: executions.filter(e => e.status === WorkflowStatus.AWAITING_APPROVAL).length,
    };
  }
}
