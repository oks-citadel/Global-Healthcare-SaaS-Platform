import { Router, Response } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import DeviceSecurityService, {
  VulnerabilitySeverity,
  VulnerabilityStatus,
  PatchCriticality,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  DeviceRecallAction,
  RecallStatus,
  RecallClass,
  RiskLevel,
  AdvisoryStatus,
} from '../services/DeviceSecurityService';
import { DeviceStatus, DeviceType } from '../generated/client';

const router: ReturnType<typeof Router> = Router();

// ==========================================
// Validation Schemas
// ==========================================

const vulnerabilityScanSchema = z.object({
  scanType: z.enum(['quick', 'full', 'targeted']).optional().default('full'),
});

const vulnerabilityStatusUpdateSchema = z.object({
  status: z.enum([
    'open',
    'in_progress',
    'mitigated',
    'resolved',
    'accepted_risk',
    'false_positive',
  ] as const),
  notes: z.string().optional(),
});

const schedulePatchSchema = z.object({
  patchVersion: z.string().min(1),
  description: z.string().optional(),
  releaseNotes: z.string().optional(),
  criticality: z.enum(['critical', 'security', 'recommended', 'optional'] as const).optional(),
  scheduledDate: z.string().datetime().optional(),
  testingRequired: z.boolean().optional(),
  vulnerabilitiesFixed: z.array(z.string()).optional(),
});

const patchApprovalSchema = z.object({
  notes: z.string().optional(),
});

const reportIncidentSchema = z.object({
  deviceId: z.string().uuid().optional(),
  incidentType: z.enum([
    'unauthorized_access',
    'data_breach',
    'malware',
    'ransomware',
    'firmware_tampering',
    'network_intrusion',
    'denial_of_service',
    'physical_tampering',
    'configuration_change',
    'anomalous_behavior',
    'credential_compromise',
    'other',
  ] as const),
  severity: z.enum(['critical', 'high', 'medium', 'low'] as const),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  affectedSystems: z.array(z.string()).optional(),
  affectedPatients: z.array(z.string()).optional(),
});

const updateIncidentStatusSchema = z.object({
  status: z.enum([
    'detected',
    'investigating',
    'contained',
    'eradicating',
    'recovering',
    'resolved',
    'closed',
  ] as const),
  notes: z.string().optional(),
});

const networkSegmentAssignmentSchema = z.object({
  segmentId: z.string().uuid(),
  ipAddress: z.string().ip().optional(),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).optional(),
});

const recallStatusUpdateSchema = z.object({
  recallId: z.string().uuid(),
  action: z.enum([
    'pending',
    'under_review',
    'device_replaced',
    'device_repaired',
    'device_removed',
    'no_action_required',
    'patient_contacted',
  ] as const),
  notes: z.string().optional(),
});

const firmwareUpdateSchema = z.object({
  firmwareVersion: z.string().min(1),
});

// ==========================================
// Middleware for Role-Based Access
// ==========================================

const requireSecurityRole = (
  req: UserRequest,
  res: Response,
  next: () => void
): void => {
  const allowedRoles = ['admin', 'security_admin', 'biomedical_engineer', 'it_admin'];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'This action requires security administrator privileges',
    });
    return;
  }
  next();
};

// ==========================================
// Device Security Inventory Endpoints
// ==========================================

/**
 * GET /devices/security/inventory
 * Get comprehensive security inventory of all devices
 */
router.get('/security/inventory', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const {
      status,
      deviceType,
      hasVulnerabilities,
      hasPendingPatches,
      riskLevel,
      networkSegmentId,
      limit,
      offset,
    } = req.query;

    const inventory = await DeviceSecurityService.getSecurityInventory({
      status: status as DeviceStatus | undefined,
      deviceType: deviceType as DeviceType | undefined,
      hasVulnerabilities: hasVulnerabilities === 'true' ? true : hasVulnerabilities === 'false' ? false : undefined,
      hasPendingPatches: hasPendingPatches === 'true' ? true : hasPendingPatches === 'false' ? false : undefined,
      riskLevel: riskLevel as RiskLevel | undefined,
      networkSegmentId: networkSegmentId as string | undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
    });

    res.json({
      data: inventory,
      count: inventory.length,
      message: 'Security inventory retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching security inventory:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch security inventory',
    });
  }
});

