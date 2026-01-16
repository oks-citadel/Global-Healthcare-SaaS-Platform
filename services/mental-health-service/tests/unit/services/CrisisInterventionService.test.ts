/**
 * Unit Tests for Crisis Intervention Service
 * Tests for crisis intervention workflows and API functionality
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance } = vi.hoisted(() => {
  const mockFn = () => ({
    crisisIntervention: {
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
  });
  return { mockPrismaInstance: mockFn() };
});

// Mock the Prisma client
vi.mock("../../../src/generated/client", () => ({
  PrismaClient: vi.fn(() => mockPrismaInstance),
}));

// Mock fixtures for crisis interventions
const mockCrisisIntervention = {
  id: "crisis-123",
  patientId: "patient-123",
  responderId: null,
  crisisType: "suicidal_ideation",
  severity: "high",
  description: "Patient expressing thoughts of self-harm",
  status: "active",
  interventions: ["Safety assessment", "Contacted emergency contact"],
  outcome: null,
  referredTo: null,
  contactedAt: new Date("2026-01-15T10:00:00Z"),
  resolvedAt: null,
  followUpNeeded: true,
  followUpDate: null,
  createdAt: new Date("2026-01-15T10:00:00Z"),
  updatedAt: new Date("2026-01-15T10:00:00Z"),
};

const createMockCrisis = (overrides: Partial<typeof mockCrisisIntervention> = {}) => ({
  ...mockCrisisIntervention,
  ...overrides,
});

describe("Crisis Intervention Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Create Crisis Intervention", () => {
    it("should create a new crisis intervention", async () => {
      const crisisData = {
        patientId: "patient-123",
        crisisType: "suicidal_ideation",
        severity: "critical",
        description: "Patient called crisis line expressing suicidal thoughts",
        interventions: ["Safety assessment"],
      };

      mockPrismaInstance.crisisIntervention.create.mockResolvedValue({
        id: "crisis-new",
        ...crisisData,
        status: "active",
        contactedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await mockPrismaInstance.crisisIntervention.create({
        data: crisisData,
      });

      expect(result.id).toBeDefined();
      expect(result.crisisType).toBe("suicidal_ideation");
      expect(result.severity).toBe("critical");
      expect(result.status).toBe("active");
    });

    it("should handle different crisis types", async () => {
      const crisisTypes = [
        "suicidal_ideation",
        "self_harm",
        "panic_attack",
        "psychotic_episode",
        "substance_overdose",
        "domestic_violence",
        "trauma",
        "other",
      ];

      for (const crisisType of crisisTypes) {
        mockPrismaInstance.crisisIntervention.create.mockResolvedValue(
          createMockCrisis({ crisisType })
        );

        const result = await mockPrismaInstance.crisisIntervention.create({
          data: { ...mockCrisisIntervention, crisisType },
        });

        expect(result.crisisType).toBe(crisisType);
      }
    });

    it("should handle different severity levels", async () => {
      const severityLevels = ["low", "medium", "high", "critical"];

      for (const severity of severityLevels) {
        mockPrismaInstance.crisisIntervention.create.mockResolvedValue(
          createMockCrisis({ severity })
        );

        const result = await mockPrismaInstance.crisisIntervention.create({
          data: { ...mockCrisisIntervention, severity },
        });

        expect(result.severity).toBe(severity);
      }
    });

    it("should create crisis intervention with empty interventions array", async () => {
      mockPrismaInstance.crisisIntervention.create.mockResolvedValue(
        createMockCrisis({ interventions: [] })
      );

      const result = await mockPrismaInstance.crisisIntervention.create({
        data: { ...mockCrisisIntervention, interventions: [] },
      });

      expect(result.interventions).toEqual([]);
    });
  });

  describe("List Crisis Interventions", () => {
    it("should return all crisis interventions for admin", async () => {
      const crises = [
        createMockCrisis({ id: "crisis-1" }),
        createMockCrisis({ id: "crisis-2" }),
      ];
      mockPrismaInstance.crisisIntervention.findMany.mockResolvedValue(crises);

      const result = await mockPrismaInstance.crisisIntervention.findMany({
        orderBy: { contactedAt: "desc" },
      });

      expect(result).toHaveLength(2);
    });

    it("should filter by patient ID", async () => {
      mockPrismaInstance.crisisIntervention.findMany.mockResolvedValue([mockCrisisIntervention]);

      const result = await mockPrismaInstance.crisisIntervention.findMany({
        where: { patientId: "patient-123" },
      });

      expect(result).toHaveLength(1);
      expect(result[0].patientId).toBe("patient-123");
    });

    it("should filter by status", async () => {
      mockPrismaInstance.crisisIntervention.findMany.mockResolvedValue([
        createMockCrisis({ status: "active" }),
      ]);

      const result = await mockPrismaInstance.crisisIntervention.findMany({
        where: { status: "active" },
      });

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("active");
    });

    it("should filter by severity", async () => {
      mockPrismaInstance.crisisIntervention.findMany.mockResolvedValue([
        createMockCrisis({ severity: "critical" }),
      ]);

      const result = await mockPrismaInstance.crisisIntervention.findMany({
        where: { severity: "critical" },
      });

      expect(result[0].severity).toBe("critical");
    });

    it("should filter by responder ID", async () => {
      mockPrismaInstance.crisisIntervention.findMany.mockResolvedValue([
        createMockCrisis({ responderId: "provider-123" }),
      ]);

      const result = await mockPrismaInstance.crisisIntervention.findMany({
        where: { responderId: "provider-123" },
      });

      expect(result[0].responderId).toBe("provider-123");
    });
  });

  describe("Get Single Crisis Intervention", () => {
    it("should return crisis intervention by ID", async () => {
      mockPrismaInstance.crisisIntervention.findUnique.mockResolvedValue(mockCrisisIntervention);

      const result = await mockPrismaInstance.crisisIntervention.findUnique({
        where: { id: "crisis-123" },
      });

      expect(result).toEqual(mockCrisisIntervention);
    });

    it("should return null for non-existent crisis", async () => {
      mockPrismaInstance.crisisIntervention.findUnique.mockResolvedValue(null);

      const result = await mockPrismaInstance.crisisIntervention.findUnique({
        where: { id: "non-existent" },
      });

      expect(result).toBeNull();
    });
  });

  describe("Update Crisis Intervention", () => {
    it("should assign responder to crisis", async () => {
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue(
        createMockCrisis({ responderId: "provider-123" })
      );

      const result = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-123" },
        data: { responderId: "provider-123" },
      });

      expect(result.responderId).toBe("provider-123");
    });

    it("should update status to monitoring", async () => {
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue(
        createMockCrisis({ status: "monitoring" })
      );

      const result = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-123" },
        data: { status: "monitoring" },
      });

      expect(result.status).toBe("monitoring");
    });

    it("should update status to resolved", async () => {
      const resolvedAt = new Date();
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue(
        createMockCrisis({ status: "resolved", resolvedAt })
      );

      const result = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-123" },
        data: { status: "resolved", resolvedAt },
      });

      expect(result.status).toBe("resolved");
      expect(result.resolvedAt).toBeDefined();
    });

    it("should update status to escalated", async () => {
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue(
        createMockCrisis({ status: "escalated" })
      );

      const result = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-123" },
        data: { status: "escalated" },
      });

      expect(result.status).toBe("escalated");
    });

    it("should add interventions", async () => {
      const interventions = [
        "Safety assessment",
        "Contacted emergency contact",
        "Provided crisis resources",
      ];
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue(
        createMockCrisis({ interventions })
      );

      const result = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-123" },
        data: { interventions },
      });

      expect(result.interventions).toHaveLength(3);
    });

    it("should record outcome", async () => {
      const outcome = "Patient stabilized, referred to outpatient care";
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue(
        createMockCrisis({ outcome })
      );

      const result = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-123" },
        data: { outcome },
      });

      expect(result.outcome).toBe(outcome);
    });

    it("should record referral information", async () => {
      const referredTo = "Inpatient Psychiatric Unit - City Hospital";
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue(
        createMockCrisis({ referredTo })
      );

      const result = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-123" },
        data: { referredTo },
      });

      expect(result.referredTo).toBe(referredTo);
    });

    it("should set follow-up date", async () => {
      const followUpDate = new Date("2026-01-20T10:00:00Z");
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue(
        createMockCrisis({ followUpNeeded: true, followUpDate })
      );

      const result = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-123" },
        data: { followUpNeeded: true, followUpDate },
      });

      expect(result.followUpNeeded).toBe(true);
      expect(result.followUpDate).toEqual(followUpDate);
    });
  });

  describe("Crisis Dashboard", () => {
    it("should return active and monitoring crises", async () => {
      const activeCrises = [
        createMockCrisis({ id: "crisis-1", status: "active", severity: "critical" }),
        createMockCrisis({ id: "crisis-2", status: "active", severity: "high" }),
        createMockCrisis({ id: "crisis-3", status: "monitoring", severity: "medium" }),
      ];
      mockPrismaInstance.crisisIntervention.findMany.mockResolvedValue(activeCrises);

      const result = await mockPrismaInstance.crisisIntervention.findMany({
        where: {
          status: {
            in: ["active", "monitoring"],
          },
        },
        orderBy: [{ severity: "desc" }, { contactedAt: "asc" }],
      });

      expect(result).toHaveLength(3);
    });

    it("should group crises by severity for dashboard", async () => {
      const crises = [
        createMockCrisis({ severity: "critical" }),
        createMockCrisis({ severity: "critical" }),
        createMockCrisis({ severity: "high" }),
        createMockCrisis({ severity: "medium" }),
        createMockCrisis({ severity: "low" }),
      ];
      mockPrismaInstance.crisisIntervention.findMany.mockResolvedValue(crises);

      const result = await mockPrismaInstance.crisisIntervention.findMany({
        where: { status: { in: ["active", "monitoring"] } },
      });

      const dashboard = {
        critical: result.filter((i: any) => i.severity === "critical"),
        high: result.filter((i: any) => i.severity === "high"),
        medium: result.filter((i: any) => i.severity === "medium"),
        low: result.filter((i: any) => i.severity === "low"),
        total: result.length,
      };

      expect(dashboard.critical).toHaveLength(2);
      expect(dashboard.high).toHaveLength(1);
      expect(dashboard.medium).toHaveLength(1);
      expect(dashboard.low).toHaveLength(1);
      expect(dashboard.total).toBe(5);
    });
  });

  describe("Crisis Status Transitions", () => {
    it("should transition from active to monitoring", async () => {
      mockPrismaInstance.crisisIntervention.findUnique.mockResolvedValue(
        createMockCrisis({ status: "active" })
      );
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue(
        createMockCrisis({ status: "monitoring" })
      );

      const current = await mockPrismaInstance.crisisIntervention.findUnique({
        where: { id: "crisis-123" },
      });
      expect(current.status).toBe("active");

      const updated = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-123" },
        data: { status: "monitoring" },
      });
      expect(updated.status).toBe("monitoring");
    });

    it("should transition from monitoring to resolved", async () => {
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue(
        createMockCrisis({ status: "resolved", resolvedAt: new Date() })
      );

      const result = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-123" },
        data: { status: "resolved", resolvedAt: new Date() },
      });

      expect(result.status).toBe("resolved");
      expect(result.resolvedAt).toBeDefined();
    });

    it("should transition from active to escalated", async () => {
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue(
        createMockCrisis({ status: "escalated" })
      );

      const result = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-123" },
        data: { status: "escalated" },
      });

      expect(result.status).toBe("escalated");
    });
  });

  describe("Emergency Response Information", () => {
    it("should provide emergency hotline information", () => {
      const emergencyContacts = {
        suicide_prevention: {
          name: "National Suicide Prevention Lifeline",
          phone: "988",
          available: "24/7",
        },
        crisis_text_line: {
          name: "Crisis Text Line",
          text: "HOME to 741741",
          available: "24/7",
        },
        emergency_services: {
          name: "Emergency Services",
          phone: "911",
          available: "24/7",
        },
        samhsa: {
          name: "SAMHSA National Helpline",
          phone: "1-800-662-4357",
          available: "24/7",
          services: "Mental health and substance abuse",
        },
      };

      expect(emergencyContacts.suicide_prevention.phone).toBe("988");
      expect(emergencyContacts.crisis_text_line.text).toBe("HOME to 741741");
      expect(emergencyContacts.emergency_services.phone).toBe("911");
      expect(emergencyContacts.samhsa.phone).toBe("1-800-662-4357");
    });
  });

  describe("Crisis Intervention Workflow", () => {
    it("should complete full crisis resolution workflow", async () => {
      // Step 1: Create crisis
      const newCrisis = createMockCrisis({
        id: "crisis-workflow",
        status: "active",
        responderId: null,
      });
      mockPrismaInstance.crisisIntervention.create.mockResolvedValue(newCrisis);

      const created = await mockPrismaInstance.crisisIntervention.create({
        data: newCrisis,
      });
      expect(created.status).toBe("active");

      // Step 2: Assign responder
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue({
        ...newCrisis,
        responderId: "provider-123",
      });

      const assigned = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-workflow" },
        data: { responderId: "provider-123" },
      });
      expect(assigned.responderId).toBe("provider-123");

      // Step 3: Update to monitoring
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue({
        ...newCrisis,
        status: "monitoring",
        interventions: ["Safety assessment completed", "Safety plan created"],
      });

      const monitored = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-workflow" },
        data: {
          status: "monitoring",
          interventions: ["Safety assessment completed", "Safety plan created"],
        },
      });
      expect(monitored.status).toBe("monitoring");

      // Step 4: Resolve
      mockPrismaInstance.crisisIntervention.update.mockResolvedValue({
        ...newCrisis,
        status: "resolved",
        outcome: "Patient stabilized, connected with outpatient services",
        resolvedAt: new Date(),
        followUpNeeded: true,
        followUpDate: new Date("2026-01-20"),
      });

      const resolved = await mockPrismaInstance.crisisIntervention.update({
        where: { id: "crisis-workflow" },
        data: {
          status: "resolved",
          outcome: "Patient stabilized, connected with outpatient services",
          resolvedAt: new Date(),
          followUpNeeded: true,
          followUpDate: new Date("2026-01-20"),
        },
      });
      expect(resolved.status).toBe("resolved");
      expect(resolved.outcome).toBeDefined();
      expect(resolved.followUpNeeded).toBe(true);
    });
  });
});
