import express, { RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import populationsRouter from './routes/populations';
import cohortsRouter from './routes/cohorts';
import qualityMeasuresRouter from './routes/quality-measures';
import riskStratificationRouter from './routes/risk-stratification';
import analyticsRouter from './routes/analytics';
import { extractUser } from './middleware/extractUser';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3013;

// Rate limiting configuration
const limiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health', // Skip health checks
}) as unknown as RequestHandler;

// Analytics endpoints may need higher limits for dashboard queries
const analyticsLimiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
}) as unknown as RequestHandler;

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
    service: 'population-health-service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Readiness check endpoint
app.get('/ready', async (req, res) => {
  try {
    // Could add database connectivity check here
    res.json({
      status: 'ready',
      service: 'population-health-service',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      service: 'population-health-service',
      timestamp: new Date().toISOString(),
    });
  }
});

// FHIR R4 capability statement
app.get('/fhir/metadata', (req, res) => {
  res.json({
    resourceType: 'CapabilityStatement',
    status: 'active',
    date: new Date().toISOString(),
    kind: 'instance',
    fhirVersion: '4.0.1',
    format: ['json'],
    rest: [
      {
        mode: 'server',
        resource: [
          {
            type: 'Group',
            profile: 'http://hl7.org/fhir/StructureDefinition/Group',
            interaction: [
              { code: 'read' },
              { code: 'search-type' },
              { code: 'create' },
              { code: 'update' },
            ],
          },
          {
            type: 'Measure',
            profile: 'http://hl7.org/fhir/StructureDefinition/Measure',
            interaction: [
              { code: 'read' },
              { code: 'search-type' },
            ],
          },
          {
            type: 'MeasureReport',
            profile: 'http://hl7.org/fhir/StructureDefinition/MeasureReport',
            interaction: [
              { code: 'read' },
              { code: 'search-type' },
              { code: 'create' },
            ],
          },
          {
            type: 'RiskAssessment',
            profile: 'http://hl7.org/fhir/StructureDefinition/RiskAssessment',
            interaction: [
              { code: 'read' },
              { code: 'search-type' },
              { code: 'create' },
            ],
          },
        ],
      },
    ],
  });
});

// API routes
app.use('/populations', populationsRouter);
app.use('/cohorts', cohortsRouter);
app.use('/quality-measures', qualityMeasuresRouter);
app.use('/risk-stratification', riskStratificationRouter);
app.use('/analytics', analyticsLimiter, analyticsRouter);

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
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`Population Health Analytics Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`FHIR R4 metadata available at http://localhost:${PORT}/fhir/metadata`);
});

export default app;
