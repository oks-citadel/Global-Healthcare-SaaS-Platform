import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { extractUser } from './middleware/extractUser';
import { transactionLogger } from './middleware/transactionLogger';

// Route imports
import fhirRouter from './routes/fhir';
import x12Router from './routes/x12';
import ccdaRouter from './routes/ccda';
import directRouter from './routes/direct';
import tefcaRouter from './routes/tefca';
import carequalityRouter from './routes/carequality';
import commonwellRouter from './routes/commonwell';
import partnersRouter from './routes/partners';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3020;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Higher limit for interoperability service
  message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
    },
  },
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Correlation-ID'],
}));

app.use(limiter);
app.use(express.json({ limit: '50mb' })); // Larger payload for document exchange
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.text({ type: ['application/xml', 'text/xml', 'application/edi-x12'], limit: '50mb' }));

// Custom middleware
app.use(extractUser);
app.use(transactionLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'interoperability-service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    capabilities: {
      fhir: ['R4', 'STU3'],
      x12: ['5010'],
      ccda: ['R2.1'],
      direct: true,
      tefca: true,
      carequality: true,
      commonwell: true,
    },
  });
});

// API routes
app.use('/fhir', fhirRouter);
app.use('/x12', x12Router);
app.use('/ccda', ccdaRouter);
app.use('/direct', directRouter);
app.use('/tefca', tefcaRouter);
app.use('/carequality', carequalityRouter);
app.use('/commonwell', commonwellRouter);
app.use('/partners', partnersRouter);

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
  logger.error('Unhandled error:', { error: err.message, stack: err.stack, path: req.path });

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    correlationId: req.headers['x-correlation-id'],
  });
});

app.listen(PORT, () => {
  logger.info(`Interoperability Service running on port ${PORT}`);
  logger.info(`Health check available at http://localhost:${PORT}/health`);
});

export default app;
