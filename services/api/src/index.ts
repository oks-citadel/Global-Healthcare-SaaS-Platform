// @ts-nocheck
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/error.middleware.js';
import { correlationMiddleware } from './middleware/correlation.middleware.js';
import { tracingMiddleware, getXRayOpenSegmentMiddleware, getXRayCloseSegmentMiddleware } from './middleware/tracing.middleware.js';
import { routes } from './routes/index.js';
import { connectDatabase, disconnectDatabase, checkDatabaseHealth } from './lib/prisma.js';
import { setupSwagger } from './docs/swagger.js';
import { initializeWebSocket, shutdownWebSocket } from './lib/websocket.js';
import { isDemoMode, demoCredentials } from './lib/demo-store.js';
import { initTracing, shutdownTracing } from './lib/tracing.js';

const app = express();
const httpServer = createServer(app);

// Initialize OpenTelemetry tracing (must be done before other middleware)
if (process.env.TRACING_ENABLED !== 'false') {
  try {
    initTracing();
    logger.info('OpenTelemetry tracing initialized');
  } catch (error) {
    logger.warn('Failed to initialize tracing', { error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

// AWS X-Ray middleware (if enabled)
if (process.env.AWS_XRAY_ENABLED === 'true') {
  app.use(getXRayOpenSegmentMiddleware());
}

// Correlation ID middleware - must be early in the chain
app.use(correlationMiddleware);

// Distributed tracing middleware
app.use(tracingMiddleware({
  serviceName: 'unified-health-api',
  serviceVersion: config.version,
  environment: config.env,
  excludePaths: ['/health', '/ready', '/metrics', '/favicon.ico'],
}));

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});
app.use(limiter);

// CRITICAL: Raw body parsing for Stripe webhooks MUST come BEFORE express.json()
// Stripe webhook signature verification requires the raw body bytes
app.use('/api/v1/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
app.use('/api/v1/billing/webhook', express.raw({ type: 'application/json' }));

// Body parsing for all other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parsing for httpOnly JWT tokens (SECURITY: required for XSS-safe auth)
app.use(cookieParser());

// Logging
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
}));

// API Documentation (Swagger UI)
setupSwagger(app);

// API routes
app.use('/api/v1', routes);

// Health check (outside /api/v1 for K8s probes)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: config.version,
  });
});

app.get('/ready', async (req, res) => {
  try {
    // Demo mode - always ready
    if (isDemoMode) {
      return res.json({
        status: 'ready',
        mode: 'demo',
        checks: {
          database: { connected: true, mode: 'in-memory' },
        },
      });
    }

    const dbHealth = await checkDatabaseHealth();
    if (!dbHealth.connected) {
      return res.status(503).json({
        status: 'not_ready',
        checks: {
          database: { connected: false, error: dbHealth.error },
        },
      });
    }
    res.json({
      status: 'ready',
      checks: {
        database: { connected: true, latency: `${dbHealth.latency}ms` },
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// AWS X-Ray close segment (if enabled)
if (process.env.AWS_XRAY_ENABLED === 'true') {
  app.use(getXRayCloseSegmentMiddleware());
}

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Start server
const PORT = config.port;

async function startServer() {
  try {
    // Demo mode - skip database connection
    if (isDemoMode) {
      logger.info('===========================================');
      logger.info('    DEMO MODE ENABLED - No Database Required');
      logger.info('===========================================');
      logger.info('Demo credentials:');
      logger.info(`  Patient:  ${demoCredentials.patient.email} / ${demoCredentials.patient.password}`);
      logger.info(`  Doctor:   ${demoCredentials.doctor.email} / ${demoCredentials.doctor.password}`);
      logger.info(`  Admin:    ${demoCredentials.admin.email} / ${demoCredentials.admin.password}`);
      logger.info('===========================================');
    } else {
      // Connect to database
      logger.info('Connecting to database...');
      await connectDatabase();
    }

    // Initialize WebSocket server with Redis adapter for horizontal scaling
    logger.info('Initializing WebSocket server...');
    const useRedisAdapter = !isDemoMode && !!config.redis.host;
    await initializeWebSocket(httpServer, useRedisAdapter);

    const server = httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${config.env}`);
      if (isDemoMode) {
        logger.info(`Mode: DEMO (in-memory data)`);
      }
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`Readiness check: http://localhost:${PORT}/ready`);
      logger.info(`API base: http://localhost:${PORT}/api/v1`);
      logger.info(`API docs: http://localhost:${PORT}/api/docs`);
      logger.info(`OpenAPI spec: http://localhost:${PORT}/api/docs/openapi.json`);
      logger.info(`WebSocket: ws://localhost:${PORT}`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, starting graceful shutdown`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          // Shutdown WebSocket server first
          await shutdownWebSocket();
          logger.info('WebSocket server closed');

          // Then disconnect database
          await disconnectDatabase();
          logger.info('Database connection closed');

          // Shutdown tracing
          await shutdownTracing();
          logger.info('Tracing shut down');

          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', { error });
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Start the server
startServer();

export { app };
