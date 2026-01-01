# ============================================
# UnifiedHealth Platform - Monorepo App Dockerfile
# ============================================
# Build Next.js apps from monorepo root with pnpm
# Usage: docker build --build-arg SERVICE_PATH=apps/web -f docker/Dockerfile.app .
# ============================================

ARG NODE_VERSION=20.18

# ============================================
# Stage 1: Base with pnpm
# ============================================
FROM node:${NODE_VERSION}-alpine AS base

RUN apk add --no-cache libc6-compat \
    && rm -rf /var/cache/apk/*

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS deps

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy all package.json files for workspace resolution
COPY packages/adapters/package.json ./packages/adapters/
COPY packages/ai-workflows/package.json ./packages/ai-workflows/
COPY packages/compliance/package.json ./packages/compliance/
COPY packages/country-config/package.json ./packages/country-config/
COPY packages/entitlements/package.json ./packages/entitlements/
COPY packages/fhir/package.json ./packages/fhir/
COPY packages/i18n/package.json ./packages/i18n/
COPY packages/policy/package.json ./packages/policy/
COPY packages/sdk/package.json ./packages/sdk/
COPY packages/ui/package.json ./packages/ui/

# Copy app package.json
ARG SERVICE_PATH
COPY ${SERVICE_PATH}/package.json ./${SERVICE_PATH}/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# ============================================
# Stage 3: Builder
# ============================================
FROM base AS builder

ARG SERVICE_PATH
ARG SERVICE_NAME

WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY --from=deps /app/pnpm-lock.yaml ./
COPY --from=deps /app/pnpm-workspace.yaml ./
COPY --from=deps /app/turbo.json ./

# Copy shared packages
COPY packages/ ./packages/

# Copy the app
COPY ${SERVICE_PATH}/ ./${SERVICE_PATH}/

# Build shared packages
RUN pnpm --filter "@global-health/*" --filter "@healthcare/*" --filter "@unifiedhealth/*" build 2>/dev/null || true

# Build the Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/${SERVICE_PATH}
RUN pnpm build

# ============================================
# Stage 4: Production
# ============================================
FROM node:${NODE_VERSION}-alpine AS production

ARG SERVICE_PATH
ARG SERVICE_NAME
ARG BUILD_DATE
ARG VCS_REF

LABEL maintainer="UnifiedHealth Platform Team"
LABEL version="1.0.0"
LABEL build-date="${BUILD_DATE}"
LABEL vcs-ref="${VCS_REF}"

RUN apk add --no-cache dumb-init \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy standalone build (Next.js output: 'standalone')
COPY --from=builder --chown=nextjs:nodejs /app/${SERVICE_PATH}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/${SERVICE_PATH}/.next/static ./${SERVICE_PATH}/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/${SERVICE_PATH}/public ./${SERVICE_PATH}/public

USER nextjs

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
