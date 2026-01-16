import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as Handlebars from 'handlebars';
import { PrismaService } from '../prisma/prisma.service';
import { SesService } from './ses.service';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
  SendEmailDto,
  BulkSendEmailDto,
  AddSuppressionDto,
  DeliverabilityMetricsDto,
} from './dto/email.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sesService: SesService,
    @InjectQueue('email-queue') private emailQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // ==================== TEMPLATES ====================

  async createTemplate(dto: CreateTemplateDto, userId?: string) {
    return this.prisma.emailTemplate.create({
      data: {
        name: dto.name,
        description: dto.description,
        subject: dto.subject,
        preheader: dto.preheader,
        htmlContent: dto.htmlContent,
        textContent: dto.textContent,
        mjmlContent: dto.mjmlContent,
        fromName: dto.fromName,
        fromEmail: dto.fromEmail,
        replyTo: dto.replyTo,
        variables: dto.variables,
        createdBy: userId,
      },
    });
  }

  async getTemplates(pagination: PaginationDto, status?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.emailTemplate.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.emailTemplate.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async getTemplate(id: string) {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async updateTemplate(id: string, dto: UpdateTemplateDto) {
    await this.getTemplate(id);

    return this.prisma.emailTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTemplate(id: string) {
    await this.getTemplate(id);

    await this.prisma.emailTemplate.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    return { success: true, message: 'Template archived' };
  }

  // ==================== SENDING ====================

  async sendEmail(dto: SendEmailDto) {
    // Check suppression list
    const suppressed = await this.prisma.suppressionEntry.findUnique({
      where: { email: dto.toEmail.toLowerCase() },
    });

    if (suppressed) {
      throw new BadRequestException(`Email is suppressed: ${suppressed.type}`);
    }

    let subject = dto.subject || '';
    let htmlContent = dto.htmlContent || '';
    let textContent = dto.textContent;
    let fromEmail = dto.fromEmail || this.sesService.getDefaultFromEmail();
    let fromName = dto.fromName || this.sesService.getDefaultFromName();
    let replyTo = dto.replyTo;

    // Use template if provided
    if (dto.templateId) {
      const template = await this.getTemplate(dto.templateId);

      if (template.status !== 'ACTIVE') {
        throw new BadRequestException('Template is not active');
      }

      subject = dto.subject || this.renderTemplate(template.subject, dto.variables);
      htmlContent = this.renderTemplate(template.htmlContent, dto.variables);
      textContent = template.textContent
        ? this.renderTemplate(template.textContent, dto.variables)
        : undefined;
      fromEmail = template.fromEmail || fromEmail;
      fromName = template.fromName || fromName;
      replyTo = template.replyTo || replyTo;
    }

    if (!subject || !htmlContent) {
      throw new BadRequestException('Subject and HTML content are required');
    }

    // Create email send record
    const emailSend = await this.prisma.emailSend.create({
      data: {
        templateId: dto.templateId,
        toEmail: dto.toEmail.toLowerCase(),
        toName: dto.toName,
        fromEmail,
        fromName,
        replyTo,
        subject,
        htmlContent,
        textContent,
        tags: dto.tags || [],
        source: dto.source,
        sourceId: dto.sourceId,
        metadata: dto.metadata,
        status: 'QUEUED',
      },
    });

    // Queue for sending
    await this.emailQueue.add('send-email', {
      emailSendId: emailSend.id,
    });

    return emailSend;
  }

  async sendBulkEmail(dto: BulkSendEmailDto) {
    const template = await this.getTemplate(dto.templateId);

    if (template.status !== 'ACTIVE') {
      throw new BadRequestException('Template is not active');
    }

    // Filter out suppressed emails
    const suppressedEmails = await this.prisma.suppressionEntry.findMany({
      where: {
        email: { in: dto.recipients.map((r) => r.email.toLowerCase()) },
      },
      select: { email: true },
    });

    const suppressedSet = new Set(suppressedEmails.map((s) => s.email));

    const validRecipients = dto.recipients.filter(
      (r) => !suppressedSet.has(r.email.toLowerCase()),
    );

    const results = {
      total: dto.recipients.length,
      queued: 0,
      suppressed: suppressedSet.size,
    };

    // Create email send records and queue
    for (const recipient of validRecipients) {
      const variables = {
        ...template.variables,
        ...recipient.variables,
      };

      const emailSend = await this.prisma.emailSend.create({
        data: {
          templateId: dto.templateId,
          toEmail: recipient.email.toLowerCase(),
          toName: recipient.name,
          fromEmail: template.fromEmail || this.sesService.getDefaultFromEmail(),
          fromName: template.fromName || this.sesService.getDefaultFromName(),
          replyTo: template.replyTo,
          subject: this.renderTemplate(template.subject, variables),
          htmlContent: this.renderTemplate(template.htmlContent, variables),
          textContent: template.textContent
            ? this.renderTemplate(template.textContent, variables)
            : undefined,
          tags: dto.tags || [],
          source: dto.source,
          sourceId: dto.sourceId,
          status: 'QUEUED',
        },
      });

      await this.emailQueue.add('send-email', {
        emailSendId: emailSend.id,
      });

      results.queued++;
    }

    return results;
  }

  async processEmailSend(emailSendId: string) {
    const emailSend = await this.prisma.emailSend.findUnique({
      where: { id: emailSendId },
    });

    if (!emailSend || emailSend.status !== 'QUEUED') {
      return;
    }

    try {
      await this.prisma.emailSend.update({
        where: { id: emailSendId },
        data: { status: 'SENDING' },
      });

      const result = await this.sesService.sendEmail({
        to: emailSend.toEmail,
        toName: emailSend.toName || undefined,
        from: emailSend.fromEmail,
        fromName: emailSend.fromName || undefined,
        replyTo: emailSend.replyTo || undefined,
        subject: emailSend.subject,
        html: emailSend.htmlContent || '',
        text: emailSend.textContent || undefined,
        tags: emailSend.tags.map((tag) => ({ name: 'tag', value: tag })),
      });

      await this.prisma.emailSend.update({
        where: { id: emailSendId },
        data: {
          status: 'SENT',
          messageId: result.messageId,
          sentAt: new Date(),
        },
      });

      // Update template stats
      if (emailSend.templateId) {
        await this.prisma.emailTemplate.update({
          where: { id: emailSend.templateId },
          data: { totalSent: { increment: 1 } },
        });
      }
    } catch (error) {
      await this.prisma.emailSend.update({
        where: { id: emailSendId },
        data: {
          status: 'FAILED',
          metadata: {
            ...(emailSend.metadata as object || {}),
            error: error.message,
          },
        },
      });
    }
  }

  // ==================== DELIVERABILITY ====================

  async getDeliverabilityMetrics(startDate?: Date, endDate?: Date): Promise<DeliverabilityMetricsDto> {
    const where: any = {};

    if (startDate || endDate) {
      where.sentAt = {};
      if (startDate) {
        where.sentAt.gte = startDate;
      }
      if (endDate) {
        where.sentAt.lte = endDate;
      }
    }

    const stats = await this.prisma.emailSend.groupBy({
      by: ['status'],
      where: {
        ...where,
        status: { in: ['SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'COMPLAINED'] },
      },
      _count: true,
    });

    const statusCounts = stats.reduce(
      (acc, s) => {
        acc[s.status] = s._count;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalSent =
      (statusCounts.SENT || 0) +
      (statusCounts.DELIVERED || 0) +
      (statusCounts.OPENED || 0) +
      (statusCounts.CLICKED || 0);
    const totalDelivered =
      (statusCounts.DELIVERED || 0) +
      (statusCounts.OPENED || 0) +
      (statusCounts.CLICKED || 0);
    const totalBounced = statusCounts.BOUNCED || 0;
    const totalComplaints = statusCounts.COMPLAINED || 0;
    const totalOpens = statusCounts.OPENED || 0;
    const totalClicks = statusCounts.CLICKED || 0;

    return {
      totalSent,
      totalDelivered,
      totalBounced,
      totalComplaints,
      totalOpens,
      totalClicks,
      deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
      bounceRate: totalSent > 0 ? (totalBounced / totalSent) * 100 : 0,
      complaintRate: totalSent > 0 ? (totalComplaints / totalSent) * 100 : 0,
      openRate: totalDelivered > 0 ? (totalOpens / totalDelivered) * 100 : 0,
      clickRate: totalDelivered > 0 ? (totalClicks / totalDelivered) * 100 : 0,
    };
  }

  async getEmailMetrics(pagination: PaginationDto, status?: string, email?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (email) {
      where.toEmail = email.toLowerCase();
    }

    const [data, total] = await Promise.all([
      this.prisma.emailSend.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          toEmail: true,
          subject: true,
          status: true,
          messageId: true,
          sentAt: true,
          deliveredAt: true,
          openedAt: true,
          clickedAt: true,
          bouncedAt: true,
          complainedAt: true,
          tags: true,
          source: true,
          createdAt: true,
        },
      }),
      this.prisma.emailSend.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  // ==================== SUPPRESSION ====================

  async addSuppression(dto: AddSuppressionDto) {
    const existing = await this.prisma.suppressionEntry.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.suppressionEntry.create({
      data: {
        email: dto.email.toLowerCase(),
        type: dto.type,
        reason: dto.reason,
        source: dto.source,
      },
    });
  }

  async getSuppressionList(pagination: PaginationDto, type?: string) {
    const where: any = {};

    if (type) {
      where.type = type;
    }

    const [data, total] = await Promise.all([
      this.prisma.suppressionEntry.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.suppressionEntry.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async checkSuppression(email: string) {
    const suppression = await this.prisma.suppressionEntry.findUnique({
      where: { email: email.toLowerCase() },
    });

    return {
      email: email.toLowerCase(),
      suppressed: suppression !== null,
      type: suppression?.type,
      reason: suppression?.reason,
    };
  }

  async removeSuppression(email: string) {
    await this.prisma.suppressionEntry.delete({
      where: { email: email.toLowerCase() },
    });

    return { success: true, message: 'Suppression removed' };
  }

  // ==================== HELPERS ====================

  private renderTemplate(template: string, variables?: Record<string, any>): string {
    if (!variables || Object.keys(variables).length === 0) {
      return template;
    }

    const compiled = Handlebars.compile(template);
    return compiled(variables);
  }
}