/**
 * GET /devices/security/dashboard
 * Get security dashboard metrics
 */
router.get('/security/dashboard', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const metrics = await DeviceSecurityService.getSecurityDashboard();

    res.json({
      data: metrics,
      message: 'Security dashboard metrics retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching security dashboard:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch security dashboard metrics',
    });
  }
});

// ==========================================
// Vulnerability Management Endpoints
// ==========================================

/**
 * POST /devices/:id/vulnerability-scan
 * Trigger a vulnerability scan for a device
 */
router.post(
  '/:id/vulnerability-scan',
  requireUser,
  requireSecurityRole,
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const validation = vulnerabilityScanSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          details: validation.error.errors,
        });
        return;
      }

      const result = await DeviceSecurityService.triggerVulnerabilityScan(
        id,
        userId,
        validation.data.scanType
      );

      res.json({
        data: result,
        message: 'Vulnerability scan completed successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Device not found') {
        res.status(404).json({
          error: 'Not Found',
          message: 'Device not found',
        });
        return;
      }
      console.error('Error triggering vulnerability scan:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to trigger vulnerability scan',
      });
    }
  }
);

/**
 * GET /devices/:id/vulnerabilities
 * Get vulnerabilities for a specific device
 */
router.get('/:id/vulnerabilities', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { severity, status, includeResolved } = req.query;

    const vulnerabilities = await DeviceSecurityService.getDeviceVulnerabilities(id, {
      severity: severity as VulnerabilitySeverity | undefined,
      status: status as VulnerabilityStatus | undefined,
      includeResolved: includeResolved === 'true',
    });

    res.json({
      data: vulnerabilities,
      count: vulnerabilities.length,
      message: 'Device vulnerabilities retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching device vulnerabilities:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch device vulnerabilities',
    });
  }
});

/**
 * PUT /devices/vulnerabilities/:vulnerabilityId/status
 * Update vulnerability status
 */
router.put(
  '/vulnerabilities/:vulnerabilityId/status',
  requireUser,
  requireSecurityRole,
  async (req: UserRequest, res: Response) => {
    try {
      const { vulnerabilityId } = req.params;
      const userId = req.user!.id;

      const validation = vulnerabilityStatusUpdateSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          details: validation.error.errors,
        });
        return;
      }

      const updated = await DeviceSecurityService.updateVulnerabilityStatus(
        vulnerabilityId,
        validation.data.status as VulnerabilityStatus,
        userId,
        validation.data.notes
      );

      res.json({
        data: updated,
        message: 'Vulnerability status updated successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Vulnerability not found') {
        res.status(404).json({
          error: 'Not Found',
          message: 'Vulnerability not found',
        });
        return;
      }
      console.error('Error updating vulnerability status:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update vulnerability status',
      });
    }
  }
);

// ==========================================
// Patch Management Endpoints
// ==========================================

/**
 * POST /devices/:id/patch
 * Schedule a patch for a device
 */
router.post(
  '/:id/patch',
  requireUser,
  requireSecurityRole,
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const validation = schedulePatchSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          details: validation.error.errors,
        });
        return;
      }

      const patch = await DeviceSecurityService.schedulePatch(
        id,
        {
          ...validation.data,
          criticality: validation.data.criticality as PatchCriticality | undefined,
          scheduledDate: validation.data.scheduledDate
            ? new Date(validation.data.scheduledDate)
            : undefined,
        } as any,
        userId
      );

      res.status(201).json({
        data: patch,
        message: 'Patch scheduled successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Device not found') {
        res.status(404).json({
          error: 'Not Found',
          message: 'Device not found',
        });
        return;
      }
      console.error('Error scheduling patch:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to schedule patch',
      });
    }
  }
);

/**
 * GET /devices/:id/patches
 * Get patches for a specific device
 */
router.get('/:id/patches', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { includeCompleted } = req.query;

    const patches = await DeviceSecurityService.getDevicePatches(
      id,
      includeCompleted === 'true'
    );

    res.json({
      data: patches,
      count: patches.length,
      message: 'Device patches retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching device patches:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch device patches',
    });
  }
});

