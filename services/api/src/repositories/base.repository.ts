import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  [key: string]: any;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Base Repository class providing common CRUD operations
 * @template T - Prisma model type
 * @template TDelegate - Prisma delegate type
 */
export abstract class BaseRepository<
  T,
  TDelegate extends {
    findUnique: Function;
    findFirst: Function;
    findMany: Function;
    create: Function;
    update: Function;
    delete: Function;
    count: Function;
    deleteMany?: Function;
  }
> {
  protected prisma: PrismaClient;
  protected model: TDelegate;
  protected modelName: string;

  constructor(model: TDelegate, modelName: string) {
    this.prisma = prisma;
    this.model = model;
    this.modelName = modelName;
  }

  /**
   * Find a single record by ID
   */
  async findById(
    id: string,
    include?: any
  ): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      include,
    });
  }

  /**
   * Find a single record by criteria
   */
  async findOne(
    where: any,
    include?: any
  ): Promise<T | null> {
    return this.model.findFirst({
      where,
      include,
    });
  }

  /**
   * Find multiple records with optional filters
   */
  async findMany(
    where?: any,
    options?: {
      include?: any;
      orderBy?: any;
      skip?: number;
      take?: number;
    }
  ): Promise<T[]> {
    return this.model.findMany({
      where,
      ...options,
    });
  }

  /**
   * Find records with pagination
   */
  async findWithPagination(
    where: any,
    pagination: PaginationOptions,
    options?: {
      include?: any;
      orderBy?: any;
    }
  ): Promise<PaginationResult<T>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take: limit,
        ...options,
      }),
      this.model.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Count records matching criteria
   */
  async count(where?: any): Promise<number> {
    return this.model.count({ where });
  }

  /**
   * Create a new record
   */
  async create(
    data: any,
    include?: any
  ): Promise<T> {
    return this.model.create({
      data,
      include,
    });
  }

  /**
   * Update a record by ID
   */
  async update(
    id: string,
    data: any,
    include?: any
  ): Promise<T> {
    return this.model.update({
      where: { id },
      data,
      include,
    });
  }

  /**
   * Update a record by criteria
   */
  async updateWhere(
    where: any,
    data: any,
    include?: any
  ): Promise<T> {
    return this.model.update({
      where,
      data,
      include,
    });
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  /**
   * Delete a record by criteria
   */
  async deleteWhere(where: any): Promise<T> {
    return this.model.delete({
      where,
    });
  }

  /**
   * Soft delete a record (if model has deletedAt field)
   */
  async softDelete(id: string): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Delete multiple records
   */
  async deleteMany(where: any): Promise<{ count: number }> {
    if (this.model.deleteMany) {
      return this.model.deleteMany({ where });
    }
    throw new Error(`deleteMany not supported for ${this.modelName}`);
  }

  /**
   * Check if record exists
   */
  async exists(where: any): Promise<boolean> {
    const count = await this.model.count({ where });
    return count > 0;
  }

  /**
   * Execute operation in transaction
   */
  async transaction<R>(
    fn: (tx: Prisma.TransactionClient) => Promise<R>
  ): Promise<R> {
    return this.prisma.$transaction(fn);
  }

  /**
   * Execute raw query
   */
  async executeRaw(query: string, ...values: any[]): Promise<any> {
    return this.prisma.$executeRawUnsafe(query, ...values);
  }

  /**
   * Query raw
   */
  async queryRaw<R = any>(query: string, ...values: any[]): Promise<R> {
    return this.prisma.$queryRawUnsafe(query, ...values);
  }

  /**
   * Upsert a record (create or update)
   */
  async upsert(
    where: any,
    create: any,
    update: any,
    include?: any
  ): Promise<T> {
    return (this.model as any).upsert({
      where,
      create,
      update,
      include,
    });
  }

  /**
   * Create multiple records
   */
  async createMany(data: any[]): Promise<{ count: number }> {
    return (this.model as any).createMany({
      data,
      skipDuplicates: true,
    });
  }

  /**
   * Update multiple records
   */
  async updateMany(where: any, data: any): Promise<{ count: number }> {
    return (this.model as any).updateMany({
      where,
      data,
    });
  }
}
