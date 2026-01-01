import { Router } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import InventoryService from '../services/InventoryService';

const router: ReturnType<typeof Router> = Router();

const addInventorySchema = z.object({
  medicationId: z.string().uuid(),
  pharmacyId: z.string().uuid(),
  ndcCode: z.string(),
  lotNumber: z.string(),
  quantityOnHand: z.number().positive(),
  unitCost: z.number().positive().optional(),
  expirationDate: z.string().datetime().optional(),
  reorderLevel: z.number().positive().optional(),
  reorderQuantity: z.number().positive().optional(),
});

/**
 * GET /inventory
 * Get pharmacy inventory
 */
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const { pharmacyId, medicationId, lowStock, expiringSoon } = req.query;

    if (!pharmacyId) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'pharmacyId is required',
      });
      return;
    }

    const inventory = await InventoryService.getPharmacyInventory(
      pharmacyId as string,
      {
        medicationId: medicationId as string | undefined,
        lowStock: lowStock === 'true',
        expiringSoon: expiringSoon === 'true',
      }
    );

    res.json({
      data: inventory,
      count: inventory.length,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch inventory',
    });
  }
});

/**
 * POST /inventory
 * Add inventory item
 */
router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'pharmacist' && req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only pharmacists can add inventory',
      });
      return;
    }

    const validatedData = addInventorySchema.parse(req.body);

    const inventory = await InventoryService.addInventory({
      ...validatedData,
      expirationDate: validatedData.expirationDate
        ? new Date(validatedData.expirationDate)
        : undefined,
    } as any);

    res.status(201).json({
      data: inventory,
      message: 'Inventory added successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }

    console.error('Error adding inventory:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add inventory',
    });
  }
});

/**
 * GET /inventory/check-availability
 * Check medication availability
 */
router.get('/check-availability', requireUser, async (req: UserRequest, res) => {
  try {
    const { medicationId, pharmacyId, quantity } = req.query;

    if (!medicationId || !pharmacyId || !quantity) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'medicationId, pharmacyId, and quantity are required',
      });
      return;
    }

    const isAvailable = await InventoryService.checkAvailability(
      medicationId as string,
      pharmacyId as string,
      parseInt(quantity as string)
    );

    res.json({
      available: isAvailable,
      medicationId,
      pharmacyId,
      quantityRequested: parseInt(quantity as string),
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to check availability',
    });
  }
});

/**
 * GET /inventory/quantity
 * Get available quantity for a medication
 */
router.get('/quantity', requireUser, async (req: UserRequest, res) => {
  try {
    const { medicationId, pharmacyId } = req.query;

    if (!medicationId || !pharmacyId) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'medicationId and pharmacyId are required',
      });
      return;
    }

    const quantity = await InventoryService.getAvailableQuantity(
      medicationId as string,
      pharmacyId as string
    );

    res.json({
      data: quantity,
      medicationId,
      pharmacyId,
    });
  } catch (error) {
    console.error('Error getting quantity:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get quantity',
    });
  }
});

/**
 * GET /inventory/reorder-list
 * Get medications that need reordering
 */
router.get('/reorder-list', requireUser, async (req: UserRequest, res) => {
  try {
    const { pharmacyId } = req.query;

    if (!pharmacyId) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'pharmacyId is required',
      });
      return;
    }

    const reorderList = await InventoryService.getReorderList(
      pharmacyId as string
    );

    res.json({
      data: reorderList,
      count: reorderList.length,
    });
  } catch (error) {
    console.error('Error getting reorder list:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get reorder list',
    });
  }
});

/**
 * GET /inventory/expiring
 * Get expiring medications
 */
router.get('/expiring', requireUser, async (req: UserRequest, res) => {
  try {
    const { pharmacyId, daysAhead } = req.query;

    if (!pharmacyId) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'pharmacyId is required',
      });
      return;
    }

    const days = daysAhead ? parseInt(daysAhead as string) : 30;

    const expiring = await InventoryService.getExpiringMedications(
      pharmacyId as string,
      days
    );

    res.json({
      data: expiring,
      count: expiring.length,
      daysAhead: days,
    });
  } catch (error) {
    console.error('Error getting expiring medications:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get expiring medications',
    });
  }
});

/**
 * PATCH /inventory/:id
 * Update inventory item
 */
router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'pharmacist' && req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only pharmacists can update inventory',
      });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    const inventory = await InventoryService.updateInventory(id, updates);

    res.json({
      data: inventory,
      message: 'Inventory updated successfully',
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update inventory',
    });
  }
});

/**
 * DELETE /inventory/:id
 * Deactivate inventory item
 */
router.delete('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'pharmacist' && req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only pharmacists can deactivate inventory',
      });
      return;
    }

    const { id } = req.params;

    const inventory = await InventoryService.deactivateInventory(id);

    res.json({
      data: inventory,
      message: 'Inventory deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating inventory:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to deactivate inventory',
    });
  }
});

/**
 * POST /inventory/reserve
 * Reserve inventory
 */
router.post('/reserve', requireUser, async (req: UserRequest, res) => {
  try {
    const { medicationId, pharmacyId, quantity } = req.body;

    if (!medicationId || !pharmacyId || !quantity) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'medicationId, pharmacyId, and quantity are required',
      });
      return;
    }

    const result = await InventoryService.reserveInventory(
      medicationId,
      pharmacyId,
      quantity
    );

    res.json({
      data: result,
      message: 'Inventory reserved successfully',
    });
  } catch (error: any) {
    console.error('Error reserving inventory:', error);
    res.status(500).json({
      error: 'Reserve Error',
      message: error.message || 'Failed to reserve inventory',
    });
  }
});

/**
 * POST /inventory/release
 * Release reserved inventory
 */
router.post('/release', requireUser, async (req: UserRequest, res) => {
  try {
    const { medicationId, pharmacyId, quantity } = req.body;

    if (!medicationId || !pharmacyId || !quantity) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'medicationId, pharmacyId, and quantity are required',
      });
      return;
    }

    const result = await InventoryService.releaseReservedInventory(
      medicationId,
      pharmacyId,
      quantity
    );

    res.json({
      data: result,
      message: 'Reserved inventory released successfully',
    });
  } catch (error) {
    console.error('Error releasing inventory:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to release inventory',
    });
  }
});

export default router;
