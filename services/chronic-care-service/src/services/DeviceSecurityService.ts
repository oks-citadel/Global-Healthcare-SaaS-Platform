import { PrismaClient, DeviceType, DeviceStatus } from '../generated/client';

const prisma = new PrismaClient();

// ==========================================
// Type Definitions for Security Module
// These mirror the Prisma schema enums
// ==========================================

export type VulnerabilitySeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';
export type VulnerabilityStatus = 'open' | 'in_progress' | 'mitigated' | 'resolved' | 'accepted_risk' | 'false_positive';
export type PatchCriticality = 'critical' | 'security' | 'recommended' | 'optional';
export type PatchStatus = 'pending' | 'approved' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'rolled_back' | 'cancelled';
export type IncidentType = 'unauthorized_access' | 'data_breach' | 'malware' | 'ransomware' | 'firmware_tampering' | 'network_intrusion' | 'denial_of_service' | 'physical_tampering' | 'configuration_change' | 'anomalous_behavior' | 'credential_compromise' | 'other';
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'detected' | 'investigating' | 'contained' | 'eradicating' | 'recovering' | 'resolved' | 'closed';
export type SecurityLevel = 'critical' | 'high' | 'medium' | 'low' | 'public';
export type IsolationLevel = 'air_gapped' | 'strict' | 'standard' | 'relaxed';
export type AssignmentStatus = 'active' | 'suspended' | 'removed';
export type ComplianceStatus = 'compliant' | 'non_compliant' | 'pending' | 'exempt';
export type RecallClass = 'class_I' | 'class_II' | 'class_III';
export type RecallStatus = 'ongoing' | 'completed' | 'terminated';
export type DeviceRecallAction = 'pending' | 'under_review' | 'device_replaced' | 'device_repaired' | 'device_removed' | 'no_action_required' | 'patient_contacted';
export type AdvisoryStatus = 'active' | 'superseded' | 'resolved' | 'archived';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal';

// ==========================================
// Type Definitions
// ==========================================

interface AuditLogData {
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  performedByRole?: string;
  previousState?: object;
  newState?: object;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
  riskLevel?: string;
}

interface VulnerabilityScanResult {
  cveId?: string;
  title: string;
  description: string;
  severity: VulnerabilitySeverity;
  cvssScore?: number;
  affectedVersion?: string;
  fixedVersion?: string;
  exploitAvailable?: boolean;
  source?: string;
  references?: string[];
}

interface RiskScoreBreakdown {
  vulnerabilityScore: number;
  patchScore: number;
  networkScore: number;
  complianceScore: number;
  incidentScore: number;
  agingScore: number;
  factors: RiskFactor[];
}

interface RiskFactor {
  category: string;
  description: string;
  impact: number;
  recommendation?: string;
}

interface SecurityDashboardMetrics {
  totalDevices: number;
  devicesByStatus: Record<string, number>;
  vulnerabilityMetrics: {
    total: number;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
    criticalOpen: number;
  };
  patchMetrics: {
    pending: number;
    scheduled: number;
    overduePatches: number;
    completedLast30Days: number;
  };
  incidentMetrics: {
    active: number;
    bySeverity: Record<string, number>;
    avgResolutionTimeHours: number;
  };
  recallMetrics: {
    activeRecalls: number;
    affectedDevices: number;
    pendingActions: number;
  };
  complianceMetrics: {
    compliantDevices: number;
    nonCompliantDevices: number;
    complianceRate: number;
  };
  riskDistribution: Record<string, number>;
}

// ==========================================
// Device Security Service
// ==========================================

export class DeviceSecurityService {
  // ==========================================
  // Security Audit Logging
  // ==========================================

