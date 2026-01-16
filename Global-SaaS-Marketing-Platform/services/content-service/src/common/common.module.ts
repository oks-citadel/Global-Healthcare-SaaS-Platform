import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './services/s3.service';
import { RedisService } from './services/redis.service';
import { OpenSearchService } from './services/opensearch.service';
import { CacheService } from './services/cache.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [S3Service, RedisService, OpenSearchService, CacheService],
  exports: [S3Service, RedisService, OpenSearchService, CacheService],
})
export class CommonModule {}
