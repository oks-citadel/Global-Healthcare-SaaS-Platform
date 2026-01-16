import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailController, TemplatesController, SuppressionController } from './email.controller';
import { EmailService } from './email.service';
import { SesService } from './ses.service';
import { EmailProcessor } from './email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  controllers: [EmailController, TemplatesController, SuppressionController],
  providers: [EmailService, SesService, EmailProcessor],
  exports: [EmailService, SesService],
})
export class EmailModule {}
