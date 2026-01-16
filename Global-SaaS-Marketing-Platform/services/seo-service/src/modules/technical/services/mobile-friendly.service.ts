import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MobileFriendlyResultDto } from '../../../common/dto';

@Injectable()
export class MobileFriendlyService {
  private readonly logger = new Logger(MobileFriendlyService.name);

  constructor(private readonly httpService: HttpService) {}

  async checkMobileFriendly(url: string): Promise<MobileFriendlyResultDto> {
    // In production, would use Google Mobile-Friendly Test API or Puppeteer
    // Simulating for development
    const issues: Array<{ rule: string; severity: 'error' | 'warning'; message: string }> = [];
    const isMobileFriendly = Math.random() > 0.2;

    if (!isMobileFriendly) {
      const possibleIssues = [
        { rule: 'MOBILE_VIEWPORT', severity: 'error' as const, message: 'Viewport not set or improperly configured' },
        { rule: 'FONT_SIZE', severity: 'warning' as const, message: 'Font size is too small for mobile devices' },
        { rule: 'TAP_TARGETS', severity: 'warning' as const, message: 'Touch elements are too close together' },
        { rule: 'CONTENT_WIDTH', severity: 'error' as const, message: 'Content wider than screen' },
      ];

      const numIssues = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numIssues; i++) {
        issues.push(possibleIssues[i % possibleIssues.length]);
      }
    }

    return {
      url,
      isMobileFriendly,
      testStatus: 'COMPLETE',
      issues: issues.length > 0 ? issues : undefined,
      resourcesBlocked: Math.floor(Math.random() * 3),
      viewport: { width: 412, height: 823, deviceScaleFactor: 2.625 },
      analyzedAt: new Date(),
    };
  }
}
