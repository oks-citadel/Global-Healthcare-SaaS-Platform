import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from './email.service';

@Processor('email-queue')
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('send-email')
  async handleSendEmail(job: Job<{ emailSendId: string }>) {
    const { emailSendId } = job.data;

    try {
      await this.emailService.processEmailSend(emailSendId);
    } catch (error) {
      console.error(`Error processing email ${emailSendId}:`, error);
      throw error;
    }
  }
}
