import { Router, Response } from "express";
import { z } from "zod";
import { PrismaClient, Prisma } from "../generated/client";
import {
  UserRequest,
  requireUser,
  requireAdmin,
  requireOrganization,
} from "../middleware/extractUser";

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const createChargemasterItemSchema = z.object({
  code: z.string().min(1, "Internal code is required"),
  description: z.string().min(1, "Description is required"),
  cptCode: z.string().optional(),
  hcpcsCode: z.string().optional(),
  revenueCode: z.string().optional(),
  departmentCode: z.string().optional(),
  departmentName: z.string().optional(),
  grossCharge: z.number().positive("Gross charge must be positive"),
  discountedCashPrice: z.number().positive().optional(),
  deidentifiedMinimum: z.number().positive().optional(),
  deidentifiedMaximum: z.number().positive().optional(),
  ndcCode: z.string().optional(),
  drugUnitOfMeasure: z.string().optional(),
  drugQuantity: z.number().positive().optional(),
  modifiers: z.array(z.string()).optional(),
  isShoppable: z.boolean().optional(),
  isBundled: z.boolean().optional(),
  bundleComponents: z
    .array(
      z.object({
        code: z.string(),
        description: z.string(),
        quantity: z.number().optional(),
      }),
    )
    .optional(),
  effectiveDate: z.string().datetime().optional(),
  expirationDate: z.string().datetime().optional(),
});

const updateChargemasterItemSchema = createChargemasterItemSchema.partial();

const bulkImportSchema = z.object({
  items: z
    .array(createChargemasterItemSchema)
    .min(1, "At least one item is required"),
  replaceExisting: z.boolean().optional().default(false),
});

const createPayerContractSchema = z.object({
  payerId: z.string().uuid(),
  payerName: z.string().min(1),
  planType: z.enum([
    "commercial",
    "medicare_advantage",
    "medicaid_mco",
    "exchange",
    "other",
  ]),
  planName: z.string().optional(),
  ein: z.string().optional(),
  contractType: z.enum([
    "fee_for_service",
    "capitation",
    "value_based",
    "hybrid",
  ]),
  effectiveDate: z.string().datetime(),
  terminationDate: z.string().datetime().optional(),
  allowedAmountBasis: z.string().optional(),
  feeScheduleVersion: z.string().optional(),
});

const createPayerRateSchema = z.object({
  payerContractId: z.string().uuid(),
  chargemasterItemId: z.string().uuid(),
  cptCode: z.string().optional(),
  hcpcsCode: z.string().optional(),
  modifiers: z.array(z.string()).optional(),
  negotiatedRate: z.number().positive(),
  rateType: z.enum([
    "fixed",
    "percentage_of_charge",
    "percentage_of_medicare",
    "case_rate",
    "per_diem",
    "capitation",
  ]),
  percentageOfCharge: z.number().min(0).max(100).optional(),
  percentageOfMedicare: z.number().min(0).max(500).optional(),
  minimumAmount: z.number().positive().optional(),
  maximumAmount: z.number().positive().optional(),
  effectiveDate: z.string().datetime().optional(),
  expirationDate: z.string().datetime().optional(),
});

/**
 * @route GET /chargemaster
 * @desc List chargemaster items
 * @access Private
 */
router.get(
  "/",
  requireUser,
  requireOrganization,
  async (req: UserRequest, res: Response) => {
    try {
      const organizationId = req.user!.organizationId!;
      const { search, cptCode, department, isShoppable, limit, offset } =
        req.query;

      const where: Prisma.ChargemasterItemWhereInput = {
        organizationId,
        isActive: true,
      };

      if (search) {
        where.OR = [
          { description: { contains: search as string, mode: "insensitive" } },
          { code: { contains: search as string, mode: "insensitive" } },
          { cptCode: { contains: search as string, mode: "insensitive" } },
          { hcpcsCode: { contains: search as string, mode: "insensitive" } },
        ];
      }

      if (cptCode) {
        where.cptCode = cptCode as string;
      }

      if (department) {
        where.departmentName = {
          contains: department as string,
          mode: "insensitive",
        };
      }

      if (isShoppable !== undefined) {
        where.isShoppable = isShoppable === "true";
      }

      const take = Math.min(parseInt(limit as string) || 50, 1000);
      const skip = parseInt(offset as string) || 0;

      const [items, total] = await Promise.all([
        prisma.chargemasterItem.findMany({
          where,
          orderBy: { description: "asc" },
          take,
          skip,
        }),
        prisma.chargemasterItem.count({ where }),
      ]);

      res.json({
        data: items,
        pagination: {
          total,
          limit: take,
          offset: skip,
          hasMore: skip + take < total,
        },
      });
    } catch (error) {
      console.error("Error listing chargemaster items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to list chargemaster items",
      });
    }
  },
);

