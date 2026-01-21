import { Router, Request, Response } from 'express';
import { register } from '../lib/metrics.js';

const router = Router();

/**
 * GET /metrics
 * Endpoint for Prometheus to scrape metrics
 * Returns metrics in Prometheus text format
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to collect metrics';
    res.status(500).end(errorMessage);
  }
});

export default router;
