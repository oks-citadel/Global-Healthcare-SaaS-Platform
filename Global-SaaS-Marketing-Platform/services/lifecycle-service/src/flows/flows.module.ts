import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { FlowsController } from './flows.controller';
import { FlowsService } from './flows.service';
import { FlowProcessor } from './flows.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'flow-execution',
    }),
  ],
  controllers: [FlowsController],
  providers: [FlowsService, FlowProcessor],
  exports: [FlowsService],
})
export class FlowsModule {}
