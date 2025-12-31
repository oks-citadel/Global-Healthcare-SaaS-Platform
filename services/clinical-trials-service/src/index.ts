import express, { RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import trialsRouter from './routes/trials';
import matchingRouter from './routes/matching';
import enrollmentRouter from './routes/enrollment';
import sitesRouter from './routes/sites';
import { extractUser } from './middleware/extractUser';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3012;

// Rate limiting configuration
const limiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health', // Skip health checks
}) as unknown as RequestHandler;

// Stricter rate limit for AI matching endpoints
const matchingLimiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit to 30 matching requests per 15 minutes
  message: { error: 'Too Many Requests', message: 'Matching rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
}) as unknown as RequestHandler;

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(extractUser);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'clinical-trials-service',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Readiness check
app.get('/ready', async (req, res) => {
  try {
    // Check database connectivity
    const { PrismaClient } = await import('./generated/client');
    const prisma = new PrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();

    res.json({
      status: 'ready',
      service: 'clinical-trials-service',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      service: 'clinical-trials-service',
      error: 'Database connection failed',
    });
  }
});

// API routes
app.use('/trials', trialsRouter);
app.use('/matching', matchingLimiter, matchingRouter);
app.use('/enrollment', enrollmentRouter);
app.use('/sites', sitesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.path,
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`Clinical Trials Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

export default app;
