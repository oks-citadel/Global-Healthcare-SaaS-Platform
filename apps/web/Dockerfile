# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:25.2-alpine AS deps

# Install security updates and dependencies
RUN apk add --no-cache libc6-compat \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only dependency manifests for better layer caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# ============================================
# Stage 2: Builder
# ============================================
FROM node:25.2-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml* ./

# Copy source code
COPY . .

# Set environment variable for standalone build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build Next.js application with standalone output
# This creates a minimal production build
RUN pnpm build

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM node:25.2-alpine AS production

# Add image metadata
LABEL maintainer="UnifiedHealth Platform Team"
LABEL version="1.0.0"
LABEL description="UnifiedHealth Patient Portal - Next.js Web Application"

# Install security updates, dumb-init for signal handling
RUN apk add --no-cache \
    dumb-init \
    ca-certificates \
    && apk upgrade --no-cache \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Copy standalone output and static files
# Next.js standalone build includes only necessary files
COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
