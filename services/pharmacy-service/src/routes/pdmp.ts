// @ts-nocheck
import { Router } from 'express';
import { UserRequest, requireUser } from '../middleware/extractUser';
import PDMPService from '../services/PDMPService';

const router: ReturnType<typeof Router> = Router();

/**
 * GET /controlled-substances/:patientId
 * Check PDMP for patient controlled substance history
 */
router.get('/:patientId', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'provider' && req.user!.role !== 'pharmacist') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers and pharmacists can access PDMP data',
      });
      return;
    }

    const { patientId } = req.params;
    const { deaSchedule } = req.query;

    const pdmpCheck = await PDMPService.checkPDMP(
      patientId,
      deaSchedule as string | undefined
    );

    res.json({
      data: pdmpCheck,
      message: pdmpCheck.requiresIntervention
        ? 'PDMP alerts detected - intervention required'
        : pdmpCheck.hasAlerts
        ? 'PDMP alerts detected - review recommended'
        : 'No PDMP alerts',
    });
  } catch (error) {
    console.error('Error checking PDMP:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to check PDMP',
    });
  }
});

/**
 * GET /controlled-substances/history/:patientId
 * Get detailed controlled substance history
 */
router.get('/history/:patientId', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'provider' && req.user!.role !== 'pharmacist') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers and pharmacists can access controlled substance history',
      });
      return;
    }

    const { patientId } = req.params;
    const { startDate, endDate, deaSchedule, limit } = req.query;

    const history = await PDMPService.getPatientControlledSubstanceHistory(
      patientId,
      {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        deaSchedule: deaSchedule as string | undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      }
    );

    res.json({
      data: history,
      count: history.length,
    });
  } catch (error) {
    console.error('Error fetching controlled substance history:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch controlled substance history',
    });
  }
});

/**
 * POST /controlled-substances/report/:logId
 * Report controlled substance dispensing to PDMP
 */
router.post('/report/:logId', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'pharmacist' && req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only pharmacists can report to PDMP',
      });
      return;
    }

    const { logId } = req.params;

    const result = await PDMPService.reportToPDMP(logId);

    res.json({
      data: result,
      message: 'Successfully reported to PDMP',
    });
  } catch (error: any) {
    console.error('Error reporting to PDMP:', error);
    res.status(500).json({
      error: 'PDMP Report Error',
      message: error.message || 'Failed to report to PDMP',
    });
  }
});

/**
 * GET /controlled-substances/unreported
 * Get unreported controlled substance dispensings
 */
router.get('/unreported', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'pharmacist' && req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only pharmacists can view unreported dispensings',
      });
      return;
    }

    const unreported = await PDMPService.getUnreportedDispensings();

    res.json({
      data: unreported,
      count: unreported.length,
    });
  } catch (error) {
    console.error('Error fetching unreported dispensings:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch unreported dispensings',
    });
  }
});

/**
 * POST /controlled-substances/bulk-report
 * Bulk report unreported controlled substance dispensings
 */
router.post('/bulk-report', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'pharmacist' && req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only pharmacists can bulk report to PDMP',
      });
      return;
    }

    const result = await PDMPService.bulkReportToPDMP();

    res.json({
      data: result,
      message: `Bulk report completed: ${result.successful} successful, ${result.failed} failed`,
    });
  } catch (error) {
    console.error('Error bulk reporting to PDMP:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to bulk report to PDMP',
    });
  }
});

/**
 * GET /controlled-substances/statistics
 * Get PDMP statistics
 */
router.get('/statistics', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can view PDMP statistics',
      });
      return;
    }

    const { startDate, endDate } = req.query;

    const stats = await PDMPService.getPDMPStatistics({
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    res.json({ data: stats });
  } catch (error) {
    console.error('Error fetching PDMP statistics:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch PDMP statistics',
    });
  }
});

export default router;