/**
 * @route GET /chargemaster/:id
 * @desc Get a chargemaster item by ID
 * @access Private
 */
router.get(
  "/:id",
  requireUser,
  requireOrganization,
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const organizationId = req.user!.organizationId!;

      const item = await prisma.chargemasterItem.findFirst({
        where: { id, organizationId },
        include: {
          payerRates: {
            where: { isActive: true },
            include: { payerContract: true },
          },
        },
      });

      if (!item) {
        res.status(404).json({
          error: "Not Found",
          message: "Chargemaster item not found",
        });
        return;
      }

      res.json({ data: item });
    } catch (error) {
      console.error("Error fetching chargemaster item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to fetch chargemaster item",
      });
    }
  },
);

/**
 * @route POST /chargemaster
 * @desc Create a chargemaster item
 * @access Private (admin only)
 */
router.post(
  "/",
  requireUser,
  requireAdmin,
  requireOrganization,
  async (req: UserRequest, res: Response) => {
    try {
      const validation = createChargemasterItemSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: "Validation Error",
          details: validation.error.errors,
        });
        return;
      }

      const organizationId = req.user!.organizationId!;
      const data = validation.data;

      // Check for duplicate code
      const existing = await prisma.chargemasterItem.findUnique({
        where: {
          organizationId_code: {
            organizationId,
            code: data.code,
          },
        },
      });

      if (existing) {
        res.status(409).json({
          error: "Conflict",
          message: "A chargemaster item with this code already exists",
        });
        return;
      }

      const item = await prisma.chargemasterItem.create({
        data: {
          organizationId,
          code: data.code,
          description: data.description,
          cptCode: data.cptCode,
          hcpcsCode: data.hcpcsCode,
          revenueCode: data.revenueCode,
          departmentCode: data.departmentCode,
          departmentName: data.departmentName,
          grossCharge: data.grossCharge,
          discountedCashPrice: data.discountedCashPrice,
          deidentifiedMinimum: data.deidentifiedMinimum,
          deidentifiedMaximum: data.deidentifiedMaximum,
          ndcCode: data.ndcCode,
          drugUnitOfMeasure: data.drugUnitOfMeasure,
          drugQuantity: data.drugQuantity,
          modifiers: data.modifiers || [],
          isShoppable: data.isShoppable || false,
          isBundled: data.isBundled || false,
          bundleComponents: (data.bundleComponents as Prisma.JsonArray) || null,
          effectiveDate: data.effectiveDate
            ? new Date(data.effectiveDate)
            : new Date(),
          expirationDate: data.expirationDate
            ? new Date(data.expirationDate)
            : null,
        },
      });

      res.status(201).json({
        data: item,
        message: "Chargemaster item created successfully",
      });
    } catch (error) {
      console.error("Error creating chargemaster item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to create chargemaster item",
      });
    }
  },
);

/**
 * @route PUT /chargemaster/:id
 * @desc Update a chargemaster item
 * @access Private (admin only)
 */
