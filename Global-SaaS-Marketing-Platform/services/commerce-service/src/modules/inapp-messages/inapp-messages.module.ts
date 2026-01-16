import { Module } from '@nestjs/common';
import { InappMessagesController } from './inapp-messages.controller';
import { InappMessagesService } from './inapp-messages.service';

@Module({
  controllers: [InappMessagesController],
  providers: [InappMessagesService],
  exports: [InappMessagesService],
})
export class InappMessagesModule {}
