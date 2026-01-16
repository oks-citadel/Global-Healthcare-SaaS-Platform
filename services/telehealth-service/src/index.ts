import express, { Application } from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import appointmentsRouter from './routes/appointments';
import visitsRouter from './routes/visits';
import { extractUser } from './middleware/extractUser';
import WebRTCService from './services/webrtc.service';
import { config, logConfig } from './config';
import {
  generalRateLimit,
  getRateLimitStatus,
  closeRateLimitConnection,
} from './middleware/rate-limit.middleware';

// Log validated configuration at startup
logConfig(config);

const app: Application = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
  },
});

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
app.use('/appointments', appointmentsRouter);
app.use('/visits', visitsRouter);

// Initialize WebRTC service
const webrtcService = new WebRTCService(io);

// WebRTC stats endpoint
app.get('/stats', (req, res) => {
  res.json({
    activeRooms: webrtcService.getActiveRoomsCount(),
    timestamp: new Date().toISOString(),
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
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Telehealth Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`WebRTC signaling server active`);
  console.log(`Rate limit status:`, getRateLimitStatus());
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down gracefully...`);

  httpServer.close(async () => {
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