  private async createAuditLog(data: AuditLogData): Promise<void> {
    try {
      await prisma.securityAuditLog.create({
        data: {
          entityType: data.entityType,
          entityId: data.entityId,
          action: data.action,
          performedBy: data.performedBy,
          performedByRole: data.performedByRole,
          previousState: data.previousState,
          newState: data.newState,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          details: data.details,
          riskLevel: data.riskLevel,
        },
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw - audit logging should not break main operations
    }
  }

  // ==========================================
  // Device Inventory & Asset Management
  // ==========================================

  async getSecurityInventory(filters?: {
    status?: DeviceStatus;
    deviceType?: DeviceType;
    hasVulnerabilities?: boolean;
    hasPendingPatches?: boolean;
    riskLevel?: RiskLevel;
    networkSegmentId?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.deviceType) {
      where.deviceType = filters.deviceType;
    }

    // Build complex queries for vulnerability and patch status
    const devices = await prisma.monitoringDevice.findMany({
      where,
      include: {
        vulnerabilities: {
          where: { status: { in: ['open', 'in_progress'] } },
          orderBy: { severity: 'asc' },
        },
        patches: {
          where: { status: { in: ['pending', 'scheduled', 'approved'] } },
          orderBy: { scheduledDate: 'asc' },
        },
        networkAssignments: {
          where: { status: 'active' },
          include: { segment: true },
        },
        riskAssessments: {
          orderBy: { assessedAt: 'desc' },
          take: 1,
        },
        recallStatuses: {
          where: { status: { in: ['pending', 'under_review'] } },
          include: { recall: true },
        },
      },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
      orderBy: { updatedAt: 'desc' },
    });

    // Apply post-query filters
    let filteredDevices = devices;

    if (filters?.hasVulnerabilities !== undefined) {
      filteredDevices = filteredDevices.filter(d =>
        filters.hasVulnerabilities
          ? d.vulnerabilities.length > 0
          : d.vulnerabilities.length === 0
      );
    }

    if (filters?.hasPendingPatches !== undefined) {
      filteredDevices = filteredDevices.filter(d =>
        filters.hasPendingPatches
          ? d.patches.length > 0
          : d.patches.length === 0
      );
    }

    if (filters?.riskLevel) {
      filteredDevices = filteredDevices.filter(d =>
        d.riskAssessments[0]?.riskLevel === filters.riskLevel
      );
    }

    if (filters?.networkSegmentId) {
      filteredDevices = filteredDevices.filter(d =>
        d.networkAssignments.some(na => na.segmentId === filters.networkSegmentId)
      );
    }

    // Enrich with security summary
    return filteredDevices.map(device => ({
      ...device,
      securitySummary: {
        openVulnerabilities: device.vulnerabilities.length,
        criticalVulnerabilities: device.vulnerabilities.filter(
          v => v.severity === 'critical'
        ).length,
        pendingPatches: device.patches.length,
        networkSegments: device.networkAssignments.map(na => na.segment.name),
        currentRiskLevel: device.riskAssessments[0]?.riskLevel || 'unknown',
        currentRiskScore: device.riskAssessments[0]?.overallRiskScore || null,
        pendingRecalls: device.recallStatuses.length,
        lastSecurityScan: device.lastSecurityScan,
        firmwareVersion: device.firmwareVersion,
      },
    }));
  }

  async updateDeviceFirmware(
    deviceId: string,
    firmwareVersion: string,
    userId: string
  ) {
    const device = await prisma.monitoringDevice.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new Error('Device not found');
    }

    const previousVersion = device.firmwareVersion;

    const updatedDevice = await prisma.monitoringDevice.update({
      where: { id: deviceId },
      data: { firmwareVersion },
    });

    await this.createAuditLog({
      entityType: 'device',
      entityId: deviceId,
      action: 'firmware_update',
      performedBy: userId,
      previousState: { firmwareVersion: previousVersion },
      newState: { firmwareVersion },
      details: `Firmware updated from ${previousVersion || 'unknown'} to ${firmwareVersion}`,
    });

    return updatedDevice;
  }

  // ==========================================
  // Vulnerability Scanning & Tracking
  // ==========================================

  async triggerVulnerabilityScan(
    deviceId: string,
    userId: string,
    scanType: 'quick' | 'full' | 'targeted' = 'full'
  ) {
    const device = await prisma.monitoringDevice.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new Error('Device not found');
    }

    // Simulate vulnerability scanning with mock CVE data
    // In production, this would integrate with vulnerability databases
    const mockVulnerabilities = await this.performVulnerabilityScan(device, scanType);

    // Update device last scan time
    await prisma.monitoringDevice.update({
      where: { id: deviceId },
      data: { lastSecurityScan: new Date() },
    });

    // Create vulnerability records for new findings
    const createdVulnerabilities = [];
    for (const vuln of mockVulnerabilities) {
      // Check if vulnerability already exists for this device
      const existing = vuln.cveId
        ? await prisma.deviceVulnerability.findFirst({
            where: { deviceId, cveId: vuln.cveId },
          })
        : null;

      if (!existing) {
        const created = await prisma.deviceVulnerability.create({
          data: {
            deviceId,
            cveId: vuln.cveId,
            title: vuln.title,
            description: vuln.description,
            severity: vuln.severity,
            cvssScore: vuln.cvssScore,
            affectedVersion: vuln.affectedVersion || device.firmwareVersion,
            fixedVersion: vuln.fixedVersion,
            exploitAvailable: vuln.exploitAvailable || false,
            source: vuln.source || 'internal_scan',
            references: vuln.references,
          },
        });
        createdVulnerabilities.push(created);
      }
    }

    await this.createAuditLog({
      entityType: 'device',
      entityId: deviceId,
      action: 'vulnerability_scan',
      performedBy: userId,
      details: `${scanType} scan completed. Found ${mockVulnerabilities.length} vulnerabilities, ${createdVulnerabilities.length} new.`,
      riskLevel: createdVulnerabilities.some(v => v.severity === 'critical')
        ? 'high'
        : 'normal',
    });

    return {
      deviceId,
      scanType,
      scanCompletedAt: new Date(),
      totalVulnerabilitiesFound: mockVulnerabilities.length,
      newVulnerabilities: createdVulnerabilities.length,
      vulnerabilities: createdVulnerabilities,
    };
  }