/**
 * POST /devices/patches/:patchId/approve
 * Approve a patch
 */
router.post(
  '/patches/:patchId/approve',
  requireUser,
  requireSecurityRole,
  async (req: UserRequest, res: Response) => {
    try {
      const { patchId } = req.params;
      const userId = req.user!.id;

      const validation = patchApprovalSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          details: validation.error.errors,
        });
        return;
      }

      const approved = await DeviceSecurityService.approvePatch(
        patchId,
        userId,
        validation.data.notes
      );

      res.json({
        data: approved,
        message: 'Patch approved successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Patch not found') {
        res.status(404).json({
          error: 'Not Found',
          message: 'Patch not found',
        });
        return;
      }
      console.error('Error approving patch:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to approve patch',
      });
    }
  }
);

/**
 * POST /devices/patches/:patchId/apply
 * Apply a patch to a device
 */
router.post(
  '/patches/:patchId/apply',
  requireUser,
  requireSecurityRole,
  async (req: UserRequest, res: Response) => {
    try {
      const { patchId } = req.params;
      const userId = req.user!.id;

      const result = await DeviceSecurityService.applyPatch(patchId, userId);

      res.json({
        data: result,
        message: 'Patch applied successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Patch not found') {
        res.status(404).json({
          error: 'Not Found',
          message: 'Patch not found',
        });
        return;
      }
      if (
        error instanceof Error &&
        error.message.includes('must be approved or scheduled')
      ) {
        res.status(400).json({
          error: 'Bad Request',
          message: error.message,
        });
        return;
      }
      console.error('Error applying patch:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to apply patch',
      });
    }
  }
);

// ==========================================
// FDA Recall Endpoints
// ==========================================

/**
 * GET /devices/recalls
 * Get FDA recall alerts
 */
router.get('/recalls', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { status, recallClass, manufacturer, includeDeviceMatches } = req.query;

    const recalls = await DeviceSecurityService.getRecallAlerts({
      status: status as RecallStatus | undefined,
      recallClass: recallClass as RecallClass | undefined,
      manufacturer: manufacturer as string | undefined,
      includeDeviceMatches: includeDeviceMatches === 'true',
    });

    res.json({
      data: recalls,
      count: recalls.length,
      message: 'FDA recall alerts retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching FDA recalls:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch FDA recall alerts',
    });
  }
});

/**
 * GET /devices/:id/recall-status
 * Check device for matching recalls
 */
router.get('/:id/recall-status', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const recallStatuses = await DeviceSecurityService.checkDeviceRecalls(id);

    res.json({
      data: recallStatuses,
      count: recallStatuses.length,
      message: 'Device recall status checked successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Device not found') {
      res.status(404).json({
        error: 'Not Found',
        message: 'Device not found',
      });
      return;
    }
    console.error('Error checking device recalls:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to check device recall status',
    });
  }
});

/**
 * PUT /devices/:id/recall-status
 * Update recall status for a device
 */
router.put(
  '/:id/recall-status',
  requireUser,
  requireSecurityRole,
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const validation = recallStatusUpdateSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          details: validation.error.errors,
        });
        return;
      }

      const updated = await DeviceSecurityService.updateRecallStatus(
        id,
        validation.data.recallId,
        validation.data.action as DeviceRecallAction,
        userId,
        validation.data.notes
      );

      res.json({
        data: updated,
        message: 'Recall status updated successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Device recall status not found') {
        res.status(404).json({
          error: 'Not Found',
          message: 'Device recall status not found',
        });
        return;
      }
      console.error('Error updating recall status:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update recall status',
      });
    }
  }
);

// ==========================================
// Security Incident Endpoints
// ==========================================

/**
 * POST /devices/:id/incident
 * Report a security incident for a device
 */
router.post(
  '/:id/incident',
  requireUser,
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const validation = reportIncidentSchema.safeParse({
        ...req.body,
        deviceId: id,
      });

      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          details: validation.error.errors,
        });
        return;
      }

      const incident = await DeviceSecurityService.reportIncident(
        {
          ...validation.data,
          incidentType: validation.data.incidentType as IncidentType,
          severity: validation.data.severity as IncidentSeverity,
        } as any,
        userId
      );

      res.status(201).json({
        data: incident,
        message: 'Security incident reported successfully',
      });
    } catch (error) {
      console.error('Error reporting security incident:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to report security incident',
      });
    }
  }
);

