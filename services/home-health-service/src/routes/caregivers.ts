import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser, requireSupervisor } from '../middleware/extractUser';
import schedulingService from '../services/scheduling.service';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const createCaregiverSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  licenseNumber: z.string().optional(),
  licenseType: z.enum(['RN', 'LPN', 'LVN', 'CNA', 'HHA', 'PT', 'OT', 'ST', 'MSW', 'OTHER']).optional(),
  licenseExpiry: z.string().datetime().optional(),
  certifications: z.array(z.any()).optional(),
  specialties: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  hourlyRate: z.number().optional(),
  maxDailyVisits: z.number().min(1).max(20).optional(),
  maxWeeklyHours: z.number().min(1).max(80).optional(),
  homeLatitude: z.number().min(-90).max(90).optional(),
  homeLongitude: z.number().min(-180).max(180).optional(),
  homeAddress: z.string().optional(),
  serviceRadius: z.number().min(1).max(100).optional(),
});

const updateCaregiverSchema = createCaregiverSchema.partial().omit({ userId: true });

const scheduleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isAvailable: z.boolean().optional(),
});

const locationUpdateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// Get all caregivers
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const { status, licenseType, specialty, limit, offset } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (licenseType) where.licenseType = licenseType;
    if (specialty) where.specialties = { has: specialty as string };

    const caregivers = await prisma.caregiver.findMany({
      where,
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        licenseType: true,
        licenseExpiry: true,
        specialties: true,
        languages: true,
        status: true,
        maxDailyVisits: true,
        serviceRadius: true,
        createdAt: true,
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      take: limit ? parseInt(limit as string) : 50,
      skip: offset ? parseInt(offset as string) : 0,
    });

    const total = await prisma.caregiver.count({ where });

    res.json({ data: caregivers, total, limit: limit || 50, offset: offset || 0 });
  } catch (error) {
    console.error('Error fetching caregivers:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch caregivers' });
  }
});

// Get current caregiver profile
router.get('/me', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;

    const caregiver = await prisma.caregiver.findUnique({
      where: { userId },
      include: {
        schedules: { orderBy: { dayOfWeek: 'asc' } },
      },
    });

    if (!caregiver) {
      res.status(404).json({ error: 'Not Found', message: 'Caregiver profile not found' });
      return;
    }

    res.json({ data: caregiver });
  } catch (error) {
    console.error('Error fetching caregiver profile:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch profile' });
  }
});

// Get caregiver by ID
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const caregiver = await prisma.caregiver.findUnique({
      where: { id: req.params.id },
      include: {
        schedules: { orderBy: { dayOfWeek: 'asc' } },
      },
    });

    if (!caregiver) {
      res.status(404).json({ error: 'Not Found', message: 'Caregiver not found' });
      return;
    }

    res.json({ data: caregiver });
  } catch (error) {
    console.error('Error fetching caregiver:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch caregiver' });
  }
});

// Create new caregiver
router.post('/', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const validatedData = createCaregiverSchema.parse(req.body);

    const caregiver = await prisma.caregiver.create({
      data: {
        ...validatedData,
        licenseExpiry: validatedData.licenseExpiry ? new Date(validatedData.licenseExpiry) : null,
        certifications: validatedData.certifications || [],
        specialties: validatedData.specialties || [],
        languages: validatedData.languages || ['English'],
      } as any,
    });

    res.status(201).json({ data: caregiver, message: 'Caregiver created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating caregiver:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create caregiver' });
  }
});

// Update caregiver
router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = updateCaregiverSchema.parse(req.body);
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only allow self-update for non-supervisors
    const caregiver = await prisma.caregiver.findUnique({ where: { id: req.params.id } });
    if (!caregiver) {
      res.status(404).json({ error: 'Not Found', message: 'Caregiver not found' });
      return;
    }

    if (caregiver.userId !== userId && !['admin', 'supervisor'].includes(userRole)) {
      res.status(403).json({ error: 'Forbidden', message: 'Cannot update other caregiver profiles' });
      return;
    }

    const updateData: any = { ...validatedData };
    if (validatedData.licenseExpiry) {
      updateData.licenseExpiry = new Date(validatedData.licenseExpiry);
    }

    const updated = await prisma.caregiver.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ data: updated, message: 'Caregiver updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating caregiver:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update caregiver' });
  }
});

// Update caregiver status
router.patch('/:id/status', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive', 'on_leave', 'terminated'].includes(status)) {
      res.status(400).json({ error: 'Validation Error', message: 'Invalid status' });
      return;
    }

    const caregiver = await prisma.caregiver.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json({ data: caregiver, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update status' });
  }
});

// Update caregiver location (for GPS tracking)
router.post('/:id/location', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = locationUpdateSchema.parse(req.body);

    const caregiver = await schedulingService.updateCaregiverLocation(
      req.params.id,
      validatedData as any
    );

    res.json({
      data: {
        currentLatitude: caregiver.currentLatitude,
        currentLongitude: caregiver.currentLongitude,
        lastLocationUpdate: caregiver.lastLocationUpdate,
      },
      message: 'Location updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update location' });
  }
});

