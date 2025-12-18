import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import appointmentsRouter from './routes/appointments';
import visitsRouter from './routes/visits';
import { extractUser } from './middleware/extractUser';
import WebRTCService from './services/webrtc.service';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Extract user from gateway headers
app.use(extractUser);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'telehealth-service',
    timestamp: new Date().toISOString(),
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
});

export default app;