  private async performVulnerabilityScan(
    device: any,
    scanType: string
  ): Promise<VulnerabilityScanResult[]> {
    // Simulated vulnerability scan - in production, integrate with:
    // - NVD (National Vulnerability Database)
    // - Manufacturer vulnerability feeds
    // - Medical device-specific CVE databases
    // - ICS-CERT advisories

    const vulnerabilities: VulnerabilityScanResult[] = [];

    // Check for known vulnerabilities based on device type and firmware
    if (!device.firmwareVersion) {
      vulnerabilities.push({
        title: 'Unknown Firmware Version',
        description:
          'Device firmware version is not tracked, making vulnerability assessment incomplete.',
        severity: 'medium',
        source: 'configuration_audit',
      });
    }

    // Check certificate expiry
    if (device.certificateExpiry) {
      const daysToExpiry = Math.floor(
        (new Date(device.certificateExpiry).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysToExpiry < 0) {
        vulnerabilities.push({
          title: 'Expired Device Certificate',
          description: `Device certificate expired ${Math.abs(daysToExpiry)} days ago.`,
          severity: 'high',
          source: 'certificate_check',
        });
      } else if (daysToExpiry < 30) {
        vulnerabilities.push({
          title: 'Device Certificate Expiring Soon',
          description: `Device certificate expires in ${daysToExpiry} days.`,
          severity: 'medium',
          source: 'certificate_check',
        });
      }
    }

    // Simulated CVE findings based on device type
    // In production, query CVE databases for actual vulnerabilities
    if (scanType === 'full' || scanType === 'targeted') {
      // Example simulated CVEs - would be real data in production
      const deviceTypeVulns = this.getKnownDeviceTypeVulnerabilities(
        device.deviceType,
        device.manufacturer
      );
      vulnerabilities.push(...deviceTypeVulns);
    }

    return vulnerabilities;
  }

  private getKnownDeviceTypeVulnerabilities(
    deviceType: DeviceType,
    manufacturer?: string | null
  ): VulnerabilityScanResult[] {
    // Placeholder for real CVE integration
    // Would query NVD API, manufacturer feeds, etc.
    return [];
  }

  async getDeviceVulnerabilities(
    deviceId: string,
    filters?: {
      severity?: VulnerabilitySeverity;
      status?: VulnerabilityStatus;
      includeResolved?: boolean;
    }
  ) {
    const where: any = { deviceId };

    if (filters?.severity) {
      where.severity = filters.severity;
    }

    if (filters?.status) {
      where.status = filters.status;
    } else if (!filters?.includeResolved) {
      where.status = { notIn: ['resolved', 'false_positive'] };
    }

    return await prisma.deviceVulnerability.findMany({
      where,
      orderBy: [{ severity: 'asc' }, { discoveredAt: 'desc' }],
      include: {
        device: {
          select: {
            id: true,
            deviceType: true,
            manufacturer: true,
            model: true,
            serialNumber: true,
            firmwareVersion: true,
          },
        },
      },
    });
  }

  async updateVulnerabilityStatus(
    vulnerabilityId: string,
    status: VulnerabilityStatus,
    userId: string,
    notes?: string
  ) {
    const vulnerability = await prisma.deviceVulnerability.findUnique({
      where: { id: vulnerabilityId },
    });

    if (!vulnerability) {
      throw new Error('Vulnerability not found');
    }

    const previousStatus = vulnerability.status;

    const updated = await prisma.deviceVulnerability.update({
      where: { id: vulnerabilityId },
      data: {
        status,
        resolvedAt: status === 'resolved' ? new Date() : undefined,
        resolvedBy: status === 'resolved' ? userId : undefined,
        resolutionNotes: notes,
      },
    });

    await this.createAuditLog({
      entityType: 'vulnerability',
      entityId: vulnerabilityId,
      action: 'status_update',
      performedBy: userId,
      previousState: { status: previousStatus },
      newState: { status, notes },
      details: `Vulnerability status changed from ${previousStatus} to ${status}`,
    });

    return updated;
  }

  // ==========================================
  // Patch Management
  // ==========================================

  async schedulePatch(
    deviceId: string,
    data: {
      patchVersion: string;
      description?: string;
      releaseNotes?: string;
      criticality?: PatchCriticality;
      scheduledDate?: Date;
      testingRequired?: boolean;
      vulnerabilitiesFixed?: string[];
    },
    userId: string
  ) {
    const device = await prisma.monitoringDevice.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new Error('Device not found');
    }

    const patch = await prisma.devicePatch.create({
      data: {
        deviceId,
        patchVersion: data.patchVersion,
        currentVersion: device.firmwareVersion || 'unknown',
        description: data.description,
        releaseNotes: data.releaseNotes,
        criticality: data.criticality || 'recommended',
        scheduledDate: data.scheduledDate,
        testingRequired: data.testingRequired || false,
        vulnerabilitiesFixed: data.vulnerabilitiesFixed,
        status: data.scheduledDate ? 'scheduled' : 'pending',
      },
    });

    await this.createAuditLog({
      entityType: 'patch',
      entityId: patch.id,
      action: 'schedule',
      performedBy: userId,
      newState: {
        deviceId,
        patchVersion: data.patchVersion,
        scheduledDate: data.scheduledDate,
        criticality: data.criticality,
      },
      details: `Patch ${data.patchVersion} scheduled for device ${deviceId}`,
    });

    return patch;
  }

  async approvePatch(patchId: string, userId: string, notes?: string) {
    const patch = await prisma.devicePatch.findUnique({
      where: { id: patchId },
    });

    if (!patch) {
      throw new Error('Patch not found');
    }

    const updated = await prisma.devicePatch.update({
      where: { id: patchId },
      data: {
        status: 'approved',
        approvedBy: userId,
        approvedAt: new Date(),
        testingNotes: notes,
      },
    });

    await this.createAuditLog({
      entityType: 'patch',
      entityId: patchId,
      action: 'approve',
      performedBy: userId,
      previousState: { status: patch.status },
      newState: { status: 'approved', approvedBy: userId },
      details: `Patch approved${notes ? ': ' + notes : ''}`,
    });

    return updated;
  }

