import { Router, Request, Response } from 'express';
import { register } from '../lib/metrics.js';

const router = Router();

/**
 * GET /metrics
 * Endpoint for Prometheus to scrape metrics
 * Returns metrics in Prometheus text format
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).end(error);
  }
});

export default router;
