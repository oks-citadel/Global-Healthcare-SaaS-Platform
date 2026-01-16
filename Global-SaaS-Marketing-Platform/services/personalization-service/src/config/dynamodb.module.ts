import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBService } from './dynamodb.service';

@Global()
@Module({
  providers: [
    {
      provide: 'DYNAMODB_CLIENT',
      useFactory: (configService: ConfigService) => {
        const client = new DynamoDBClient({
          region: configService.get('AWS_REGION', 'us-east-1'),
          endpoint: configService.get('DYNAMODB_ENDPOINT'),
          credentials: configService.get('AWS_ACCESS_KEY_ID')
            ? {
                accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
              }
            : undefined,
        });

        return DynamoDBDocumentClient.from(client, {
          marshallOptions: {
            convertEmptyValues: true,
            removeUndefinedValues: true,
            convertClassInstanceToMap: true,
          },
          unmarshallOptions: {
            wrapNumbers: false,
          },
        });
      },
      inject: [ConfigService],
    },
    DynamoDBService,
  ],
  exports: ['DYNAMODB_CLIENT', DynamoDBService],
})
export class DynamoDBModule {}