router.put(
  "/:id",
  requireUser,
  requireAdmin,
  requireOrganization,
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const organizationId = req.user!.organizationId!;

      const validation = updateChargemasterItemSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: "Validation Error",
          details: validation.error.errors,
        });
        return;
      }

      const existing = await prisma.chargemasterItem.findFirst({
        where: { id, organizationId },
      });

      if (!existing) {
        res.status(404).json({
          error: "Not Found",
          message: "Chargemaster item not found",
        });
        return;
      }

      const data = validation.data;
      const updateData: Prisma.ChargemasterItemUpdateInput = {};

      if (data.code !== undefined) updateData.code = data.code;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.cptCode !== undefined) updateData.cptCode = data.cptCode;
      if (data.hcpcsCode !== undefined) updateData.hcpcsCode = data.hcpcsCode;
      if (data.revenueCode !== undefined)
        updateData.revenueCode = data.revenueCode;
      if (data.departmentCode !== undefined)
        updateData.departmentCode = data.departmentCode;
      if (data.departmentName !== undefined)
        updateData.departmentName = data.departmentName;
      if (data.grossCharge !== undefined)
        updateData.grossCharge = data.grossCharge;
      if (data.discountedCashPrice !== undefined)
        updateData.discountedCashPrice = data.discountedCashPrice;
      if (data.deidentifiedMinimum !== undefined)
        updateData.deidentifiedMinimum = data.deidentifiedMinimum;
      if (data.deidentifiedMaximum !== undefined)
        updateData.deidentifiedMaximum = data.deidentifiedMaximum;
      if (data.ndcCode !== undefined) updateData.ndcCode = data.ndcCode;
      if (data.drugUnitOfMeasure !== undefined)
        updateData.drugUnitOfMeasure = data.drugUnitOfMeasure;
      if (data.drugQuantity !== undefined)
        updateData.drugQuantity = data.drugQuantity;
      if (data.modifiers !== undefined) updateData.modifiers = data.modifiers;
      if (data.isShoppable !== undefined)
        updateData.isShoppable = data.isShoppable;
      if (data.isBundled !== undefined) updateData.isBundled = data.isBundled;
      if (data.bundleComponents !== undefined)
        updateData.bundleComponents = data.bundleComponents as Prisma.JsonArray;
      if (data.effectiveDate !== undefined)
        updateData.effectiveDate = new Date(data.effectiveDate);
      if (data.expirationDate !== undefined)
        updateData.expirationDate = new Date(data.expirationDate);

      const item = await prisma.chargemasterItem.update({
        where: { id },
        data: updateData,
      });

      res.json({
        data: item,
        message: "Chargemaster item updated successfully",
      });
    } catch (error) {
      console.error("Error updating chargemaster item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to update chargemaster item",
      });
    }
  },
);

/**
 * @route DELETE /chargemaster/:id
 * @desc Soft delete a chargemaster item
 * @access Private (admin only)
 */
router.delete(
  "/:id",
  requireUser,
  requireAdmin,
  requireOrganization,
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const organizationId = req.user!.organizationId!;

      const existing = await prisma.chargemasterItem.findFirst({
        where: { id, organizationId },
      });

      if (!existing) {
        res.status(404).json({
          error: "Not Found",
          message: "Chargemaster item not found",
        });
        return;
      }

      await prisma.chargemasterItem.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({
        message: "Chargemaster item deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting chargemaster item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to delete chargemaster item",
      });
    }
  },
);

/**
 * @route POST /chargemaster/bulk-import
 * @desc Bulk import chargemaster items
 * @access Private (admin only)
 */
