import { Request, Response, NextFunction } from 'express';
import { planService } from '../services/plan.service.js';

export const planController = {
  /**
   * GET /plans
   * List all available subscription plans
   */
  listPlans: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { region, currency } = req.query;

      const plans = await planService.listPlans({
        region: region as string,
        currency: (currency as string) || 'USD',
      });

      res.json(plans);
    } catch (error) {
      next(error);
    }
  },
};
