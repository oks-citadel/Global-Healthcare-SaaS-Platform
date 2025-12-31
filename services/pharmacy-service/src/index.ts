import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import prescriptionsRouter from './routes/prescriptions';
import pharmaciesRouter from './routes/pharmacies';
import { extractUser } from './middleware/extractUser';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3004;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health', // Skip health checks
});

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(extractUser);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'pharmacy-service', timestamp: new Date().toISOString() });
});

app.use('/prescriptions', prescriptionsRouter);
app.use('/pharmacies', pharmaciesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found', path: req.path });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.name || 'Internal Server Error', message: err.message || 'An unexpected error occurred' });
});

app.listen(PORT, () => {
  console.log(`Pharmacy Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

export default app;
