import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

/**
 * Dashboard Controller
 *
 * Provides dashboard statistics for the frontend
 */
export const dashboardController = {
  /**
   * Get dashboard statistics
   */
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      logger.info({ userId }, 'Fetching dashboard stats');

      // Return demo stats
      const stats = {
        upcomingAppointments: 3,
        totalAppointments: 12,
        pendingResults: 1,
        unreadMessages: 2,
        lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextAppointment: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      };

      res.json(stats);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get quick actions for dashboard
   */
  async getQuickActions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actions = [
        { id: 'book', label: 'Book Appointment', icon: 'calendar', href: '/appointments/book' },
        { id: 'prescriptions', label: 'View Prescriptions', icon: 'pill', href: '/prescriptions' },
        { id: 'records', label: 'Medical Records', icon: 'folder', href: '/records' },
        { id: 'messages', label: 'Messages', icon: 'message', href: '/messages' },
      ];

      res.json(actions);
    } catch (error) {
      next(error);
    }
  },
};
