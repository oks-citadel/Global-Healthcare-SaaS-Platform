import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KinesisService } from './services/kinesis.service';
import { DynamoDBService } from './services/dynamodb.service';
import { S3Service } from './services/s3.service';
import { AthenaService } from './services/athena.service';
import { RedisService } from './services/redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    KinesisService,
    DynamoDBService,
    S3Service,
    AthenaService,
    RedisService,
  ],
  exports: [
    KinesisService,
    DynamoDBService,
    S3Service,
    AthenaService,
    RedisService,
  ],
})
export class CommonModule {}
