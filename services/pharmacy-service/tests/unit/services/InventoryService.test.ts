/**
 * Unit Tests for InventoryService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InventoryService } from '../../../src/services/InventoryService';
import { mockPrismaClient } from '../helpers/mocks';
import { mockInventory, mockMedication } from '../helpers/fixtures';

// Mock the Prisma client
vi.mock('../../../src/generated/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient()),
}));

describe('InventoryService', () => {
  let inventoryService: InventoryService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    inventoryService = new InventoryService();
    vi.clearAllMocks();
  });

  describe('addInventory', () => {
    const addInventoryInput = {
      medicationId: 'medication-123',
      pharmacyId: 'pharmacy-123',
      ndcCode: '0456-1234-01',
      lotNumber: 'LOT-2025-001',
      quantityOnHand: 500,
      unitCost: 10.50,
      expirationDate: new Date('2026-12-31'),
      reorderLevel: 50,
    };

    it('should create a new inventory item', async () => {
      mockPrisma.inventory.create.mockResolvedValue(mockInventory);

      const result = await inventoryService.addInventory(addInventoryInput);

      expect(mockPrisma.inventory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          medicationId: addInventoryInput.medicationId,
          pharmacyId: addInventoryInput.pharmacyId,
          lotNumber: addInventoryInput.lotNumber,
          quantity: addInventoryInput.quantityOnHand,
        }),
      });
      expect(result).toEqual(mockInventory);
    });

    it('should use default reorder level if not provided', async () => {
      const inputWithoutReorderLevel = {
        ...addInventoryInput,
        reorderLevel: undefined,
      };
      mockPrisma.inventory.create.mockResolvedValue(mockInventory);

      await inventoryService.addInventory(inputWithoutReorderLevel);

      const createCall = mockPrisma.inventory.create.mock.calls[0][0];
      expect(createCall.data.reorderLevel).toBe(10);
    });
  });

  describe('checkAvailability', () => {
    it('should return true when sufficient inventory available', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([
        { ...mockInventory, quantity: 100 },
        { ...mockInventory, id: 'inventory-456', quantity: 100 },
      ]);

      const result = await inventoryService.checkAvailability('medication-123', 'pharmacy-123', 150);

      expect(result).toBe(true);
    });

    it('should return false when insufficient inventory', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([
        { ...mockInventory, quantity: 50 },
      ]);

      const result = await inventoryService.checkAvailability('medication-123', 'pharmacy-123', 100);

      expect(result).toBe(false);
    });

    it('should return false when no inventory items', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([]);

      const result = await inventoryService.checkAvailability('medication-123', 'pharmacy-123', 10);

      expect(result).toBe(false);
    });

    it('should only consider active inventory items with positive quantity', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([]);

      await inventoryService.checkAvailability('medication-123', 'pharmacy-123', 10);

      const findCall = mockPrisma.inventory.findMany.mock.calls[0][0];
      expect(findCall.where.isActive).toBe(true);
      expect(findCall.where.quantity.gt).toBe(0);
    });

    it('should order by expiration date (FEFO)', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([]);

      await inventoryService.checkAvailability('medication-123', 'pharmacy-123', 10);

      const findCall = mockPrisma.inventory.findMany.mock.calls[0][0];
      expect(findCall.orderBy.expirationDate).toBe('asc');
    });
  });

  describe('getAvailableQuantity', () => {
    it('should return total quantities for medication', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([
        { ...mockInventory, quantity: 100 },
        { ...mockInventory, id: 'inventory-456', quantity: 150 },
      ]);

      const result = await inventoryService.getAvailableQuantity('medication-123', 'pharmacy-123');

      expect(result.totalOnHand).toBe(250);
      expect(result.totalAvailable).toBe(250);
      expect(result.items).toBe(2);
    });

    it('should return zero when no inventory', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([]);

      const result = await inventoryService.getAvailableQuantity('medication-123', 'pharmacy-123');

      expect(result.totalOnHand).toBe(0);
      expect(result.totalAvailable).toBe(0);
      expect(result.items).toBe(0);
    });
  });

  describe('decrementInventory', () => {
    it('should decrement from preferred lot if available', async () => {
      mockPrisma.inventory.findFirst.mockResolvedValue({
        ...mockInventory,
        quantity: 100,
      });
      mockPrisma.inventory.update.mockResolvedValue({
        ...mockInventory,
        quantity: 70,
      });

      const result = await inventoryService.decrementInventory(
        'medication-123',
        'pharmacy-123',
        30,
        'LOT-2025-001'
      );

      expect(mockPrisma.inventory.update).toHaveBeenCalledWith({
        where: { id: 'inventory-123' },
        data: { quantity: 70 },
      });
      expect(result).toBeDefined();
    });

    it('should use FEFO when no preferred lot specified', async () => {
      mockPrisma.inventory.findFirst.mockResolvedValue(null);
      mockPrisma.inventory.findMany.mockResolvedValue([
        { ...mockInventory, quantity: 50 },
        { ...mockInventory, id: 'inventory-456', quantity: 100 },
      ]);
      mockPrisma.inventory.update.mockResolvedValue(mockInventory);

      await inventoryService.decrementInventory(
        'medication-123',
        'pharmacy-123',
        30
      );

      expect(mockPrisma.inventory.findMany).toHaveBeenCalled();
    });

    it('should decrement from multiple lots if needed', async () => {
      mockPrisma.inventory.findFirst.mockResolvedValue(null);
      mockPrisma.inventory.findMany.mockResolvedValue([
        { ...mockInventory, quantity: 20 },
        { ...mockInventory, id: 'inventory-456', quantity: 50 },
      ]);
      mockPrisma.inventory.update.mockResolvedValue(mockInventory);

      await inventoryService.decrementInventory(
        'medication-123',
        'pharmacy-123',
        30
      );

      // Should update both items
      expect(mockPrisma.inventory.update).toHaveBeenCalledTimes(2);
    });

    it('should throw error when insufficient inventory', async () => {
      mockPrisma.inventory.findFirst.mockResolvedValue(null);
      mockPrisma.inventory.findMany.mockResolvedValue([
        { ...mockInventory, quantity: 10 },
      ]);
      mockPrisma.inventory.update.mockResolvedValue(mockInventory);

      await expect(inventoryService.decrementInventory(
        'medication-123',
        'pharmacy-123',
        50
      )).rejects.toThrow('Insufficient inventory');
    });
  });

  describe('incrementInventory', () => {
    it('should increment existing inventory item', async () => {
      mockPrisma.inventory.findFirst.mockResolvedValue({
        ...mockInventory,
        quantity: 100,
      });
      mockPrisma.inventory.update.mockResolvedValue({
        ...mockInventory,
        quantity: 150,
      });

      const result = await inventoryService.incrementInventory(
        'medication-123',
        'pharmacy-123',
        50,
        'LOT-2025-001'
      );

      expect(mockPrisma.inventory.update).toHaveBeenCalledWith({
        where: { id: 'inventory-123' },
        data: {
          quantity: 150,
          isActive: true,
        },
      });
      expect(result.quantity).toBe(150);
    });

    it('should throw error when item not found', async () => {
      mockPrisma.inventory.findFirst.mockResolvedValue(null);

      await expect(inventoryService.incrementInventory(
        'medication-123',
        'pharmacy-123',
        50,
        'LOT-UNKNOWN'
      )).rejects.toThrow('Inventory item not found');
    });
  });

  describe('getPharmacyInventory', () => {
    it('should return all active inventory for pharmacy', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([mockInventory]);

      const result = await inventoryService.getPharmacyInventory('pharmacy-123');

      expect(mockPrisma.inventory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            pharmacyId: 'pharmacy-123',
            isActive: true,
          }),
        })
      );
      expect(result).toHaveLength(1);
    });

    it('should filter by medication ID', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([mockInventory]);

      await inventoryService.getPharmacyInventory('pharmacy-123', {
        medicationId: 'medication-123',
      });

      const findCall = mockPrisma.inventory.findMany.mock.calls[0][0];
      expect(findCall.where.medicationId).toBe('medication-123');
    });

    it('should filter items expiring soon', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([]);

      await inventoryService.getPharmacyInventory('pharmacy-123', {
        expiringSoon: true,
      });

      const findCall = mockPrisma.inventory.findMany.mock.calls[0][0];
      expect(findCall.where.expirationDate).toBeDefined();
      expect(findCall.where.expirationDate.lte).toBeDefined();
      expect(findCall.where.expirationDate.gte).toBeDefined();
    });

    it('should include medication details', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([{
        ...mockInventory,
        medication: mockMedication,
      }]);

      await inventoryService.getPharmacyInventory('pharmacy-123');

      const findCall = mockPrisma.inventory.findMany.mock.calls[0][0];
      expect(findCall.include.medication).toBe(true);
    });
  });

  describe('getReorderList', () => {
    it('should return items that need reordering', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([
        { ...mockInventory, quantity: 30, reorderLevel: 50 },
        { ...mockInventory, id: 'inventory-456', quantity: 100, reorderLevel: 50 },
      ]);

      const result = await inventoryService.getReorderList('pharmacy-123');

      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBeLessThanOrEqual(result[0].reorderLevel);
    });

    it('should include recommended order quantity', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([
        { ...mockInventory, quantity: 30, reorderLevel: 50 },
      ]);

      const result = await inventoryService.getReorderList('pharmacy-123');

      expect(result[0].recommendedOrderQuantity).toBeDefined();
    });

    it('should return empty array when nothing needs reordering', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([
        { ...mockInventory, quantity: 100, reorderLevel: 50 },
      ]);

      const result = await inventoryService.getReorderList('pharmacy-123');

      expect(result).toHaveLength(0);
    });
  });

  describe('getExpiringMedications', () => {
    it('should return items expiring within specified days', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([mockInventory]);

      const result = await inventoryService.getExpiringMedications('pharmacy-123', 30);

      expect(result).toHaveLength(1);
    });

    it('should use default 30 days if not specified', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([]);

      await inventoryService.getExpiringMedications('pharmacy-123');

      // Check that filter uses 30 day window
      const findCall = mockPrisma.inventory.findMany.mock.calls[0][0];
      expect(findCall.where.expirationDate).toBeDefined();
    });

    it('should only include active items with positive quantity', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([]);

      await inventoryService.getExpiringMedications('pharmacy-123');

      const findCall = mockPrisma.inventory.findMany.mock.calls[0][0];
      expect(findCall.where.isActive).toBe(true);
      expect(findCall.where.quantity.gt).toBe(0);
    });
  });

  describe('updateInventory', () => {
    it('should update inventory fields', async () => {
      const updatedInventory = { ...mockInventory, quantity: 200 };
      mockPrisma.inventory.update.mockResolvedValue(updatedInventory);

      const result = await inventoryService.updateInventory('inventory-123', {
        quantityOnHand: 200,
      });

      expect(mockPrisma.inventory.update).toHaveBeenCalledWith({
        where: { id: 'inventory-123' },
        data: expect.objectContaining({
          quantity: 200,
        }),
      });
      expect(result.quantity).toBe(200);
    });
  });

  describe('deactivateInventory', () => {
    it('should set inventory isActive to false', async () => {
      mockPrisma.inventory.update.mockResolvedValue({
        ...mockInventory,
        isActive: false,
      });

      const result = await inventoryService.deactivateInventory('inventory-123');

      expect(mockPrisma.inventory.update).toHaveBeenCalledWith({
        where: { id: 'inventory-123' },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe('reserveInventory', () => {
    it('should succeed when inventory available', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([
        { ...mockInventory, quantity: 100 },
      ]);

      const result = await inventoryService.reserveInventory(
        'medication-123',
        'pharmacy-123',
        50
      );

      expect(result.success).toBe(true);
      expect(result.quantityReserved).toBe(50);
    });

    it('should throw error when insufficient inventory', async () => {
      mockPrisma.inventory.findMany.mockResolvedValue([
        { ...mockInventory, quantity: 10 },
      ]);

      await expect(inventoryService.reserveInventory(
        'medication-123',
        'pharmacy-123',
        50
      )).rejects.toThrow('Insufficient inventory to reserve');
    });
  });

  describe('releaseReservedInventory', () => {
    it('should release reserved inventory', async () => {
      const result = await inventoryService.releaseReservedInventory(
        'medication-123',
        'pharmacy-123',
        50
      );

      expect(result.success).toBe(true);
      expect(result.quantityReleased).toBe(50);
    });
  });
});
