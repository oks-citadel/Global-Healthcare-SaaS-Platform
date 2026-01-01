# ============================================
# Stage 1: Dependencies
# ============================================
FROM public.ecr.aws/docker/library/node:20-alpine AS deps

RUN apk add --no-cache libc6-compat \
    && rm -rf /var/cache/apk/*

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

# ============================================
# Stage 2: Builder
# ============================================
FROM public.ecr.aws/docker/library/node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml* ./

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN pnpm build

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM public.ecr.aws/docker/library/node:20-alpine AS production

LABEL maintainer="UnifiedHealth Platform Team"
LABEL version="1.0.0"
LABEL description="UnifiedHealth Provider Portal - Next.js Web Application"

RUN apk add --no-cache \
    dumb-init \
    ca-certificates \
    && apk upgrade --no-cache \
    && rm -rf /var/cache/apk/*

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3002
ENV HOSTNAME "0.0.0.0"

COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

USER nodejs

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/api/health || exit 1

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "server.js"]
