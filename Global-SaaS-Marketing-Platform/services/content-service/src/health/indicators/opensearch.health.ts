import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { OpenSearchService } from '../../common/services/opensearch.service';

@Injectable()
export class OpenSearchHealthIndicator extends HealthIndicator {
  constructor(private readonly openSearch: OpenSearchService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.openSearch.ping();

      if (isHealthy) {
        return this.getStatus(key, true, { message: 'OpenSearch is reachable' });
      }

      throw new Error('OpenSearch cluster status is red');
    } catch (error) {
      throw new HealthCheckError(
        'OpenSearch health check failed',
        this.getStatus(key, false, { message: error.message }),
      );
    }
  }
}
