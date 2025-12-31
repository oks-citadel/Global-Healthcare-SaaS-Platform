import express, { RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/client';
import denialsRouter from './routes/denials';
import appealsRouter from './routes/appeals';
import analyticsRouter from './routes/analytics';
import { extractUser } from './middleware/extractUser';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3010;
const prisma = new PrismaClient();

// Rate limiting configuration
const limiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health' || req.path === '/ready',
}) as unknown as RequestHandler;

// Stricter rate limit for AI-intensive endpoints
const aiLimiter: RequestHandler = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute for AI endpoints
  message: {
    error: 'Too Many Requests',
    message: 'AI endpoint rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
}) as unknown as RequestHandler;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(extractUser);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      service: 'denial-management-service',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'denial-management-service',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
    });
  }
});

// Readiness check endpoint
app.get('/ready', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ready',
      service: 'denial-management-service',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      service: 'denial-management-service',
      timestamp: new Date().toISOString(),
    });
  }
});

// API Routes
app.use('/denials', denialsRouter);
app.use('/appeals', appealsRouter);
app.use('/analytics', analyticsRouter);

// Apply stricter rate limiting to AI-intensive endpoints
app.use('/denials/predict-risk', aiLimiter);
app.use('/appeals/generate', aiLimiter);

// API documentation endpoint
app.get('/docs', (req, res) => {
  res.json({
    service: 'Denial Management Service',
    version: '1.0.0',
    description: 'AI-powered denial management with prediction, appeal generation, and analytics',
    endpoints: {
      denials: {
        'GET /denials': 'List all denials with filtering and pagination',
        'GET /denials/:id': 'Get denial by ID',
        'POST /denials': 'Create new denial from X12 835 remittance',
        'PATCH /denials/:id': 'Update denial',
        'POST /denials/predict-risk': 'Predict denial risk for a claim (pre-submission)',
        'POST /denials/predict-risk/bulk': 'Bulk predict risk for multiple claims',
        'GET /denials/:id/root-cause': 'Get root cause analysis for a denial',
        'POST /denials/import/x12-835': 'Import denials from X12 835 batch',
        'GET /denials/summary/by-carc': 'Get denials summary by CARC code',
        'POST /denials/:id/write-off': 'Write off a denial',
      },
      appeals: {
        'GET /appeals': 'List all appeals with filtering and pagination',
        'GET /appeals/:id': 'Get appeal by ID',
        'POST /appeals/generate': 'Generate a new appeal letter',
        'PATCH /appeals/:id': 'Update appeal',
        'POST /appeals/:id/submit': 'Submit appeal',
        'POST /appeals/:id/outcome': 'Record appeal outcome',
        'GET /appeals/strategy/:payerId': 'Get payer appeal strategy',
        'POST /appeals/:id/assign': 'Assign appeal to staff member',
        'GET /appeals/queue/:staffId': 'Get appeals queue for staff member',
        'POST /appeals/:id/escalate': 'Escalate appeal to next level',
        'GET /appeals/stats/summary': 'Get appeal statistics',
      },
      analytics: {
        'GET /analytics/dashboard': 'Get dashboard summary',
        'GET /analytics/denials': 'Get comprehensive denial analytics',
        'GET /analytics/revenue-recovery': 'Get revenue recovery summary',
        'GET /analytics/productivity/:staffId': 'Get staff productivity metrics',
        'GET /analytics/productivity': 'Get team productivity dashboard',
        'GET /analytics/patterns': 'Get denial patterns',
        'POST /analytics/patterns/refresh': 'Refresh denial patterns',
        'GET /analytics/payers': 'Get payer performance report',
        'GET /analytics/procedures': 'Get procedure denial analysis',
        'GET /analytics/trending': 'Get trending issues',
        'GET /analytics/export': 'Export analytics data',
      },
    },
    standards: {
      'X12 835': 'Remittance Advice - Used for importing denial data',
      'X12 277': 'Claim Status - Used for tracking claim status',
      'CARC': 'Claim Adjustment Reason Codes - Used for denial categorization',
      'RARC': 'Remittance Advice Remark Codes - Additional denial context',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);

  // Handle Prisma errors
  if (err.code?.startsWith('P')) {
    res.status(400).json({
      error: 'Database Error',
      message: 'A database error occurred',
      code: err.code,
    });
    return;
  }

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Denial Management Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`API documentation at http://localhost:${PORT}/docs`);
});

export default app;
