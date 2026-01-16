import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBClient,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
  BatchWriteCommand,
  BatchGetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

export interface QueryParams {
  tableName: string;
  keyCondition: string;
  expressionValues: Record<string, any>;
  expressionNames?: Record<string, string>;
  filterExpression?: string;
  limit?: number;
  exclusiveStartKey?: Record<string, any>;
  scanIndexForward?: boolean;
  indexName?: string;
}

export interface UpdateParams {
  tableName: string;
  key: Record<string, any>;
  updateExpression: string;
  expressionValues: Record<string, any>;
  expressionNames?: Record<string, string>;
  conditionExpression?: string;
}

@Injectable()
export class DynamoDBService implements OnModuleInit {
  private readonly logger = new Logger(DynamoDBService.name);
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;
  private tablePrefix: string;

  constructor(private configService: ConfigService) {
    this.client = new DynamoDBClient({
      region: this.configService.get('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', ''),
      },
    });

    this.docClient = DynamoDBDocumentClient.from(this.client, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertEmptyValues: true,
      },
    });

    this.tablePrefix = this.configService.get('DYNAMODB_TABLE_PREFIX', 'analytics_');
  }

  async onModuleInit() {
    this.logger.log('DynamoDB service initialized');
  }

  getTableName(baseName: string): string {
    return `${this.tablePrefix}${baseName}`;
  }

  async get(
    tableName: string,
    key: Record<string, any>,
  ): Promise<Record<string, any> | null> {
    const command = new GetCommand({
      TableName: this.getTableName(tableName),
      Key: key,
    });

    try {
      const response = await this.docClient.send(command);
      return response.Item || null;
    } catch (error) {
      this.logger.error(`Get failed: ${error.message}`);
      throw error;
    }
  }

  async put(
    tableName: string,
    item: Record<string, any>,
    conditionExpression?: string,
  ): Promise<void> {
    const command = new PutCommand({
      TableName: this.getTableName(tableName),
      Item: item,
      ConditionExpression: conditionExpression,
    });

    try {
      await this.docClient.send(command);
    } catch (error) {
      this.logger.error(`Put failed: ${error.message}`);
      throw error;
    }
  }

  async update(params: UpdateParams): Promise<Record<string, any>> {
    const command = new UpdateCommand({
      TableName: this.getTableName(params.tableName),
      Key: params.key,
      UpdateExpression: params.updateExpression,
      ExpressionAttributeValues: params.expressionValues,
      ExpressionAttributeNames: params.expressionNames,
      ConditionExpression: params.conditionExpression,
      ReturnValues: 'ALL_NEW',
    });

    try {
      const response = await this.docClient.send(command);
      return response.Attributes || {};
    } catch (error) {
      this.logger.error(`Update failed: ${error.message}`);
      throw error;
    }
  }

  async delete(tableName: string, key: Record<string, any>): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.getTableName(tableName),
      Key: key,
    });

    try {
      await this.docClient.send(command);
    } catch (error) {
      this.logger.error(`Delete failed: ${error.message}`);
      throw error;
    }
  }

  async query(params: QueryParams): Promise<{
    items: Record<string, any>[];
    lastEvaluatedKey?: Record<string, any>;
  }> {
    const command = new QueryCommand({
      TableName: this.getTableName(params.tableName),
      KeyConditionExpression: params.keyCondition,
      ExpressionAttributeValues: params.expressionValues,
      ExpressionAttributeNames: params.expressionNames,
      FilterExpression: params.filterExpression,
      Limit: params.limit,
      ExclusiveStartKey: params.exclusiveStartKey,
      ScanIndexForward: params.scanIndexForward,
      IndexName: params.indexName,
    });

    try {
      const response = await this.docClient.send(command);
      return {
        items: response.Items || [],
        lastEvaluatedKey: response.LastEvaluatedKey,
      };
    } catch (error) {
      this.logger.error(`Query failed: ${error.message}`);
      throw error;
    }
  }

  async scan(
    tableName: string,
    filterExpression?: string,
    expressionValues?: Record<string, any>,
    limit?: number,
  ): Promise<Record<string, any>[]> {
    const command = new ScanCommand({
      TableName: this.getTableName(tableName),
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionValues,
      Limit: limit,
    });

    try {
      const response = await this.docClient.send(command);
      return response.Items || [];
    } catch (error) {
      this.logger.error(`Scan failed: ${error.message}`);
      throw error;
    }
  }

  async batchWrite(
    tableName: string,
    items: Record<string, any>[],
  ): Promise<void> {
    const fullTableName = this.getTableName(tableName);
    const batches: Record<string, any>[][] = [];

    // Split into batches of 25 (DynamoDB limit)
    for (let i = 0; i < items.length; i += 25) {
      batches.push(items.slice(i, i + 25));
    }

    for (const batch of batches) {
      const command = new BatchWriteCommand({
        RequestItems: {
          [fullTableName]: batch.map((item) => ({
            PutRequest: { Item: item },
          })),
        },
      });

      try {
        await this.docClient.send(command);
      } catch (error) {
        this.logger.error(`Batch write failed: ${error.message}`);
        throw error;
      }
    }
  }

  async batchGet(
    tableName: string,
    keys: Record<string, any>[],
  ): Promise<Record<string, any>[]> {
    const fullTableName = this.getTableName(tableName);
    const batches: Record<string, any>[][] = [];
    const results: Record<string, any>[] = [];

    // Split into batches of 100 (DynamoDB limit)
    for (let i = 0; i < keys.length; i += 100) {
      batches.push(keys.slice(i, i + 100));
    }

    for (const batch of batches) {
      const command = new BatchGetCommand({
        RequestItems: {
          [fullTableName]: {
            Keys: batch,
          },
        },
      });

      try {
        const response = await this.docClient.send(command);
        if (response.Responses?.[fullTableName]) {
          results.push(...response.Responses[fullTableName]);
        }
      } catch (error) {
        this.logger.error(`Batch get failed: ${error.message}`);
        throw error;
      }
    }

    return results;
  }

  async incrementCounter(
    tableName: string,
    key: Record<string, any>,
    counterField: string,
    incrementBy: number = 1,
  ): Promise<number> {
    const result = await this.update({
      tableName,
      key,
      updateExpression: `SET ${counterField} = if_not_exists(${counterField}, :zero) + :inc`,
      expressionValues: {
        ':zero': 0,
        ':inc': incrementBy,
      },
    });

    return result[counterField] || 0;
  }

  async addToSet(
    tableName: string,
    key: Record<string, any>,
    setField: string,
    values: string[],
  ): Promise<void> {
    await this.update({
      tableName,
      key,
      updateExpression: `ADD ${setField} :vals`,
      expressionValues: {
        ':vals': new Set(values),
      },
    });
  }
}
