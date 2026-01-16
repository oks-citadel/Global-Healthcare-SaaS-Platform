import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import winston from 'winston';
import ordersRouter from './routes/orders';
import resultsRouter from './routes/results';
import { extractUser } from './middleware/extractUser';
import { config, logConfig } from './config';
import {
  generalRateLimit,
  getRateLimitStatus,
  closeRateLimitConnection,
} from './middleware/rate-limit.middleware';

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

// Log validated configuration at startup
logConfig(config);

const app: express.Application = express();
const PORT = config.port;

app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: config.cors.credentials }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(extractUser);

// Apply distributed rate limiting with Redis support
app.use(generalRateLimit);

app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: config.serviceName,
    timestamp: new Date().toISOString(),
    rateLimit: getRateLimitStatus(),
  });
});

app.use('/orders', ordersRouter);
app.use('/results', resultsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found', path: req.path });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({ error: err.name || 'Internal Server Error', message: err.message || 'An unexpected error occurred' });
});

const server = app.listen(PORT, () => {
  logger.info(`Laboratory Service running on port ${PORT}`);
  logger.info(`Health check available at http://localhost:${PORT}/health`);
  logger.info('Rate limit status:', getRateLimitStatus());
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully...`);

  server.close(async () => {
    logger.info('HTTP server closed');
    await closeRateLimitConnection();
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
