/**
 * Integration Tests for Laboratory Service API
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock all external dependencies before importing the app
const { mockPrismaInstance, MockPrismaClient } = vi.hoisted(() => {
  const instance = {
    labOrder: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    labTest: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    labResult: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    diagnosticTest: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    sample: {
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

vi.mock('../../src/middleware/extractUser', () => ({
  extractUser: (req: any, res: any, next: any) => {
    req.user = { id: 'user-123', role: 'provider' };
    next();
  },
}));

import app from '../../src/server';

describe('Laboratory Service API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('laboratory-service');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api-docs', () => {
    it('should return API documentation', async () => {
      const response = await request(app).get('/api-docs');

      expect(response.status).toBe(200);
      expect(response.body.service).toBe('laboratory-service');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('Lab Orders API', () => {
    const mockOrder = {
      id: 'order-123',
      orderNumber: 'LAB-1234567890-ABC123',
      patientId: 'patient-123',
      providerId: 'provider-123',
      encounterId: 'encounter-123',
      status: 'pending',
      priority: 'routine',
      clinicalInfo: 'Annual checkup',
      orderedAt: new Date(),
      collectedAt: null,
      completedAt: null,
      reportUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tests: [],
    };

    describe('GET /lab-orders', () => {
      it('should return list of lab orders', async () => {
        mockPrismaInstance.labOrder.findMany.mockResolvedValue([mockOrder]);
        mockPrismaInstance.labOrder.count.mockResolvedValue(1);

        const response = await request(app).get('/lab-orders');

        expect(response.status).toBe(200);
      });

      it('should support filtering by patient ID', async () => {
        mockPrismaInstance.labOrder.findMany.mockResolvedValue([mockOrder]);
        mockPrismaInstance.labOrder.count.mockResolvedValue(1);

        const response = await request(app)
          .get('/lab-orders')
          .query({ patientId: 'patient-123' });

        expect(response.status).toBe(200);
      });

      it('should support filtering by status', async () => {
        mockPrismaInstance.labOrder.findMany.mockResolvedValue([mockOrder]);
        mockPrismaInstance.labOrder.count.mockResolvedValue(1);

        const response = await request(app)
          .get('/lab-orders')
          .query({ status: 'pending' });

        expect(response.status).toBe(200);
      });

      it('should support pagination', async () => {
        mockPrismaInstance.labOrder.findMany.mockResolvedValue([mockOrder]);
        mockPrismaInstance.labOrder.count.mockResolvedValue(100);

        const response = await request(app)
          .get('/lab-orders')
          .query({ page: 2, limit: 10 });

        expect(response.status).toBe(200);
      });
    });

    describe('GET /lab-orders/statistics', () => {
      it('should return order statistics', async () => {
        mockPrismaInstance.labOrder.count
          .mockResolvedValueOnce(100)
          .mockResolvedValueOnce(20)
          .mockResolvedValueOnce(15)
          .mockResolvedValueOnce(10)
          .mockResolvedValueOnce(50)
          .mockResolvedValueOnce(5)
          .mockResolvedValueOnce(8)
          .mockResolvedValueOnce(2);

        const response = await request(app).get('/lab-orders/statistics');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('byStatus');
      });
    });

    describe('GET /lab-orders/:id', () => {
      it('should return order by ID', async () => {
        mockPrismaInstance.labOrder.findUnique.mockResolvedValue(mockOrder);

        const response = await request(app).get('/lab-orders/order-123');

        expect(response.status).toBe(200);
        expect(response.body.id).toBe('order-123');
      });

      it('should return 404 for non-existent order', async () => {
        mockPrismaInstance.labOrder.findUnique.mockResolvedValue(null);

        const response = await request(app).get('/lab-orders/non-existent');

        expect(response.status).toBe(404);
      });
    });

    describe('POST /lab-orders', () => {
      it('should create a new lab order', async () => {
        const orderData = {
          patientId: 'patient-123',
          encounterId: 'encounter-123',
          priority: 'routine',
          clinicalInfo: 'Annual checkup',
          tests: [
            {
              testCode: 'CBC',
              testName: 'Complete Blood Count',
              category: 'hematology',
            },
          ],
        };

        mockPrismaInstance.labOrder.create.mockResolvedValue({
          ...mockOrder,
          ...orderData,
        });

        const response = await request(app)
          .post('/lab-orders')
          .send(orderData);

        expect(response.status).toBe(201);
      });

      it('should return 400 for invalid data', async () => {
        const response = await request(app)
          .post('/lab-orders')
          .send({ invalid: 'data' });

        expect(response.status).toBe(400);
      });
    });

    describe('PATCH /lab-orders/:id', () => {
      it('should update order status', async () => {
        mockPrismaInstance.labOrder.update.mockResolvedValue({
          ...mockOrder,
          status: 'collected',
        });

        const response = await request(app)
          .patch('/lab-orders/order-123')
          .send({ status: 'collected' });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('collected');
      });
    });
  });

  describe('Lab Results API', () => {
    const mockResult = {
      id: 'result-123',
      testId: 'test-123',
      componentCode: 'WBC',
      componentName: 'White Blood Cell Count',
      value: '7500',
      numericValue: 7500,
      unit: 'cells/mcL',
      referenceRange: '4500-11000',
      isAbnormal: false,
      isCritical: false,
      abnormalFlag: null,
      performedBy: 'tech-123',
      resultedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /lab-results/patient/:patientId', () => {
      it('should return results for a patient', async () => {
        mockPrismaInstance.labResult.findMany.mockResolvedValue([mockResult]);

        const response = await request(app).get('/lab-results/patient/patient-123');

        expect(response.status).toBe(200);
      });
    });

    describe('GET /lab-results/abnormal', () => {
      it('should return abnormal results', async () => {
        mockPrismaInstance.labResult.findMany.mockResolvedValue([
          { ...mockResult, isAbnormal: true },
        ]);
        mockPrismaInstance.labResult.count.mockResolvedValue(1);

        const response = await request(app).get('/lab-results/abnormal');

        expect(response.status).toBe(200);
      });
    });

    describe('GET /lab-results/critical', () => {
      it('should return critical results', async () => {
        mockPrismaInstance.labResult.findMany.mockResolvedValue([
          { ...mockResult, isCritical: true },
        ]);
        mockPrismaInstance.labResult.count.mockResolvedValue(1);

        const response = await request(app).get('/lab-results/critical');

        expect(response.status).toBe(200);
      });
    });

    describe('POST /lab-results', () => {
      it('should create a new result', async () => {
        mockPrismaInstance.labResult.create.mockResolvedValue(mockResult);
        mockPrismaInstance.labTest.findUnique.mockResolvedValue({
          id: 'test-123',
          orderId: 'order-123',
        });
        mockPrismaInstance.labOrder.findUnique.mockResolvedValue({
          id: 'order-123',
          providerId: 'provider-123',
          patientId: 'patient-123',
        });

        const resultData = {
          testId: 'test-123',
          componentCode: 'WBC',
          componentName: 'White Blood Cell Count',
          value: '7500',
          numericValue: 7500,
          unit: 'cells/mcL',
          referenceRange: '4500-11000',
        };

        const response = await request(app)
          .post('/lab-results')
          .send(resultData);

        expect(response.status).toBe(201);
      });
    });

    describe('PATCH /lab-results/:id/verify', () => {
      it('should verify a result', async () => {
        mockPrismaInstance.labResult.update.mockResolvedValue({
          ...mockResult,
          verifiedBy: 'verifier-123',
          verifiedAt: new Date(),
        });

        const response = await request(app)
          .patch('/lab-results/result-123/verify')
          .send({ verifiedBy: 'verifier-123' });

        expect(response.status).toBe(200);
        expect(response.body.verifiedBy).toBe('verifier-123');
      });
    });
  });

  describe('Test Catalog API', () => {
    const mockDiagnosticTest = {
      id: 'diagnostic-123',
      code: 'CBC',
      name: 'Complete Blood Count',
      category: 'hematology',
      description: 'Complete blood count with differential',
      sampleType: 'whole_blood',
      turnaroundTime: '24 hours',
      price: 50.0,
      currency: 'USD',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /test-catalog', () => {
      it('should return list of tests', async () => {
        mockPrismaInstance.diagnosticTest.findMany.mockResolvedValue([
          mockDiagnosticTest,
        ]);
        mockPrismaInstance.diagnosticTest.count.mockResolvedValue(1);

        const response = await request(app).get('/test-catalog');

        expect(response.status).toBe(200);
      });

      it('should support filtering by category', async () => {
        mockPrismaInstance.diagnosticTest.findMany.mockResolvedValue([
          mockDiagnosticTest,
        ]);
        mockPrismaInstance.diagnosticTest.count.mockResolvedValue(1);

        const response = await request(app)
          .get('/test-catalog')
          .query({ category: 'hematology' });

        expect(response.status).toBe(200);
      });
    });

    describe('GET /test-catalog/search', () => {
      it('should search tests', async () => {
        mockPrismaInstance.diagnosticTest.findMany.mockResolvedValue([
          mockDiagnosticTest,
        ]);

        const response = await request(app)
          .get('/test-catalog/search')
          .query({ q: 'blood' });

        expect(response.status).toBe(200);
      });
    });

    describe('POST /test-catalog', () => {
      it('should create a new test', async () => {
        mockPrismaInstance.diagnosticTest.create.mockResolvedValue(
          mockDiagnosticTest
        );

        const testData = {
          code: 'CBC',
          name: 'Complete Blood Count',
          category: 'hematology',
          sampleType: 'whole_blood',
          turnaroundTime: '24 hours',
          price: 50.0,
        };

        const response = await request(app)
          .post('/test-catalog')
          .send(testData);

        expect(response.status).toBe(201);
      });
    });
  });

  describe('Samples API', () => {
    const mockSample = {
      id: 'sample-123',
      sampleNumber: 'SMP-1234567890',
      orderId: 'order-123',
      sampleType: 'whole_blood',
      containerType: 'EDTA tube',
      collectedBy: 'phlebotomist-123',
      collectedAt: new Date(),
      status: 'collected',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /samples', () => {
      it('should return list of samples', async () => {
        mockPrismaInstance.sample.findMany.mockResolvedValue([mockSample]);
        mockPrismaInstance.sample.count.mockResolvedValue(1);

        const response = await request(app).get('/samples');

        expect(response.status).toBe(200);
      });
    });

    describe('POST /samples', () => {
      it('should create a new sample', async () => {
        mockPrismaInstance.sample.create.mockResolvedValue(mockSample);

        const sampleData = {
          orderId: 'order-123',
          sampleType: 'whole_blood',
          containerType: 'EDTA tube',
          collectedBy: 'phlebotomist-123',
        };

        const response = await request(app)
          .post('/samples')
          .send(sampleData);

        expect(response.status).toBe(201);
      });
    });

    describe('PATCH /samples/:id', () => {
      it('should update sample status', async () => {
        mockPrismaInstance.sample.update.mockResolvedValue({
          ...mockSample,
          status: 'received',
          receivedAt: new Date(),
        });

        const response = await request(app)
          .patch('/samples/sample-123')
          .send({ status: 'received' });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('received');
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
    });
  });
});
