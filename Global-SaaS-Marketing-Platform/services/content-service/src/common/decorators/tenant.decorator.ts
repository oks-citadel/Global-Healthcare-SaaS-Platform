import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract tenant ID from the request
 * Expects tenant ID to be set in request by authentication middleware
 */
export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    // Try to get tenant ID from various sources
    const tenantId =
      request.tenantId ||
      request.headers['x-tenant-id'] ||
      request.user?.tenantId;

    if (!tenantId) {
      throw new Error('Tenant ID not found in request');
    }

    return tenantId;
  },
);

/**
 * Extract user ID from the request
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    const userId = request.userId || request.user?.id || request.user?.sub;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    return userId;
  },
);
