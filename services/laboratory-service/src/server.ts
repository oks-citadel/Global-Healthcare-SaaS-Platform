import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { extractUser } from './middleware/extractUser';
import logger from './utils/logger';

// Import routes
import labOrdersRouter from './routes/lab-orders';
import labResultsRouter from './routes/lab-results';
import testCatalogRouter from './routes/test-catalog';
import samplesRouter from './routes/samples';

// Legacy routes (for backward compatibility)
import ordersRouter from './routes/orders';
import resultsRouter from './routes/results';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

app.use(extractUser);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'laboratory-service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/lab-orders', labOrdersRouter);
app.use('/lab-results', labResultsRouter);
app.use('/test-catalog', testCatalogRouter);
app.use('/samples', samplesRouter);

// Legacy routes (for backward compatibility)
app.use('/orders', ordersRouter);
app.use('/results', resultsRouter);

// API documentation endpoint
app.get('/api-docs', (req, res) => {
  res.json({
    service: 'laboratory-service',
    version: '1.0.0',
    description: 'Laboratory Information System (LIS) - Manages lab orders, results, samples, and test catalog',
    endpoints: {
      'Lab Orders': {
        'GET /lab-orders': 'List all lab orders with filters',
        'GET /lab-orders/statistics': 'Get order statistics',
        'GET /lab-orders/:id': 'Get order details',
        'POST /lab-orders': 'Create new lab order',
        'PATCH /lab-orders/:id': 'Update lab order',
        'GET /lab-orders/:id/results': 'Get order results',
        'POST /lab-orders/:id/results': 'Submit results for order',
      },
      'Lab Results': {
        'GET /lab-results/patient/:patientId': 'Get patient results',
        'GET /lab-results/abnormal': 'Get abnormal results',
        'GET /lab-results/critical': 'Get critical results',
        'POST /lab-results': 'Create single result',
        'POST /lab-results/bulk': 'Create multiple results',
        'PATCH /lab-results/:id/verify': 'Verify result',
      },
      'Test Catalog': {
        'GET /test-catalog': 'List all tests in catalog',
        'GET /test-catalog/search': 'Search tests',
        'POST /test-catalog': 'Add new test type',
      },
      'Samples': {
        'GET /samples': 'Track all samples',
        'POST /samples': 'Create sample',
        'PATCH /samples/:id': 'Update sample status',
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
  });
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
  });

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`Laboratory Service running on port ${PORT}`);
  logger.info(`Health check available at http://localhost:${PORT}/health`);
  logger.info(`API documentation available at http://localhost:${PORT}/api-docs`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