  async applyPatch(patchId: string, userId: string) {
    const patch = await prisma.devicePatch.findUnique({
      where: { id: patchId },
      include: { device: true },
    });

    if (!patch) {
      throw new Error('Patch not found');
    }

    if (patch.status !== 'approved' && patch.status !== 'scheduled') {
      throw new Error('Patch must be approved or scheduled before applying');
    }

    // Start patch application
    await prisma.devicePatch.update({
      where: { id: patchId },
      data: { status: 'in_progress' },
    });

    try {
      // In production, this would trigger actual patch deployment
      // For now, simulate successful patch application

      // Update device firmware version
      await prisma.monitoringDevice.update({
        where: { id: patch.deviceId },
        data: { firmwareVersion: patch.patchVersion },
      });

      // Mark patch as completed
      const completed = await prisma.devicePatch.update({
        where: { id: patchId },
        data: {
          status: 'completed',
          appliedDate: new Date(),
          appliedBy: userId,
          rollbackVersion: patch.currentVersion,
        },
      });

      // Resolve any vulnerabilities that this patch fixes
      if (patch.vulnerabilitiesFixed) {
        const cveIds = patch.vulnerabilitiesFixed as string[];
        await prisma.deviceVulnerability.updateMany({
          where: {
            deviceId: patch.deviceId,
            cveId: { in: cveIds },
          },
          data: {
            status: 'resolved',
            resolvedAt: new Date(),
            resolvedBy: userId,
            resolutionNotes: `Resolved by patch ${patch.patchVersion}`,
          },
        });
      }

      await this.createAuditLog({
        entityType: 'patch',
        entityId: patchId,
        action: 'apply',
        performedBy: userId,
        previousState: { firmwareVersion: patch.currentVersion },
        newState: { firmwareVersion: patch.patchVersion },
        details: `Patch ${patch.patchVersion} successfully applied to device ${patch.deviceId}`,
      });

      return completed;
    } catch (error) {
      // Mark patch as failed
      await prisma.devicePatch.update({
        where: { id: patchId },
        data: {
          status: 'failed',
          failureReason: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      await this.createAuditLog({
        entityType: 'patch',
        entityId: patchId,
        action: 'apply_failed',
        performedBy: userId,
        details: `Patch application failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        riskLevel: 'high',
      });

      throw error;
    }
  }

  async getDevicePatches(deviceId: string, includeCompleted = false) {
    const where: any = { deviceId };

    if (!includeCompleted) {
      where.status = { notIn: ['completed', 'cancelled', 'rolled_back'] };
    }

    return await prisma.devicePatch.findMany({
      where,
      orderBy: [{ criticality: 'asc' }, { scheduledDate: 'asc' }],
    });
  }

  // ==========================================
  // FDA Recall Monitoring
  // ==========================================

  async getRecallAlerts(filters?: {
    status?: RecallStatus;
    recallClass?: RecallClass;
    manufacturer?: string;
    includeDeviceMatches?: boolean;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.recallClass) {
      where.recallClass = filters.recallClass;
    }

    if (filters?.manufacturer) {
      where.manufacturer = { contains: filters.manufacturer, mode: 'insensitive' };
    }

    const recalls = await prisma.fDARecall.findMany({
      where,
      include: filters?.includeDeviceMatches
        ? {
            affectedDevices: {
              include: {
                device: {
                  select: {
                    id: true,
                    patientId: true,
                    deviceType: true,
                    manufacturer: true,
                    model: true,
                    serialNumber: true,
                  },
                },
              },
            },
          }
        : undefined,
      orderBy: [{ recallClass: 'asc' }, { initiatedDate: 'desc' }],
    });

    return recalls;
  }

  async checkDeviceRecalls(deviceId: string) {
    const device = await prisma.monitoringDevice.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new Error('Device not found');
    }

    // Find matching recalls based on manufacturer and model
    const matchingRecalls = await prisma.fDARecall.findMany({
      where: {
        status: 'ongoing',
        OR: [
          { manufacturer: { contains: device.manufacturer || '', mode: 'insensitive' } },
          {
            affectedModels: {
              path: [],
              array_contains: device.model,
            },
          },
        ],
      },
    });

    // Create or update recall status for each matching recall
    const recallStatuses = [];
    for (const recall of matchingRecalls) {
      const existing = await prisma.deviceRecallStatus.findUnique({
        where: {
          deviceId_recallId: {
            deviceId,
            recallId: recall.id,
          },
        },
      });

      if (!existing) {
        const status = await prisma.deviceRecallStatus.create({
          data: {
            deviceId,
            recallId: recall.id,
            status: 'pending',
          },
        });
        recallStatuses.push({ ...status, recall });
      } else {
        recallStatuses.push({ ...existing, recall });
      }
    }

    return recallStatuses;
  }

  async updateRecallStatus(
    deviceId: string,
    recallId: string,
    action: DeviceRecallAction,
    userId: string,
    notes?: string
  ) {
    const recallStatus = await prisma.deviceRecallStatus.findUnique({
      where: {
        deviceId_recallId: { deviceId, recallId },
      },
    });

    if (!recallStatus) {
      throw new Error('Device recall status not found');
    }

    const previousAction = recallStatus.status;

    const updated = await prisma.deviceRecallStatus.update({
      where: { id: recallStatus.id },
      data: {
        status: action,
        actionTaken: notes,
        actionDate: new Date(),
        actionBy: userId,
      },
    });

    await this.createAuditLog({
      entityType: 'recall_status',
      entityId: recallStatus.id,
      action: 'update',
      performedBy: userId,
      previousState: { status: previousAction },
      newState: { status: action, notes },
      details: `Recall action updated for device ${deviceId}`,
      riskLevel:
        action === 'device_removed' || action === 'device_replaced' ? 'high' : 'normal',
    });

    return updated;
  }

  // ==========================================
  // Security Incident Management
  // ==========================================

  async reportIncident(
    data: {
      deviceId?: string;
      incidentType: IncidentType;
      severity: IncidentSeverity;
      title: string;
      description: string;
      affectedSystems?: string[];
      affectedPatients?: string[];
    },
    userId: string
  ) {
    const incident = await prisma.securityIncident.create({
      data: {
        deviceId: data.deviceId,
        incidentType: data.incidentType,
        severity: data.severity,
        title: data.title,
        description: data.description,
        affectedSystems: data.affectedSystems,
        affectedPatients: data.affectedPatients,
        detectedBy: userId,
        reportedBy: userId,
        timeline: [
          {
            timestamp: new Date().toISOString(),
            action: 'Incident reported',
            performedBy: userId,
          },
        ],
      },
    });

    await this.createAuditLog({
      entityType: 'incident',
      entityId: incident.id,
      action: 'report',
      performedBy: userId,
      newState: {
        incidentType: data.incidentType,
        severity: data.severity,
        title: data.title,
      },
      details: `Security incident reported: ${data.title}`,
      riskLevel: data.severity === 'critical' ? 'critical' : data.severity,
    });

    // If device is involved, update its status
    if (data.deviceId) {
      await prisma.monitoringDevice.update({
        where: { id: data.deviceId },
        data: { status: 'maintenance' },
      });
    }

    return incident;
  }

  async updateIncidentStatus(
    incidentId: string,
    status: IncidentStatus,
    userId: string,
    notes?: string
  ) {
    const incident = await prisma.securityIncident.findUnique({
      where: { id: incidentId },
    });

    if (!incident) {
      throw new Error('Incident not found');
    }

    const previousStatus = incident.status;
    const timeline = (incident.timeline as any[]) || [];

    timeline.push({
      timestamp: new Date().toISOString(),
      action: `Status changed from ${previousStatus} to ${status}`,
      performedBy: userId,
      notes,
    });

    const updateData: any = {
      status,
      timeline,
    };

    if (status === 'contained') {
      updateData.containedAt = new Date();
    } else if (status === 'resolved' || status === 'closed') {
      updateData.resolvedAt = new Date();
    }

    const updated = await prisma.securityIncident.update({
      where: { id: incidentId },
      data: updateData,
    });

    await this.createAuditLog({
      entityType: 'incident',
      entityId: incidentId,
      action: 'status_update',
      performedBy: userId,
      previousState: { status: previousStatus },
      newState: { status, notes },
      details: `Incident status updated from ${previousStatus} to ${status}`,
    });

    return updated;
  }

  async getIncidents(filters?: {
    deviceId?: string;
    status?: IncidentStatus;
    severity?: IncidentSeverity;
    incidentType?: IncidentType;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters?.deviceId) {
      where.deviceId = filters.deviceId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.severity) {
      where.severity = filters.severity;
    }

    if (filters?.incidentType) {
      where.incidentType = filters.incidentType;
    }

    if (filters?.startDate || filters?.endDate) {
      where.detectedAt = {};
      if (filters?.startDate) {
        where.detectedAt.gte = filters.startDate;
      }
      if (filters?.endDate) {
        where.detectedAt.lte = filters.endDate;
      }
    }

    return await prisma.securityIncident.findMany({
      where,
      include: {
        device: {
          select: {
            id: true,
            deviceType: true,
            manufacturer: true,
            model: true,
            serialNumber: true,
          },
        },
      },
      orderBy: [{ severity: 'asc' }, { detectedAt: 'desc' }],
    });
  }

  // ==========================================
  // Network Segmentation
  // ==========================================

  async getNetworkSegments(includeDevices = false) {
    return await prisma.networkSegment.findMany({
      where: { isActive: true },
      include: includeDevices
        ? {
            devices: {
              where: { status: 'active' },
              include: {
                device: {
                  select: {
                    id: true,
                    deviceType: true,
                    manufacturer: true,
                    model: true,
                    serialNumber: true,
                  },
                },
              },
            },
          }
        : undefined,
      orderBy: { securityLevel: 'asc' },
    });
  }

  async assignDeviceToSegment(
    deviceId: string,
    segmentId: string,
    userId: string,
    networkDetails?: {
      ipAddress?: string;
      macAddress?: string;
    }
  ) {
    const device = await prisma.monitoringDevice.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new Error('Device not found');
    }

    const segment = await prisma.networkSegment.findUnique({
      where: { id: segmentId },
    });

    if (!segment) {
      throw new Error('Network segment not found');
    }

    // Check if device already assigned to this segment
    const existing = await prisma.deviceNetworkAssignment.findUnique({
      where: {
        deviceId_segmentId: { deviceId, segmentId },
      },
    });

    if (existing) {
      // Update existing assignment
      const updated = await prisma.deviceNetworkAssignment.update({
        where: { id: existing.id },
        data: {
          status: 'active',
          ipAddress: networkDetails?.ipAddress,
          macAddress: networkDetails?.macAddress,
          complianceStatus: 'pending',
        },
      });

      await this.createAuditLog({
        entityType: 'network_assignment',
        entityId: updated.id,
        action: 'reactivate',
        performedBy: userId,
        details: `Device ${deviceId} reactivated in segment ${segment.name}`,
      });

      return updated;
    }

    // Deactivate any existing active assignments
    await prisma.deviceNetworkAssignment.updateMany({
      where: { deviceId, status: 'active' },
      data: { status: 'removed' },
    });

    // Create new assignment
    const assignment = await prisma.deviceNetworkAssignment.create({
      data: {
        deviceId,
        segmentId,
        assignedBy: userId,
        ipAddress: networkDetails?.ipAddress,
        macAddress: networkDetails?.macAddress,
        complianceStatus: 'pending',
      },
    });

    await this.createAuditLog({
      entityType: 'network_assignment',
      entityId: assignment.id,
      action: 'assign',
      performedBy: userId,
      newState: {
        deviceId,
        segmentId,
        segmentName: segment.name,
        securityLevel: segment.securityLevel,
      },
      details: `Device ${deviceId} assigned to network segment ${segment.name}`,
    });

    return assignment;
  }

  async verifyNetworkCompliance(deviceId: string, userId: string) {
    const assignments = await prisma.deviceNetworkAssignment.findMany({
      where: { deviceId, status: 'active' },
      include: { segment: true },
    });

    const results = [];

    for (const assignment of assignments) {
      const complianceChecks: { check: string; passed: boolean; details?: string }[] = [];

      // Check if device security level matches segment requirements
      const device = await prisma.monitoringDevice.findUnique({
        where: { id: deviceId },
        include: {
          vulnerabilities: { where: { status: 'open' } },
          patches: { where: { status: 'pending', criticality: 'critical' } },
        },
      });

      if (!device) {
        continue;
      }

      // Check for critical vulnerabilities
      const hasCriticalVulns = device.vulnerabilities.some(
        v => v.severity === 'critical'
      );
      complianceChecks.push({
        check: 'No critical vulnerabilities',
        passed: !hasCriticalVulns,
        details: hasCriticalVulns
          ? `${device.vulnerabilities.filter(v => v.severity === 'critical').length} critical vulnerabilities found`
          : undefined,
      });

      // Check for pending critical patches
      const hasPendingCriticalPatches = device.patches.length > 0;
      complianceChecks.push({
        check: 'No pending critical patches',
        passed: !hasPendingCriticalPatches,
        details: hasPendingCriticalPatches
          ? `${device.patches.length} critical patches pending`
          : undefined,
      });

      // Check firmware version
      complianceChecks.push({
        check: 'Firmware version tracked',
        passed: !!device.firmwareVersion,
      });

      // Check last security scan
      const lastScanDays = device.lastSecurityScan
        ? Math.floor(
            (Date.now() - new Date(device.lastSecurityScan).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;
      complianceChecks.push({
        check: 'Recent security scan (within 30 days)',
        passed: lastScanDays !== null && lastScanDays <= 30,
        details:
          lastScanDays === null
            ? 'No security scan on record'
            : `Last scan ${lastScanDays} days ago`,
      });

      const allPassed = complianceChecks.every(c => c.passed);
      const newStatus: ComplianceStatus = allPassed ? 'compliant' : 'non_compliant';

      // Update compliance status
      await prisma.deviceNetworkAssignment.update({
        where: { id: assignment.id },
        data: {
          complianceStatus: newStatus,
          lastComplianceCheck: new Date(),
          complianceNotes: JSON.stringify(complianceChecks),
        },
      });

      await this.createAuditLog({
        entityType: 'network_assignment',
        entityId: assignment.id,
        action: 'compliance_check',
        performedBy: userId,
        newState: { complianceStatus: newStatus, checks: complianceChecks },
        details: `Compliance check: ${allPassed ? 'PASSED' : 'FAILED'}`,
      });

      results.push({
        assignmentId: assignment.id,
        segmentName: assignment.segment.name,
        complianceStatus: newStatus,
        checks: complianceChecks,
      });
    }

    return results;
  }

  // ==========================================
  // Risk Scoring
  // ==========================================

  async calculateDeviceRiskScore(deviceId: string, userId?: string) {
    const device = await prisma.monitoringDevice.findUnique({
      where: { id: deviceId },
      include: {
        vulnerabilities: { where: { status: { in: ['open', 'in_progress'] } } },
        patches: { where: { status: { in: ['pending', 'scheduled'] } } },
        incidents: { where: { status: { notIn: ['resolved', 'closed'] } } },
        networkAssignments: { where: { status: 'active' }, include: { segment: true } },
        recallStatuses: { where: { status: 'pending' }, include: { recall: true } },
      },
    });

    if (!device) {
      throw new Error('Device not found');
    }

    const riskFactors: RiskFactor[] = [];

    // Calculate vulnerability score (0-100, higher = more risk)
    let vulnerabilityScore = 0;
    const vulnCounts = {
      critical: device.vulnerabilities.filter(v => v.severity === 'critical').length,
      high: device.vulnerabilities.filter(v => v.severity === 'high').length,
      medium: device.vulnerabilities.filter(v => v.severity === 'medium').length,
      low: device.vulnerabilities.filter(v => v.severity === 'low').length,
    };

    vulnerabilityScore += vulnCounts.critical * 25;
    vulnerabilityScore += vulnCounts.high * 15;
    vulnerabilityScore += vulnCounts.medium * 8;
    vulnerabilityScore += vulnCounts.low * 3;
    vulnerabilityScore = Math.min(vulnerabilityScore, 100);

    if (vulnCounts.critical > 0) {
      riskFactors.push({
        category: 'vulnerability',
        description: `${vulnCounts.critical} critical vulnerabilities`,
        impact: 25,
        recommendation: 'Immediately address critical vulnerabilities',
      });
    }

    // Calculate patch score
    let patchScore = 0;
    const criticalPatches = device.patches.filter(p => p.criticality === 'critical').length;
    const securityPatches = device.patches.filter(p => p.criticality === 'security').length;
    const overduePatches = device.patches.filter(
      p => p.scheduledDate && new Date(p.scheduledDate) < new Date()
    ).length;

    patchScore += criticalPatches * 20;
    patchScore += securityPatches * 10;
    patchScore += overduePatches * 15;
    patchScore = Math.min(patchScore, 100);

    if (criticalPatches > 0) {
      riskFactors.push({
        category: 'patching',
        description: `${criticalPatches} critical patches pending`,
        impact: 20,
        recommendation: 'Schedule critical patches immediately',
      });
    }

    // Calculate network score
    let networkScore = 0;
    const networkAssignment = device.networkAssignments[0];

    if (!networkAssignment) {
      networkScore = 50;
      riskFactors.push({
        category: 'network',
        description: 'Device not assigned to any network segment',
        impact: 50,
        recommendation: 'Assign device to appropriate network segment',
      });
    } else if (networkAssignment.complianceStatus === 'non_compliant') {
      networkScore = 40;
      riskFactors.push({
        category: 'network',
        description: 'Device non-compliant with network segment requirements',
        impact: 40,
        recommendation: 'Address compliance issues for network segment',
      });
    }

    // Calculate compliance score
    let complianceScore = 0;
    if (!device.firmwareVersion) {
      complianceScore += 20;
      riskFactors.push({
        category: 'compliance',
        description: 'Firmware version not tracked',
        impact: 20,
        recommendation: 'Document and track firmware version',
      });
    }

    if (!device.lastSecurityScan) {
      complianceScore += 30;
      riskFactors.push({
        category: 'compliance',
        description: 'No security scan on record',
        impact: 30,
        recommendation: 'Perform initial security scan',
      });
    } else {
      const daysSinceScan = Math.floor(
        (Date.now() - new Date(device.lastSecurityScan).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysSinceScan > 90) {
        complianceScore += 25;
        riskFactors.push({
          category: 'compliance',
          description: `Security scan overdue by ${daysSinceScan - 30} days`,
          impact: 25,
          recommendation: 'Schedule security scan',
        });
      }
    }

    // Calculate incident score
    let incidentScore = 0;
    const activeIncidents = device.incidents.length;
    const criticalIncidents = device.incidents.filter(i => i.severity === 'critical').length;

    incidentScore += criticalIncidents * 30;
    incidentScore += (activeIncidents - criticalIncidents) * 15;
    incidentScore = Math.min(incidentScore, 100);

    if (criticalIncidents > 0) {
      riskFactors.push({
        category: 'incident',
        description: `${criticalIncidents} critical incidents active`,
        impact: 30,
        recommendation: 'Prioritize incident resolution',
      });
    }

    // Calculate aging score
    let agingScore = 0;
    const deviceAgeMonths = Math.floor(
      (Date.now() - new Date(device.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    if (deviceAgeMonths > 60) {
      agingScore = 30;
      riskFactors.push({
        category: 'lifecycle',
        description: `Device is ${deviceAgeMonths} months old`,
        impact: 30,
        recommendation: 'Consider device replacement or enhanced monitoring',
      });
    } else if (deviceAgeMonths > 36) {
      agingScore = 15;
    }

    // Check for recalls
    if (device.recallStatuses.length > 0) {
      const classIRecalls = device.recallStatuses.filter(
        r => r.recall.recallClass === 'class_I'
      ).length;
      if (classIRecalls > 0) {
        riskFactors.push({
          category: 'recall',
          description: `Device affected by ${classIRecalls} Class I recall(s)`,
          impact: 40,
          recommendation: 'Immediately address Class I recall',
        });
      }
    }

    // Calculate overall risk score (weighted average)
    const weights = {
      vulnerability: 0.3,
      patch: 0.2,
      network: 0.15,
      compliance: 0.15,
      incident: 0.15,
      aging: 0.05,
    };

    const overallRiskScore =
      vulnerabilityScore * weights.vulnerability +
      patchScore * weights.patch +
      networkScore * weights.network +
      complianceScore * weights.compliance +
      incidentScore * weights.incident +
      agingScore * weights.aging;

    // Determine risk level
    let riskLevel: RiskLevel;
    if (overallRiskScore >= 80) {
      riskLevel = 'critical';
    } else if (overallRiskScore >= 60) {
      riskLevel = 'high';
    } else if (overallRiskScore >= 40) {
      riskLevel = 'medium';
    } else if (overallRiskScore >= 20) {
      riskLevel = 'low';
    } else {
      riskLevel = 'minimal';
    }

    // Generate recommendations based on risk factors
    const recommendations = riskFactors
      .filter(f => f.recommendation)
      .sort((a, b) => b.impact - a.impact)
      .map(f => f.recommendation);

    // Save risk assessment
    const assessment = await prisma.deviceRiskAssessment.create({
      data: {
        deviceId,
        overallRiskScore,
        vulnerabilityScore,
        patchScore,
        networkScore,
        complianceScore,
        incidentScore,
        agingScore,
        riskLevel,
        riskFactors: riskFactors,
        recommendations,
        assessedBy: userId,
        nextAssessmentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    if (userId) {
      await this.createAuditLog({
        entityType: 'risk_assessment',
        entityId: assessment.id,
        action: 'calculate',
        performedBy: userId,
        newState: { overallRiskScore, riskLevel },
        details: `Risk assessment completed: ${riskLevel} (${overallRiskScore.toFixed(1)})`,
      });
    }

    return {
      deviceId,
      overallRiskScore: Math.round(overallRiskScore * 10) / 10,
      riskLevel,
      breakdown: {
        vulnerabilityScore,
        patchScore,
        networkScore,
        complianceScore,
        incidentScore,
        agingScore,
      },
      riskFactors,
      recommendations,
      assessedAt: assessment.assessedAt,
      nextAssessmentDue: assessment.nextAssessmentDue,
    };
  }

  // ==========================================
  // Manufacturer Advisory Tracking
  // ==========================================

  async getManufacturerAdvisories(filters?: {
    manufacturer?: string;
    severity?: VulnerabilitySeverity;
    status?: AdvisoryStatus;
  }) {
    const where: any = {};

    if (filters?.manufacturer) {
      where.manufacturer = { contains: filters.manufacturer, mode: 'insensitive' };
    }

    if (filters?.severity) {
      where.severity = filters.severity;
    }

    if (filters?.status) {
      where.status = filters.status;
    } else {
      where.status = { in: ['active', 'superseded'] };
    }

    return await prisma.manufacturerAdvisory.findMany({
      where,
      orderBy: [{ severity: 'asc' }, { publishedDate: 'desc' }],
    });
  }

  async acknowledgeAdvisory(advisoryId: string, userId: string) {
    const advisory = await prisma.manufacturerAdvisory.findUnique({
      where: { id: advisoryId },
    });

    if (!advisory) {
      throw new Error('Advisory not found');
    }

    const updated = await prisma.manufacturerAdvisory.update({
      where: { id: advisoryId },
      data: {
        acknowledgedAt: new Date(),
        acknowledgedBy: userId,
      },
    });

    await this.createAuditLog({
      entityType: 'advisory',
      entityId: advisoryId,
      action: 'acknowledge',
      performedBy: userId,
      details: `Advisory ${advisory.advisoryId} acknowledged`,
    });

    return updated;
  }

  // ==========================================
  // Security Dashboard
  // ==========================================

  async getSecurityDashboard(): Promise<SecurityDashboardMetrics> {
    // Get device counts by status
    const devicesByStatus = await prisma.monitoringDevice.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const totalDevices = devicesByStatus.reduce((sum, d) => sum + d._count.id, 0);

    // Vulnerability metrics
    const vulnerabilities = await prisma.deviceVulnerability.groupBy({
      by: ['severity', 'status'],
      _count: { id: true },
    });

    const vulnBySeverity: Record<string, number> = {};
    const vulnByStatus: Record<string, number> = {};
    let criticalOpen = 0;

    for (const v of vulnerabilities) {
      vulnBySeverity[v.severity] = (vulnBySeverity[v.severity] || 0) + v._count.id;
      vulnByStatus[v.status] = (vulnByStatus[v.status] || 0) + v._count.id;
      if (v.severity === 'critical' && v.status === 'open') {
        criticalOpen = v._count.id;
      }
    }

    // Patch metrics
    const patches = await prisma.devicePatch.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const patchCounts: Record<string, number> = {};
    for (const p of patches) {
      patchCounts[p.status] = p._count.id;
    }

    const overduePatches = await prisma.devicePatch.count({
      where: {
        status: { in: ['pending', 'scheduled', 'approved'] },
        scheduledDate: { lt: new Date() },
      },
    });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const completedLast30Days = await prisma.devicePatch.count({
      where: {
        status: 'completed',
        appliedDate: { gte: thirtyDaysAgo },
      },
    });

    // Incident metrics
    const activeIncidents = await prisma.securityIncident.findMany({
      where: { status: { notIn: ['resolved', 'closed'] } },
      select: { severity: true },
    });

    const incidentBySeverity: Record<string, number> = {};
    for (const i of activeIncidents) {
      incidentBySeverity[i.severity] = (incidentBySeverity[i.severity] || 0) + 1;
    }

    // Calculate average resolution time
    const resolvedIncidents = await prisma.securityIncident.findMany({
      where: {
        status: { in: ['resolved', 'closed'] },
        resolvedAt: { not: null },
      },
      select: { detectedAt: true, resolvedAt: true },
    });

    let avgResolutionTimeHours = 0;
    if (resolvedIncidents.length > 0) {
      const totalHours = resolvedIncidents.reduce((sum, i) => {
        if (i.resolvedAt) {
          return (
            sum +
            (new Date(i.resolvedAt).getTime() - new Date(i.detectedAt).getTime()) /
              (1000 * 60 * 60)
          );
        }
        return sum;
      }, 0);
      avgResolutionTimeHours = totalHours / resolvedIncidents.length;
    }

    // Recall metrics
    const activeRecalls = await prisma.fDARecall.count({
      where: { status: 'ongoing' },
    });

    const affectedDevices = await prisma.deviceRecallStatus.count({
      where: { status: { in: ['pending', 'under_review'] } },
    });

    const pendingRecallActions = await prisma.deviceRecallStatus.count({
      where: { status: 'pending' },
    });

    // Compliance metrics
    const networkAssignments = await prisma.deviceNetworkAssignment.groupBy({
      by: ['complianceStatus'],
      where: { status: 'active' },
      _count: { id: true },
    });

    let compliantDevices = 0;
    let nonCompliantDevices = 0;
    for (const na of networkAssignments) {
      if (na.complianceStatus === 'compliant') {
        compliantDevices = na._count.id;
      } else if (na.complianceStatus === 'non_compliant') {
        nonCompliantDevices = na._count.id;
      }
    }

    const complianceRate =
      compliantDevices + nonCompliantDevices > 0
        ? (compliantDevices / (compliantDevices + nonCompliantDevices)) * 100
        : 0;

    // Risk distribution
    const riskAssessments = await prisma.deviceRiskAssessment.findMany({
      distinct: ['deviceId'],
      orderBy: { assessedAt: 'desc' },
      select: { riskLevel: true },
    });

    const riskDistribution: Record<string, number> = {};
    for (const r of riskAssessments) {
      riskDistribution[r.riskLevel] = (riskDistribution[r.riskLevel] || 0) + 1;
    }

    return {
      totalDevices,
      devicesByStatus: devicesByStatus.reduce(
        (acc, d) => ({ ...acc, [d.status]: d._count.id }),
        {}
      ),
      vulnerabilityMetrics: {
        total: Object.values(vulnBySeverity).reduce((a, b) => a + b, 0),
        bySeverity: vulnBySeverity,
        byStatus: vulnByStatus,
        criticalOpen,
      },
      patchMetrics: {
        pending: patchCounts['pending'] || 0,
        scheduled: patchCounts['scheduled'] || 0,
        overduePatches,
        completedLast30Days,
      },
      incidentMetrics: {
        active: activeIncidents.length,
        bySeverity: incidentBySeverity,
        avgResolutionTimeHours: Math.round(avgResolutionTimeHours * 10) / 10,
      },
      recallMetrics: {
        activeRecalls,
        affectedDevices,
        pendingActions: pendingRecallActions,
      },
      complianceMetrics: {
        compliantDevices,
        nonCompliantDevices,
        complianceRate: Math.round(complianceRate * 10) / 10,
      },
      riskDistribution,
    };
  }

  // ==========================================
  // Device Lifecycle Management
  // ==========================================

  async getDeviceLifecycleStatus(deviceId: string) {
    const device = await prisma.monitoringDevice.findUnique({
      where: { id: deviceId },
      include: {
        vulnerabilities: true,
        patches: true,
        incidents: true,
        riskAssessments: { orderBy: { assessedAt: 'desc' }, take: 5 },
        recallStatuses: { include: { recall: true } },
        networkAssignments: { where: { status: 'active' }, include: { segment: true } },
      },
    });

    if (!device) {
      throw new Error('Device not found');
    }

    const ageMonths = Math.floor(
      (Date.now() - new Date(device.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    // Determine lifecycle stage
    let lifecycleStage: string;
    let lifecycleRecommendation: string;

    if (device.status === 'decommissioned') {
      lifecycleStage = 'end_of_life';
      lifecycleRecommendation = 'Device has been decommissioned';
    } else if (ageMonths > 60) {
      lifecycleStage = 'aging';
      lifecycleRecommendation = 'Consider replacement planning';
    } else if (ageMonths > 36) {
      lifecycleStage = 'mature';
      lifecycleRecommendation = 'Maintain regular security monitoring';
    } else if (ageMonths > 12) {
      lifecycleStage = 'stable';
      lifecycleRecommendation = 'Continue standard maintenance';
    } else {
      lifecycleStage = 'new';
      lifecycleRecommendation = 'Complete initial security configuration';
    }

    return {
      deviceId,
      deviceType: device.deviceType,
      manufacturer: device.manufacturer,
      model: device.model,
      serialNumber: device.serialNumber,
      status: device.status,
      firmwareVersion: device.firmwareVersion,
      createdAt: device.createdAt,
      ageMonths,
      lifecycleStage,
      lifecycleRecommendation,
      lastSync: device.lastSyncAt,
      lastSecurityScan: device.lastSecurityScan,
      certificateExpiry: device.certificateExpiry,
      securityMetrics: {
        totalVulnerabilities: device.vulnerabilities.length,
        openVulnerabilities: device.vulnerabilities.filter(
          v => v.status === 'open' || v.status === 'in_progress'
        ).length,
        totalPatches: device.patches.length,
        pendingPatches: device.patches.filter(
          p => p.status === 'pending' || p.status === 'scheduled'
        ).length,
        totalIncidents: device.incidents.length,
        activeIncidents: device.incidents.filter(
          i => i.status !== 'resolved' && i.status !== 'closed'
        ).length,
      },
      networkSegment: device.networkAssignments[0]?.segment?.name || 'Unassigned',
      latestRiskAssessment: device.riskAssessments[0] || null,
      activeRecalls: device.recallStatuses.filter(
        r => r.status === 'pending' || r.status === 'under_review'
      ),
    };
  }

  // ==========================================
  // Audit Log Retrieval
  // ==========================================

  async getSecurityAuditLogs(filters?: {
    entityType?: string;
    entityId?: string;
    action?: string;
    performedBy?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    const where: any = {};

    if (filters?.entityType) {
      where.entityType = filters.entityType;
    }

    if (filters?.entityId) {
      where.entityId = filters.entityId;
    }

    if (filters?.action) {
      where.action = filters.action;
    }

    if (filters?.performedBy) {
      where.performedBy = filters.performedBy;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters?.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters?.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    return await prisma.securityAuditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 100,
    });
  }
}

export default new DeviceSecurityService();
