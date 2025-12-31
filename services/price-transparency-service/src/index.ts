import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import pricesRouter from './routes/prices';
import estimatesRouter from './routes/estimates';
import complianceRouter from './routes/compliance';
import chargemasterRouter from './routes/chargemaster';
import mrfRouter from './routes/mrf';
import { extractUser } from './middleware/extractUser';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3010;

// Rate limiting configuration
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health', // Skip health checks
});

// Stricter rate limiting for MRF generation (resource-intensive)
const mrfLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 MRF generations per hour
  message: { error: 'Too Many Requests', message: 'MRF generation rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for compliance checks
const complianceLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 compliance checks per hour
  message: { error: 'Too Many Requests', message: 'Compliance check rate limit exceeded. Please try again later.' },
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
      imgSrc: ["'self'", "data:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-User-Role', 'X-User-Email', 'X-Organization-Id'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' })); // Larger limit for bulk imports
app.use(express.urlencoded({ extended: true }));

// User extraction middleware
app.use(extractUser);

// Health check endpoint (no rate limiting)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'price-transparency-service',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    features: [
      'chargemaster-management',
      'price-lookup',
      'shoppable-services',
      'good-faith-estimates',
      'mrf-generation',
      'cms-compliance',
      'payer-contracts',
      'price-comparison',
    ],
  });
});

// Readiness check
app.get('/ready', async (req, res) => {
  try {
    // In production, would check database connectivity
    res.json({
      status: 'ready',
      service: 'price-transparency-service',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      service: 'price-transparency-service',
      error: 'Database connection failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// API routes with appropriate rate limiting
app.use('/prices', standardLimiter, pricesRouter);
app.use('/estimates', standardLimiter, estimatesRouter);
app.use('/compliance', complianceLimiter, complianceRouter);
app.use('/chargemaster', standardLimiter, chargemasterRouter);
app.use('/mrf', mrfLimiter, mrfRouter);

// API documentation endpoint
app.get('/api-docs', (req, res) => {
  res.json({
    service: 'Price Transparency Service',
    version: '1.0.0',
    description: 'CMS Price Transparency compliance, Good Faith Estimates, and price lookup service',
    endpoints: {
      '/health': 'GET - Health check',
      '/ready': 'GET - Readiness check',
      '/prices': {
        '/lookup': 'GET - Look up price for a service',
        '/shoppable': 'GET - Get shoppable services list',
        '/search': 'GET - Search chargemaster items',
        '/compare/:serviceCode': 'GET - Compare payer prices for a service',
        '/compare-region': 'POST - Compare prices across facilities in a region',
        '/estimates': 'POST - Create a price estimate',
        '/estimates/patient/:patientId': 'GET - Get price estimates for a patient',
      },
      '/estimates': {
        '/gfe': 'POST - Create Good Faith Estimate',
        '/gfe/:id': 'GET - Get GFE by ID',
        '/gfe/patient/:patientId': 'GET - List GFEs for patient',
        '/gfe/:id/status': 'PATCH - Update GFE status',
        '/gfe/:id/line-items': 'POST - Add line items to GFE',
        '/gfe/:id/calculate-responsibility': 'POST - Calculate patient responsibility',
        '/gfe/:id/acknowledge': 'POST - Patient acknowledges GFE',
        '/gfe/expiring': 'GET - Get expiring GFEs',
        '/gfe/mark-expired': 'POST - Mark expired GFEs',
      },
      '/compliance': {
        '/check/hospital-price-transparency': 'POST - Run CMS compliance check',
        '/check/no-surprises-act': 'POST - Run No Surprises Act compliance check',
        '/audits': 'GET - Get compliance audit history',
        '/score': 'GET - Get latest compliance scores',
        '/dashboard': 'GET - Get compliance dashboard data',
        '/requirements': 'GET - Get compliance requirements',
      },
      '/chargemaster': {
        '/': 'GET - List chargemaster items, POST - Create item',
        '/:id': 'GET - Get item, PUT - Update item, DELETE - Delete item',
        '/bulk-import': 'POST - Bulk import chargemaster items',
        '/contracts': 'GET - List payer contracts, POST - Create contract',
        '/contracts/:contractId/rates': 'POST - Add negotiated rate',
        '/export': 'GET - Export chargemaster as CSV',
      },
      '/mrf': {
        '/generate': 'POST - Generate machine-readable file',
        '/download/:id': 'GET - Download MRF file',
        '/': 'GET - List MRF files',
        '/:id': 'GET - Get MRF file details',
        '/:id/publish': 'POST - Mark MRF as published',
        '/types': 'GET - Get available MRF file types',
        '/schema': 'GET - Get CMS MRF schema info',
      },
    },
    authentication: 'Bearer token or X-User-Id, X-User-Role, X-User-Email, X-Organization-Id headers',
    rateLimit: {
      standard: '100 requests per 15 minutes',
      mrf: '10 requests per hour',
      compliance: '20 requests per hour',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.path,
    method: req.method,
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  // Don't expose internal errors in production
  const isDev = process.env.NODE_ENV !== 'production';

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: isDev ? err.message : 'An unexpected error occurred',
    ...(isDev && { stack: err.stack }),
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Price Transparency Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
