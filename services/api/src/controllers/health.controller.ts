import { Request, Response } from 'express';
import { config } from '../config/index.js';

export const healthController = {
  /**
   * GET /version
   * Returns API version information
   */
  getVersion: (_req: Request, res: Response) => {
    res.json({
      version: config.version,
      build: process.env.BUILD_NUMBER || 'dev',
      commit: process.env.GIT_COMMIT || 'unknown',
      environment: config.env,
    });
  },

  /**
   * GET /config/public
   * Returns public configuration for clients
   */
  getPublicConfig: (_req: Request, res: Response) => {
    res.json({
      features: {
        telemedicine: true,
        appointments: true,
        billing: true,
        chat: true,
        videoCall: false, // Phase 2
        mfa: false, // Phase 2
        aiTriage: false, // Phase 2
      },
      supportedRegions: ['us', 'uk', 'ng'],
      supportedCurrencies: ['USD', 'GBP', 'NGN'],
      minAppVersion: {
        ios: '1.0.0',
        android: '1.0.0',
      },
      maintenance: {
        scheduled: false,
        message: null,
      },
    });
  },
};
