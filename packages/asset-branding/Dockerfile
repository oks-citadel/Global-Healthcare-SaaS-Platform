# =============================================================================
# The Unified Health - Asset Branding Docker Image
# =============================================================================
# This image contains all branding assets for platform-wide consumption.
# Services can mount or copy assets from this image.
#
# Version: 1.0.0
# Last Updated: 2026-01-08
# =============================================================================

# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY tsconfig.json ./
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY icons/ ./icons/

# Build the package
RUN pnpm build

# Production stage - minimal image with only built assets
FROM alpine:3.19 AS production

LABEL org.opencontainers.image.title="The Unified Health - Asset Branding"
LABEL org.opencontainers.image.description="Healthcare-grade brand system and design tokens"
LABEL org.opencontainers.image.vendor="The Unified Health, Inc."
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.source="https://github.com/unified-health/asset-branding"

# Create non-root user
RUN addgroup -g 1001 -S branding && \
    adduser -u 1001 -S branding -G branding

WORKDIR /assets

# Copy built assets from builder
COPY --from=builder --chown=branding:branding /app/dist/ ./dist/
COPY --from=builder --chown=branding:branding /app/icons/ ./icons/

# Create manifest for version tracking
RUN echo '{"version":"1.0.0","buildTime":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"}' > ./manifest.json

# Set ownership
RUN chown -R branding:branding /assets

USER branding

# Expose volume for mounting
VOLUME ["/assets"]

# Default command - keep container running for asset serving
CMD ["tail", "-f", "/dev/null"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD test -f /assets/dist/tokens.json && test -f /assets/dist/theme.css || exit 1
