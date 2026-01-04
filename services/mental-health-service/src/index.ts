import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sessionsRouter from './routes/sessions';
import assessmentsRouter from './routes/assessments';
import crisisRouter from './routes/crisis';
import { extractUser } from './middleware/extractUser';
import { config, logConfig } from './config';
import {
  generalRateLimit,
  getRateLimitStatus,
  closeRateLimitConnection,
} from './middleware/rate-limit.middleware';

// Log validated configuration at startup
logConfig(config);

const app: express.Application = express();
const PORT = config.port;

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Extract user from gateway headers
app.use(extractUser);

// Apply distributed rate limiting with Redis support
app.use(generalRateLimit);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: config.serviceName,
    timestamp: new Date().toISOString(),
    rateLimit: getRateLimitStatus(),
  });
});

// Routes
app.use('/sessions', sessionsRouter);
app.use('/assessments', assessmentsRouter);
app.use('/crisis', crisisRouter);

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
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Mental Health Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`Rate limit status:`, getRateLimitStatus());
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down gracefully...`);

  server.close(async () => {
    console.log('HTTP server closed');
    await closeRateLimitConnection();
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
