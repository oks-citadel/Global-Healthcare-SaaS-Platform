import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rate-limit.middleware.js';

const router = Router();

/**
 * Public routes (with rate limiting)
 */
router.post('/register', authLimiter, authController.register.bind(authController));
router.post('/login', authLimiter, authController.login.bind(authController));
router.post('/refresh', authController.refresh.bind(authController));
router.post('/forgot-password', passwordResetLimiter, authController.forgotPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));
router.post('/verify-email', authController.verifyEmail.bind(authController));
router.post('/resend-verification', authLimiter, authController.resendVerification.bind(authController));

/**
 * Protected routes (require authentication)
 */
router.post('/logout', authenticate, authController.logout.bind(authController));
router.get('/me', authenticate, authController.me.bind(authController));

export default router;
