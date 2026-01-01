import { PrismaClient, Prisma } from '../generated/client';

const prisma = new PrismaClient();

// Type for Prisma where clauses
type InventoryWhereInput = Prisma.InventoryWhereInput;

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
    return await (prisma.inventory.create as any)({
      data: {
        medicationId: data.medicationId,
        pharmacyId: data.pharmacyId,
        lotNumber: data.lotNumber,
        quantity: data.quantityOnHand,
        expirationDate: data.expirationDate || new Date(),
        reorderLevel: data.reorderLevel || 10,
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
    const inventoryItems = await (prisma.inventory.findMany as any)({
      where: {
        medicationId,
        pharmacyId,
        isActive: true,
        quantity: {
          gt: 0,
        },
      },
      orderBy: {
        expirationDate: 'asc', // Use oldest first (FEFO - First Expired, First Out)
      },
    });

    const totalAvailable = inventoryItems.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );

    return totalAvailable >= quantityNeeded;
  }

  /**
   * Get available quantity for a medication at a pharmacy
   */
  async getAvailableQuantity(medicationId: string, pharmacyId: string) {
    const inventoryItems = await (prisma.inventory.findMany as any)({
      where: {
        medicationId,
        pharmacyId,
        isActive: true,
      },
    });

    const totalOnHand = inventoryItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

    return {
      totalOnHand,
      totalReserved: 0,
      totalAvailable: totalOnHand,
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
      const item: any = await prisma.inventory.findFirst({
        where: {
          medicationId,
          pharmacyId,
          lotNumber: preferredLotNumber,
          isActive: true,
        },
      });

      if (item && item.quantity >= quantity) {
        return await prisma.inventory.update({
          where: { id: item.id },
          data: {
            quantity: item.quantity - quantity,
          },
        });
      }
    }

    // Otherwise, use FEFO (First Expired, First Out)
    const inventoryItems: any[] = await (prisma.inventory.findMany as any)({
      where: {
        medicationId,
        pharmacyId,
        isActive: true,
        quantity: {
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

      const availableInThisItem = item.quantity;
      const toDeduct = Math.min(availableInThisItem, remainingQuantity);

      await prisma.inventory.update({
        where: { id: item.id },
        data: {
          quantity: item.quantity - toDeduct,
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
    const existingItem: any = await prisma.inventory.findFirst({
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
          quantity: existingItem.quantity + quantity,
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
    const where: InventoryWhereInput = { pharmacyId, isActive: true };

    if (filters?.medicationId) {
      where.medicationId = filters.medicationId;
    }

    // Note: lowStock filter is handled in getReorderList method instead
    // as comparing fields directly in Prisma requires raw queries

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
      (item: any) => item.reorderLevel && item.quantity <= item.reorderLevel
    );

    return needsReorder.map((item: any) => ({
      ...item,
      recommendedOrderQuantity: item.reorderLevel,
    }));
  }

  /**
   * Get expiring medications
   */
  async getExpiringMedications(pharmacyId: string, daysAhead = 30) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return await (prisma.inventory.findMany as any)({
      where: {
        pharmacyId,
        isActive: true,
        expirationDate: {
          lte: targetDate,
          gte: new Date(),
        },
        quantity: {
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
    return await (prisma.inventory.update as any)({
      where: { id },
      data: {
        quantity: data.quantityOnHand,
        lotNumber: data.lotNumber,
        expirationDate: data.expirationDate,
        reorderLevel: data.reorderLevel,
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
    // Simplified reservation - just verify availability
    const available = await this.checkAvailability(medicationId, pharmacyId, quantity);
    if (!available) {
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
    // Simplified release - no reservation tracking in current schema
    return { success: true, quantityReleased: quantity };
  }
}

export default new InventoryService();
