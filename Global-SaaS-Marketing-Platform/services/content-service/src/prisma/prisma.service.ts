import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connection established');

    // Query logging in development
    if (process.env.NODE_ENV === 'development') {
      (this as any).$on('query', (e: Prisma.QueryEvent) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }

  // Clean database for testing
  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDatabase can only be called in test environment');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && !key.startsWith('_') && !key.startsWith('$'),
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = (this as any)[modelKey];
        if (model && typeof model.deleteMany === 'function') {
          return model.deleteMany();
        }
        return Promise.resolve();
      }),
    );
  }

  // Soft delete helper
  async softDelete<T extends { deletedAt?: Date | null }>(
    model: any,
    where: any,
  ): Promise<T> {
    return model.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  // Pagination helper
  async paginate<T>(
    model: any,
    args: {
      page?: number;
      limit?: number;
      where?: any;
      orderBy?: any;
      include?: any;
    },
  ): Promise<{
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const page = Math.max(1, args.page || 1);
    const limit = Math.min(100, Math.max(1, args.limit || 10));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      model.findMany({
        where: args.where,
        orderBy: args.orderBy,
        include: args.include,
        skip,
        take: limit,
      }),
      model.count({ where: args.where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
