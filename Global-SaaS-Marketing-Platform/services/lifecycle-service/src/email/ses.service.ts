import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESClient, SendEmailCommand, SendBulkTemplatedEmailCommand } from '@aws-sdk/client-ses';

export interface SendEmailParams {
  to: string;
  toName?: string;
  from: string;
  fromName?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  configurationSet?: string;
  tags?: { name: string; value: string }[];
}

export interface BulkEmailParams {
  from: string;
  fromName?: string;
  replyTo?: string;
  templateName: string;
  templateData: string;
  destinations: {
    to: string;
    replacementData?: string;
  }[];
  configurationSet?: string;
}

@Injectable()
export class SesService {
  private readonly logger = new Logger(SesService.name);
  private readonly sesClient: SESClient;
  private readonly defaultFromEmail: string;
  private readonly defaultFromName: string;
  private readonly configurationSet?: string;

  constructor(private readonly configService: ConfigService) {
    this.sesClient = new SESClient({
      region: this.configService.get('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', ''),
      },
    });

    this.defaultFromEmail = this.configService.get('SES_FROM_EMAIL', 'noreply@example.com');
    this.defaultFromName = this.configService.get('SES_FROM_NAME', 'Marketing Platform');
    this.configurationSet = this.configService.get('SES_CONFIGURATION_SET');
  }

  async sendEmail(params: SendEmailParams): Promise<{ messageId: string }> {
    const fromAddress = params.fromName
      ? `${params.fromName} <${params.from}>`
      : params.from;

    const toAddress = params.toName
      ? `${params.toName} <${params.to}>`
      : params.to;

    const command = new SendEmailCommand({
      Source: fromAddress,
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Subject: {
          Data: params.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: params.html,
            Charset: 'UTF-8',
          },
          ...(params.text && {
            Text: {
              Data: params.text,
              Charset: 'UTF-8',
            },
          }),
        },
      },
      ...(params.replyTo && {
        ReplyToAddresses: [params.replyTo],
      }),
      ...(params.configurationSet || this.configurationSet
        ? {
            ConfigurationSetName: params.configurationSet || this.configurationSet,
          }
        : {}),
      ...(params.tags && {
        Tags: params.tags.map((tag) => ({
          Name: tag.name,
          Value: tag.value,
        })),
      }),
    });

    try {
      const response = await this.sesClient.send(command);
      this.logger.debug(`Email sent to ${params.to}, MessageId: ${response.MessageId}`);
      return { messageId: response.MessageId || '' };
    } catch (error) {
      this.logger.error(`Failed to send email to ${params.to}:`, error);
      throw error;
    }
  }

  async sendBulkEmail(params: BulkEmailParams): Promise<{ successful: number; failed: number }> {
    const command = new SendBulkTemplatedEmailCommand({
      Source: params.fromName
        ? `${params.fromName} <${params.from}>`
        : params.from,
      Template: params.templateName,
      DefaultTemplateData: params.templateData,
      Destinations: params.destinations.map((dest) => ({
        Destination: {
          ToAddresses: [dest.to],
        },
        ReplacementTemplateData: dest.replacementData,
      })),
      ...(params.replyTo && {
        ReplyToAddresses: [params.replyTo],
      }),
      ...(params.configurationSet || this.configurationSet
        ? {
            ConfigurationSetName: params.configurationSet || this.configurationSet,
          }
        : {}),
    });

    try {
      const response = await this.sesClient.send(command);
      const successful = response.Status?.filter((s) => s.Status === 'Success').length || 0;
      const failed = response.Status?.filter((s) => s.Status !== 'Success').length || 0;

      this.logger.debug(`Bulk email sent: ${successful} successful, ${failed} failed`);
      return { successful, failed };
    } catch (error) {
      this.logger.error('Failed to send bulk email:', error);
      throw error;
    }
  }

  getDefaultFromEmail(): string {
    return this.defaultFromEmail;
  }

  getDefaultFromName(): string {
    return this.defaultFromName;
  }
}
