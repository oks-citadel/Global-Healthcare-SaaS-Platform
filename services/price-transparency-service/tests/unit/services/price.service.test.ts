/**
 * Unit Tests for Price Service
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrismaClient, mockDecimal } from "../../helpers/mocks";
import {
  mockChargemasterItem,
  mockShoppableService,
  mockPayerContract,
  mockPayerContractRate,
  mockPriceEstimate,
  mockPriceLookupParams,
} from "../../helpers/fixtures";

// Mock Prisma
vi.mock("../../../src/generated/client", () => ({
  PrismaClient: vi.fn(() => mockPrismaClient()),
  Prisma: {
    Decimal: (value: number) => mockDecimal(value),
  },
}));

// Import after mocking
import { PriceService } from "../../../src/services/price.service";

describe("PriceService", () => {
  let service: PriceService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PriceService();
    mockPrisma = (service as any).prisma;
  });

  describe("lookupPrice", () => {
    it("should lookup price for a service code", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(
        mockChargemasterItem,
      );

      const result = await service.lookupPrice(mockPriceLookupParams);

      expect(result).toHaveProperty("chargemasterItemId");
      expect(result).toHaveProperty("code");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("grossCharge");
      expect(result).toHaveProperty("discountedCashPrice");
    });

    it("should include payer-specific rates if payerId provided", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue({
        ...mockChargemasterItem,
        payerRates: [
          {
            ...mockPayerContractRate,
            payerContract: mockPayerContract,
          },
        ],
      });

      const result = await service.lookupPrice({
        ...mockPriceLookupParams,
        payerId: "payer-001",
      });

      expect(result!.payerSpecificRates).toBeDefined();
      expect(result!.payerSpecificRates.length).toBeGreaterThan(0);
    });

    it("should return null for unknown service code", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(null);

      const result = await service.lookupPrice({
        ...mockPriceLookupParams,
        serviceCode: "UNKNOWN",
      });

      expect(result).toBeNull();
    });

    it("should search by CPT, HCPCS, or internal code", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(
        mockChargemasterItem,
      );

      await service.lookupPrice(mockPriceLookupParams);

      expect(mockPrisma.chargemasterItem.findFirst).toHaveBeenCalledWith({
        where: expect.objectContaining({
          OR: [
            { cptCode: mockPriceLookupParams.serviceCode },
            { hcpcsCode: mockPriceLookupParams.serviceCode },
            { code: mockPriceLookupParams.serviceCode },
          ],
        }),
        include: expect.any(Object),
      });
    });
  });

  describe("getShoppableServices", () => {
    it("should return shoppable services for an organization", async () => {
      mockPrisma.shoppableService.findMany.mockResolvedValue([
        mockShoppableService,
      ]);
      mockPrisma.shoppableService.count.mockResolvedValue(1);

      const result = await service.getShoppableServices("org-123");

      expect(result).toHaveProperty("services");
      expect(result).toHaveProperty("total");
      expect(result.services).toHaveLength(1);
    });

    it("should support pagination", async () => {
      mockPrisma.shoppableService.findMany.mockResolvedValue([
        mockShoppableService,
      ]);
      mockPrisma.shoppableService.count.mockResolvedValue(100);

      await service.getShoppableServices("org-123", 10, 20);

      expect(mockPrisma.shoppableService.findMany).toHaveBeenCalledWith({
        where: { organizationId: "org-123", isActive: true },
        orderBy: { serviceName: "asc" },
        take: 10,
        skip: 20,
      });
    });

    it("should only return active services", async () => {
      mockPrisma.shoppableService.findMany.mockResolvedValue([]);
      mockPrisma.shoppableService.count.mockResolvedValue(0);

      await service.getShoppableServices("org-123");

      expect(mockPrisma.shoppableService.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({ isActive: true }),
        orderBy: expect.any(Object),
        take: 100,
        skip: 0,
      });
    });
  });

  describe("searchChargemaster", () => {
    it("should search chargemaster by term", async () => {
      mockPrisma.chargemasterItem.findMany.mockResolvedValue([
        mockChargemasterItem,
      ]);
      mockPrisma.chargemasterItem.count.mockResolvedValue(1);

      const result = await service.searchChargemaster({
        organizationId: "org-123",
        searchTerm: "office visit",
      });

      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("total");
    });

    it("should filter by CPT code", async () => {
      mockPrisma.chargemasterItem.findMany.mockResolvedValue([
        mockChargemasterItem,
      ]);
      mockPrisma.chargemasterItem.count.mockResolvedValue(1);

      await service.searchChargemaster({
        organizationId: "org-123",
        cptCode: "99213",
      });

      expect(mockPrisma.chargemasterItem.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({ cptCode: "99213" }),
        orderBy: expect.any(Object),
        take: 50,
        skip: 0,
      });
    });

    it("should filter by department", async () => {
      mockPrisma.chargemasterItem.findMany.mockResolvedValue([
        mockChargemasterItem,
      ]);
      mockPrisma.chargemasterItem.count.mockResolvedValue(1);

      await service.searchChargemaster({
        organizationId: "org-123",
        department: "Outpatient",
      });

      expect(mockPrisma.chargemasterItem.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          departmentName: { contains: "Outpatient", mode: "insensitive" },
        }),
        orderBy: expect.any(Object),
        take: 50,
        skip: 0,
      });
    });

    it("should filter by shoppable status", async () => {
      mockPrisma.chargemasterItem.findMany.mockResolvedValue([
        mockChargemasterItem,
      ]);
      mockPrisma.chargemasterItem.count.mockResolvedValue(1);

      await service.searchChargemaster({
        organizationId: "org-123",
        isShoppable: true,
      });

      expect(mockPrisma.chargemasterItem.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({ isShoppable: true }),
        orderBy: expect.any(Object),
        take: 50,
        skip: 0,
      });
    });
  });

  describe("comparePayerPrices", () => {
    it("should compare prices across payers", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(
        mockChargemasterItem,
      );
      mockPrisma.payerContractRate.findMany.mockResolvedValue([
        {
          ...mockPayerContractRate,
          payerContract: mockPayerContract,
          negotiatedRate: mockDecimal(200),
        },
        {
          ...mockPayerContractRate,
          id: "rate-2",
          payerContract: {
            ...mockPayerContract,
            id: "contract-2",
            payerName: "Aetna",
          },
          negotiatedRate: mockDecimal(180),
        },
      ]);

      const result = await service.comparePayerPrices("org-123", "99213");

      expect(result).toHaveProperty("serviceCode");
      expect(result).toHaveProperty("grossCharge");
      expect(result).toHaveProperty("payerRates");
      expect(result).toHaveProperty("statistics");
    });

    it("should calculate min, max, and average rates", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(
        mockChargemasterItem,
      );
      mockPrisma.payerContractRate.findMany.mockResolvedValue([
        {
          ...mockPayerContractRate,
          payerContract: mockPayerContract,
          negotiatedRate: mockDecimal(100),
        },
        {
          ...mockPayerContractRate,
          payerContract: mockPayerContract,
          negotiatedRate: mockDecimal(200),
        },
        {
          ...mockPayerContractRate,
          payerContract: mockPayerContract,
          negotiatedRate: mockDecimal(150),
        },
      ]);

      const result = await service.comparePayerPrices("org-123", "99213");

      expect(result!.statistics.minNegotiatedRate).toBe(100);
      expect(result!.statistics.maxNegotiatedRate).toBe(200);
      expect(result!.statistics.averageNegotiatedRate).toBe(150);
    });

    it("should return null for unknown service", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(null);

      const result = await service.comparePayerPrices("org-123", "UNKNOWN");

      expect(result).toBeNull();
    });
  });

  describe("getPriceComparison", () => {
    it("should check cache first", async () => {
      const cachedResult = {
        serviceCode: "99213",
        zipCode: "90210",
        searchRadius: 25,
        results: [],
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      };
      mockPrisma.priceComparisonCache.findUnique.mockResolvedValue(
        cachedResult,
      );

      const result = await service.getPriceComparison({
        serviceCode: "99213",
        zipCode: "90210",
      });

      expect(result.cached).toBe(true);
    });

    it("should indicate when cache miss occurs", async () => {
      mockPrisma.priceComparisonCache.findUnique.mockResolvedValue(null);

      const result = await service.getPriceComparison({
        serviceCode: "99213",
        zipCode: "90210",
      });

      expect(result.cached).toBe(false);
    });

    it("should use provided radius", async () => {
      mockPrisma.priceComparisonCache.findUnique.mockResolvedValue(null);

      const result = await service.getPriceComparison({
        serviceCode: "99213",
        zipCode: "90210",
        radiusMiles: 50,
      });

      expect(result.searchRadius).toBe(50);
    });
  });

  describe("createPriceEstimate", () => {
    it("should create a price estimate", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(
        mockChargemasterItem,
      );
      mockPrisma.priceEstimate.create.mockResolvedValue(mockPriceEstimate);

      const result = await service.createPriceEstimate({
        organizationId: "org-123",
        patientId: "patient-789",
        serviceCode: "99213",
        serviceDescription: "Office Visit",
        grossCharge: 250,
        negotiatedRate: 200,
        discountedCashPrice: 175,
      });

      expect(result).toHaveProperty("id");
      expect(mockPrisma.priceEstimate.create).toHaveBeenCalled();
    });

    it("should link to chargemaster item if found", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(
        mockChargemasterItem,
      );
      mockPrisma.priceEstimate.create.mockResolvedValue(mockPriceEstimate);

      await service.createPriceEstimate({
        organizationId: "org-123",
        serviceCode: "99213",
        serviceDescription: "Office Visit",
        grossCharge: 250,
      });

      const createCall = mockPrisma.priceEstimate.create.mock.calls[0][0];
      expect(createCall.data.chargemasterItemId).toBe(mockChargemasterItem.id);
    });

    it("should set expiration date", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(null);
      mockPrisma.priceEstimate.create.mockResolvedValue(mockPriceEstimate);

      await service.createPriceEstimate({
        organizationId: "org-123",
        serviceCode: "99213",
        serviceDescription: "Office Visit",
        grossCharge: 250,
        validDays: 60,
      });

      const createCall = mockPrisma.priceEstimate.create.mock.calls[0][0];
      expect(createCall.data.expiresAt).toBeDefined();
    });
  });

  describe("getPatientEstimates", () => {
    it("should return estimates for a patient", async () => {
      mockPrisma.priceEstimate.findMany.mockResolvedValue([mockPriceEstimate]);

      const result = await service.getPatientEstimates("patient-789");

      expect(result).toHaveLength(1);
      expect(mockPrisma.priceEstimate.findMany).toHaveBeenCalledWith({
        where: {
          patientId: "patient-789",
          expiresAt: { gt: expect.any(Date) },
        },
        orderBy: { createdAt: "desc" },
        include: { chargemasterItem: true },
      });
    });

    it("should filter by organization if provided", async () => {
      mockPrisma.priceEstimate.findMany.mockResolvedValue([mockPriceEstimate]);

      await service.getPatientEstimates("patient-789", "org-123");

      expect(mockPrisma.priceEstimate.findMany).toHaveBeenCalledWith({
        where: {
          patientId: "patient-789",
          organizationId: "org-123",
          expiresAt: { gt: expect.any(Date) },
        },
        orderBy: { createdAt: "desc" },
        include: { chargemasterItem: true },
      });
    });

    it("should only return non-expired estimates", async () => {
      mockPrisma.priceEstimate.findMany.mockResolvedValue([]);

      await service.getPatientEstimates("patient-789");

      const findCall = mockPrisma.priceEstimate.findMany.mock.calls[0][0];
      expect(findCall.where.expiresAt).toEqual({ gt: expect.any(Date) });
    });
  });
});
