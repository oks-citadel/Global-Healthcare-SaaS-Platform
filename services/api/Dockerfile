# ============================================
# Stage 1: Dependencies
# ============================================
FROM public.ecr.aws/docker/library/node:22-alpine AS deps

# Install security updates, dumb-init, and openssl for Prisma
RUN apk add --no-cache \
    libc6-compat \
    dumb-init \
    openssl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy only dependency manifests for better layer caching
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install all dependencies (needed for build)
RUN npm install --legacy-peer-deps

# ============================================
# Stage 2: Builder
# ============================================
FROM public.ecr.aws/docker/library/node:22-alpine AS builder

# Install openssl for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/package-lock.json* ./
COPY --from=deps /app/prisma ./prisma/

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run db:generate

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production --legacy-peer-deps

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM public.ecr.aws/docker/library/node:22-alpine AS production

# Add image metadata
LABEL maintainer="UnifiedHealth Platform Team"
LABEL version="1.0.0"
LABEL description="UnifiedHealth API Service - Production Image"

# Install security updates, dumb-init, wget, and openssl
RUN apk add --no-cache \
    dumb-init \
    wget \
    ca-certificates \
    openssl \
    && apk upgrade --no-cache \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Create non-root user with specific UID/GID
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy only production dependencies
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
# Copy generated Prisma client to correct path (dist/generated/client is imported from dist/lib/prisma.js)
COPY --from=builder --chown=nodejs:nodejs /app/src/generated ./dist/generated

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Use dumb-init to handle signals properly (for graceful shutdown)
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]