router.post(
  "/bulk-import",
  requireUser,
  requireAdmin,
  requireOrganization,
  async (req: UserRequest, res: Response) => {
    try {
      const validation = bulkImportSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: "Validation Error",
          details: validation.error.errors,
        });
        return;
      }

      const organizationId = req.user!.organizationId!;
      const { items, replaceExisting } = validation.data;

      let imported = 0;
      let updated = 0;
      const errors: Array<{ code: string; error: string }> = [];

      for (const item of items) {
        try {
          const existing = await prisma.chargemasterItem.findUnique({
            where: {
              organizationId_code: {
                organizationId,
                code: item.code,
              },
            },
          });

          if (existing) {
            if (replaceExisting) {
              await prisma.chargemasterItem.update({
                where: { id: existing.id },
                data: {
                  description: item.description,
                  cptCode: item.cptCode,
                  hcpcsCode: item.hcpcsCode,
                  revenueCode: item.revenueCode,
                  departmentCode: item.departmentCode,
                  departmentName: item.departmentName,
                  grossCharge: item.grossCharge,
                  discountedCashPrice: item.discountedCashPrice,
                  deidentifiedMinimum: item.deidentifiedMinimum,
                  deidentifiedMaximum: item.deidentifiedMaximum,
                  ndcCode: item.ndcCode,
                  drugUnitOfMeasure: item.drugUnitOfMeasure,
                  drugQuantity: item.drugQuantity,
                  modifiers: item.modifiers || [],
                  isShoppable: item.isShoppable || false,
                  isBundled: item.isBundled || false,
                  bundleComponents:
                    (item.bundleComponents as Prisma.JsonArray) || null,
                  effectiveDate: item.effectiveDate
                    ? new Date(item.effectiveDate)
                    : undefined,
                  expirationDate: item.expirationDate
                    ? new Date(item.expirationDate)
                    : null,
                },
              });
              updated++;
            } else {
              errors.push({ code: item.code, error: "Item already exists" });
            }
          } else {
            await prisma.chargemasterItem.create({
              data: {
                organizationId,
                code: item.code,
                description: item.description,
                cptCode: item.cptCode,
                hcpcsCode: item.hcpcsCode,
                revenueCode: item.revenueCode,
                departmentCode: item.departmentCode,
                departmentName: item.departmentName,
                grossCharge: item.grossCharge,
                discountedCashPrice: item.discountedCashPrice,
                deidentifiedMinimum: item.deidentifiedMinimum,
                deidentifiedMaximum: item.deidentifiedMaximum,
                ndcCode: item.ndcCode,
                drugUnitOfMeasure: item.drugUnitOfMeasure,
                drugQuantity: item.drugQuantity,
                modifiers: item.modifiers || [],
                isShoppable: item.isShoppable || false,
                isBundled: item.isBundled || false,
                bundleComponents:
                  (item.bundleComponents as Prisma.JsonArray) || null,
                effectiveDate: item.effectiveDate
                  ? new Date(item.effectiveDate)
                  : new Date(),
                expirationDate: item.expirationDate
                  ? new Date(item.expirationDate)
                  : null,
              },
            });
            imported++;
          }
        } catch (err) {
          errors.push({
            code: item.code,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }

      res.json({
        message: "Bulk import completed",
        summary: {
          total: items.length,
          imported,
          updated,
          errors: errors.length,
        },
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      console.error("Error bulk importing chargemaster:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to bulk import chargemaster items",
      });
    }
  },
);

/**
 * @route GET /chargemaster/contracts
 * @desc List payer contracts
 * @access Private (admin only)
 */
router.get(
  "/contracts",
  requireUser,
  requireAdmin,
  requireOrganization,
  async (req: UserRequest, res: Response) => {
    try {
      const organizationId = req.user!.organizationId!;
      const { payerName, isActive, limit, offset } = req.query;

      const where: Prisma.PayerContractWhereInput = { organizationId };

      if (payerName) {
        where.payerName = {
          contains: payerName as string,
          mode: "insensitive",
        };
      }

      if (isActive !== undefined) {
        where.isActive = isActive === "true";
      }

      const take = Math.min(parseInt(limit as string) || 50, 200);
      const skip = parseInt(offset as string) || 0;

      const [contracts, total] = await Promise.all([
        prisma.payerContract.findMany({
          where,
          orderBy: { payerName: "asc" },
          take,
          skip,
          include: {
            _count: { select: { rates: true } },
          },
        }),
        prisma.payerContract.count({ where }),
      ]);

      res.json({
        data: contracts,
        pagination: {
          total,
          limit: take,
          offset: skip,
          hasMore: skip + take < total,
        },
      });
    } catch (error) {
      console.error("Error listing payer contracts:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to list payer contracts",
      });
    }
  },
);

/**
 * @route POST /chargemaster/contracts
 * @desc Create a payer contract
 * @access Private (admin only)
 */
router.post(
  "/contracts",
  requireUser,
  requireAdmin,
  requireOrganization,
  async (req: UserRequest, res: Response) => {
    try {
      const validation = createPayerContractSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: "Validation Error",
          details: validation.error.errors,
        });
        return;
      }

      const organizationId = req.user!.organizationId!;
      const data = validation.data;

      const contract = await prisma.payerContract.create({
        data: {
          organizationId,
          payerId: data.payerId,
          payerName: data.payerName,
          planType: data.planType,
          planName: data.planName,
          ein: data.ein,
          contractType: data.contractType,
          effectiveDate: new Date(data.effectiveDate),
          terminationDate: data.terminationDate
            ? new Date(data.terminationDate)
            : null,
          allowedAmountBasis: data.allowedAmountBasis,
          feeScheduleVersion: data.feeScheduleVersion,
        },
      });

      res.status(201).json({
        data: contract,
        message: "Payer contract created successfully",
      });
    } catch (error) {
      console.error("Error creating payer contract:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to create payer contract",
      });
    }
  },
);

