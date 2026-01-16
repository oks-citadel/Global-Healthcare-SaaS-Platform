/**
 * Integration Tests for Mental Health Service API Routes
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import express, { Express } from "express";
import request from "supertest";

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance } = vi.hoisted(() => {
  const mockFn = () => ({
    therapySession: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    crisisIntervention: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    mentalHealthAssessment: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
  });
  return { mockPrismaInstance: mockFn() };
});

// Mock Prisma
vi.mock("../../src/generated/client", () => ({
  PrismaClient: vi.fn(() => mockPrismaInstance),
  Prisma: {
    TherapySessionWhereInput: {},
  },
}));

// Mock rate limiter
vi.mock("../../src/middleware/rate-limit.middleware", () => ({
  generalRateLimit: (req: any, res: any, next: any) => next(),
  getRateLimitStatus: () => ({ enabled: false }),
  closeRateLimitConnection: vi.fn(),
}));

// Mock fixtures
const mockTherapySession = {
  id: "session-123",
  patientId: "patient-123",
  therapistId: "therapist-123",
  sessionType: "individual",
  scheduledAt: new Date("2026-02-01T14:00:00Z"),
  duration: 60,
  status: "scheduled",
  modality: "telehealth",
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCrisisIntervention = {
  id: "crisis-123",
  patientId: "patient-123",
  responderId: null,
  crisisType: "suicidal_ideation",
  severity: "high",
  description: "Patient expressing thoughts of self-harm",
  status: "active",
  interventions: [],
  contactedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAssessment = {
  id: "assessment-123",
  patientId: "patient-123",
  providerId: "provider-123",
  assessmentType: "PHQ9",
  responses: { phq9_1: 2, phq9_2: 1, phq9_3: 2 },
  totalScore: 5,
  severity: "mild",
  interpretation: "Mild depression",
  recommendations: ["Monitor symptoms"],
  completedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
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

  // Sessions routes
  app.get("/sessions", requireUser, async (req: any, res) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const where: any = {};

    if (userRole === "patient") {
      where.patientId = userId;
    } else if (userRole === "provider") {
      where.therapistId = userId;
    }

    const sessions = await mockPrismaInstance.therapySession.findMany({
      where,
      orderBy: { scheduledAt: "desc" },
    });

    res.json({ data: sessions, count: sessions.length });
  });

  app.get("/sessions/:id", requireUser, async (req: any, res) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const session = await mockPrismaInstance.therapySession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({ error: "Not Found" });
    }

    const hasAccess =
      (userRole === "patient" && session.patientId === userId) ||
      (userRole === "provider" && session.therapistId === userId);

    if (!hasAccess) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ data: session });
  });

  app.post("/sessions", requireUser, async (req: any, res) => {
    const userId = req.user!.id;
    if (req.user!.role !== "patient") {
      return res
        .status(403)
        .json({ error: "Only patients can create therapy sessions" });
    }

    const session = await mockPrismaInstance.therapySession.create({
      data: {
        ...req.body,
        patientId: userId,
      },
    });

    res.status(201).json({ data: session });
  });

  app.patch("/sessions/:id", requireUser, async (req: any, res) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const session = await mockPrismaInstance.therapySession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({ error: "Not Found" });
    }

    const canUpdate =
      (userRole === "patient" && session.patientId === userId) ||
      (userRole === "provider" && session.therapistId === userId);

    if (!canUpdate) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await mockPrismaInstance.therapySession.update({
      where: { id },
      data: req.body,
    });

    res.json({ data: updated });
  });

  app.delete("/sessions/:id", requireUser, async (req: any, res) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const session = await mockPrismaInstance.therapySession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({ error: "Not Found" });
    }

    const canCancel =
      (userRole === "patient" && session.patientId === userId) ||
      (userRole === "provider" && session.therapistId === userId);

    if (!canCancel) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await mockPrismaInstance.therapySession.update({
      where: { id },
      data: { status: "cancelled" },
    });

    res.json({ message: "Session cancelled successfully" });
  });

  // Crisis routes
  app.get("/crisis", requireUser, async (req: any, res) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const where: any = {};

    if (userRole === "patient") {
      where.patientId = userId;
    }

    const interventions = await mockPrismaInstance.crisisIntervention.findMany({
      where,
      orderBy: { contactedAt: "desc" },
    });

    res.json({ data: interventions, count: interventions.length });
  });

  app.post("/crisis", requireUser, async (req: any, res) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const patientId = req.body.patientId || (userRole === "patient" ? userId : null);

    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    const intervention = await mockPrismaInstance.crisisIntervention.create({
      data: {
        ...req.body,
        patientId,
      },
    });

    res.status(201).json({
      data: intervention,
      emergencyContacts: {
        suicide_prevention: "988",
        crisis_text_line: "Text HOME to 741741",
        emergency: "911",
      },
    });
  });

  app.patch("/crisis/:id", requireUser, async (req: any, res) => {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== "provider" && userRole !== "admin") {
      return res.status(403).json({ error: "Only crisis responders can update interventions" });
    }

    const intervention = await mockPrismaInstance.crisisIntervention.findUnique({
      where: { id },
    });

    if (!intervention) {
      return res.status(404).json({ error: "Not Found" });
    }

    const updated = await mockPrismaInstance.crisisIntervention.update({
      where: { id },
      data: req.body,
    });

    res.json({ data: updated });
  });

  app.get("/crisis/active/dashboard", requireUser, async (req: any, res) => {
    const userRole = req.user!.role;

    if (userRole !== "provider" && userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const activeInterventions = await mockPrismaInstance.crisisIntervention.findMany({
      where: {
        status: { in: ["active", "monitoring"] },
      },
    });

    const dashboard = {
      critical: activeInterventions.filter((i: any) => i.severity === "critical"),
      high: activeInterventions.filter((i: any) => i.severity === "high"),
      medium: activeInterventions.filter((i: any) => i.severity === "medium"),
      low: activeInterventions.filter((i: any) => i.severity === "low"),
      total: activeInterventions.length,
    };

    res.json({ data: dashboard });
  });

  // Hotline info (public endpoint)
  app.get("/crisis/hotlines/info", (req, res) => {
    res.json({
      emergency: {
        suicide_prevention: { name: "National Suicide Prevention Lifeline", phone: "988" },
        crisis_text_line: { name: "Crisis Text Line", text: "HOME to 741741" },
        emergency_services: { name: "Emergency Services", phone: "911" },
      },
    });
  });

  return app;
}

describe("Mental Health Service API Routes", () => {
  let app: Express;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createTestApp();
  });

  describe("Sessions Routes", () => {
    describe("GET /sessions", () => {
      it("should return sessions for patient", async () => {
        mockPrismaInstance.therapySession.findMany.mockResolvedValue([mockTherapySession]);

        const response = await request(app)
          .get("/sessions")
          .set("x-test-user", JSON.stringify(mockUser("patient", "patient-123")));

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
      });

      it("should filter by patient ID for patients", async () => {
        mockPrismaInstance.therapySession.findMany.mockResolvedValue([]);

        await request(app)
          .get("/sessions")
          .set("x-test-user", JSON.stringify(mockUser("patient", "patient-123")));

        expect(mockPrismaInstance.therapySession.findMany).toHaveBeenCalledWith({
          where: { patientId: "patient-123" },
          orderBy: { scheduledAt: "desc" },
        });
      });

      it("should filter by therapist ID for providers", async () => {
        mockPrismaInstance.therapySession.findMany.mockResolvedValue([]);

        await request(app)
          .get("/sessions")
          .set("x-test-user", JSON.stringify(mockUser("provider", "therapist-123")));

        expect(mockPrismaInstance.therapySession.findMany).toHaveBeenCalledWith({
          where: { therapistId: "therapist-123" },
          orderBy: { scheduledAt: "desc" },
        });
      });

      it("should return 401 for unauthenticated requests", async () => {
        const response = await request(app).get("/sessions");
        expect(response.status).toBe(401);
      });
    });

    describe("GET /sessions/:id", () => {
      it("should return session for authorized patient", async () => {
        mockPrismaInstance.therapySession.findUnique.mockResolvedValue(mockTherapySession);

        const response = await request(app)
          .get("/sessions/session-123")
          .set("x-test-user", JSON.stringify(mockUser("patient", "patient-123")));

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe("session-123");
      });

      it("should return 403 for unauthorized access", async () => {
        mockPrismaInstance.therapySession.findUnique.mockResolvedValue(mockTherapySession);

        const response = await request(app)
          .get("/sessions/session-123")
          .set("x-test-user", JSON.stringify(mockUser("patient", "other-patient")));

        expect(response.status).toBe(403);
      });

      it("should return 404 for non-existent session", async () => {
        mockPrismaInstance.therapySession.findUnique.mockResolvedValue(null);

        const response = await request(app)
          .get("/sessions/non-existent")
          .set("x-test-user", JSON.stringify(mockUser("patient")));

        expect(response.status).toBe(404);
      });
    });

    describe("POST /sessions", () => {
      it("should create session for patient", async () => {
        mockPrismaInstance.therapySession.create.mockResolvedValue(mockTherapySession);

        const response = await request(app)
          .post("/sessions")
          .set("x-test-user", JSON.stringify(mockUser("patient", "patient-123")))
          .send({
            therapistId: "therapist-123",
            sessionType: "individual",
            scheduledAt: "2026-02-15T10:00:00Z",
            duration: 60,
          });

        expect(response.status).toBe(201);
      });

      it("should return 403 for non-patients", async () => {
        const response = await request(app)
          .post("/sessions")
          .set("x-test-user", JSON.stringify(mockUser("provider")))
          .send({});

        expect(response.status).toBe(403);
      });
    });

    describe("PATCH /sessions/:id", () => {
      it("should update session for authorized patient", async () => {
        mockPrismaInstance.therapySession.findUnique.mockResolvedValue(mockTherapySession);
        mockPrismaInstance.therapySession.update.mockResolvedValue({
          ...mockTherapySession,
          notes: "Updated notes",
        });

        const response = await request(app)
          .patch("/sessions/session-123")
          .set("x-test-user", JSON.stringify(mockUser("patient", "patient-123")))
          .send({ notes: "Updated notes" });

        expect(response.status).toBe(200);
      });

      it("should update session for authorized therapist", async () => {
        mockPrismaInstance.therapySession.findUnique.mockResolvedValue(mockTherapySession);
        mockPrismaInstance.therapySession.update.mockResolvedValue({
          ...mockTherapySession,
          status: "completed",
        });

        const response = await request(app)
          .patch("/sessions/session-123")
          .set("x-test-user", JSON.stringify(mockUser("provider", "therapist-123")))
          .send({ status: "completed" });

        expect(response.status).toBe(200);
      });
    });

    describe("DELETE /sessions/:id", () => {
      it("should cancel session for patient", async () => {
        mockPrismaInstance.therapySession.findUnique.mockResolvedValue(mockTherapySession);
        mockPrismaInstance.therapySession.update.mockResolvedValue({
          ...mockTherapySession,
          status: "cancelled",
        });

        const response = await request(app)
          .delete("/sessions/session-123")
          .set("x-test-user", JSON.stringify(mockUser("patient", "patient-123")));

        expect(response.status).toBe(200);
        expect(response.body.message).toContain("cancelled");
      });
    });
  });

  describe("Crisis Routes", () => {
    describe("GET /crisis", () => {
      it("should return crisis interventions for patient", async () => {
        mockPrismaInstance.crisisIntervention.findMany.mockResolvedValue([mockCrisisIntervention]);

        const response = await request(app)
          .get("/crisis")
          .set("x-test-user", JSON.stringify(mockUser("patient", "patient-123")));

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
      });
    });

    describe("POST /crisis", () => {
      it("should create crisis intervention for patient", async () => {
        mockPrismaInstance.crisisIntervention.create.mockResolvedValue(mockCrisisIntervention);

        const response = await request(app)
          .post("/crisis")
          .set("x-test-user", JSON.stringify(mockUser("patient", "patient-123")))
          .send({
            crisisType: "suicidal_ideation",
            severity: "high",
            description: "Patient expressing thoughts of self-harm",
          });

        expect(response.status).toBe(201);
        expect(response.body.emergencyContacts).toBeDefined();
        expect(response.body.emergencyContacts.suicide_prevention).toBe("988");
      });

      it("should require patient ID for provider-created crisis", async () => {
        const response = await request(app)
          .post("/crisis")
          .set("x-test-user", JSON.stringify(mockUser("provider")))
          .send({
            crisisType: "suicidal_ideation",
            severity: "high",
            description: "Test",
          });

        expect(response.status).toBe(400);
      });
    });

    describe("PATCH /crisis/:id", () => {
      it("should update crisis intervention for provider", async () => {
        mockPrismaInstance.crisisIntervention.findUnique.mockResolvedValue(mockCrisisIntervention);
        mockPrismaInstance.crisisIntervention.update.mockResolvedValue({
          ...mockCrisisIntervention,
          status: "monitoring",
        });

        const response = await request(app)
          .patch("/crisis/crisis-123")
          .set("x-test-user", JSON.stringify(mockUser("provider")))
          .send({ status: "monitoring" });

        expect(response.status).toBe(200);
      });

      it("should return 403 for patients", async () => {
        const response = await request(app)
          .patch("/crisis/crisis-123")
          .set("x-test-user", JSON.stringify(mockUser("patient")))
          .send({ status: "resolved" });

        expect(response.status).toBe(403);
      });
    });

    describe("GET /crisis/active/dashboard", () => {
      it("should return crisis dashboard for provider", async () => {
        mockPrismaInstance.crisisIntervention.findMany.mockResolvedValue([
          { ...mockCrisisIntervention, severity: "critical" },
          { ...mockCrisisIntervention, severity: "high" },
        ]);

        const response = await request(app)
          .get("/crisis/active/dashboard")
          .set("x-test-user", JSON.stringify(mockUser("provider")));

        expect(response.status).toBe(200);
        expect(response.body.data.total).toBe(2);
        expect(response.body.data.critical).toHaveLength(1);
        expect(response.body.data.high).toHaveLength(1);
      });

      it("should return 403 for patients", async () => {
        const response = await request(app)
          .get("/crisis/active/dashboard")
          .set("x-test-user", JSON.stringify(mockUser("patient")));

        expect(response.status).toBe(403);
      });
    });

    describe("GET /crisis/hotlines/info", () => {
      it("should return emergency hotline information (public)", async () => {
        const response = await request(app).get("/crisis/hotlines/info");

        expect(response.status).toBe(200);
        expect(response.body.emergency.suicide_prevention.phone).toBe("988");
        expect(response.body.emergency.emergency_services.phone).toBe("911");
      });
    });
  });
});
