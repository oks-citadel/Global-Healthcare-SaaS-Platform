import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './utils/errorHandler';
import logger from './utils/logger';

// Import routes
import orderRoutes from './routes/orderRoutes';
import studyRoutes from './routes/studyRoutes';
import studyImageRoutes from './routes/studyImageRoutes';
import imageRoutes from './routes/imageRoutes';
import reportRoutes from './routes/reportRoutes';
import criticalFindingRoutes from './routes/criticalFindingRoutes';

// Load environment variables
dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'imaging-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/imaging-orders', orderRoutes);
app.use('/api/studies', studyRoutes);
app.use('/api/studies', studyImageRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/critical-findings', criticalFindingRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    service: 'Imaging Service',
    version: '1.0.0',
    description: 'Radiology and medical imaging service for Global Healthcare SaaS Platform',
    endpoints: {
      health: '/health',
      imagingOrders: '/api/imaging-orders',
      studies: '/api/studies',
      images: '/api/images',
      reports: '/api/reports',
      criticalFindings: '/api/critical-findings',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
