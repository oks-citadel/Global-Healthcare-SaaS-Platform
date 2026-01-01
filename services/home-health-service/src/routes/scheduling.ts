import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser, requireSupervisor, requireCaregiver } from '../middleware/extractUser';
import schedulingService from '../services/scheduling.service';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const findCaregiverSchema = z.object({
  patientLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  visitType: z.string(),
  requiredSpecialties: z.array(z.string()).optional(),
  preferredLanguage: z.string().optional(),
  date: z.string().datetime(),
  duration: z.number().min(15).max(480),
});

const optimizeRouteSchema = z.object({
  date: z.string().datetime(),
});

// Find matching caregivers for a visit
router.post('/find-caregivers', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = findCaregiverSchema.parse(req.body);

    const matches = await schedulingService.findMatchingCaregivers({
      patientLocation: validatedData.patientLocation as any,
      visitType: validatedData.visitType,
      requiredSpecialties: validatedData.requiredSpecialties,
      preferredLanguage: validatedData.preferredLanguage,
      date: new Date(validatedData.date),
      duration: validatedData.duration,
    });

    res.json({
      data: matches,
      count: matches.length,
      message: `Found ${matches.length} matching caregivers`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error finding caregivers:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to find caregivers' });
  }
});

// Optimize route for a caregiver's day
router.post('/optimize-route/:caregiverId', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = optimizeRouteSchema.parse(req.body);

    const route = await schedulingService.optimizeRoute(
      req.params.caregiverId,
      new Date(validatedData.date)
    );

    res.json({ data: route });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error optimizing route:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to optimize route' });
  }
});

// Get optimized route for current caregiver
router.get('/my-route', requireUser, requireCaregiver, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const caregiver = await prisma.caregiver.findUnique({ where: { userId } });

    if (!caregiver) {
      res.status(404).json({ error: 'Not Found', message: 'Caregiver profile not found' });
      return;
    }

    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const route = await schedulingService.optimizeRoute(caregiver.id, date);

    res.json({ data: route });
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch route' });
  }
});

// Get estimated arrival time
router.get('/eta/:visitId', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const caregiver = await prisma.caregiver.findUnique({ where: { userId } });

    if (!caregiver) {
      res.status(404).json({ error: 'Not Found', message: 'Caregiver profile not found' });
      return;
    }

    const eta = await schedulingService.getEstimatedArrival(caregiver.id, req.params.visitId);

    if (!eta) {
      res.status(404).json({ error: 'Not Found', message: 'Could not calculate ETA' });
      return;
    }

    res.json({ data: eta });
  } catch (error) {
    console.error('Error calculating ETA:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to calculate ETA' });
  }
});

// Auto-assign caregivers for a date
router.post('/auto-assign', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      res.status(400).json({ error: 'Validation Error', message: 'date is required' });
      return;
    }

    const assignments = await schedulingService.autoAssignCaregivers(new Date(date));

    res.json({
      data: assignments,
      count: assignments.length,
      message: `Auto-assigned ${assignments.length} visits`,
    });
  } catch (error) {
    console.error('Error auto-assigning:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to auto-assign caregivers' });
  }
});

// Get available slots for a patient
router.post('/available-slots', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientHomeId, date, duration, visitType } = req.body;

    if (!patientHomeId || !date || !duration) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'patientHomeId, date, and duration are required',
      });
      return;
    }

    const patientHome = await prisma.patientHome.findUnique({
      where: { id: patientHomeId },
    });

    if (!patientHome || !patientHome.latitude || !patientHome.longitude) {
      res.status(404).json({ error: 'Not Found', message: 'Patient home not found or missing location' });
      return;
    }

    const matches = await schedulingService.findMatchingCaregivers({
      patientLocation: {
        latitude: patientHome.latitude,
        longitude: patientHome.longitude,
      },
      visitType: visitType || 'skilled_nursing',
      date: new Date(date),
      duration,
    });

    // Aggregate all available slots across caregivers
    const allSlots: { time: string; caregivers: { id: string; name: string; matchScore: number }[] }[] = [];
    const slotMap = new Map<string, { id: string; name: string; matchScore: number }[]>();

    matches.forEach(match => {
      match.availableSlots.forEach(slot => {
        if (!slotMap.has(slot)) {
          slotMap.set(slot, []);
        }
        slotMap.get(slot)!.push({
          id: match.caregiverId,
          name: match.caregiverName,
          matchScore: match.matchScore,
        });
      });
    });

    slotMap.forEach((caregivers, time) => {
      allSlots.push({ time, caregivers: caregivers.sort((a, b) => b.matchScore - a.matchScore) });
    });

    // Sort slots by time
    allSlots.sort((a, b) => a.time.localeCompare(b.time));

    res.json({ data: allSlots, date, totalSlots: allSlots.length });
  } catch (error) {
    console.error('Error finding slots:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to find available slots' });
  }
});

