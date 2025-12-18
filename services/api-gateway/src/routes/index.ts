import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getServiceUrl } from '../config/services';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Telehealth routes
router.use(
  '/telehealth',
  authenticate,
  createProxyMiddleware({
    target: getServiceUrl('telehealth'),
    changeOrigin: true,
    pathRewrite: {
      '^/telehealth': '',
    },
    onProxyReq: (proxyReq, req) => {
      // Forward user information to service
      const user = (req as any).user;
      if (user) {
        proxyReq.setHeader('X-User-Id', user.id);
        proxyReq.setHeader('X-User-Role', user.role);
        proxyReq.setHeader('X-User-Email', user.email);
      }
    },
  })
);

// Mental Health routes
router.use(
  '/mental-health',
  authenticate,
  createProxyMiddleware({
    target: getServiceUrl('mentalHealth'),
    changeOrigin: true,
    pathRewrite: {
      '^/mental-health': '',
    },
    onProxyReq: (proxyReq, req) => {
      const user = (req as any).user;
      if (user) {
        proxyReq.setHeader('X-User-Id', user.id);
        proxyReq.setHeader('X-User-Role', user.role);
        proxyReq.setHeader('X-User-Email', user.email);
      }
    },
  })
);

// Chronic Care routes
router.use(
  '/chronic-care',
  authenticate,
  createProxyMiddleware({
    target: getServiceUrl('chronicCare'),
    changeOrigin: true,
    pathRewrite: {
      '^/chronic-care': '',
    },
    onProxyReq: (proxyReq, req) => {
      const user = (req as any).user;
      if (user) {
        proxyReq.setHeader('X-User-Id', user.id);
        proxyReq.setHeader('X-User-Role', user.role);
        proxyReq.setHeader('X-User-Email', user.email);
      }
    },
  })
);

// Pharmacy routes
router.use(
  '/pharmacy',
  authenticate,
  createProxyMiddleware({
    target: getServiceUrl('pharmacy'),
    changeOrigin: true,
    pathRewrite: {
      '^/pharmacy': '',
    },
    onProxyReq: (proxyReq, req) => {
      const user = (req as any).user;
      if (user) {
        proxyReq.setHeader('X-User-Id', user.id);
        proxyReq.setHeader('X-User-Role', user.role);
        proxyReq.setHeader('X-User-Email', user.email);
      }
    },
  })
);

// Laboratory routes
router.use(
  '/laboratory',
  authenticate,
  createProxyMiddleware({
    target: getServiceUrl('laboratory'),
    changeOrigin: true,
    pathRewrite: {
      '^/laboratory': '',
    },
    onProxyReq: (proxyReq, req) => {
      const user = (req as any).user;
      if (user) {
        proxyReq.setHeader('X-User-Id', user.id);
        proxyReq.setHeader('X-User-Role', user.role);
        proxyReq.setHeader('X-User-Email', user.email);
      }
    },
  })
);

export default router;