/**
 * POST /devices/security/incidents
 * Report a general security incident (not necessarily device-specific)
 */
router.post(
  '/security/incidents',
  requireUser,
  async (req: UserRequest, res: Response) => {
    try {
      const userId = req.user!.id;

      const validation = reportIncidentSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          details: validation.error.errors,
        });
        return;
      }

      const incident = await DeviceSecurityService.reportIncident(
        {
          ...validation.data,
          incidentType: validation.data.incidentType as IncidentType,
          severity: validation.data.severity as IncidentSeverity,
        } as any,
        userId
      );

      res.status(201).json({
        data: incident,
        message: 'Security incident reported successfully',
      });
    } catch (error) {
      console.error('Error reporting security incident:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to report security incident',
      });
    }
  }
);

/**
 * GET /devices/security/incidents
 * Get security incidents
 */
router.get('/security/incidents', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { deviceId, status, severity, incidentType, startDate, endDate } = req.query;

    const incidents = await DeviceSecurityService.getIncidents({
      deviceId: deviceId as string | undefined,
      status: status as IncidentStatus | undefined,
      severity: severity as IncidentSeverity | undefined,
      incidentType: incidentType as IncidentType | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    res.json({
      data: incidents,
      count: incidents.length,
      message: 'Security incidents retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching security incidents:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch security incidents',
    });
  }
});

/**
 * PUT /devices/security/incidents/:incidentId/status
 * Update security incident status
 */
router.put(
  '/security/incidents/:incidentId/status',
  requireUser,
  requireSecurityRole,
  async (req: UserRequest, res: Response) => {
    try {
      const { incidentId } = req.params;
      const userId = req.user!.id;

      const validation = updateIncidentStatusSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          details: validation.error.errors,
        });
        return;
      }

      const updated = await DeviceSecurityService.updateIncidentStatus(
        incidentId,
        validation.data.status as IncidentStatus,
        userId,
        validation.data.notes
      );

      res.json({
        data: updated,
        message: 'Incident status updated successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Incident not found') {
        res.status(404).json({
          error: 'Not Found',
          message: 'Incident not found',
        });
        return;
      }
      console.error('Error updating incident status:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update incident status',
      });
    }
  }
);

// ==========================================
// Network Segmentation Endpoints
// ==========================================

/**
 * GET /devices/security/network-segments
 * Get all network segments
 */
router.get('/security/network-segments', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { includeDevices } = req.query;

    const segments = await DeviceSecurityService.getNetworkSegments(
      includeDevices === 'true'
    );

    res.json({
      data: segments,
      count: segments.length,
      message: 'Network segments retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching network segments:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch network segments',
    });
  }
});

/**
 * PUT /devices/:id/network-segment
 * Assign device to a network segment
 */
router.put(
  '/:id/network-segment',
  requireUser,
  requireSecurityRole,
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const validation = networkSegmentAssignmentSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          details: validation.error.errors,
        });
        return;
      }

      const assignment = await DeviceSecurityService.assignDeviceToSegment(
        id,
        validation.data.segmentId,
        userId,
        {
          ipAddress: validation.data.ipAddress,
          macAddress: validation.data.macAddress,
        }
      );

      res.json({
        data: assignment,
        message: 'Device assigned to network segment successfully',
      });
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'Device not found' || error.message === 'Network segment not found')
      ) {
        res.status(404).json({
          error: 'Not Found',
          message: error.message,
        });
        return;
      }
      console.error('Error assigning device to network segment:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to assign device to network segment',
      });
    }
  }
);

/**
 * POST /devices/:id/network-compliance
 * Verify network compliance for a device
 */
router.post(
  '/:id/network-compliance',
  requireUser,
  requireSecurityRole,
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const results = await DeviceSecurityService.verifyNetworkCompliance(id, userId);

      res.json({
        data: results,
        count: results.length,
        message: 'Network compliance verification completed',
      });
    } catch (error) {
      console.error('Error verifying network compliance:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to verify network compliance',
      });
    }
  }
);

