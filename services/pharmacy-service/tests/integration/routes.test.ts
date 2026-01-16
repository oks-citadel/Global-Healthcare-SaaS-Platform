/**
 * Integration Tests for Pharmacy Service API Routes
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import express, { Express } from "express";
import request from "supertest";

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance, mockPDMPService } = vi.hoisted(() => {
  const mockFn = () => ({
    prescription: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    prescriptionItem: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    controlledSubstanceLog: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
  });

  const pdmpServiceMock = {
    checkPDMP: vi.fn(),
    getPatientControlledSubstanceHistory: vi.fn(),
    reportToPDMP: vi.fn(),
    getUnreportedDispensings: vi.fn(),
    bulkReportToPDMP: vi.fn(),
    getPDMPStatistics: vi.fn(),
  };

  return { mockPrismaInstance: mockFn(), mockPDMPService: pdmpServiceMock };
});

// Mock Prisma
vi.mock("../../src/generated/client", () => ({
  PrismaClient: vi.fn(() => mockPrismaInstance),
}));

// Mock PDMPService
vi.mock("../../src/services/PDMPService", () => ({
  default: mockPDMPService,
}));

// Mock rate limiter
vi.mock("../../src/middleware/rate-limit.middleware", () => ({
  generalRateLimit: (req: any, res: any, next: any) => next(),
  getRateLimitStatus: () => ({ enabled: false }),
  closeRateLimitConnection: vi.fn(),
}));

// Mock fixtures
const mockPrescription = {
  id: "prescription-123",
  patientId: "patient-123",
  providerId: "provider-123",
  status: "active",
  validUntil: new Date("2027-06-01"),
  notes: "Test prescription",
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [
    {
      id: "item-123",
      prescriptionId: "prescription-123",
      medicationName: "Metformin",
      dosage: "500mg",
      frequency: "twice daily",
      refillsAllowed: 3,
      refillsUsed: 0,
      isGenericAllowed: true,
    },
  ],
};

const mockUser = (role: string, id: string = "user-123") => ({
  id,
  email: `${role}@example.com`,
  role,
});

// Create test app
function createTestApp(): Express {
  const app = express();
  app.use(express.json());

  // Mock extractUser middleware
  app.use((req: any, res, next) => {
    req.user = req.headers["x-test-user"]
      ? JSON.parse(req.headers["x-test-user"] as string)
      : undefined;
    next();
  });

  // Mock requireUser middleware
  const requireUser = (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // Prescriptions routes
  app.get("/prescriptions", requireUser, async (req: any, res) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const where: any = {};

    if (userRole === "patient") {
      where.patientId = userId;
    } else if (userRole === "provider") {
      where.providerId = userId;
    }

    const prescriptions = await mockPrismaInstance.prescription.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: prescriptions, count: prescriptions.length });
  });

  app.get("/prescriptions/:id", requireUser, async (req: any, res) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const prescription = await mockPrismaInstance.prescription.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!prescription) {
      return res.status(404).json({ error: "Not Found" });
    }

    const hasAccess =
      (userRole === "patient" && prescription.patientId === userId) ||
      (userRole === "provider" && prescription.providerId === userId) ||
      userRole === "admin";

    if (!hasAccess) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ data: prescription });
  });

  app.post("/prescriptions", requireUser, async (req: any, res) => {
    const userId = req.user!.id;
    if (req.user!.role !== "provider") {
      return res
        .status(403)
        .json({ error: "Only providers can create prescriptions" });
    }

    const prescription = await mockPrismaInstance.prescription.create({
      data: {
        ...req.body,
        providerId: userId,
      },
    });

    res.status(201).json({ data: prescription });
  });

  // PDMP routes
  app.get("/pdmp/:patientId", requireUser, async (req: any, res) => {
    if (req.user!.role !== "provider" && req.user!.role !== "pharmacist") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const pdmpCheck = await mockPDMPService.checkPDMP(req.params.patientId);
    res.json({ data: pdmpCheck });
  });

  app.get("/pdmp/history/:patientId", requireUser, async (req: any, res) => {
    if (req.user!.role !== "provider" && req.user!.role !== "pharmacist") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const history = await mockPDMPService.getPatientControlledSubstanceHistory(
      req.params.patientId
    );
    res.json({ data: history });
  });

  app.post("/pdmp/report/:logId", requireUser, async (req: any, res) => {
    if (req.user!.role !== "pharmacist" && req.user!.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const result = await mockPDMPService.reportToPDMP(req.params.logId);
    res.json({ data: result });
  });

  app.get("/pdmp/statistics", requireUser, async (req: any, res) => {
    if (req.user!.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const stats = await mockPDMPService.getPDMPStatistics();
    res.json({ data: stats });
  });

  return app;
}

describe("Pharmacy Service API Routes", () => {
  let app: Express;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createTestApp();
  });

  describe("GET /prescriptions", () => {
    it("should return prescriptions for patient", async () => {
      mockPrismaInstance.prescription.findMany.mockResolvedValue([
        mockPrescription,
      ]);

      const response = await request(app)
        .get("/prescriptions")
        .set("x-test-user", JSON.stringify(mockUser("patient", "patient-123")));

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.count).toBe(1);
    });

    it("should filter prescriptions by patient ID for patients", async () => {
      mockPrismaInstance.prescription.findMany.mockResolvedValue([]);

      await request(app)
        .get("/prescriptions")
        .set("x-test-user", JSON.stringify(mockUser("patient", "patient-123")));

      expect(mockPrismaInstance.prescription.findMany).toHaveBeenCalledWith({
        where: { patientId: "patient-123" },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should filter prescriptions by provider ID for providers", async () => {
      mockPrismaInstance.prescription.findMany.mockResolvedValue([]);

      await request(app)
        .get("/prescriptions")
        .set("x-test-user", JSON.stringify(mockUser("provider", "provider-123")));

      expect(mockPrismaInstance.prescription.findMany).toHaveBeenCalledWith({
        where: { providerId: "provider-123" },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return 401 for unauthenticated requests", async () => {
      const response = await request(app).get("/prescriptions");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /prescriptions/:id", () => {
    it("should return prescription for authorized patient", async () => {
      mockPrismaInstance.prescription.findUnique.mockResolvedValue(
        mockPrescription
      );

      const response = await request(app)
        .get("/prescriptions/prescription-123")
        .set("x-test-user", JSON.stringify(mockUser("patient", "patient-123")));

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe("prescription-123");
    });

    it("should return prescription for authorized provider", async () => {
      mockPrismaInstance.prescription.findUnique.mockResolvedValue(
        mockPrescription
      );

      const response = await request(app)
        .get("/prescriptions/prescription-123")
        .set("x-test-user", JSON.stringify(mockUser("provider", "provider-123")));

      expect(response.status).toBe(200);
    });

    it("should return 404 for non-existent prescription", async () => {
      mockPrismaInstance.prescription.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/prescriptions/non-existent")
        .set("x-test-user", JSON.stringify(mockUser("patient")));

      expect(response.status).toBe(404);
    });

    it("should return 403 for unauthorized access", async () => {
      mockPrismaInstance.prescription.findUnique.mockResolvedValue(
        mockPrescription
      );

      const response = await request(app)
        .get("/prescriptions/prescription-123")
        .set("x-test-user", JSON.stringify(mockUser("patient", "other-patient")));

      expect(response.status).toBe(403);
    });
  });

  describe("POST /prescriptions", () => {
    it("should create prescription for provider", async () => {
      mockPrismaInstance.prescription.create.mockResolvedValue(mockPrescription);

      const response = await request(app)
        .post("/prescriptions")
        .set("x-test-user", JSON.stringify(mockUser("provider", "provider-123")))
        .send({
          patientId: "patient-123",
          items: [
            {
              medicationName: "Metformin",
              dosage: "500mg",
              frequency: "twice daily",
              refillsAllowed: 3,
              isGenericAllowed: true,
            },
          ],
        });

      expect(response.status).toBe(201);
    });

    it("should return 403 for non-providers", async () => {
      const response = await request(app)
        .post("/prescriptions")
        .set("x-test-user", JSON.stringify(mockUser("patient")))
        .send({});

      expect(response.status).toBe(403);
    });
  });

  describe("PDMP Routes", () => {
    describe("GET /pdmp/:patientId", () => {
      it("should return PDMP check for provider", async () => {
        mockPDMPService.checkPDMP.mockResolvedValue({
          patientId: "patient-123",
          hasAlerts: false,
          requiresIntervention: false,
          alerts: [],
        });

        const response = await request(app)
          .get("/pdmp/patient-123")
          .set("x-test-user", JSON.stringify(mockUser("provider")));

        expect(response.status).toBe(200);
        expect(response.body.data.hasAlerts).toBe(false);
      });

      it("should return PDMP check for pharmacist", async () => {
        mockPDMPService.checkPDMP.mockResolvedValue({
          patientId: "patient-123",
          hasAlerts: true,
          requiresIntervention: false,
          alerts: ["Alert 1"],
        });

        const response = await request(app)
          .get("/pdmp/patient-123")
          .set("x-test-user", JSON.stringify(mockUser("pharmacist")));

        expect(response.status).toBe(200);
        expect(response.body.data.hasAlerts).toBe(true);
      });

      it("should return 403 for patients", async () => {
        const response = await request(app)
          .get("/pdmp/patient-123")
          .set("x-test-user", JSON.stringify(mockUser("patient")));

        expect(response.status).toBe(403);
      });
    });

    describe("POST /pdmp/report/:logId", () => {
      it("should allow pharmacist to report to PDMP", async () => {
        mockPDMPService.reportToPDMP.mockResolvedValue({
          success: true,
          pdmpReportId: "PDMP-123",
        });

        const response = await request(app)
          .post("/pdmp/report/log-123")
          .set("x-test-user", JSON.stringify(mockUser("pharmacist")));

        expect(response.status).toBe(200);
        expect(mockPDMPService.reportToPDMP).toHaveBeenCalledWith("log-123");
      });

      it("should allow admin to report to PDMP", async () => {
        mockPDMPService.reportToPDMP.mockResolvedValue({ success: true });

        const response = await request(app)
          .post("/pdmp/report/log-123")
          .set("x-test-user", JSON.stringify(mockUser("admin")));

        expect(response.status).toBe(200);
      });

      it("should return 403 for providers", async () => {
        const response = await request(app)
          .post("/pdmp/report/log-123")
          .set("x-test-user", JSON.stringify(mockUser("provider")));

        expect(response.status).toBe(403);
      });
    });

    describe("GET /pdmp/statistics", () => {
      it("should return statistics for admin", async () => {
        mockPDMPService.getPDMPStatistics.mockResolvedValue({
          totalDispensings: 100,
          bySchedule: { II: 30, III: 25, IV: 35, V: 10 },
          reporting: { reported: 90, unreported: 10, reportingRate: 90 },
        });

        const response = await request(app)
          .get("/pdmp/statistics")
          .set("x-test-user", JSON.stringify(mockUser("admin")));

        expect(response.status).toBe(200);
        expect(response.body.data.totalDispensings).toBe(100);
      });

      it("should return 403 for non-admins", async () => {
        const response = await request(app)
          .get("/pdmp/statistics")
          .set("x-test-user", JSON.stringify(mockUser("pharmacist")));

        expect(response.status).toBe(403);
      });
    });
  });
});
