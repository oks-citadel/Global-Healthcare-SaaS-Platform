import { Module } from '@nestjs/common';
import { PersonalizationEngineController } from './personalization-engine.controller';
import { PersonalizationEngineService } from './personalization-engine.service';
import { RulesService } from './rules.service';

@Module({
  controllers: [PersonalizationEngineController],
  providers: [PersonalizationEngineService, RulesService],
  exports: [PersonalizationEngineService, RulesService],
})
export class PersonalizationEngineModule {}
