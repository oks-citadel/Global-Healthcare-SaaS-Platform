import { Request, Response, NextFunction } from 'express';
import { subscriptionService } from '../services/subscription.service.js';
import { z } from 'zod';

const CreateSubscriptionSchema = z.object({
  planId: z.string(),
  paymentMethodId: z.string(),
  couponCode: z.string().optional(),
});

export const subscriptionController = {
  /**
   * POST /subscriptions
   * Create a new subscription
   */
  createSubscription: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const input = CreateSubscriptionSchema.parse(req.body);

      const subscription = await subscriptionService.createSubscription(userId, input);
      res.status(201).json(subscription);
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /subscriptions/:id
   * Cancel a subscription
   */
  cancelSubscription: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      await subscriptionService.cancelSubscription(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /billing/webhook
   * Handle Stripe webhooks
   */
  handleWebhook: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers['stripe-signature'] as string;

      await subscriptionService.handleWebhook(req.body, signature);
      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  },
};
