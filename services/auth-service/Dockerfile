# Stage 1: Build
FROM public.ecr.aws/docker/library/node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (remove lock file if exists to ensure clean install)
RUN rm -f package-lock.json && npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN chmod +x ./node_modules/.bin/* && npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY prisma ./prisma/

RUN rm -f package-lock.json && npm install --omit=dev && \
    chmod +x ./node_modules/.bin/* && npx prisma generate && \
    npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/index.js"]
