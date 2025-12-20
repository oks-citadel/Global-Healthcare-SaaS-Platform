import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AddInventoryData {
  medicationId: string;
  pharmacyId: string;
  ndcCode: string;
  lotNumber: string;
  quantityOnHand: number;
  unitCost?: number;
  expirationDate?: Date;
  reorderLevel?: number;
  reorderQuantity?: number;
}

export class InventoryService {
  /**
   * Add inventory item
   */
  async addInventory(data: AddInventoryData) {
    return await prisma.inventory.create({
      data: {
        ...data,
        unitCost: data.unitCost ? String(data.unitCost) : undefined,
      },
      include: {
        medication: true,
      },
    });
  }

  /**
   * Check if medication is available in sufficient quantity
   */
  async checkAvailability(
    medicationId: string,
    pharmacyId: string,
    quantityNeeded: number
  ): Promise<boolean> {
    const inventoryItems = await prisma.inventory.findMany({
      where: {
        medicationId,
        pharmacyId,
        isActive: true,
        quantityOnHand: {
          gt: 0,
        },
      },
      orderBy: {
        expirationDate: 'asc', // Use oldest first (FEFO - First Expired, First Out)
      },
    });

    const totalAvailable = inventoryItems.reduce(
      (sum, item) => sum + (item.quantityOnHand - item.quantityReserved),
      0
    );

    return totalAvailable >= quantityNeeded;
  }

  /**
   * Get available quantity for a medication at a pharmacy
   */
  async getAvailableQuantity(medicationId: string, pharmacyId: string) {
    const inventoryItems = await prisma.inventory.findMany({
      where: {
        medicationId,
        pharmacyId,
        isActive: true,
      },
    });

    const totalOnHand = inventoryItems.reduce((sum, item) => sum + item.quantityOnHand, 0);
    const totalReserved = inventoryItems.reduce(
      (sum, item) => sum + item.quantityReserved,
      0
    );
    const totalAvailable = totalOnHand - totalReserved;

    return {
      totalOnHand,
      totalReserved,
      totalAvailable,
      items: inventoryItems.length,
    };
  }

  /**
   * Decrement inventory (when dispensing)
   */
  async decrementInventory(
    medicationId: string,
    pharmacyId: string,
    quantity: number,
    preferredLotNumber?: string
  ) {
    // Try to use specific lot if provided
    if (preferredLotNumber) {
      const item = await prisma.inventory.findFirst({
        where: {
          medicationId,
          pharmacyId,
          lotNumber: preferredLotNumber,
          isActive: true,
        },
      });

      if (item && item.quantityOnHand >= quantity) {
        return await prisma.inventory.update({
          where: { id: item.id },
          data: {
            quantityOnHand: item.quantityOnHand - quantity,
          },
        });
      }
    }

    // Otherwise, use FEFO (First Expired, First Out)
    const inventoryItems = await prisma.inventory.findMany({
      where: {
        medicationId,
        pharmacyId,
        isActive: true,
        quantityOnHand: {
          gt: 0,
        },
      },
      orderBy: {
        expirationDate: 'asc',
      },
    });

    let remainingQuantity = quantity;

    for (const item of inventoryItems) {
      if (remainingQuantity <= 0) break;

      const availableInThisItem = item.quantityOnHand - item.quantityReserved;
      const toDeduct = Math.min(availableInThisItem, remainingQuantity);

      await prisma.inventory.update({
        where: { id: item.id },
        data: {
          quantityOnHand: item.quantityOnHand - toDeduct,
        },
      });

      remainingQuantity -= toDeduct;
    }

    if (remainingQuantity > 0) {
      throw new Error('Insufficient inventory to fulfill request');
    }

    return { success: true, quantityDeducted: quantity };
  }

  /**
   * Increment inventory (when receiving stock or processing returns)
   */
  async incrementInventory(
    medicationId: string,
    pharmacyId: string,
    quantity: number,
    lotNumber: string
  ) {
    const existingItem = await prisma.inventory.findFirst({
      where: {
        medicationId,
        pharmacyId,
        lotNumber,
      },
    });

    if (existingItem) {
      return await prisma.inventory.update({
        where: { id: existingItem.id },
        data: {
          quantityOnHand: existingItem.quantityOnHand + quantity,
          isActive: true,
        },
      });
    } else {
      throw new Error('Inventory item not found. Please add new inventory instead.');
    }
  }

