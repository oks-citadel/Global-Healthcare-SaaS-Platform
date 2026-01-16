/**
 * Integration Tests for Imaging Service API
 */

import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock all external dependencies before importing the app
const { mockPrismaInstance, MockPrismaClient } = vi.hoisted(() => {
  const instance = {
    imagingOrder: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    study: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    image: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    radiologyReport: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    criticalFinding: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
  };

  function MockPrismaClient() {
    return instance;
  }

  return { mockPrismaInstance: instance, MockPrismaClient };
});

vi.mock('../../src/generated/client', () => ({
  PrismaClient: MockPrismaClient,
}));

vi.mock('../../src/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('../../src/utils/s3Storage', () => ({
  default: {
    uploadImage: vi.fn(),
    deleteImage: vi.fn(),
    generatePresignedUrl: vi.fn().mockResolvedValue('https://signed-url.com'),
  },
}));

vi.mock('../../src/middleware/auth', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { id: 'user-123', role: 'provider' };
    next();
  },
  authorize: (...roles: string[]) => (req: any, res: any, next: any) => next(),
}));

vi.mock('../../src/middleware/rate-limit.middleware', () => ({
  generalRateLimit: (req: any, res: any, next: any) => next(),
  uploadRateLimit: (req: any, res: any, next: any) => next(),
  searchRateLimit: (req: any, res: any, next: any) => next(),
  getRateLimitStatus: () => ({ remaining: 100, limit: 100, reset: Date.now() }),
}));

import app from '../../src/app';

