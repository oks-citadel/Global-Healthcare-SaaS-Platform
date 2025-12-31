import { Router, Response } from 'express';
import { z } from 'zod';
import { getDistance } from 'geolib';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();

// Lazy load Prisma
const getPrisma = async () => {
  const { PrismaClient } = await import('../generated/client');
  return new PrismaClient();
};

// Validation schemas
const createSiteSchema = z.object({
  trialId: z.string().uuid(),
  facilityName: z.string().min(1),
  facilityId: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  country: z.string().min(1),
  zipCode: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  principalInvestigator: z.string().optional(),
  targetEnrollment: z.number().min(0).optional(),
});

const updateSiteSchema = createSiteSchema.partial().omit({ trialId: true });

const siteFinderSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  maxDistance: z.number().min(1).max(500).optional(),
  distanceUnit: z.enum(['miles', 'km']).optional(),
  trialId: z.string().uuid().optional(),
  conditions: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  limit: z.number().min(1).max(100).optional(),
});

const createInvestigatorSchema = z.object({
  userId: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  institution: z.string().optional(),
  npiNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseState: z.string().optional(),
  cvUrl: z.string().url().optional(),
  roles: z.array(z.enum([
    'principal_investigator',
    'sub_investigator',
    'study_coordinator',
    'research_nurse',
    'data_manager',
    'pharmacist',
    'laboratory',
  ])).optional(),
  certifications: z.array(z.object({
    type: z.string(),
    issuedDate: z.string().optional(),
    expirationDate: z.string().optional(),
    certificateNumber: z.string().optional(),
  })).optional(),
});