/**
 * @route POST /chargemaster/contracts/:contractId/rates
 * @desc Add a negotiated rate to a contract
 * @access Private (admin only)
 */
router.post(
  "/contracts/:contractId/rates",
  requireUser,
  requireAdmin,
  requireOrganization,
  async (req: UserRequest, res: Response) => {
    try {
      const { contractId } = req.params;
      const organizationId = req.user!.organizationId!;

      // Verify contract belongs to organization
      const contract = await prisma.payerContract.findFirst({
        where: { id: contractId, organizationId },
      });

      if (!contract) {
        res.status(404).json({
          error: "Not Found",
          message: "Payer contract not found",
        });
        return;
      }

      const validation = createPayerRateSchema.safeParse({
        ...req.body,
        payerContractId: contractId,
      });
      if (!validation.success) {
        res.status(400).json({
          error: "Validation Error",
          details: validation.error.errors,
        });
        return;
      }

      const data = validation.data;

      // Verify chargemaster item belongs to organization
      const chargemasterItem = await prisma.chargemasterItem.findFirst({
        where: { id: data.chargemasterItemId, organizationId },
      });

      if (!chargemasterItem) {
        res.status(404).json({
          error: "Not Found",
          message: "Chargemaster item not found",
        });
        return;
      }

      const rate = await prisma.payerContractRate.create({
        data: {
          payerContractId: contractId,
          chargemasterItemId: data.chargemasterItemId,
          cptCode: data.cptCode,
          hcpcsCode: data.hcpcsCode,
          modifiers: data.modifiers || [],
          negotiatedRate: data.negotiatedRate,
          rateType: data.rateType,
          percentageOfCharge: data.percentageOfCharge,
          percentageOfMedicare: data.percentageOfMedicare,
          minimumAmount: data.minimumAmount,
          maximumAmount: data.maximumAmount,
          effectiveDate: data.effectiveDate
            ? new Date(data.effectiveDate)
            : new Date(),
          expirationDate: data.expirationDate
            ? new Date(data.expirationDate)
            : null,
        },
        include: {
          chargemasterItem: true,
        },
      });

      res.status(201).json({
        data: rate,
        message: "Negotiated rate added successfully",
      });
    } catch (error) {
      console.error("Error adding negotiated rate:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to add negotiated rate",
      });
    }
  },
);

/**
 * @route GET /chargemaster/export
 * @desc Export chargemaster as CSV
 * @access Private (admin only)
 */
router.get(
  "/export",
  requireUser,
  requireAdmin,
  requireOrganization,
  async (req: UserRequest, res: Response) => {
    try {
      const organizationId = req.user!.organizationId!;

      const items = await prisma.chargemasterItem.findMany({
        where: { organizationId, isActive: true },
        orderBy: { code: "asc" },
      });

      // Generate CSV
      const headers = [
        "code",
        "description",
        "cptCode",
        "hcpcsCode",
        "revenueCode",
        "departmentCode",
        "departmentName",
        "grossCharge",
        "discountedCashPrice",
        "deidentifiedMinimum",
        "deidentifiedMaximum",
        "ndcCode",
        "isShoppable",
      ];

      const rows = items.map((item) =>
        [
          item.code,
          `"${item.description.replace(/"/g, '""')}"`,
          item.cptCode || "",
          item.hcpcsCode || "",
          item.revenueCode || "",
          item.departmentCode || "",
          item.departmentName || "",
          item.grossCharge.toString(),
          item.discountedCashPrice?.toString() || "",
          item.deidentifiedMinimum?.toString() || "",
          item.deidentifiedMaximum?.toString() || "",
          item.ndcCode || "",
          item.isShoppable ? "true" : "false",
        ].join(","),
      );

      const csv = [headers.join(","), ...rows].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="chargemaster_${new Date().toISOString().split("T")[0]}.csv"`,
      );
      res.send(csv);
    } catch (error) {
      console.error("Error exporting chargemaster:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to export chargemaster",
      });
    }
  },
);

export default router;
