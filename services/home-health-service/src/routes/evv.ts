import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser, requireCaregiver, requireSupervisor } from '../middleware/extractUser';
import evvService from '../services/evv.service';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
});

const clockInSchema = z.object({
  visitId: z.string().uuid(),
  location: locationSchema,
  deviceId: z.string().optional(),
  deviceType: z.string().optional(),
  verificationMethod: z.enum(['gps', 'telephony', 'biometric', 'fixed_device', 'manual_override']).optional(),
});

const clockOutSchema = clockInSchema.extend({
  signature: z.string().optional(),
});

const signatureSchema = z.object({
  signatureType: z.enum(['caregiver', 'patient']),
  signature: z.string(),
  location: locationSchema,
});

// Clock in for a visit
router.post('/clock-in', requireUser, requireCaregiver, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const caregiver = await prisma.caregiver.findUnique({ where: { userId } });

    if (!caregiver) {
      res.status(404).json({ error: 'Not Found', message: 'Caregiver profile not found' });
      return;
    }

    const validatedData = clockInSchema.parse(req.body);

    const result = await evvService.clockIn({
      ...validatedData,
      caregiverId: caregiver.id,
      verificationMethod: validatedData.verificationMethod || 'gps',
      ipAddress: req.ip,
    });

    res.json({
      data: result,
      message: result.locationVerification.isWithinGeofence
        ? 'Clock-in successful - location verified'
        : 'Clock-in recorded - location outside geofence',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error clocking in:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to clock in' });
  }
});

// Clock out from a visit
router.post('/clock-out', requireUser, requireCaregiver, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const caregiver = await prisma.caregiver.findUnique({ where: { userId } });

    if (!caregiver) {
      res.status(404).json({ error: 'Not Found', message: 'Caregiver profile not found' });
      return;
    }

    const validatedData = clockOutSchema.parse(req.body);

    const result = await evvService.clockOut({
      ...validatedData,
      caregiverId: caregiver.id,
      verificationMethod: validatedData.verificationMethod || 'gps',
      ipAddress: req.ip,
    });

    res.json({
      data: result,
      message: 'Clock-out successful',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error clocking out:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to clock out' });
  }
});

// Record location update during visit
router.post('/location-update', requireUser, requireCaregiver, async (req: UserRequest, res) => {
  try {
    const { visitId, location, deviceId } = req.body;

    const validatedLocation = locationSchema.parse(location);

    const record = await evvService.recordLocationUpdate(visitId, validatedLocation, deviceId);

    res.json({ data: record, message: 'Location recorded' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error recording location:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to record location' });
  }
});

// Capture signature
router.post('/signature/:visitId', requireUser, requireCaregiver, async (req: UserRequest, res) => {
  try {
    const validatedData = signatureSchema.parse(req.body);

    const record = await evvService.captureSignature(req.params.visitId, validatedData);

    res.json({ data: record, message: 'Signature captured successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error capturing signature:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to capture signature' });
  }
});

// Verify location for a visit
router.post('/verify-location/:visitId', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedLocation = locationSchema.parse(req.body);

    const verification = await evvService.verifyLocation(req.params.visitId, validatedLocation);

    res.json({ data: verification });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error verifying location:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to verify location' });
  }
});

// Get EVV records for a visit
router.get('/records/:visitId', requireUser, async (req: UserRequest, res) => {
  try {
    const records = await evvService.getVisitEVVRecords(req.params.visitId);
    res.json({ data: records, count: records.length });
  } catch (error) {
    console.error('Error fetching EVV records:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch EVV records' });
  }
});

// Get compliance report for a visit
router.get('/compliance/:visitId', requireUser, async (req: UserRequest, res) => {
  try {
    const report = await evvService.generateComplianceReport(req.params.visitId);
    res.json({ data: report });
  } catch (error) {
    console.error('Error generating compliance report:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to generate compliance report' });
  }
});

