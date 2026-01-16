import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  BatchGetCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoDBService {
  private readonly tablePrefix: string;

  constructor(
    @Inject('DYNAMODB_CLIENT') private readonly client: DynamoDBDocumentClient,
    private readonly configService: ConfigService,
  ) {
    this.tablePrefix = this.configService.get('DYNAMODB_TABLE_PREFIX', 'personalization_');
  }

  private getTableName(table: string): string {
    return `${this.tablePrefix}${table}`;
  }

  async get<T>(table: string, key: Record<string, any>): Promise<T | null> {
    const command = new GetCommand({
      TableName: this.getTableName(table),
      Key: key,
    });

    const result = await this.client.send(command);
    return (result.Item as T) || null;
  }

  async put<T>(table: string, item: T): Promise<T> {
    const command = new PutCommand({
      TableName: this.getTableName(table),
      Item: item as Record<string, any>,
    });

    await this.client.send(command);
    return item;
  }

  async delete(table: string, key: Record<string, any>): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.getTableName(table),
      Key: key,
    });

    await this.client.send(command);
  }

  async query<T>(
    table: string,
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, any>,
    options?: {
      indexName?: string;
      filterExpression?: string;
      expressionAttributeNames?: Record<string, string>;
      limit?: number;
      scanIndexForward?: boolean;
      exclusiveStartKey?: Record<string, any>;
    },
  ): Promise<{ items: T[]; lastEvaluatedKey?: Record<string, any> }> {
    const command = new QueryCommand({
      TableName: this.getTableName(table),
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      IndexName: options?.indexName,
      FilterExpression: options?.filterExpression,
      ExpressionAttributeNames: options?.expressionAttributeNames,
      Limit: options?.limit,
      ScanIndexForward: options?.scanIndexForward,
      ExclusiveStartKey: options?.exclusiveStartKey,
    });

    const result = await this.client.send(command);
    return {
      items: (result.Items as T[]) || [],
      lastEvaluatedKey: result.LastEvaluatedKey,
    };
  }

  async scan<T>(
    table: string,
    options?: {
      filterExpression?: string;
      expressionAttributeValues?: Record<string, any>;
      expressionAttributeNames?: Record<string, string>;
      limit?: number;
      exclusiveStartKey?: Record<string, any>;
    },
  ): Promise<{ items: T[]; lastEvaluatedKey?: Record<string, any> }> {
    const command = new ScanCommand({
      TableName: this.getTableName(table),
      FilterExpression: options?.filterExpression,
      ExpressionAttributeValues: options?.expressionAttributeValues,
      ExpressionAttributeNames: options?.expressionAttributeNames,
      Limit: options?.limit,
      ExclusiveStartKey: options?.exclusiveStartKey,
    });

    const result = await this.client.send(command);
    return {
      items: (result.Items as T[]) || [],
      lastEvaluatedKey: result.LastEvaluatedKey,
    };
  }

  async update<T>(
    table: string,
    key: Record<string, any>,
    updateExpression: string,
    expressionAttributeValues: Record<string, any>,
    expressionAttributeNames?: Record<string, string>,
  ): Promise<T | null> {
    const command = new UpdateCommand({
      TableName: this.getTableName(table),
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW',
    });

    const result = await this.client.send(command);
    return (result.Attributes as T) || null;
  }

  async batchGet<T>(
    table: string,
    keys: Record<string, any>[],
  ): Promise<T[]> {
    const tableName = this.getTableName(table);
    const command = new BatchGetCommand({
      RequestItems: {
        [tableName]: {
          Keys: keys,
        },
      },
    });

    const result = await this.client.send(command);
    return (result.Responses?.[tableName] as T[]) || [];
  }

  async batchWrite(
    table: string,
    operations: Array<{ put?: Record<string, any>; delete?: Record<string, any> }>,
  ): Promise<void> {
    const tableName = this.getTableName(table);
    const requests = operations.map((op) => {
      if (op.put) {
        return { PutRequest: { Item: op.put } };
      }
      if (op.delete) {
        return { DeleteRequest: { Key: op.delete } };
      }
      throw new Error('Invalid batch write operation');
    });

    const command = new BatchWriteCommand({
      RequestItems: {
        [tableName]: requests,
      },
    });

    await this.client.send(command);
  }
}
