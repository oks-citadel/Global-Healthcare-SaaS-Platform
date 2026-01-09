import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import prescriptionsRouter from './routes/prescriptions-enhanced';
import pharmaciesRouter from './routes/pharmacies';
import dispenseRouter from './routes/dispense';
import interactionsRouter from './routes/interactions';
import inventoryRouter from './routes/inventory';
import priorAuthRouter from './routes/priorAuth';
import pdmpRouter from './routes/pdmp';
import formularyRouter from './routes/formulary';
import { extractUser } from './middleware/extractUser';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3004;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(extractUser);

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'pharmacy-service', timestamp: new Date().toISOString() });
});

// Core routes
app.use('/prescriptions', prescriptionsRouter);
app.use('/pharmacies', pharmaciesRouter);

// Comprehensive pharmacy routes
app.use('/dispense', dispenseRouter);
app.use('/drug-interactions', interactionsRouter);
app.use('/inventory', inventoryRouter);
app.use('/prior-auth', priorAuthRouter);
app.use('/controlled-substances', pdmpRouter);
app.use('/formulary', formularyRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found', path: req.path });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.name || 'Internal Server Error', message: err.message || 'An unexpected error occurred' });
});

app.listen(PORT, () => {
  console.log(`Pharmacy Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log('Available endpoints:');
  console.log('  - /prescriptions - Prescription management');
  console.log('  - /pharmacies - Pharmacy information');
  console.log('  - /dispense - Medication dispensing');
  console.log('  - /drug-interactions - Drug interaction & allergy checking');
  console.log('  - /inventory - Inventory management');
  console.log('  - /prior-auth - Prior authorization');
  console.log('  - /controlled-substances - PDMP & controlled substances');
  console.log('  - /formulary - Drug formulary');
});

export default app;
