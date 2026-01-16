export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextCursor?: string;
    previousCursor?: string;
  };
}

export interface DateRangeParams {
  startDate: string;
  endDate: string;
  timezone?: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
}

export interface FilterParams {
  organizationId: string;
  projectId?: string;
  userId?: string;
  sessionId?: string;
  eventTypes?: string[];
  properties?: Record<string, any>;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface QueryParams extends PaginationParams, DateRangeParams, FilterParams {
  sort?: SortParams;
}
