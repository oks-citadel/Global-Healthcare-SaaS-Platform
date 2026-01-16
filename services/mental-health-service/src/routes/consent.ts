import { Router, Request, Response } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { ConsentService } from '../services/ConsentService';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const grantConsentSchema = z.object({
  providerId: z.string().uuid(),
  consentType: z.enum(['treatment', 'information_release', 'research', 'emergency_contact', 'cfr_part2']),
  purpose: z.string(),
  expiresAt: z.string().datetime().optional(),
  substanceUseDisclosure: z.boolean().optional(),
  disclosureScope: z.string().optional(),
  redisclosure: z.boolean().optional(),
});

// Grant consent (patient grants consent to provider)
router.post('/grant', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only patients can grant consent
    if (userRole !== 'patient') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only patients can grant consent',
      });
      return;
    }

    const validatedData = grantConsentSchema.parse(req.body);

    const consent = await ConsentService.grantConsent({
      patientId: userId,
      providerId: validatedData.providerId,
      consentType: validatedData.consentType,
      purpose: validatedData.purpose,
      expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined,
      substanceUseDisclosure: validatedData.substanceUseDisclosure,
      disclosureScope: validatedData.disclosureScope,
      redisclosure: validatedData.redisclosure,
    });

    res.status(201).json({
      data: consent,
      message: 'Consent granted successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error granting consent:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to grant consent',
    });
  }
});

// Get patient's consents
router.get('/my-consents', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only patients can view their consents
    if (userRole !== 'patient') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only patients can view their consents',
      });
      return;
    }

    const consents = await ConsentService.getPatientConsents(userId);

    res.json({
      data: consents,
      count: consents.length,
    });
  } catch (error) {
    console.error('Error fetching consents:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch consents',
    });
  }
});

// Check if provider has consent
router.get('/check/:patientId/:providerId', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { patientId, providerId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only the patient or the provider can check consent
    const canCheck =
      userRole === 'admin' ||
      (userRole === 'patient' && patientId === userId) ||
      (userRole === 'provider' && providerId === userId);

    if (!canCheck) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const hasConsent = await ConsentService.hasValidConsent(patientId, providerId);
    const canDiscloseSubstanceUse = await ConsentService.canDiscloseSubstanceUse(
      patientId,
      providerId
    );

    res.json({
      data: {
        hasConsent,
        canDiscloseSubstanceUse,
      },
    });
  } catch (error) {
    console.error('Error checking consent:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to check consent',
    });
  }
});

// Revoke consent
router.post('/:consentId/revoke', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { consentId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only patients can revoke consent
    if (userRole !== 'patient') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only patients can revoke consent',
      });
      return;
    }

    const revoked = await ConsentService.revokeConsent(consentId, userId);

    res.json({
      data: revoked,
      message: 'Consent revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking consent:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to revoke consent',
    });
  }
});

// Get consent by ID
router.get('/:consentId', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { consentId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const consent = await prisma.consentRecord.findUnique({
      where: { id: consentId },
    });

    if (!consent) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Consent record not found',
      });
      return;
    }

    // Check access
    const hasAccess =
      userRole === 'admin' ||
      (userRole === 'patient' && consent.patientId === userId) ||
      (userRole === 'provider' && consent.grantedTo.includes(userId));

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    res.json({ data: consent });
  } catch (error) {
    console.error('Error fetching consent:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch consent',
    });
  }
});

// Get 42 CFR Part 2 compliance info
router.get('/compliance/cfr-part2', (_req: Request, res: Response): void => {
  res.json({
    regulation: '42 CFR Part 2',
    description: 'Federal regulations protecting the confidentiality of substance use disorder patient records',
    keyRequirements: {
      writtenConsent: 'Written patient consent required before disclosure',
      specificPurpose: 'Consent must specify the purpose of disclosure',
      specificRecipient: 'Consent must name the person/organization receiving information',
      specificInformation: 'Consent must describe what information can be disclosed',
      expirationDate: 'Consent must include an expiration date or event',
      revocation: 'Patient has the right to revoke consent at any time',
      redisclosure: 'Recipients must be notified that information cannot be redisclosed without additional consent',
    },
    exceptions: [
      'Medical emergencies',
      'Research (with specific protections)',
      'Audit and evaluation activities',
      'Court orders (under specific conditions)',
      'Reporting of suspected child abuse/neglect',
      'Reporting of crimes committed on program premises or against program personnel',
    ],
    penalties: 'Violations may result in fines up to $500 for first offense, $5,000 for subsequent offenses',
    additionalInfo: 'https://www.samhsa.gov/about-us/who-we-are/laws-regulations/confidentiality-regulations-faqs',
  });
});

// Create emergency consent (72-hour limited consent)
router.post('/emergency', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can create emergency consent
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can create emergency consent',
      });
      return;
    }

    const { patientId, emergencyReason } = req.body;

    if (!patientId || !emergencyReason) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Patient ID and emergency reason are required',
      });
      return;
    }

    const consent = await ConsentService.createEmergencyConsent(
      patientId,
      userId,
      emergencyReason
    );

    res.status(201).json({
      data: consent,
      message: 'Emergency consent created (valid for 72 hours)',
    });
  } catch (error) {
    console.error('Error creating emergency consent:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create emergency consent',
    });
  }
});

export default router;
