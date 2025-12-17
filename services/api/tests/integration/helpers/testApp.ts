import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { routes } from '../../../src/routes/index.js';
import { errorHandler } from '../../../src/middleware/error.middleware.js';
import { authService } from '../../../src/services/auth.service.js';

/**
 * Create a test Express application instance
 */
export function createTestApp() {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/v1', routes);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
  });

  // Error handling
  app.use(errorHandler);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.path} not found`,
    });
  });

  return app;
}

/**
 * Create a test user and return authentication tokens
 */
export async function createTestUser(
  role: 'patient' | 'provider' | 'admin' = 'patient'
) {
  const email = `test-${role}-${Date.now()}@example.com`;
  const password = 'TestPassword123!';

  const result = await authService.register({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
    role,
  });

  return {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    email,
    password,
  };
}

/**
 * Get authorization header for a test user
 */
export function getAuthHeader(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}
