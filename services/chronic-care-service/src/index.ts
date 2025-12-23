import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import carePlansRouter from './routes/carePlans';
import devicesRouter from './routes/devices';
import alertsRouter from './routes/alerts';
import { extractUser } from './middleware/extractUser';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(extractUser);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'chronic-care-service', timestamp: new Date().toISOString() });
});

app.use('/care-plans', carePlansRouter);
app.use('/devices', devicesRouter);
app.use('/alerts', alertsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found', path: req.path });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.name || 'Internal Server Error', message: err.message || 'An unexpected error occurred' });
});

app.listen(PORT, () => {
  console.log(`Chronic Care Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

export default app;