describe('Imaging Service API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('imaging-service');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /', () => {
    it('should return service info', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body.service).toBe('Imaging Service');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('Imaging Orders API', () => {
    const mockOrder = {
      id: 'order-123',
      orderNumber: 'ORD-2024-001',
      patientId: 'patient-123',
      orderingProviderId: 'provider-123',
      modality: 'CT',
      bodyPart: 'CHEST',
      priority: 'ROUTINE',
      status: 'SCHEDULED',
      clinicalHistory: 'Chest pain',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /api/imaging-orders', () => {
      it('should return list of imaging orders', async () => {
        mockPrismaInstance.imagingOrder.findMany.mockResolvedValue([mockOrder]);
        mockPrismaInstance.imagingOrder.count.mockResolvedValue(1);

        const response = await request(app).get('/api/imaging-orders');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.orders || response.body)).toBe(true);
      });

      it('should support pagination', async () => {
        mockPrismaInstance.imagingOrder.findMany.mockResolvedValue([mockOrder]);
        mockPrismaInstance.imagingOrder.count.mockResolvedValue(100);

        const response = await request(app)
          .get('/api/imaging-orders')
          .query({ page: 2, limit: 10 });

        expect(response.status).toBe(200);
      });
    });

    describe('GET /api/imaging-orders/:id', () => {
      it('should return order by ID', async () => {
        mockPrismaInstance.imagingOrder.findUnique.mockResolvedValue(mockOrder);

        const response = await request(app).get('/api/imaging-orders/order-123');

        expect(response.status).toBe(200);
        expect(response.body.id).toBe('order-123');
      });

      it('should return 404 for non-existent order', async () => {
        mockPrismaInstance.imagingOrder.findUnique.mockResolvedValue(null);

        const response = await request(app).get('/api/imaging-orders/non-existent');

        expect(response.status).toBe(404);
      });
    });

    describe('POST /api/imaging-orders', () => {
      it('should create a new imaging order', async () => {
        const orderData = {
          patientId: 'patient-123',
          providerId: 'provider-123',
          facilityId: 'facility-123',
          modality: 'CT',
          bodyPart: 'CHEST',
          clinicalIndication: 'Chest pain',
          requestedBy: 'provider-123',
        };

        mockPrismaInstance.imagingOrder.create.mockResolvedValue({
          ...mockOrder,
          ...orderData,
        });

        const response = await request(app)
          .post('/api/imaging-orders')
          .send(orderData);

        expect(response.status).toBe(201);
        expect(response.body.patientId).toBe('patient-123');
      });

      it('should return 400 for invalid data', async () => {
        const response = await request(app)
          .post('/api/imaging-orders')
          .send({ invalid: 'data' });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('Studies API', () => {
    const mockStudy = {
      id: 'study-123',
      studyInstanceUid: '1.2.3.4.5.6',
      accessionNumber: 'ACC-2024-001',
      orderId: 'order-123',
      patientId: 'patient-123',
      modality: 'CT',
      bodyPart: 'CHEST',
      status: 'IN_PROGRESS',
      studyDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /api/studies', () => {
      it('should return list of studies', async () => {
        mockPrismaInstance.study.findMany.mockResolvedValue([mockStudy]);
        mockPrismaInstance.study.count.mockResolvedValue(1);

        const response = await request(app).get('/api/studies');

        expect(response.status).toBe(200);
      });
    });

    describe('GET /api/studies/:id', () => {
      it('should return study by ID', async () => {
        mockPrismaInstance.study.findUnique.mockResolvedValue(mockStudy);

        const response = await request(app).get('/api/studies/study-123');

        expect(response.status).toBe(200);
        expect(response.body.id).toBe('study-123');
      });

      it('should return 404 for non-existent study', async () => {
        mockPrismaInstance.study.findUnique.mockResolvedValue(null);

        const response = await request(app).get('/api/studies/non-existent');

        expect(response.status).toBe(404);
      });
    });
  });

  describe('Reports API', () => {
    const mockReport = {
      id: 'report-123',
      reportNumber: 'RPT-2024-001',
      studyId: 'study-123',
      radiologistId: 'radiologist-123',
      radiologistName: 'Dr. Smith',
      findings: 'Normal findings',
      impression: 'No abnormalities',
      status: 'PRELIMINARY',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /api/reports', () => {
      it('should return list of reports', async () => {
        mockPrismaInstance.radiologyReport.findMany.mockResolvedValue([mockReport]);
        mockPrismaInstance.radiologyReport.count.mockResolvedValue(1);

        const response = await request(app).get('/api/reports');

        expect(response.status).toBe(200);
      });
    });

    describe('GET /api/reports/:id', () => {
      it('should return report by ID', async () => {
        mockPrismaInstance.radiologyReport.findUnique.mockResolvedValue(mockReport);

        const response = await request(app).get('/api/reports/report-123');

        expect(response.status).toBe(200);
        expect(response.body.id).toBe('report-123');
      });
    });
  });

  describe('Critical Findings API', () => {
    const mockFinding = {
      id: 'finding-123',
      studyId: 'study-123',
      finding: 'Critical finding detected',
      severity: 'CRITICAL',
      category: 'pulmonary',
      reportedBy: 'Dr. Smith',
      notifiedTo: ['provider-123'],
      acknowledgedBy: null,
      acknowledgedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /api/critical-findings', () => {
      it('should return list of critical findings', async () => {
        mockPrismaInstance.criticalFinding.findMany.mockResolvedValue([mockFinding]);
        mockPrismaInstance.criticalFinding.count.mockResolvedValue(1);

        const response = await request(app).get('/api/critical-findings');

        expect(response.status).toBe(200);
      });
    });

    describe('GET /api/critical-findings/:id', () => {
      it('should return critical finding by ID', async () => {
        mockPrismaInstance.criticalFinding.findUnique.mockResolvedValue({
          ...mockFinding,
          study: { id: 'study-123', accessionNumber: 'ACC-123' },
        });

        const response = await request(app).get('/api/critical-findings/finding-123');

        expect(response.status).toBe(200);
        expect(response.body.id).toBe('finding-123');
      });
    });

    describe('POST /api/critical-findings/:id/acknowledge', () => {
      it('should acknowledge a critical finding', async () => {
        mockPrismaInstance.criticalFinding.update.mockResolvedValue({
          ...mockFinding,
          acknowledgedBy: 'Dr. Wilson',
          acknowledgedAt: new Date(),
        });

        const response = await request(app)
          .post('/api/critical-findings/finding-123/acknowledge')
          .send({ acknowledgedBy: 'Dr. Wilson' });

        expect(response.status).toBe(200);
        expect(response.body.acknowledgedBy).toBe('Dr. Wilson');
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Route not found');
    });
  });
});