// ==========================================
// Risk Scoring Endpoints
// ==========================================

/**
 * GET /devices/:id/risk-score
 * Calculate and get risk score for a device
 */
router.get('/:id/risk-score', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const riskScore = await DeviceSecurityService.calculateDeviceRiskScore(id, userId);

    res.json({
      data: riskScore,
      message: 'Device risk score calculated successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Device not found') {
      res.status(404).json({
        error: 'Not Found',
        message: 'Device not found',
      });
      return;
    }
    console.error('Error calculating device risk score:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to calculate device risk score',
    });
  }
});

// ==========================================
// Device Lifecycle Endpoints
// ==========================================

/**
 * GET /devices/:id/lifecycle
 * Get device lifecycle status
 */
router.get('/:id/lifecycle', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const lifecycleStatus = await DeviceSecurityService.getDeviceLifecycleStatus(id);

    res.json({
      data: lifecycleStatus,
      message: 'Device lifecycle status retrieved successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Device not found') {
      res.status(404).json({
        error: 'Not Found',
        message: 'Device not found',
      });
      return;
    }
    console.error('Error fetching device lifecycle status:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch device lifecycle status',
    });
  }
});

/**
 * PUT /devices/:id/firmware
 * Update device firmware version
 */
router.put(
  '/:id/firmware',
  requireUser,
  requireSecurityRole,
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const validation = firmwareUpdateSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          details: validation.error.errors,
        });
        return;
      }

      const updated = await DeviceSecurityService.updateDeviceFirmware(
        id,
        validation.data.firmwareVersion,
        userId
      );

      res.json({
        data: updated,
        message: 'Device firmware version updated successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Device not found') {
        res.status(404).json({
          error: 'Not Found',
          message: 'Device not found',
        });
        return;
      }
      console.error('Error updating device firmware:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update device firmware',
      });
    }
  }
);

// ==========================================
// Manufacturer Advisory Endpoints
// ==========================================

/**
 * GET /devices/security/advisories
 * Get manufacturer security advisories
 */
router.get('/security/advisories', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { manufacturer, severity, status } = req.query;

    const advisories = await DeviceSecurityService.getManufacturerAdvisories({
      manufacturer: manufacturer as string | undefined,
      severity: severity as VulnerabilitySeverity | undefined,
      status: status as AdvisoryStatus | undefined,
    });

    res.json({
      data: advisories,
      count: advisories.length,
      message: 'Manufacturer advisories retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching manufacturer advisories:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch manufacturer advisories',
    });
  }
});

/**
 * POST /devices/security/advisories/:advisoryId/acknowledge
 * Acknowledge a manufacturer advisory
 */
router.post(
  '/security/advisories/:advisoryId/acknowledge',
  requireUser,
  requireSecurityRole,
  async (req: UserRequest, res: Response) => {
    try {
      const { advisoryId } = req.params;
      const userId = req.user!.id;

      const acknowledged = await DeviceSecurityService.acknowledgeAdvisory(
        advisoryId,
        userId
      );

      res.json({
        data: acknowledged,
        message: 'Advisory acknowledged successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Advisory not found') {
        res.status(404).json({
          error: 'Not Found',
          message: 'Advisory not found',
        });
        return;
      }
      console.error('Error acknowledging advisory:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to acknowledge advisory',
      });
    }
  }
);

// ==========================================
// Audit Log Endpoints
// ==========================================

/**
 * GET /devices/security/audit-logs
 * Get security audit logs
 */
router.get(
  '/security/audit-logs',
  requireUser,
  requireSecurityRole,
  async (req: UserRequest, res: Response) => {
    try {
      const { entityType, entityId, action, performedBy, startDate, endDate, limit } =
        req.query;

      const auditLogs = await DeviceSecurityService.getSecurityAuditLogs({
        entityType: entityType as string | undefined,
        entityId: entityId as string | undefined,
        action: action as string | undefined,
        performedBy: performedBy as string | undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      res.json({
        data: auditLogs,
        count: auditLogs.length,
        message: 'Security audit logs retrieved successfully',
      });
    } catch (error) {
      console.error('Error fetching security audit logs:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch security audit logs',
      });
    }
  }
);

export default router;