// GET /sites - List all sites
router.get('/', async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { trialId, status, country, state, city, isActive, limit = '50', offset = '0' } = req.query;

    const where: any = {};

    if (trialId) where.trialId = trialId;
    if (status) where.status = status;
    if (country) where.country = country;
    if (state) where.state = state;
    if (city) where.city = { contains: city as string, mode: 'insensitive' };
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [sites, total] = await Promise.all([
      prisma.trialSite.findMany({
        where,
        include: {
          trial: {
            select: { nctId: true, title: true, status: true },
          },
          _count: {
            select: { enrollments: true },
          },
        },
        orderBy: { facilityName: 'asc' },
        take: parseInt(limit as string, 10),
        skip: parseInt(offset as string, 10),
      }),
      prisma.trialSite.count({ where }),
    ]);

    await prisma.$disconnect();

    res.json({
      data: sites,
      pagination: {
        total,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
        hasMore: parseInt(offset as string, 10) + sites.length < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /sites/find-nearby - Find sites near a location
router.post('/find-nearby', async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const params = siteFinderSchema.parse(req.body);

    const {
      latitude,
      longitude,
      maxDistance = 100,
      distanceUnit = 'miles',
      trialId,
      conditions,
      status,
      limit = 50,
    } = params;

    // Build query
    const where: any = {
      isActive: true,
      latitude: { not: null },
      longitude: { not: null },
    };

    if (trialId) {
      where.trialId = trialId;
    }

    if (status?.length) {
      where.status = { in: status };
    }

    if (conditions?.length) {
      where.trial = {
        conditions: { hasSome: conditions },
        status: { in: ['recruiting', 'enrolling_by_invitation', 'not_yet_recruiting'] },
      };
    } else {
      where.trial = {
        status: { in: ['recruiting', 'enrolling_by_invitation', 'not_yet_recruiting'] },
      };
    }

    const sites = await prisma.trialSite.findMany({
      where,
      include: {
        trial: {
          select: {
            id: true,
            nctId: true,
            title: true,
            status: true,
            phase: true,
            conditions: true,
            briefSummary: true,
          },
        },
      },
    });

    // Calculate distances and filter
    const sitesWithDistance = sites
      .map((site) => {
        const distanceMeters = getDistance(
          { latitude, longitude },
          { latitude: site.latitude!, longitude: site.longitude! }
        );

        const distance = distanceUnit === 'miles'
          ? distanceMeters / 1609.344
          : distanceMeters / 1000;

        return {
          ...site,
          distance: Math.round(distance * 10) / 10,
          distanceUnit,
        };
      })
      .filter((site) => site.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    await prisma.$disconnect();

    res.json({
      data: sitesWithDistance,
      query: {
        latitude,
        longitude,
        maxDistance,
        distanceUnit,
      },
      count: sitesWithDistance.length,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error finding nearby sites:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /sites/:id - Get site details
router.get('/:id', async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;

    const site = await prisma.trialSite.findUnique({
      where: { id },
      include: {
        trial: {
          select: {
            id: true,
            nctId: true,
            title: true,
            status: true,
            phase: true,
            conditions: true,
          },
        },
        enrollments: {
          select: {
            id: true,
            status: true,
            enrollmentDate: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    await prisma.$disconnect();

    if (!site) {
      res.status(404).json({ error: 'Not Found', message: 'Site not found' });
      return;
    }

    res.json({ data: site });
  } catch (error: any) {
    console.error('Error fetching site:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /sites - Create a new site
router.post('/', requireUser, requireRole('admin', 'coordinator'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const validatedData = createSiteSchema.parse(req.body);

    // Check trial exists
    const trial = await prisma.clinicalTrial.findUnique({
      where: { id: validatedData.trialId },
    });

    if (!trial) {
      res.status(404).json({ error: 'Not Found', message: 'Trial not found' });
      return;
    }

    const site = await prisma.trialSite.create({
      data: validatedData as any,
      include: {
        trial: {
          select: { nctId: true, title: true },
        },
      },
    });

    await prisma.$disconnect();

    res.status(201).json({
      data: site,
      message: 'Site created successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Conflict', message: 'Site already exists for this trial' });
      return;
    }
    console.error('Error creating site:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// PUT /sites/:id - Update a site
router.put('/:id', requireUser, requireRole('admin', 'coordinator'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;
    const validatedData = updateSiteSchema.parse(req.body);

    const site = await prisma.trialSite.findUnique({ where: { id } });

    if (!site) {
      res.status(404).json({ error: 'Not Found', message: 'Site not found' });
      return;
    }

    const updatedSite = await prisma.trialSite.update({
      where: { id },
      data: validatedData,
      include: {
        trial: {
          select: { nctId: true, title: true },
        },
      },
    });

    await prisma.$disconnect();

    res.json({
      data: updatedSite,
      message: 'Site updated successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating site:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// PUT /sites/:id/status - Update site status
router.put('/:id/status', requireUser, requireRole('admin', 'coordinator'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;
    const { status, isActive } = req.body;

    const site = await prisma.trialSite.findUnique({ where: { id } });

    if (!site) {
      res.status(404).json({ error: 'Not Found', message: 'Site not found' });
      return;
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedSite = await prisma.trialSite.update({
      where: { id },
      data: updateData,
    });

    await prisma.$disconnect();

    res.json({
      data: updatedSite,
      message: 'Site status updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating site status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// DELETE /sites/:id - Delete a site
router.delete('/:id', requireUser, requireRole('admin'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;

    const site = await prisma.trialSite.findUnique({
      where: { id },
      include: { _count: { select: { enrollments: true } } },
    });

    if (!site) {
      res.status(404).json({ error: 'Not Found', message: 'Site not found' });
      return;
    }

    if (site._count.enrollments > 0) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Cannot delete site with active enrollments',
      });
      return;
    }

    await prisma.trialSite.delete({ where: { id } });
    await prisma.$disconnect();

    res.json({ message: 'Site deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting site:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// ==========================================
// Investigator Management
// ==========================================

// GET /sites/investigators - List investigators
router.get('/investigators/list', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { role, isActive, limit = '50', offset = '0' } = req.query;

    const where: any = {};

    if (role) {
      where.roles = { has: role as string };
    }
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [investigators, total] = await Promise.all([
      prisma.investigator.findMany({
        where,
        include: {
          siteAssignments: {
            where: { isActive: true },
            take: 5,
          },
        },
        orderBy: { lastName: 'asc' },
        take: parseInt(limit as string, 10),
        skip: parseInt(offset as string, 10),
      }),
      prisma.investigator.count({ where }),
    ]);

    await prisma.$disconnect();

    res.json({
      data: investigators,
      pagination: {
        total,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
        hasMore: parseInt(offset as string, 10) + investigators.length < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching investigators:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /sites/investigators - Create investigator
router.post('/investigators', requireUser, requireRole('admin'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const validatedData = createInvestigatorSchema.parse(req.body);

    const investigator = await prisma.investigator.create({
      data: {
        ...validatedData,
        certifications: validatedData.certifications || [],
        trainingRecords: [],
      } as any,
    });

    await prisma.$disconnect();

    res.status(201).json({
      data: investigator,
      message: 'Investigator created successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      res.status(409).json({
        error: 'Conflict',
        message: `An investigator with this ${field} already exists`,
      });
      return;
    }
    console.error('Error creating investigator:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /sites/investigators/:id - Get investigator
router.get('/investigators/:id', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;

    const investigator = await prisma.investigator.findUnique({
      where: { id },
      include: {
        siteAssignments: {
          where: { isActive: true },
          orderBy: { startDate: 'desc' },
        },
      },
    });

    await prisma.$disconnect();

    if (!investigator) {
      res.status(404).json({ error: 'Not Found', message: 'Investigator not found' });
      return;
    }

    res.json({ data: investigator });
  } catch (error: any) {
    console.error('Error fetching investigator:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /sites/:siteId/assign-investigator - Assign investigator to site
router.post('/:siteId/assign-investigator', requireUser, requireRole('admin', 'coordinator'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { siteId } = req.params;
    const { investigatorId, trialId, role } = req.body;

    const site = await prisma.trialSite.findUnique({ where: { id: siteId } });
    if (!site) {
      res.status(404).json({ error: 'Not Found', message: 'Site not found' });
      return;
    }

    const investigator = await prisma.investigator.findUnique({ where: { id: investigatorId } });
    if (!investigator) {
      res.status(404).json({ error: 'Not Found', message: 'Investigator not found' });
      return;
    }

    const assignment = await prisma.investigatorSiteAssignment.create({
      data: {
        investigatorId,
        siteId,
        trialId: trialId || site.trialId,
        role,
      },
      include: {
        investigator: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    await prisma.$disconnect();

    res.status(201).json({
      data: assignment,
      message: 'Investigator assigned successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({
        error: 'Conflict',
        message: 'This investigator is already assigned to this site with the same role',
      });
      return;
    }
    console.error('Error assigning investigator:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /sites/:id/statistics - Get site statistics
router.get('/:id/statistics', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;

    const site = await prisma.trialSite.findUnique({
      where: { id },
      include: {
        enrollments: {
          select: { status: true, enrollmentDate: true },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    await prisma.$disconnect();

    if (!site) {
      res.status(404).json({ error: 'Not Found', message: 'Site not found' });
      return;
    }

    const statusBreakdown = site.enrollments.reduce((acc: any, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    }, {});

    // Monthly enrollment trend
    const last6Months = new Array(6).fill(0).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        count: site.enrollments.filter((e) => {
          if (!e.enrollmentDate) return false;
          const enrollDate = new Date(e.enrollmentDate);
          return (
            enrollDate.getMonth() === date.getMonth() &&
            enrollDate.getFullYear() === date.getFullYear()
          );
        }).length,
      };
    }).reverse();

    res.json({
      data: {
        siteId: id,
        facilityName: site.facilityName,
        currentEnrollment: site.currentEnrollment,
        targetEnrollment: site.targetEnrollment,
        enrollmentProgress: site.targetEnrollment
          ? Math.round((site.currentEnrollment / site.targetEnrollment) * 100)
          : null,
        statusBreakdown,
        monthlyTrend: last6Months,
      },
    });
  } catch (error: any) {
    console.error('Error fetching site statistics:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;
