import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  KinesisClient,
  PutRecordCommand,
  PutRecordsCommand,
  PutRecordsRequestEntry,
  DescribeStreamCommand,
} from '@aws-sdk/client-kinesis';

export interface KinesisRecord {
  partitionKey: string;
  data: Record<string, any>;
  explicitHashKey?: string;
}

@Injectable()
export class KinesisService implements OnModuleInit {
  private readonly logger = new Logger(KinesisService.name);
  private client: KinesisClient;
  private streamName: string;

  constructor(private configService: ConfigService) {
    this.client = new KinesisClient({
      region: this.configService.get('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', ''),
      },
    });
    this.streamName = this.configService.get(
      'KINESIS_STREAM_NAME',
      'analytics-events',
    );
  }

  async onModuleInit() {
    try {
      const command = new DescribeStreamCommand({
        StreamName: this.streamName,
      });
      await this.client.send(command);
      this.logger.log(`Connected to Kinesis stream: ${this.streamName}`);
    } catch (error) {
      this.logger.warn(
        `Kinesis stream ${this.streamName} not available: ${error.message}`,
      );
    }
  }

  async putRecord(record: KinesisRecord): Promise<string> {
    const command = new PutRecordCommand({
      StreamName: this.streamName,
      PartitionKey: record.partitionKey,
      Data: Buffer.from(JSON.stringify(record.data)),
      ExplicitHashKey: record.explicitHashKey,
    });

    try {
      const response = await this.client.send(command);
      this.logger.debug(`Record sent to shard: ${response.ShardId}`);
      return response.SequenceNumber || '';
    } catch (error) {
      this.logger.error(`Failed to put record: ${error.message}`);
      throw error;
    }
  }

  async putRecords(records: KinesisRecord[]): Promise<{
    successCount: number;
    failedCount: number;
    failedRecords: number[];
  }> {
    const entries: PutRecordsRequestEntry[] = records.map((record) => ({
      PartitionKey: record.partitionKey,
      Data: Buffer.from(JSON.stringify(record.data)),
      ExplicitHashKey: record.explicitHashKey,
    }));

    const command = new PutRecordsCommand({
      StreamName: this.streamName,
      Records: entries,
    });

    try {
      const response = await this.client.send(command);
      const failedRecords: number[] = [];

      response.Records?.forEach((record, index) => {
        if (record.ErrorCode) {
          failedRecords.push(index);
        }
      });

      return {
        successCount: records.length - (response.FailedRecordCount || 0),
        failedCount: response.FailedRecordCount || 0,
        failedRecords,
      };
    } catch (error) {
      this.logger.error(`Failed to put records batch: ${error.message}`);
      throw error;
    }
  }

  async putRecordsWithRetry(
    records: KinesisRecord[],
    maxRetries: number = 3,
  ): Promise<{
    successCount: number;
    failedCount: number;
  }> {
    let remainingRecords = [...records];
    let totalSuccess = 0;
    let retries = 0;

    while (remainingRecords.length > 0 && retries < maxRetries) {
      const result = await this.putRecords(remainingRecords);
      totalSuccess += result.successCount;

      if (result.failedCount === 0) {
        break;
      }

      remainingRecords = result.failedRecords.map((i) => remainingRecords[i]);
      retries++;

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, retries) * 100),
      );
    }

    return {
      successCount: totalSuccess,
      failedCount: remainingRecords.length,
    };
  }
}
