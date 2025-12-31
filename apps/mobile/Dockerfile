# ============================================
# UnifiedHealth Mobile App - CI/EAS Build Image
# For Expo Application Services (EAS) and CI builds
# ============================================

FROM node:20-alpine AS base

# Add image metadata
LABEL maintainer="UnifiedHealth Platform Team"
LABEL version="1.0.0"
LABEL description="UnifiedHealth Mobile App - Expo/EAS Build Environment"

# Install required dependencies for Expo/EAS builds
RUN apk add --no-cache \
    git \
    bash \
    curl \
    ca-certificates \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Install EAS CLI globally
RUN npm install -g eas-cli@12.6.2 expo-cli@6.3.12

# ============================================
# Stage 1: Dependencies
# ============================================
FROM base AS deps

WORKDIR /app

# Copy only dependency manifests for better layer caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with cache mount for faster builds
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ============================================
# Stage 2: Builder
# ============================================
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml* ./

# Copy source code
COPY . .

# Environment variables for CI builds
ENV EXPO_NO_TELEMETRY=1
ENV CI=1
ENV NODE_ENV=production

# Create non-root user for running builds
RUN addgroup -g 1001 -S expo && \
    adduser -S expo -u 1001 -G expo && \
    chown -R expo:expo /app

# Switch to non-root user
USER expo

# Default command for CI builds
# Override this in CI/CD pipeline with specific build commands
CMD ["pnpm", "run", "build:preview"]

# ============================================
# Development stage (for local testing)
# ============================================
FROM base AS development

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose Metro bundler port
EXPOSE 8081

# Expose Expo development server port
EXPOSE 19000 19001 19002

# Create non-root user
RUN addgroup -g 1001 -S expo && \
    adduser -S expo -u 1001 -G expo && \
    chown -R expo:expo /app

USER expo

# Start Expo development server
CMD ["pnpm", "run", "dev"]
