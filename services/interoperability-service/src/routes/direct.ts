import { Router, RequestHandler } from 'express';
import { z } from 'zod';
import DirectMessagingService from '../services/DirectMessagingService';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { directMessagingLimiter } from '../middleware/rateLimiter';
import { logger } from '../utils/logger';

const router: ReturnType<typeof Router> = Router();

// Apply Direct messaging-specific rate limiting
router.use(directMessagingLimiter as unknown as RequestHandler);

// Schema for sending a Direct message
const sendMessageSchema = z.object({
  from: z.string().email(),
  to: z.array(z.string().email()),
  subject: z.string(),
  body: z.string(),
  attachments: z.array(z.object({
    filename: z.string(),
    contentType: z.string(),
    content: z.string(), // Base64
    size: z.number(),
  })).optional(),
  mdn: z.object({
    requested: z.boolean(),
  }).optional(),
});

// Schema for registering a Direct address
const registerAddressSchema = z.object({
  address: z.string().email(),
  ownerId: z.string(),
  ownerType: z.enum(['user', 'organization', 'department', 'system']),
  ownerName: z.string().optional(),
  generateCertificate: z.boolean().optional(),
});

/**
 * POST /direct/send
 * Send a Direct message
 */
router.post('/send', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = sendMessageSchema.parse(req.body);

    const result = await DirectMessagingService.sendMessage({
      from: validatedData.from,
      to: validatedData.to,
      subject: validatedData.subject,
      body: validatedData.body,
      attachments: validatedData.attachments as any,
      mdn: { requested: validatedData.mdn?.requested || false },
      encrypted: true,
      signed: true,
    });

    if (!result.success) {
      res.status(400).json({
        error: 'Send Failed',
        messageId: result.messageId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      messageId: result.messageId,
      mdnStatus: result.mdnStatus,
      message: 'Message sent successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error sending Direct message', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to send Direct message',
    });
  }
});

/**
 * POST /direct/receive
 * Receive and process an incoming Direct message
 */
router.post('/receive', async (req: UserRequest, res) => {
  try {
    const rawMessage = typeof req.body === 'string' ? req.body : req.body.message;

    if (!rawMessage) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Raw message content is required',
      });
      return;
    }

    const message = await DirectMessagingService.receiveMessage(rawMessage);

    if (!message) {
      res.status(400).json({
        error: 'Processing Failed',
        message: 'Failed to process incoming message',
      });
      return;
    }

    res.json({
      success: true,
      messageId: message.id,
      from: message.from,
      to: message.to,
      subject: message.subject,
      received: message.timestamp,
    });
  } catch (error: any) {
    logger.error('Error receiving Direct message', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to receive Direct message',
    });
  }
});

/**
 * POST /direct/addresses
 * Register a new Direct address
 */
router.post('/addresses', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = registerAddressSchema.parse(req.body);

    const result = await DirectMessagingService.registerAddress(validatedData as any);

    res.status(201).json({
      success: true,
      address: result.address,
      valid: result.valid,
      message: 'Direct address registered successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error registering Direct address', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register Direct address',
    });
  }
});

/**
 * PUT /direct/addresses/:address/activate
 * Activate a Direct address
 */
router.put('/addresses/:address/activate', requireUser, async (req: UserRequest, res) => {
  try {
    const { address } = req.params;
    const { certificate } = req.body;

    await DirectMessagingService.activateAddress(address, certificate);

    res.json({
      success: true,
      message: 'Direct address activated successfully',
    });
  } catch (error: any) {
    logger.error('Error activating Direct address', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to activate Direct address',
    });
  }
});

/**
 * GET /direct/addresses/:ownerId
 * List Direct addresses for an owner
 */
router.get('/addresses/:ownerId', requireUser, async (req: UserRequest, res) => {
  try {
    const { ownerId } = req.params;

    const addresses = await DirectMessagingService.listAddresses(ownerId);

    res.json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error: any) {
    logger.error('Error listing Direct addresses', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to list Direct addresses',
    });
  }
});

/**
 * GET /direct/certificate/:address
 * Lookup certificate for a Direct address
 */
router.get('/certificate/:address', requireUser, async (req: UserRequest, res) => {
  try {
    const address = decodeURIComponent(req.params.address);

    const result = await DirectMessagingService.lookupCertificate(address);

    if (!result.valid) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Certificate not found for this address',
      });
      return;
    }

    res.json({
      success: true,
      address: result.address,
      certificate: result.certificate,
      trustAnchor: result.trustAnchor,
    });
  } catch (error: any) {
    logger.error('Error looking up certificate', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to lookup certificate',
    });
  }
});

/**
 * POST /direct/validate-trust
 * Validate trust chain for a certificate
 */
router.post('/validate-trust', requireUser, async (req: UserRequest, res) => {
  try {
    const { certificate } = req.body;

    if (!certificate) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Certificate is required',
      });
      return;
    }

    const valid = await DirectMessagingService.validateTrustChain(certificate);

    res.json({
      success: true,
      valid,
    });
  } catch (error: any) {
    logger.error('Error validating trust chain', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to validate trust chain',
    });
  }
});

export default router;
