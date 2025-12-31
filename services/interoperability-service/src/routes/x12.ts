import { Router } from 'express';
import { z } from 'zod';
import X12TransactionService from '../services/X12TransactionService';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { x12Limiter } from '../middleware/rateLimiter';
import { logger } from '../utils/logger';

const router: ReturnType<typeof Router> = Router();

// Apply X12-specific rate limiting
router.use(x12Limiter);

// Schema for X12 transaction generation
const x12GenerateSchema = z.object({
  transactionType: z.enum([
    'x270_eligibility_inquiry',
    'x276_claim_status_inquiry',
    'x278_prior_auth_request',
    'x837_professional_claim',
  ]),
  partnerId: z.string().uuid(),
  data: z.record(z.any()),
});

/**
 * POST /x12/inbound
 * Process an incoming X12 transaction
 */
router.post('/inbound', async (req: UserRequest, res) => {
  try {
    const rawContent = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const partnerId = req.headers['x-partner-id'] as string;

    logger.info('Processing inbound X12 transaction', {
      contentLength: rawContent.length,
      partnerId,
    });

    const result = await X12TransactionService.processInbound(rawContent, partnerId);

    if (!result.success) {
      res.status(400).json({
        error: 'X12 Processing Error',
        transactionId: result.transactionId,
        errors: result.errors,
        acknowledgment: result.acknowledgment,
      });
      return;
    }

    res.json({
      success: true,
      transactionId: result.transactionId,
      acknowledgment: result.acknowledgment,
      data: result.data,
    });
  } catch (error: any) {
    logger.error('Error processing inbound X12', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process X12 transaction',
    });
  }
});

/**
 * POST /x12/generate
 * Generate an outbound X12 transaction
 */
router.post('/generate', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = x12GenerateSchema.parse(req.body);

    const result = await X12TransactionService.generateOutbound(
      validatedData.transactionType,
      validatedData.data,
      validatedData.partnerId
    );

    if (!result.success) {
      res.status(400).json({
        error: 'X12 Generation Error',
        transactionId: result.transactionId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      transactionId: result.transactionId,
      content: result.data,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error generating X12', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate X12 transaction',
    });
  }
});

/**
 * POST /x12/270
 * Submit 270 Eligibility Inquiry
 */
router.post('/270', requireUser, async (req: UserRequest, res) => {
  try {
    const { partnerId, ...data } = req.body;

    if (!partnerId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'partnerId is required',
      });
      return;
    }

    const result = await X12TransactionService.generateOutbound(
      'x270_eligibility_inquiry',
      data,
      partnerId
    );

    if (!result.success) {
      res.status(400).json({
        error: 'X12 Error',
        transactionId: result.transactionId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      transactionId: result.transactionId,
      transaction: result.data,
    });
  } catch (error: any) {
    logger.error('Error submitting 270', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit eligibility inquiry',
    });
  }
});

/**
 * POST /x12/276
 * Submit 276 Claim Status Inquiry
 */
router.post('/276', requireUser, async (req: UserRequest, res) => {
  try {
    const { partnerId, ...data } = req.body;

    if (!partnerId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'partnerId is required',
      });
      return;
    }

    const result = await X12TransactionService.generateOutbound(
      'x276_claim_status_inquiry',
      data,
      partnerId
    );

    if (!result.success) {
      res.status(400).json({
        error: 'X12 Error',
        transactionId: result.transactionId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      transactionId: result.transactionId,
      transaction: result.data,
    });
  } catch (error: any) {
    logger.error('Error submitting 276', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit claim status inquiry',
    });
  }
});

/**
 * POST /x12/278
 * Submit 278 Prior Authorization Request
 */
router.post('/278', requireUser, async (req: UserRequest, res) => {
  try {
    const { partnerId, ...data } = req.body;

    if (!partnerId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'partnerId is required',
      });
      return;
    }

    const result = await X12TransactionService.generateOutbound(
      'x278_prior_auth_request',
      data,
      partnerId
    );

    if (!result.success) {
      res.status(400).json({
        error: 'X12 Error',
        transactionId: result.transactionId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      transactionId: result.transactionId,
      transaction: result.data,
    });
  } catch (error: any) {
    logger.error('Error submitting 278', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit prior authorization request',
    });
  }
});

/**
 * POST /x12/837
 * Submit 837 Professional Claim
 */
router.post('/837', requireUser, async (req: UserRequest, res) => {
  try {
    const { partnerId, ...data } = req.body;

    if (!partnerId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'partnerId is required',
      });
      return;
    }

    const result = await X12TransactionService.generateOutbound(
      'x837_professional_claim',
      data,
      partnerId
    );

    if (!result.success) {
      res.status(400).json({
        error: 'X12 Error',
        transactionId: result.transactionId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      transactionId: result.transactionId,
      transaction: result.data,
    });
  } catch (error: any) {
    logger.error('Error submitting 837', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit claim',
    });
  }
});

/**
 * POST /x12/parse
 * Parse an X12 transaction for inspection
 */
router.post('/parse', requireUser, async (req: UserRequest, res) => {
  try {
    const rawContent = typeof req.body === 'string' ? req.body : req.body.content;

    if (!rawContent) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'X12 content is required',
      });
      return;
    }

    const parsed = X12TransactionService.parse(rawContent);

    res.json({
      success: true,
      envelope: parsed.envelope,
      transactionType: parsed.transactionType,
      segmentCount: parsed.segments.length,
      segments: parsed.segments,
    });
  } catch (error: any) {
    logger.error('Error parsing X12', { error: error.message });
    res.status(400).json({
      error: 'Parse Error',
      message: error.message,
    });
  }
});

export default router;