// Get caregiver schedule
router.get('/:id/schedule', requireUser, async (req: UserRequest, res) => {
  try {
    const schedules = await prisma.caregiverSchedule.findMany({
      where: { caregiverId: req.params.id },
      orderBy: { dayOfWeek: 'asc' },
    });

    res.json({ data: schedules });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch schedule' });
  }
});

// Set caregiver schedule
router.put('/:id/schedule', requireUser, async (req: UserRequest, res) => {
  try {
    const { schedules } = req.body;

    if (!Array.isArray(schedules)) {
      res.status(400).json({ error: 'Validation Error', message: 'schedules must be an array' });
      return;
    }

    // Validate each schedule entry
    const validatedSchedules = schedules.map(s => scheduleSchema.parse(s));

    // Delete existing schedules
    await prisma.caregiverSchedule.deleteMany({
      where: { caregiverId: req.params.id },
    });

    // Create new schedules
    const created = await prisma.caregiverSchedule.createMany({
      data: validatedSchedules.map(s => ({
        caregiverId: req.params.id,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        isAvailable: s.isAvailable ?? true,
      })),
    });

    const newSchedules = await prisma.caregiverSchedule.findMany({
      where: { caregiverId: req.params.id },
      orderBy: { dayOfWeek: 'asc' },
    });

    res.json({ data: newSchedules, message: 'Schedule updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update schedule' });
  }
});

// Get caregiver's weekly schedule with visits
router.get('/:id/weekly-schedule', requireUser, async (req: UserRequest, res) => {
  try {
    const { startDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date();

    const schedule = await schedulingService.getCaregiverWeeklySchedule(req.params.id, start);
    res.json({ data: schedule });
  } catch (error) {
    console.error('Error fetching weekly schedule:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch weekly schedule' });
  }
});

// Get caregiver time entries
router.get('/:id/time-entries', requireUser, async (req: UserRequest, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    const where: any = { caregiverId: req.params.id };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate as string);
      if (endDate) where.startTime.lte = new Date(endDate as string);
    }

    if (status) where.status = status;

    const entries = await prisma.timeEntry.findMany({
      where,
      orderBy: { startTime: 'desc' },
    });

    // Calculate totals
    const totals = {
      totalEntries: entries.length,
      totalMinutes: entries.reduce((sum, e) => sum + (e.duration || 0), 0),
      visitMinutes: entries.filter(e => e.entryType === 'visit').reduce((sum, e) => sum + (e.duration || 0), 0),
      travelMinutes: entries.filter(e => e.entryType === 'travel').reduce((sum, e) => sum + (e.duration || 0), 0),
    };

    res.json({ data: entries, totals });
  } catch (error) {
    console.error('Error fetching time entries:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch time entries' });
  }
});

// Get caregiver mileage entries
router.get('/:id/mileage', requireUser, async (req: UserRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(1));
    const end = endDate ? new Date(endDate as string) : new Date();

    const summary = await schedulingService.getMileageSummary(req.params.id, start, end);

    const entries = await prisma.mileageEntry.findMany({
      where: {
        caregiverId: req.params.id,
        date: { gte: start, lte: end },
      },
      orderBy: { date: 'desc' },
    });

    res.json({ data: entries, summary });
  } catch (error) {
    console.error('Error fetching mileage:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch mileage' });
  }
});

// Record mileage entry
router.post('/:id/mileage', requireUser, async (req: UserRequest, res) => {
  try {
    const entry = await schedulingService.recordMileage({
      caregiverId: req.params.id,
      startAddress: req.body.startAddress,
      endAddress: req.body.endAddress,
      distance: req.body.distance,
      purpose: req.body.purpose,
      startLocation: req.body.startLocation,
      endLocation: req.body.endLocation,
      routeData: req.body.routeData,
    });

    res.status(201).json({ data: entry, message: 'Mileage recorded successfully' });
  } catch (error) {
    console.error('Error recording mileage:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to record mileage' });
  }
});

// Approve time entry
router.post('/time-entries/:entryId/approve', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;

    const entry = await prisma.timeEntry.update({
      where: { id: req.params.entryId },
      data: {
        status: 'approved',
        approvedBy: userId,
        approvedAt: new Date(),
        notes: req.body.notes,
      },
    });

    res.json({ data: entry, message: 'Time entry approved' });
  } catch (error) {
    console.error('Error approving time entry:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to approve time entry' });
  }
});

// Approve mileage entry
router.post('/mileage/:entryId/approve', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;

    const entry = await prisma.mileageEntry.update({
      where: { id: req.params.entryId },
      data: {
        status: 'approved',
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });

    res.json({ data: entry, message: 'Mileage entry approved' });
  } catch (error) {
    console.error('Error approving mileage:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to approve mileage' });
  }
});

// Get caregivers with expiring licenses
router.get('/reports/expiring-licenses', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const caregivers = await prisma.caregiver.findMany({
      where: {
        status: 'active',
        licenseExpiry: {
          lte: thirtyDaysFromNow,
          gte: new Date(),
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        licenseType: true,
        licenseNumber: true,
        licenseExpiry: true,
      },
      orderBy: { licenseExpiry: 'asc' },
    });

    res.json({ data: caregivers, count: caregivers.length });
  } catch (error) {
    console.error('Error fetching expiring licenses:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch expiring licenses' });
  }
});

export default router;