  /**
   * Get inventory for a pharmacy
   */
  async getPharmacyInventory(pharmacyId: string, filters?: {
    medicationId?: string;
    lowStock?: boolean;
    expiringSoon?: boolean;
  }) {
    const where: any = { pharmacyId, isActive: true };

    if (filters?.medicationId) {
      where.medicationId = filters.medicationId;
    }

    if (filters?.lowStock) {
      where.quantityOnHand = {
        lte: prisma.inventory.fields.reorderLevel,
      };
    }

    if (filters?.expiringSoon) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      where.expirationDate = {
        lte: thirtyDaysFromNow,
        gte: new Date(),
      };
    }

    return await prisma.inventory.findMany({
      where,
      include: {
        medication: true,
      },
      orderBy: {
        expirationDate: 'asc',
      },
    });
  }

  /**
   * Get medications that need reordering
   */
  async getReorderList(pharmacyId: string) {
    const inventoryItems = await prisma.inventory.findMany({
      where: {
        pharmacyId,
        isActive: true,
        reorderLevel: {
          not: null,
        },
      },
      include: {
        medication: true,
      },
    });

    // Filter items where quantity is at or below reorder level
    const needsReorder = inventoryItems.filter(
      (item) => item.reorderLevel && item.quantityOnHand <= item.reorderLevel
    );

    return needsReorder.map((item) => ({
      ...item,
      recommendedOrderQuantity: item.reorderQuantity || item.reorderLevel,
    }));
  }

  /**
   * Get expiring medications
   */
  async getExpiringMedications(pharmacyId: string, daysAhead = 30) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return await prisma.inventory.findMany({
      where: {
        pharmacyId,
        isActive: true,
        expirationDate: {
          lte: targetDate,
          gte: new Date(),
        },
        quantityOnHand: {
          gt: 0,
        },
      },
      include: {
        medication: true,
      },
      orderBy: {
        expirationDate: 'asc',
      },
    });
  }

  /**
   * Update inventory item
   */
  async updateInventory(id: string, data: Partial<AddInventoryData>) {
    return await prisma.inventory.update({
      where: { id },
      data: {
        ...data,
        unitCost: data.unitCost ? String(data.unitCost) : undefined,
      },
    });
  }

  /**
   * Deactivate inventory item
   */
  async deactivateInventory(id: string) {
    return await prisma.inventory.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Reserve inventory (for pending orders)
   */
  async reserveInventory(
    medicationId: string,
    pharmacyId: string,
    quantity: number
  ) {
    const items = await prisma.inventory.findMany({
      where: {
        medicationId,
        pharmacyId,
        isActive: true,
      },
      orderBy: {
        expirationDate: 'asc',
      },
    });

    let remainingToReserve = quantity;

    for (const item of items) {
      if (remainingToReserve <= 0) break;

      const availableToReserve = item.quantityOnHand - item.quantityReserved;
      const toReserve = Math.min(availableToReserve, remainingToReserve);

      if (toReserve > 0) {
        await prisma.inventory.update({
          where: { id: item.id },
          data: {
            quantityReserved: item.quantityReserved + toReserve,
          },
        });

        remainingToReserve -= toReserve;
      }
    }

    if (remainingToReserve > 0) {
      throw new Error('Insufficient inventory to reserve');
    }

    return { success: true, quantityReserved: quantity };
  }

  /**
   * Release reserved inventory
   */
  async releaseReservedInventory(
    medicationId: string,
    pharmacyId: string,
    quantity: number
  ) {
    const items = await prisma.inventory.findMany({
      where: {
        medicationId,
        pharmacyId,
        isActive: true,
        quantityReserved: {
          gt: 0,
        },
      },
      orderBy: {
        expirationDate: 'asc',
      },
    });

    let remainingToRelease = quantity;

    for (const item of items) {
      if (remainingToRelease <= 0) break;

      const toRelease = Math.min(item.quantityReserved, remainingToRelease);

      await prisma.inventory.update({
        where: { id: item.id },
        data: {
          quantityReserved: item.quantityReserved - toRelease,
        },
      });

      remainingToRelease -= toRelease;
    }

    return { success: true, quantityReleased: quantity - remainingToRelease };
  }
}

export default new InventoryService();
