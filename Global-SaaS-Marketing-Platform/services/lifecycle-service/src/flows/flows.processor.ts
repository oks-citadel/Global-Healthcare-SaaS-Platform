import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { FlowsService } from './flows.service';

@Processor('flow-execution')
export class FlowProcessor {
  constructor(private readonly flowsService: FlowsService) {}

  @Process('execute-step')
  async handleStepExecution(job: Job<{ executionId: string; stepId: string }>) {
    const { executionId, stepId } = job.data;

    try {
      await this.flowsService.processStep(executionId, stepId);
    } catch (error) {
      console.error(`Error processing step ${stepId} for execution ${executionId}:`, error);
      throw error;
    }
  }
}
