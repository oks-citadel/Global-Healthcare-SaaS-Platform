import { Request } from 'express';

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Pagination result metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Cursor pagination metadata
 */
export interface CursorPaginationMeta {
  nextCursor: string | null;
  previousCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  count: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Cursor paginated response
 */
export interface CursorPaginatedResponse<T> {
  data: T[];
  meta: CursorPaginationMeta;
}

/**
 * Parse pagination parameters from request
 */
export function parsePaginationParams(req: Request): PaginationParams {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(
    parseInt(req.query.limit as string) || 10,
    100 // Max limit
  );
  const cursor = req.query.cursor as string | undefined;
  const sort = req.query.sort as string || 'createdAt';
  const order = (req.query.order as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

  return {
    page: Math.max(1, page),
    limit: Math.max(1, limit),
    cursor,
    sort,
    order,
  };
}

/**
 * Calculate offset from page and limit
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    data,
    meta: calculatePaginationMeta(total, page, limit),
  };
}

/**
 * Encode cursor (base64)
 */
export function encodeCursor(data: any): string {
  const json = JSON.stringify(data);
  return Buffer.from(json).toString('base64');
}

/**
 * Decode cursor (base64)
 */
export function decodeCursor(cursor: string): any {
  try {
    const json = Buffer.from(cursor, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (error) {
    throw new Error('Invalid cursor format');
  }
}

/**
 * Create cursor from record
 */
export function createCursor(record: any, cursorField: string = 'id'): string {
  const cursorData = {
    field: cursorField,
    value: record[cursorField],
    timestamp: record.createdAt || new Date(),
  };
  return encodeCursor(cursorData);
}

/**
 * Cursor-based pagination helper
 * More efficient for large datasets
 */
export class CursorPagination {
  /**
   * Build Prisma where clause for cursor pagination
   */
  static buildWhereClause(
    cursor: string | undefined,
    cursorField: string = 'id',
    order: 'asc' | 'desc' = 'desc'
  ): any {
    if (!cursor) {
      return {};
    }

    try {
      const decoded = decodeCursor(cursor);
      const operator = order === 'desc' ? 'lt' : 'gt';

      return {
        [cursorField]: {
          [operator]: decoded.value,
        },
      };
    } catch (error) {
      // Invalid cursor, return empty where clause
      return {};
    }
  }

  /**
   * Create cursor pagination response
   */
  static createResponse<T>(
    data: T[],
    limit: number,
    cursorField: string = 'id',
    totalCount?: number
  ): CursorPaginatedResponse<T> {
    const hasNextPage = data.length > limit;
    const items = hasNextPage ? data.slice(0, limit) : data;

    const nextCursor =
      hasNextPage && items.length > 0
        ? createCursor(items[items.length - 1], cursorField)
        : null;

    const previousCursor =
      items.length > 0 ? createCursor(items[0], cursorField) : null;

    return {
      data: items,
      meta: {
        nextCursor,
        previousCursor: hasNextPage ? previousCursor : null,
        hasNextPage,
        hasPreviousPage: false, // Can be determined if needed
        count: items.length,
      },
    };
  }

  /**
   * Get Prisma pagination args
   */
  static getPrismaArgs(
    cursor: string | undefined,
    limit: number,
    cursorField: string = 'id',
    order: 'asc' | 'desc' = 'desc'
  ): any {
    const args: any = {
      take: limit + 1, // Fetch one extra to check if there's a next page
      orderBy: {
        [cursorField]: order,
      },
    };

    if (cursor) {
      try {
        const decoded = decodeCursor(cursor);
        args.cursor = {
          [cursorField]: decoded.value,
        };
        args.skip = 1; // Skip the cursor itself
      } catch (error) {
        // Invalid cursor, ignore
      }
    }

    return args;
  }
}

/**
 * Offset-based pagination helper
 * Traditional pagination with page numbers
 */
export class OffsetPagination {
  /**
   * Get Prisma pagination args
   */
  static getPrismaArgs(
    page: number,
    limit: number,
    sortField: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc'
  ): any {
    return {
      skip: calculateOffset(page, limit),
      take: limit,
      orderBy: {
        [sortField]: order,
      },
    };
  }

  /**
   * Create offset pagination response
   */
  static createResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResponse<T> {
    return createPaginatedResponse(data, total, page, limit);
  }
}

/**
 * Optimized total count query
 * Uses approximate count for large datasets
 */
export class CountOptimization {
  private static readonly COUNT_CACHE = new Map<string, { count: number; timestamp: number }>();
  private static readonly CACHE_TTL = 60000; // 1 minute

  /**
   * Get cached count or execute count query
   */
  static async getCachedCount(
    key: string,
    countFn: () => Promise<number>,
    useCache: boolean = true
  ): Promise<number> {
    if (!useCache) {
      return countFn();
    }

    const cached = this.COUNT_CACHE.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.count;
    }

    const count = await countFn();
    this.COUNT_CACHE.set(key, { count, timestamp: Date.now() });

    return count;
  }

  /**
   * Clear count cache
   */
  static clearCache(key?: string): void {
    if (key) {
      this.COUNT_CACHE.delete(key);
    } else {
      this.COUNT_CACHE.clear();
    }
  }

  /**
   * Approximate count for very large tables
   * Uses database statistics instead of counting all rows
   */
  static async getApproximateCount(
    prisma: any,
    tableName: string
  ): Promise<number> {
    try {
      // PostgreSQL specific query
      const result = await prisma.$queryRaw<any[]>`
        SELECT reltuples::bigint AS approximate_count
        FROM pg_class
        WHERE relname = ${tableName}
      `;

      return result[0]?.approximate_count || 0;
    } catch (error) {
      // Fallback to exact count if approximate fails
      return prisma[tableName].count();
    }
  }
}

/**
 * Advanced pagination utilities
 */
export class PaginationUtils {
  /**
   * Generate pagination links
   */
  static generateLinks(
    baseUrl: string,
    page: number,
    limit: number,
    totalPages: number
  ): {
    first: string;
    prev: string | null;
    next: string | null;
    last: string;
  } {
    const buildUrl = (p: number) => `${baseUrl}?page=${p}&limit=${limit}`;

    return {
      first: buildUrl(1),
      prev: page > 1 ? buildUrl(page - 1) : null,
      next: page < totalPages ? buildUrl(page + 1) : null,
      last: buildUrl(totalPages),
    };
  }

  /**
   * Validate pagination parameters
   */
  static validate(
    page: number,
    limit: number,
    maxLimit: number = 100
  ): { valid: boolean; error?: string } {
    if (page < 1) {
      return { valid: false, error: 'Page must be greater than 0' };
    }

    if (limit < 1) {
      return { valid: false, error: 'Limit must be greater than 0' };
    }

    if (limit > maxLimit) {
      return { valid: false, error: `Limit must not exceed ${maxLimit}` };
    }

    return { valid: true };
  }

  /**
   * Calculate page range for pagination UI
   */
  static getPageRange(
    currentPage: number,
    totalPages: number,
    maxPages: number = 5
  ): number[] {
    const halfRange = Math.floor(maxPages / 2);
    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, currentPage + halfRange);

    // Adjust if we're near the beginning or end
    if (end - start + 1 < maxPages) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxPages - 1);
      } else {
        start = Math.max(1, end - maxPages + 1);
      }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  /**
   * Convert cursor pagination to offset (for compatibility)
   */
  static cursorToOffset(
    cursor: string | undefined,
    totalCount: number,
    limit: number
  ): number {
    if (!cursor) return 1;

    try {
      const decoded = decodeCursor(cursor);
      // This is an approximation
      return Math.floor(decoded.value / limit) + 1;
    } catch {
      return 1;
    }
  }
}

/**
 * Keyset pagination (alternative to cursor)
 * More efficient for sorting by multiple fields
 */
export class KeysetPagination {
  /**
   * Build where clause for keyset pagination
   */
  static buildWhereClause(
    lastKey: Record<string, any> | undefined,
    fields: string[],
    order: 'asc' | 'desc' = 'desc'
  ): any {
    if (!lastKey || fields.length === 0) {
      return {};
    }

    const operator = order === 'desc' ? 'lt' : 'gt';
    const conditions: any[] = [];

    // Build compound conditions for multiple fields
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const condition: any = {};

      for (let j = 0; j < i; j++) {
        condition[fields[j]] = lastKey[fields[j]];
      }

      condition[field] = {
        [operator]: lastKey[field],
      };

      conditions.push(condition);
    }

    return conditions.length === 1 ? conditions[0] : { OR: conditions };
  }

  /**
   * Create keyset from record
   */
  static createKeyset(record: any, fields: string[]): Record<string, any> {
    const keyset: Record<string, any> = {};
    fields.forEach(field => {
      keyset[field] = record[field];
    });
    return keyset;
  }
}

export default {
  parsePaginationParams,
  calculateOffset,
  calculatePaginationMeta,
  createPaginatedResponse,
  encodeCursor,
  decodeCursor,
  createCursor,
  CursorPagination,
  OffsetPagination,
  CountOptimization,
  PaginationUtils,
  KeysetPagination,
};
