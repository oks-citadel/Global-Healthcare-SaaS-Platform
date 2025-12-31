import { Router, Response } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser, requireAdmin, requireOrganization } from '../middleware/extractUser';
import complianceService from '../services/compliance.service';
import { ComplianceAuditType } from '../generated/client';

const router: ReturnType<typeof Router> = Router();

/**
 * @route POST /compliance/check/hospital-price-transparency
 * @desc Run CMS Hospital Price Transparency compliance check
 * @access Private (admin only)
 */
router.post('/check/hospital-price-transparency', requireUser, requireAdmin, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId!;

    const report = await complianceService.checkHospitalPriceTransparency(organizationId);

    res.json({
      data: report,
      message: 'Compliance check completed',
    });
  } catch (error) {
    console.error('Error running compliance check:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to run compliance check',
    });
  }
});

/**
 * @route POST /compliance/check/no-surprises-act
 * @desc Run No Surprises Act compliance check
 * @access Private (admin only)
 */
router.post('/check/no-surprises-act', requireUser, requireAdmin, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId!;

    const report = await complianceService.checkNoSurprisesActCompliance(organizationId);

    res.json({
      data: report,
      message: 'Compliance check completed',
    });
  } catch (error) {
    console.error('Error running compliance check:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to run compliance check',
    });
  }
});

/**
 * @route GET /compliance/audits
 * @desc Get compliance audit history
 * @access Private (admin only)
 */
router.get('/audits', requireUser, requireAdmin, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId!;
    const { auditType, limit } = req.query;

    const validAuditTypes: ComplianceAuditType[] = [
      'cms_hospital_price_transparency',
      'no_surprises_act_gfe',
      'payer_transparency_rule',
      'state_price_transparency',
      'internal_audit',
    ];

    let parsedAuditType: ComplianceAuditType | undefined;
    if (auditType && validAuditTypes.includes(auditType as ComplianceAuditType)) {
      parsedAuditType = auditType as ComplianceAuditType;
    }

    const audits = await complianceService.getAuditHistory(
      organizationId,
      parsedAuditType,
      limit ? parseInt(limit as string) : 10
    );

    res.json({
      data: audits,
      count: audits.length,
    });
  } catch (error) {
    console.error('Error fetching audit history:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch audit history',
    });
  }
});

/**
 * @route GET /compliance/score
 * @desc Get latest compliance scores
 * @access Private (admin only)
 */
router.get('/score', requireUser, requireAdmin, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId!;

    const [hospitalScore, nsaScore] = await Promise.all([
      complianceService.getLatestComplianceScore(organizationId, 'cms_hospital_price_transparency'),
      complianceService.getLatestComplianceScore(organizationId, 'no_surprises_act_gfe'),
    ]);

    res.json({
      data: {
        hospitalPriceTransparency: hospitalScore,
        noSurprisesAct: nsaScore,
        overallCompliance: hospitalScore && nsaScore
          ? ((Number(hospitalScore.score) + Number(nsaScore.score)) / 2).toFixed(1)
          : hospitalScore
            ? hospitalScore.score
            : nsaScore
              ? nsaScore.score
              : null,
      },
    });
  } catch (error) {
    console.error('Error fetching compliance scores:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch compliance scores',
    });
  }
});

/**
 * @route GET /compliance/dashboard
 * @desc Get compliance dashboard data
 * @access Private (admin only)
 */