// Bulk schedule visits
router.post('/bulk-schedule', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const { visits } = req.body;

    if (!Array.isArray(visits) || visits.length === 0) {
      res.status(400).json({ error: 'Validation Error', message: 'visits array is required' });
      return;
    }

    const results = {
      success: [] as any[],
      failed: [] as any[],
    };

    for (const visitData of visits) {
      try {
        const visit = await prisma.homeVisit.create({
          data: {
            patientId: visitData.patientId,
            patientHomeId: visitData.patientHomeId,
            caregiverId: visitData.caregiverId,
            scheduledDate: new Date(visitData.scheduledDate),
            scheduledStartTime: visitData.scheduledStartTime,
            scheduledEndTime: visitData.scheduledEndTime,
            estimatedDuration: visitData.estimatedDuration,
            visitType: visitData.visitType,
            priority: visitData.priority || 'routine',
            reasonForVisit: visitData.reasonForVisit,
          },
        });
        results.success.push({ id: visit.id, patientId: visit.patientId });
      } catch (error: any) {
        results.failed.push({
          patientId: visitData.patientId,
          error: error.message,
        });
      }
    }

    res.json({
      data: results,
      message: `Scheduled ${results.success.length} visits, ${results.failed.length} failed`,
    });
  } catch (error) {
    console.error('Error bulk scheduling:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to bulk schedule' });
  }
});

// Get scheduling conflicts
router.get('/conflicts/:caregiverId', requireUser, async (req: UserRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date();
    const end = endDate ? new Date(endDate as string) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

    const visits = await prisma.homeVisit.findMany({
      where: {
        caregiverId: req.params.caregiverId,
        scheduledDate: { gte: start, lte: end },
        status: { in: ['scheduled', 'confirmed'] },
      },
      orderBy: [{ scheduledDate: 'asc' }, { scheduledStartTime: 'asc' }],
    });

    const conflicts: { visit1Id: string; visit2Id: string; date: Date; overlap: string }[] = [];

    // Check for overlapping visits
    for (let i = 0; i < visits.length - 1; i++) {
      const current = visits[i];
      const next = visits[i + 1];

      // Only check if same day
      if (current.scheduledDate.toDateString() === next.scheduledDate.toDateString()) {
        const currentEnd = current.scheduledEndTime;
        const nextStart = next.scheduledStartTime;

        if (currentEnd > nextStart) {
          conflicts.push({
            visit1Id: current.id,
            visit2Id: next.id,
            date: current.scheduledDate,
            overlap: `${current.scheduledEndTime} overlaps with ${next.scheduledStartTime}`,
          });
        }
      }
    }

    res.json({ data: conflicts, hasConflicts: conflicts.length > 0 });
  } catch (error) {
    console.error('Error checking conflicts:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to check conflicts' });
  }
});

// Get unassigned visits
router.get('/unassigned', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const { date } = req.query;

    const targetDate = date ? new Date(date as string) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Find visits without a proper caregiver assignment or pending
    const visits = await prisma.homeVisit.findMany({
      where: {
        scheduledDate: { gte: startOfDay, lte: endOfDay },
        status: 'scheduled',
      },
      include: {
        patientHome: true,
        caregiver: {
          select: { id: true, firstName: true, lastName: true, status: true },
        },
      },
      orderBy: { scheduledStartTime: 'asc' },
    });

    // Filter for visits where caregiver is inactive or unavailable
    const unassigned = visits.filter(v => !v.caregiver || v.caregiver.status !== 'active');

    res.json({ data: unassigned, count: unassigned.length });
  } catch (error) {
    console.error('Error fetching unassigned:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch unassigned visits' });
  }
});

// Get scheduling dashboard data
router.get('/dashboard', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const [
      todayVisits,
      weekVisits,
      activeCaregivers,
      pendingApprovals,
    ] = await Promise.all([
      prisma.homeVisit.groupBy({
        by: ['status'],
        where: { scheduledDate: { gte: today, lt: tomorrow } },
        _count: true,
      }),
      prisma.homeVisit.count({
        where: { scheduledDate: { gte: today, lt: weekEnd } },
      }),
      prisma.caregiver.count({
        where: { status: 'active' },
      }),
      prisma.timeEntry.count({
        where: { status: 'pending' },
      }),
    ]);

    const todayStats = {
      total: todayVisits.reduce((sum, v) => sum + v._count, 0),
      scheduled: todayVisits.find(v => v.status === 'scheduled')?._count || 0,
      inProgress: todayVisits.find(v => v.status === 'in_progress')?._count || 0,
      completed: todayVisits.find(v => v.status === 'completed')?._count || 0,
      cancelled: todayVisits.find(v => v.status === 'cancelled')?._count || 0,
    };

    res.json({
      data: {
        today: todayStats,
        weekTotal: weekVisits,
        activeCaregivers,
        pendingApprovals,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch dashboard' });
  }
});

export default router;
