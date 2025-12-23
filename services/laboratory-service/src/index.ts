import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import ordersRouter from './routes/orders';
import resultsRouter from './routes/results';
import { extractUser } from './middleware/extractUser';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3005;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(extractUser);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'laboratory-service', timestamp: new Date().toISOString() });
});

app.use('/orders', ordersRouter);
app.use('/results', resultsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found', path: req.path });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.name || 'Internal Server Error', message: err.message || 'An unexpected error occurred' });
});

app.listen(PORT, () => {
  console.log(`Laboratory Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

export default app;
