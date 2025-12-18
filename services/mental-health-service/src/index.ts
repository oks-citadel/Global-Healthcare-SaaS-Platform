import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import sessionsRouter from './routes/sessions';
import assessmentsRouter from './routes/assessments';
import crisisRouter from './routes/crisis';
import { extractUser } from './middleware/extractUser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

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
    service: 'mental-health-service',
    timestamp: new Date().toISOString(),
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
app.listen(PORT, () => {
  console.log(`Mental Health Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

export default app;
