import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProduces } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@ApiTags('Health')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  @ApiProduces('text/plain')
  @ApiResponse({
    status: 200,
    description: 'Prometheus metrics in text format',
  })
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }
}
