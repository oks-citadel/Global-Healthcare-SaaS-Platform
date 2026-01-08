import express, { RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import winston from 'winston';
import visitsRouter from './routes/visits';
import caregiversRouter from './routes/caregivers';
import schedulingRouter from './routes/scheduling';
import evvRouter from './routes/evv';
import documentationRouter from './routes/documentation';
import { extractUser } from './middleware/extractUser';

dotenv.config();

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

const app: express.Application = express();
const PORT = process.env.PORT || 3010;

// Rate limiting configuration
const limiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health', // Skip health checks
}) as unknown as RequestHandler;

// GPS location update rate limiter (more permissive for real-time tracking)
const locationLimiter: RequestHandler = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Allow 60 requests per minute for location updates
  message: { error: 'Too Many Requests', message: 'Location update rate limit exceeded.' },
  standardHeaders: true,
  legacyHeaders: false,
}) as unknown as RequestHandler;

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
    // Allow requests with no origin (same-origin, mobile apps, curl)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' })); // Larger limit for photos/signatures
app.use(express.urlencoded({ extended: true }));
app.use(extractUser);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'home-health-service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Readiness check (for Kubernetes)
app.get('/ready', (_req, res) => {
  // Add database connectivity check here in production
  res.json({
    status: 'ready',
    service: 'home-health-service',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/visits', visitsRouter);
app.use('/caregivers', caregiversRouter);
app.use('/scheduling', schedulingRouter);
app.use('/evv', evvRouter);
app.use('/documentation', documentationRouter);

// Apply location-specific rate limiter
app.use('/caregivers/:id/location', locationLimiter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  logger.info(`Home Health Service running on port ${PORT}`);
  logger.info(`Health check available at http://localhost:${PORT}/health`);
  logger.info(`API endpoints:`);
  logger.info(`  - /visits       - Visit management`);
  logger.info(`  - /caregivers   - Caregiver management`);
  logger.info(`  - /scheduling   - Schedule and route optimization`);
  logger.info(`  - /evv          - Electronic Visit Verification`);
  logger.info(`  - /documentation - Visit documentation`);
});

export default app;
