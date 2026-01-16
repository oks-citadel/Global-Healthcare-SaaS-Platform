import { Injectable } from '@nestjs/common';
import { FunnelService } from './services/funnel.service';
import { CohortService } from './services/cohort.service';
import { RetentionService } from './services/retention.service';
import { LtvService } from './services/ltv.service';
import { ChurnService } from './services/churn.service';
import { SessionService } from './services/session.service';
import {
  FunnelQueryDto,
  FunnelResultDto,
  CohortQueryDto,
  CohortResultDto,
  RetentionQueryDto,
  RetentionResultDto,
  LtvQueryDto,
  LtvResultDto,
  ChurnQueryDto,
  ChurnResultDto,
  SessionQueryDto,
  SessionResultDto,
} from './dto/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly funnelService: FunnelService,
    private readonly cohortService: CohortService,
    private readonly retentionService: RetentionService,
    private readonly ltvService: LtvService,
    private readonly churnService: ChurnService,
    private readonly sessionService: SessionService,
  ) {}

  async analyzeFunnel(query: FunnelQueryDto): Promise<FunnelResultDto> {
    return this.funnelService.analyzeFunnel(query);
  }

  async analyzeCohort(query: CohortQueryDto): Promise<CohortResultDto> {
    return this.cohortService.analyzeCohort(query);
  }

  async analyzeRetention(query: RetentionQueryDto): Promise<RetentionResultDto> {
    return this.retentionService.analyzeRetention(query);
  }

  async analyzeLTV(query: LtvQueryDto): Promise<LtvResultDto> {
    return this.ltvService.analyzeLTV(query);
  }

  async analyzeChurn(query: ChurnQueryDto): Promise<ChurnResultDto> {
    return this.churnService.analyzeChurn(query);
  }

  async analyzeSessions(query: SessionQueryDto): Promise<SessionResultDto> {
    return this.sessionService.analyzeSession(query);
  }
}
