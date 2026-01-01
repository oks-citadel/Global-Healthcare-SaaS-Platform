# ============================================
# UnifiedHealth Platform - Monorepo App Dockerfile
# ============================================
# Usage: docker build --build-arg SERVICE_PATH=apps/web -f docker/Dockerfile.app .
# Using ECR Public Gallery to avoid Docker Hub rate limits
# ============================================

FROM public.ecr.aws/docker/library/node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# ============================================
# Stage 2: Install dependencies
# ============================================
FROM base AS deps
ARG SERVICE_PATH

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY ${SERVICE_PATH}/ ./${SERVICE_PATH}/

RUN pnpm install --frozen-lockfile --ignore-scripts

# ============================================
# Stage 3: Build
# ============================================
FROM base AS builder
ARG SERVICE_PATH

COPY --from=deps /app ./

ENV NEXT_TELEMETRY_DISABLED=1

# Build shared packages
RUN pnpm -r --filter "./packages/*" build || true

# Build the Next.js app
RUN pnpm --filter "./${SERVICE_PATH}" build

# ============================================
# Stage 4: Production
# ============================================
FROM public.ecr.aws/docker/library/node:20-alpine AS production
ARG SERVICE_PATH

RUN apk add --no-cache dumb-init
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/${SERVICE_PATH}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/${SERVICE_PATH}/.next/static ./${SERVICE_PATH}/.next/static

# Copy public folder if it exists (handle empty dirs gracefully)
RUN --mount=from=builder,source=/app,target=/builder \
    if [ -d "/builder/${SERVICE_PATH}/public" ]; then \
      mkdir -p ./${SERVICE_PATH}/public && \
      (cp -r /builder/${SERVICE_PATH}/public/. ./${SERVICE_PATH}/public/ 2>/dev/null || true); \
    fi

RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