router.get('/dashboard', requireUser, requireAdmin, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId!;

    // Get latest audits for each type
    const [hospitalAudits, nsaAudits] = await Promise.all([
      complianceService.getAuditHistory(organizationId, 'cms_hospital_price_transparency', 5),
      complianceService.getAuditHistory(organizationId, 'no_surprises_act_gfe', 5),
    ]);

    const latestHospital = hospitalAudits[0];
    const latestNSA = nsaAudits[0];

    // Calculate trend (comparing last 2 audits)
    const hospitalTrend = hospitalAudits.length >= 2
      ? Number(hospitalAudits[0].overallScore) - Number(hospitalAudits[1].overallScore)
      : 0;

    const nsaTrend = nsaAudits.length >= 2
      ? Number(nsaAudits[0].overallScore) - Number(nsaAudits[1].overallScore)
      : 0;

    // Aggregate findings
    const criticalFindings: any[] = [];
    const majorFindings: any[] = [];
    const allRecommendations: string[] = [];

    if (latestHospital) {
      const findings = latestHospital.findings as any[];
      findings.forEach(f => {
        if (!f.passed) {
          if (f.severity === 'critical') criticalFindings.push({ ...f, auditType: 'Hospital Price Transparency' });
          if (f.severity === 'major') majorFindings.push({ ...f, auditType: 'Hospital Price Transparency' });
        }
      });
      if (latestHospital.recommendations) {
        allRecommendations.push(...(latestHospital.recommendations as string[]));
      }
    }

    if (latestNSA) {
      const findings = latestNSA.findings as any[];
      findings.forEach(f => {
        if (!f.passed) {
          if (f.severity === 'critical') criticalFindings.push({ ...f, auditType: 'No Surprises Act' });
          if (f.severity === 'major') majorFindings.push({ ...f, auditType: 'No Surprises Act' });
        }
      });
      if (latestNSA.recommendations) {
        allRecommendations.push(...(latestNSA.recommendations as string[]));
      }
    }

    res.json({
      data: {
        summary: {
          hospitalPriceTransparency: latestHospital ? {
            score: latestHospital.overallScore,
            lastAudit: latestHospital.auditDate,
            passedChecks: latestHospital.passedChecks,
            failedChecks: latestHospital.failedChecks,
            trend: hospitalTrend,
          } : null,
          noSurprisesAct: latestNSA ? {
            score: latestNSA.overallScore,
            lastAudit: latestNSA.auditDate,
            passedChecks: latestNSA.passedChecks,
            failedChecks: latestNSA.failedChecks,
            trend: nsaTrend,
          } : null,
        },
        criticalFindings,
        majorFindings,
        recommendations: [...new Set(allRecommendations)], // Dedupe
        auditHistory: {
          hospitalPriceTransparency: hospitalAudits.map(a => ({
            date: a.auditDate,
            score: a.overallScore,
          })),
          noSurprisesAct: nsaAudits.map(a => ({
            date: a.auditDate,
            score: a.overallScore,
          })),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching compliance dashboard:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch compliance dashboard',
    });
  }
});

/**
 * @route GET /compliance/requirements
 * @desc Get list of compliance requirements
 * @access Private
 */
router.get('/requirements', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const requirements = {
      hospitalPriceTransparency: {
        name: 'CMS Hospital Price Transparency Rule',
        effectiveDate: '2021-01-01',
        requirements: [
          {
            id: 'MRF',
            name: 'Machine-Readable File',
            description: 'Publish a comprehensive machine-readable file with all standard charges',
            deadline: 'Ongoing - Update annually',
          },
          {
            id: 'SHOPPABLE_70',
            name: '70 Shoppable Services',
            description: 'Display prices for at least 70 shoppable services in a consumer-friendly format',
            deadline: 'Ongoing',
          },
          {
            id: 'PAYER_RATES',
            name: 'Payer-Specific Negotiated Rates',
            description: 'Include payer-specific negotiated charges for each item/service',
            deadline: 'Ongoing',
          },
          {
            id: 'CASH_PRICE',
            name: 'Discounted Cash Price',
            description: 'Include the discounted cash price for self-pay patients',
            deadline: 'Ongoing',
          },
          {
            id: 'DEIDENTIFIED',
            name: 'De-identified Min/Max',
            description: 'Include de-identified minimum and maximum negotiated charges',
            deadline: 'Ongoing',
          },
        ],
        penaltiesForNonCompliance: 'Up to $300 per day for the first violation, increasing for subsequent violations. Maximum $5,500 per day for hospitals with 30+ beds.',
      },
      noSurprisesAct: {
        name: 'No Surprises Act - Good Faith Estimate',
        effectiveDate: '2022-01-01',
        requirements: [
          {
            id: 'GFE_UNINSURED',
            name: 'GFE for Uninsured/Self-Pay',
            description: 'Provide Good Faith Estimates to uninsured and self-pay patients',
            deadline: 'Upon scheduling or request',
          },
          {
            id: 'GFE_TIMELINE',
            name: 'GFE Delivery Timeline',
            description: 'Deliver GFE at least 3 business days before scheduled service (if scheduled 3+ days in advance)',
            deadline: 'At least 3 business days before service',
          },
          {
            id: 'GFE_CONTENT',
            name: 'GFE Content Requirements',
            description: 'Include provider NPIs, service descriptions, diagnosis codes, and itemized expected charges',
            deadline: 'At time of GFE delivery',
          },
          {
            id: 'PATIENT_RIGHTS',
            name: 'Patient Rights Notice',
            description: 'Inform patients of their rights to dispute charges exceeding GFE by $400+',
            deadline: 'At time of GFE delivery',
          },
        ],
        penaltiesForNonCompliance: 'Subject to HHS enforcement actions and potential civil monetary penalties.',
      },
    };

    res.json({ data: requirements });
  } catch (error) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch requirements',
    });
  }
});

export default router;
