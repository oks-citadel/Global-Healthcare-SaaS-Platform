import express, { RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { extractUser } from './middleware/extractUser';

// Import routes
import vendorsRouter from './routes/vendors';
import assessmentsRouter from './routes/assessments';
import contractsRouter from './routes/contracts';
import incidentsRouter from './routes/incidents';
import complianceRouter from './routes/compliance';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3012;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health', // Skip health checks
});

// Stricter rate limit for write operations
const writeOperationsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 write operations per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Write operation rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-site' },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-User-Role', 'X-User-Email', 'X-Request-Id'],
}));

app.use(limiter as unknown as RequestHandler);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(extractUser);

// Apply stricter rate limit to write operations
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.path !== '/health') {
    return (writeOperationsLimiter as unknown as RequestHandler)(req, res, next);
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${new Date().toISOString()} ${req.method} ${req.path} ${res.statusCode} ${duration}ms`
    );
  });
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'vendor-risk-service',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
  });
});

// Ready check endpoint (for Kubernetes)
app.get('/ready', (_req, res) => {
  // Add database connection check here if needed
  res.json({
    status: 'ready',
    service: 'vendor-risk-service',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/vendors', vendorsRouter);
app.use('/assessments', assessmentsRouter);
app.use('/contracts', contractsRouter);
app.use('/incidents', incidentsRouter);
app.use('/compliance', complianceRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.path,
  });
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { status?: number }, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Don't leak internal error details in production
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: isProduction ? 'An unexpected error occurred' : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  console.log(`${signal} received. Starting graceful shutdown...`);

  // Close server
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });

  // Force exit after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

const server = app.listen(PORT, () => {
  console.log(`Vendor Risk Management Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