// Bulk compliance check
router.post('/compliance/bulk', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const { visitIds } = req.body;

    if (!Array.isArray(visitIds) || visitIds.length === 0) {
      res.status(400).json({ error: 'Validation Error', message: 'visitIds array is required' });
      return;
    }

    const reports = await evvService.bulkComplianceCheck(visitIds);

    const summary = {
      total: reports.length,
      compliant: reports.filter(r => r.isCompliant).length,
      nonCompliant: reports.filter(r => !r.isCompliant).length,
      complianceRate: Math.round((reports.filter(r => r.isCompliant).length / reports.length) * 100),
    };

    res.json({ data: reports, summary });
  } catch (error) {
    console.error('Error checking compliance:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to check compliance' });
  }
});

// Get EVV statistics
router.get('/statistics', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const { startDate, endDate, caregiverId } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(1));
    const end = endDate ? new Date(endDate as string) : new Date();

    const stats = await evvService.getEVVStatistics(start, end, caregiverId as string);

    res.json({ data: stats });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch statistics' });
  }
});

// Manual override for EVV record (supervisor only)
router.post('/override/:recordId', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const { overrideReason } = req.body;
    const userId = req.user!.id;

    if (!overrideReason) {
      res.status(400).json({ error: 'Validation Error', message: 'overrideReason is required' });
      return;
    }

    const record = await evvService.manualOverride(req.params.recordId, {
      overrideReason,
      overrideBy: userId,
    });

    res.json({ data: record, message: 'EVV record overridden successfully' });
  } catch (error) {
    console.error('Error overriding EVV record:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to override EVV record' });
  }
});

// Get non-compliant visits
router.get('/non-compliant', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(new Date().getDate() - 7));
    const end = endDate ? new Date(endDate as string) : new Date();

    // Get completed visits without proper EVV records
    const visits = await prisma.homeVisit.findMany({
      where: {
        scheduledDate: { gte: start, lte: end },
        status: 'completed',
      },
      include: {
        evvRecords: true,
        caregiver: { select: { id: true, firstName: true, lastName: true } },
        patientHome: { select: { address: true, city: true } },
      },
      orderBy: { scheduledDate: 'desc' },
    });

    const nonCompliant = visits.filter(visit => {
      const clockIn = visit.evvRecords.find(r => r.recordType === 'clock_in');
      const clockOut = visit.evvRecords.find(r => r.recordType === 'clock_out');

      return (
        !clockIn ||
        !clockOut ||
        !clockIn.isWithinGeofence ||
        !clockOut.isWithinGeofence ||
        !visit.caregiverSignature
      );
    });

    res.json({
      data: nonCompliant.map(v => ({
        visitId: v.id,
        scheduledDate: v.scheduledDate,
        caregiver: v.caregiver,
        address: v.patientHome.address,
        issues: [
          ...(v.evvRecords.find(r => r.recordType === 'clock_in') ? [] : ['Missing clock-in']),
          ...(v.evvRecords.find(r => r.recordType === 'clock_out') ? [] : ['Missing clock-out']),
          ...(v.evvRecords.find(r => r.recordType === 'clock_in' && !r.isWithinGeofence)
            ? ['Clock-in outside geofence']
            : []),
          ...(v.evvRecords.find(r => r.recordType === 'clock_out' && !r.isWithinGeofence)
            ? ['Clock-out outside geofence']
            : []),
          ...(v.caregiverSignature ? [] : ['Missing signature']),
        ],
      })),
      count: nonCompliant.length,
    });
  } catch (error) {
    console.error('Error fetching non-compliant visits:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch non-compliant visits' });
  }
});

// EVV compliance dashboard
router.get('/dashboard', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayStats, weekStats, monthStats] = await Promise.all([
      evvService.getEVVStatistics(today, new Date()),
      evvService.getEVVStatistics(startOfWeek, new Date()),
      evvService.getEVVStatistics(startOfMonth, new Date()),
    ]);

    res.json({
      data: {
        today: todayStats,
        thisWeek: weekStats,
        thisMonth: monthStats,
      },
    });
  } catch (error) {
    console.error('Error fetching EVV dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch EVV dashboard' });
  }
});

export default router;
