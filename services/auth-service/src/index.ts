import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";
import { prisma } from "./utils/prisma.js";
import { initializeSessionStore, getSessionStore } from "./utils/redis.js";
import authRoutes from "./routes/auth.routes.js";
import mfaRoutes from "./routes/mfa.routes.js";
import oauthRoutes from "./routes/oauth.routes.js";
import { generalLimiter } from "./middleware/rate-limit.middleware.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";
import { logEnabledProviders } from "./strategies/index.js";

const app: express.Application = express();

// ==================== Security Middleware ====================

// Helmet for security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  }),
);

// Request logging
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }),
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parsing (for OAuth state cookies)
app.use(cookieParser());

// Rate limiting
app.use(generalLimiter);

// Trust proxy (for accurate IP detection behind load balancers)
app.set("trust proxy", 1);

// ==================== Routes ====================

// Health check
app.get("/health", async (_req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis session store
    const sessionStore = getSessionStore();
    const redisHealthy = sessionStore ? await sessionStore.healthCheck() : false;

    res.json({
      status: "healthy",
      service: "auth-service",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      database: "connected",
      redis: redisHealthy ? "connected" : "not configured",
    });
  } catch (error) {
    logger.error("Health check failed", { error });
    res.status(503).json({
      status: "unhealthy",
      service: "auth-service",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      redis: "unknown",
    });
  }
});

// Readiness check
app.get("/ready", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).send("OK");
  } catch (error) {
    res.status(503).send("Service Unavailable");
  }
});

// Liveness check
app.get("/live", (_req, res) => {
  res.status(200).send("OK");
});

// Auth routes
app.use("/auth", authRoutes);

// MFA routes
app.use("/auth/mfa", mfaRoutes);

// OAuth routes
app.use("/auth/oauth", oauthRoutes);

// ==================== Error Handling ====================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ==================== Server Startup ====================

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info("Database connected successfully");

    // Initialize Redis session store (optional - will work without it)
    if (process.env.REDIS_HOST || process.env.REDIS_URL) {
      const sessionStore = initializeSessionStore();
      const redisHealthy = await sessionStore.healthCheck();
      if (redisHealthy) {
        logger.info("Redis session store initialized successfully");
      } else {
        logger.warn("Redis session store failed to connect - using fallback session handling");
      }
    } else {
      logger.info("Redis not configured - session store disabled");
    }

    // Log enabled OAuth providers
    logEnabledProviders();

    // Start Express server
    app.listen(config.port, () => {
      logger.info(`Authentication Service started`, {
        port: config.port,
        env: config.env,
        jwtAlgorithm: config.jwt.algorithm,
      });
      console.log(`\nAuthentication Service running on port ${config.port}`);
      console.log(`Health check: http://localhost:${config.port}/health`);
      console.log(`\nAvailable endpoints:`);
      console.log(`  POST /auth/register`);
      console.log(`  POST /auth/login`);
      console.log(`  POST /auth/refresh`);
      console.log(`  POST /auth/logout (protected)`);
      console.log(`  GET  /auth/me (protected)`);
      console.log(`  POST /auth/forgot-password`);
      console.log(`  POST /auth/reset-password`);
      console.log(`  POST /auth/verify-email`);
      console.log(`  POST /auth/resend-verification`);
      console.log(`\nOAuth endpoints:`);
      console.log(`  GET  /auth/oauth/providers`);
      console.log(`  GET  /auth/oauth/:provider`);
      console.log(`  GET  /auth/oauth/:provider/callback`);
      console.log(`  POST /auth/oauth/:provider/token`);
      console.log(`  POST /auth/oauth/link/:provider (protected)`);
      console.log(`  DELETE /auth/oauth/unlink/:provider (protected)`);
      console.log(`  GET  /auth/oauth/accounts (protected)\n`);
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully...`);

  try {
    // Disconnect Redis session store
    const sessionStore = getSessionStore();
    if (sessionStore) {
      await sessionStore.disconnect();
      logger.info("Redis session store disconnected");
    }

    // Disconnect database
    await prisma.$disconnect();
    logger.info("Database disconnected");
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown", { error });
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start the server
startServer();

export default app;
